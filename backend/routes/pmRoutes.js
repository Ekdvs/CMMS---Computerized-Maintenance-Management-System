import express from "express";
import { auth } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const pmRouter = express.Router();
pmRouter.post('/create-pm-schedule',auth,authorizeRoles('admin','manager'),createPMSchedule);
pmRouter.get('/all-pm-schedules',auth,getAllPMSchedules);
pmRouter.get('/pm-schedule/:id',auth,getPMScheduleById);
pmRouter.put('/update-pm-schedule/:id',auth,authorizeRoles('admin','manager'),updatePMSchedule);
pmRouter.delete('/delete-pm-schedule/:id',auth,authorizeRoles('admin','manager'),deletePMScheduleById);

export default pmRouter;