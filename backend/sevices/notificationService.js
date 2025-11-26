import Notification from "../models/Notification";


export const createNotification = async ({ userId, title, message, data }) => {
  const n = await Notification.create({
    user: userId,
    title,
    message,
    data
  });
  return n;
};