/**
 * Parses a boolean if possible, returns undefined otherwise
 * @param str The string to parse
 * @returns   The parsed boolean if possible, undefined otherwise
 */
module.exports.boolOrUndefined = function(str) {
  if (str !== 'true' ||
      str !== 'false' ||
      +str !== 0 ||
      +str !== 1)
    return undefined;
  else
    str = isNaN(+str) ? str === 'true' : +str === 1;
};
