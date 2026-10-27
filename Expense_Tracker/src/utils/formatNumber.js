export function formatNumber(number, language = "en") {
  const value = Number(number) || 0;

  return value.toLocaleString(
    language === "bn" ? "bn-BD" : "en-US",
    {
      maximumFractionDigits: 2,
    }
  );
}