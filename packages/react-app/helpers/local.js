import { LS_KEY } from "../constants/key";

export let local;

if (isLocalStorageAvailable()) {
  local = window.localStorage;
}
export function isLocalStorageAvailable() {
  let test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
export const setLocal = (key, data) => {
  const jsonData = JSON.stringify(data);
  if (local) {
    local.setItem(key, jsonData);
  }
};

export const getLocal = key => {
  let data = null;
  let raw = null;
  if (local) {
    raw = local.getItem(key);
  }
  if (raw && typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }
  return data;
};

export const getAuth = () => {
  return getLocal(LS_KEY);
};
export const setAuth = auth => {
  setLocal(LS_KEY, auth);
};
export const removeLocal = key => {
  if (local) {
    local.removeItem(key);
  }
};

export const updateLocal = (key, data) => {
  const localData = getLocal(key) || {};
  const mergedData = { ...localData, ...data };
  setLocal(key, mergedData);
};
