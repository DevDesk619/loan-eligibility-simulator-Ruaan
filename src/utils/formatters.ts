const zarCurrency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export function formatMoney(value: number): string {
  return zarCurrency.format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${(Number.isFinite(value) ? value : 0).toFixed(fractionDigits)}%`;
}
