
/**
 * MK Multiverse Hardened Sanitizer
 * Prevents XSS by escaping dynamic strings
 */
export const sanitizeString = (str: string): string => {
  if (!str) return '';
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match) => map[match]);
};

/**
 * Utility to freeze sensitive configuration objects
 */
export const secureFreeze = <T extends object>(obj: T): Readonly<T> => {
  return Object.freeze(obj);
};
