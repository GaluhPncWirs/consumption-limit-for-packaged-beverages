export function convertResultCalculate(resultCalculate: number) {
  return resultCalculate?.toLocaleString("id-ID", {
    maximumFractionDigits: 0,
  });
}
