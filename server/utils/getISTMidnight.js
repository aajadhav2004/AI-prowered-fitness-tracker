// Convert any JS date to IST midnight
export function getISTMidnight(date = new Date()) {
  return new Date(
    date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata"
    })
  ).setHours(0, 0, 0, 0);
}
