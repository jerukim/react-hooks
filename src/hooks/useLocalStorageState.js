import {useEffect, useState, useRef} from 'react'

export function useLocalStorageState(key, defaultValue = '') {
  const type = typeof defaultValue

  const deserialize = {
    string: String,
    number: Number,
    object: JSON.parse,
    boolean: value => value === 'true',
  }

  const getInitialState = () => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    if (valueInLocalStorage) {
      try {
        return deserialize[type](valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }

    return type === 'function' ? defaultValue() : defaultValue
  }

  const [state, setState] = useState(getInitialState)

  const prevKeyRef = useRef(key)

  useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }

    prevKeyRef.current = key

    const serialize = {
      string: str => str,
      number: num => num,
      object: JSON.stringify,
      boolean: bool => bool,
    }

    window.localStorage.setItem(key, serialize[type](state))
  }, [key, state, type])

  return [state, setState]
}
