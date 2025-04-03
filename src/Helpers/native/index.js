import { store } from "../../redux/native/store"

export function getToken() {
  const state = store.getState();
  const { token = "" } = state?.authSlice || {};
  return token
}



export const sortWordsLength = (text, maxLength) => {
  const str = typeof text === 'number' ? String(text) : text;
  if (typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};
