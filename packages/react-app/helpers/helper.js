export const formatCurrency = value => {
  return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(value);
};
