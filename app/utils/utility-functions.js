"use strict";

const utilityFunctions = {
  dateFormatter: function (dateInput) {
    const output =
      ("0" + dateInput.getDate()).slice(-2) +
      "-" +
      ("0" + (dateInput.getMonth() + 1)).slice(-2) +
      "-" +
      dateInput.getFullYear();
    return output;
  },

  categoriseStadiums: function (stadiums) {
    let countries = ["England", "France", "Germany", "Italy", "Spain"];
    let result = [];
    for (let x = 0; x < countries.length; x++) {
      let array = [];
      for (let y = 0; y < stadiums.length; y++) {
        if (stadiums[y].country == countries[x]) {
          array.push(stadiums[y]);
        }
      }
      result.push(array);
    }
    return result;
  },
};

module.exports = utilityFunctions;
