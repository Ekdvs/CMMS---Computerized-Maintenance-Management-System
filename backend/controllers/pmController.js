import PMSchedule from "../models/PMSchedule";

// helper
function computeNext(recurrence) {
  const now = new Date();
  if (!recurrence || !recurrence.interval) return now;
  const { value, unit } = recurrence.interval;
  const next = new Date(now);
  if (unit === "days") next.setDate(next.getDate() + value);
  if (unit === "weeks") next.setDate(next.getDate() + value * 7);
  if (unit === "months") next.setMonth(next.getMonth() + value);
  if (unit === "quarters") next.setMonth(next.getMonth() + value * 3);
  return next;
}

// create PMSchedule
export const createPMSchedule= async (request ,response )=>{
    try {
        const data = request.body;
        const newPMSchedule = await PMSchedule.create(data);

        //schedule next run
        if(newPMSchedule.recurrence && newPMSchedule.type==='interval'){
            const next = computeNext(newPMSchedule.recurrence);
            newPMSchedule.nextRun = next;
            await newPMSchedule.save();
        }

        const agenda = getAgenda();
        if(agenda){
            await agenda.now("pm-check", { pmId: newPMSchedule._id.toString() });
        }

        return response.status(201).json({
            message: "Preventive Maintenance Schedule created successfully",
            error: false,
            data: newPMSchedule,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
}

// get all PM schedules
export const getAllPMSchedules = async(request,response)=>{
    try {
        const pmSchedules = await PMSchedule.find().populate('asset assignedTo');
        return response.status(200).json({
            message: "PM Schedules fetched successfully",
            error: false,
            data: pmSchedules,
            success: true,
        });
        
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
}

//get pm schedule by id
export const getAllPMSchedulesById= async(request,response)=>{
    try {
        const PMScheduleId= request.params.id;
        if(!PMScheduleId){
            return response.status(400).json({
                message: "PMSchedule ID is required",
                error: true,
                success: false,
            });
        }

        //check from data base
        const pmSchedule = await PMSchedule.findById(PMScheduleId).populate('asset assignedTo');
        if(!pmSchedule){
            return response.status(404).json({
                message: "PMSchedule not found",
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: "PMSchedule fetched successfully",
            error: false,
            data: pmSchedule,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
}

// update pm schedule by id
export const updatePMScheduleById = async(request, response) =>{
    try {
         const PMScheduleId= request.params.id;
         const data = request.body;
        if(!PMScheduleId){
            return response.status(400).json({
                message: "PMSchedule ID is required",
                error: true,
                success: false,
            });
        }

        //find and update
        const PMSchedule = await PMSchedule.findByIdAndUpdate(PMScheduleId, data, { new: true });
        if(!PMSchedule){
            return response.status(404).json({
                message: "PMSchedule not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({ 
            message: "PMSchedule updated successfully",
            error: false,
            data: PMSchedule,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
}

//delete pm schedule by id
export const deletePMScheduleById = async (request,response)=>{
    try {
        const PMScheduleId= request.params.id;
         
        if(!PMScheduleId){
            return response.status(400).json({
                message: "PMSchedule ID is required",
                error: true,
                success: false,
            });
        }

        //find and delete
        const PMSchedule = await PMSchedule.findByIdAndDelete(PMScheduleId);
        if(!PMSchedule){
            return response.status(404).json({
                message: "PMSchedule not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "PMSchedule deleted successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
}