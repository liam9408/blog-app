import { isNil, isEmpty } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateQuery = (obj: { [key: string]: any }) => {
  if (!obj) {
    return '';
  }

  const keys = Object.keys(obj);

  const queryArray: string[] = [];

  keys.forEach((key: string) => {
    if (
      (!isEmpty(obj[key]) && !isNil(obj[key])) ||
      typeof obj[key] === 'number'
    ) {
      queryArray.push(`${key}=${obj[key]}`);
    }

    if (key === 'archived' || key === 'exported') {
      queryArray.push(`${key}=${obj[key]}`);
    }
  });

  return '?' + queryArray.join('&');
};
