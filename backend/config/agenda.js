// /config/agenda.js
import Agenda from "agenda";
import dotenv from "dotenv";
dotenv.config();



const agenda = new Agenda({
    db: {
        address: process.env.MONGODB_URL,
        collection: "agendaJobs", // collection where agenda jobs will be stored
        options: {
            useUnifiedTopology: true
        }
    },
    processEvery: "30 seconds", // how often Agenda checks for jobs
});



// Example Job: Send PM Reminder  
agenda.define("send-pm-reminder", async (job) => {
    const { assetId, dueDate, assignedTo } = job.attrs.data;

    console.log("⏰ Sending PM Reminder for asset:", assetId);

    
});

// Example Job: Auto Close Work Orders
agenda.define("auto-close-workorders", async () => {
    console.log("🔧 Auto closing completed work orders...");

    
});

// Example Job: Generate PM Work Order
agenda.define("generate-pm-workorder", async (job) => {
    const { assetId, scheduleId } = job.attrs.data;
    console.log("📝 Generating PM Work Order for:", assetId);

    
});


export const startAgenda = async () => {
    await agenda.start();
    console.log("🚀 Agenda job scheduler started");
};

export default agenda;
