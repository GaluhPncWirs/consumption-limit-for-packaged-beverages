export function getConvertMaxSugar(maxSugar) {
  return maxSugar.toLocaleString("id-ID", {
    maximumFractionDigits: 0,
  });
}
