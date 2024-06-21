const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

const localStorageUtil = <T>(key: string, defaultValue: T): [T, (value: T) => void, () => void] => {
  const getValue = (): T => {
    return getLocalStorageItem(key, defaultValue);
  };

  const setValue = (value: T): void => {
    setLocalStorageItem(key, value);
  };

  const removeValue = (): void => {
    removeLocalStorageItem(key);
  };

  return [getValue(), setValue, removeValue];
};

export default localStorageUtil;
