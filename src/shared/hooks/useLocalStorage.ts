import { useState, useCallback } from 'react';
import { localStorageUtil } from '@/shared';

const useLocalStorage = <T>(key: string, defaultValue: T): [T, (value: T) => void, () => void] => {
  const [value, setValue] = useState<T>(() => {
    const [storedValue] = localStorageUtil<T>(key, defaultValue);
    return storedValue;
  });

  const setStoredValue = useCallback(
    (newValue: T) => {
      const [, setValueInLocalStorage] = localStorageUtil<T>(key, defaultValue);
      setValueInLocalStorage(newValue);
      setValue(newValue);
    },
    [key, defaultValue]
  );

  const removeStoredValue = useCallback(() => {
    const [, , removeValueFromLocalStorage] = localStorageUtil<T>(key, defaultValue);
    removeValueFromLocalStorage();
    setValue(defaultValue);
  }, [key, defaultValue]);

  return [value, setStoredValue, removeStoredValue];
};

export default useLocalStorage;
