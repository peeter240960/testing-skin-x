export function setStorage(key: string, value: string) {
  return localStorage.setItem(key, value);
}

export function getStorage(key: string) {
  return localStorage.getItem(key);
}

export function removeStorage(key: string) {
  return localStorage.removeItem(key);
}

export function clearStorage() {
  return localStorage.clear();
}
export function replaceHtml(str: string) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}
