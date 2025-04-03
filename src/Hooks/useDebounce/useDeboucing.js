import { useEffect, useState } from "react"

export const useDebouncing = (serach = '', delay = 1000) => {
  const [debounceSearch, setDebouneSearch] = useState('')
  useEffect(() => {
    let timeout = setTimeout(() => {
      setDebouneSearch(serach)
    }, delay)
    return () => clearTimeout(timeout)
  }, [serach])
  return debounceSearch
}

