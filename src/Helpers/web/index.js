import { store } from "../../redux/store"
export function getToken() {
  const state = store.getState(); 
  // this code won't work in native
  return state.auth.user?.token || null;

}

export function setTokenInLocalStorage(token) {
  localStorage.setItem("token", token);
}

export function clearLocalStorage() {
  localStorage.clear();
}

export function generateRandomString(length=8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getCount(key1, key2) {
  
  let value =  +key1 + +key2
  return Number.isInteger(value) ? value : +value.toFixed(2)
}