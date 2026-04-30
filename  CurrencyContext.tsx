import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'

type CurrencyCode = 'USD' | 'SAR' | 'YER'

interface Currency {
  code: CurrencyCode
  symbol: string
  rate: number
  name: string
}

interface CurrencyContextType {
  currencies: Currency[]
  activeCurrency: Currency
  setActiveCurrency: (currency: Currency) => void
  convertPrice: (priceInUSD: number) => string // converted string with 2 decimals
  formatPrice: (priceInUSD: number) => string   // symbol + converted
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, name: 'دولار أمريكي' },
  { code: 'SAR', symbol: '﷼', rate: 3.75, name: 'ريال سعودي' },
  { code: 'YER', symbol: '﷼', rate: 535, name: 'ريال يمني' },
]

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [activeCurrency, setActiveCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('activeCurrency')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Currency
        // تأكد من أن العملة المحفوظة ما زالت موجودة في القائمة
        if (currencies.some(c => c.code === parsed.code)) return parsed
      } catch {}
    }
    return currencies[0] // USD افتراضي
  })

  // حفظ العملة المختارة في localStorage
  useMemo(() => {
    localStorage.setItem('activeCurrency', JSON.stringify(activeCurrency))
  }, [activeCurrency])

  // تحويل السعر (من الدولار إلى العملة المختارة)
  const convertPrice = useCallback((priceInUSD: number): string => {
    if (typeof priceInUSD !== 'number' || isNaN(priceInUSD)) return '0.00'
    return (priceInUSD * activeCurrency.rate).toFixed(2)
  }, [activeCurrency])

  // تنسيق السعر مع الرمز
  const formatPrice = useCallback((priceInUSD: number): string => {
    return `${activeCurrency.symbol}${convertPrice(priceInUSD)}`
  }, [activeCurrency, convertPrice])

  const value = useMemo(() => ({
    currencies,
    activeCurrency,
    setActiveCurrency,
    convertPrice,
    formatPrice
  }), [activeCurrency, convertPrice, formatPrice])

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

// هوك مخصص لاستخدام العملات
export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}