export function changeCurr(value) {
  const formattedCurr = new Intl.NumberFormat("vi-VI", {
    style: "currency",
    currency: "VND",
  }).format(value);
  return formattedCurr;
}
