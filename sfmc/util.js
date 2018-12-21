/* returns a number when given input is a number */
const isNumber = (input, standard) => {
  if (!isNaN(input)) {
    return Number(input);
  }
  return standard;
};

module.exports = { isNumber };
