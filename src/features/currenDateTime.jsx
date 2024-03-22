import { DateTime } from "luxon";
const currentDateTime = () => {
  const currentDateTime = DateTime.now()
    .setZone("Asia/Ho_Chi_Minh")
    .toLocaleString(DateTime.DATETIME_FULL);
  return currentDateTime;
};
export default currentDateTime;
