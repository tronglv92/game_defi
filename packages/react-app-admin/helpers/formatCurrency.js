export const getCurrency = value => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
