import React, { createContext, useContext, useState } from 'react';

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  JPY: { symbol: '¥', rate: 151.5, name: 'Japanese Yen' },
  AUD: { symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
  CAD: { symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
  CHF: { symbol: 'CHF', rate: 0.9, name: 'Swiss Franc' },
  CNY: { symbol: '¥', rate: 7.23, name: 'Chinese Yuan' },
  HKD: { symbol: 'HK$', rate: 7.83, name: 'Hong Kong Dollar' },
  NZD: { symbol: 'NZ$', rate: 1.66, name: 'New Zealand Dollar' },
  INR: { symbol: '₹', rate: 83.3, name: 'Indian Rupee' },
};

export type CurrencyCode = keyof typeof CURRENCIES;

interface CurrencyContextType {
  globalCurrency: CurrencyCode;
  setGlobalCurrency: (currency: CurrencyCode) => void;
  convertAmount: (amount: number, fromCurrency?: CurrencyCode, toCurrency?: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalCurrency, setGlobalCurrency] = useState<CurrencyCode>('USD');
  const [ratesLoaded, setRatesLoaded] = useState(false);

  React.useEffect(() => {
    fetch('https://api.frankfurter.app/latest?from=USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          Object.keys(CURRENCIES).forEach(key => {
            if (key !== 'USD' && data.rates[key]) {
              CURRENCIES[key as CurrencyCode].rate = data.rates[key];
            }
          });
          setRatesLoaded(true);
        }
      })
      .catch(err => console.error("Failed to fetch live rates", err));
  }, []);

  const convertAmount = (amount: number, fromCurrency: CurrencyCode = 'USD', toCurrency: CurrencyCode = globalCurrency) => {
    const amountInUSD = amount / CURRENCIES[fromCurrency].rate;
    return amountInUSD * CURRENCIES[toCurrency].rate;
  };

  return (
    <CurrencyContext.Provider value={{ globalCurrency, setGlobalCurrency, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
