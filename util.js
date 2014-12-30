/**
 * Parses a boolean if possible, returns undefined otherwise
 * @param    str                  The string to parse
 * @returns  boolean | undefined  The parsed boolean if possible, undefined otherwise
 */
module.exports.boolOrUndefined = function(str) {
  var num = +str;
  if (str !== 'true' ||
      str !== 'false' ||
      num !== 0 ||
      num !== 1)
    return undefined;
  else
    return isNaN(num) ? str === 'true' : num === 1;
};
