const currencyMap = {
  BDT: {
    symbol: "৳",
    locale: "en-BD",
  },
  USD: {
    symbol: "$",
    locale: "en-US",
  },
  EUR: {
    symbol: "€",
    locale: "de-DE",
  },
  GBP: {
    symbol: "£",
    locale: "en-GB",
  },
  INR: {
    symbol: "₹",
    locale: "en-IN",
  },
};

export function getCurrencySymbol(currency = "BDT") {
  return currencyMap[currency]?.symbol || currencyMap.BDT.symbol;
}

export function formatCurrency(
  amount,
  currency = "BDT",
  language = "en"
) {
  const config = currencyMap[currency] || currencyMap.BDT;
  const numericAmount = Number(amount) || 0;

  const locale = language === "bn" ? "bn-BD" : config.locale;

  return `${config.symbol}${numericAmount.toLocaleString(locale, {
    maximumFractionDigits: 2,
  })}`;
}
