
export const validateSymbol = (symbol: string): boolean => {
  // Simple validation for A-shares (6 digits) or HK shares (5 digits)
  return /^\d{5,6}$/.test(symbol);
};

export const validateAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount > 0;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
