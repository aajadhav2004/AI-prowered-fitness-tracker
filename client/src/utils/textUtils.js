/**
 * Convert text to Title Case (capitalize first letter of each word)
 * @param {string} text - The text to convert
 * @returns {string} - Text in Title Case
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
