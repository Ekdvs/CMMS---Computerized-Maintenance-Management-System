import PMSchedule from "../models/PMSchedule";
import WorkOrder from "../models/WorkOrder";
import { createNotification } from "../sevices/notificationService";


export default (agenda)=>{
    agenda.define('pm-check-job',async(job)=>{
        console.log("PM Check Job executed");
        const {pmTaskId}=job.attrs.data||{};
        console.log(`Checking PM Task with ID: ${pmTaskId}`);

        if(!pmTaskId){
            console.log("No PM Task ID provided.");
            return;
        }

        const pm =await PMSchedule.findById(pmTaskId).populate('asset assignedTo');

        if(!pm||!pm.active){
            console.log(`PM Task with ID: ${pmTaskId} not found.`);
            return;
        }

        const now = new Date();
        const shouldRun = !pm.nextRun || pm.nextRun <= now;

        if(shouldRun){
            console.log(`PM Task with ID: ${pmTaskId} is due. Creating PM Work Order...`);
            const workOrder = await WorkOrder.create({
                title: `PM: ${pm.name} - ${pm.asset?.name || pm.asset}`,
                description: pm.description || "Preventive maintenance generated",
                category: pm.asset?.category || "PM",
                priority: "Low",
                asset: pm.asset,
                assignedTo: pm.assignedTo,
                status: "Open"
            })

            if(pm.assignedTo){
            await createNotification({
                userId: pm.assignedTo,
                title: "New Preventive Maintenance Work Order",
                message: `A new PM work order was created: ${workOrder.title}`,
                data: { workOrderId: workOrder._id }
            });
        }

        pm.lastRun = now;

        const {interval}=pm.recurrence||{};
        if(pm.recurrence.type==='interval'&&interval?.value){
            const next = new Date(now);
            const { value, unit } = interval;

            if (unit === "days") next.setDate(next.getDate() + value);
            if (unit === "weeks") next.setDate(next.getDate() + value * 7);
            if (unit === "months") next.setMonth(next.getMonth() + value);
            if (unit === "quarters") next.setMonth(next.getMonth() + value * 3);

            pm.nextRun = next;

        }
        await pm.save();
    }
  });
};