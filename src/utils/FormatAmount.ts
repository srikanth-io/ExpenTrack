
export const formatAmount = (amount: number): string => {
    if (amount >= 1e7) {
      return `${(amount / 1e7).toFixed()}C`; 
    } else if (amount >= 1e6) {
      return `${(amount / 1e6).toFixed()}M`; 
    } else if (amount >= 1e3) {
      return `${(amount / 1e3).toFixed()}K`; 
    } else {
      return amount.toFixed(); 
    }
  };