import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
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
