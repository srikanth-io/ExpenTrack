export const formatAmount = (amount: number | undefined | null): string => {
  // Default to 0 if amount is undefined or null
  if (amount == null || isNaN(amount)) {
    return '0';
  }

  // Ensure amount is a number
  amount = Number(amount);

  // Handle amounts between 100 and 999 directly
  if (amount >= 100 && amount < 1000) {
    return amount.toFixed(amount % 1 !== 0 ? 2 : 0); // Show 2 decimal places if necessary, otherwise show no decimal places
  }

  // Format amounts in thousands, millions, or crores
  if (amount >= 1e7) {
    return `${(amount / 1e7).toFixed(1).replace(/\.0$/, '')}C`;
  } else if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  } else if (amount >= 1e3) {
    return `${(amount / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  } else {
    // For amounts less than 100
    return amount.toFixed(amount % 1 !== 0 ? 2 : 0); // Show 2 decimal places if necessary, otherwise show no decimal places
  }
};
