export function getISTDate(date = new Date()) {
  const ist = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  return ist;
}

export function getISTMidnightDate(date = new Date()) {
  const ist = getISTDate(date);
  ist.setHours(0, 0, 0, 0);
  return ist;
}
