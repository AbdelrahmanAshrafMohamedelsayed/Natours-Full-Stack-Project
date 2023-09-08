const ExtractYear = (date) => {
  if (!date) return { year: null, month: null };
  const date2 = new Date(date);
  const year = date2.getFullYear();
  const monthAbbreviation = date2.toLocaleString("default", { month: "short" });
  const month = monthAbbreviation;
  return {
    year,
    month,
  };
};
export default ExtractYear;
