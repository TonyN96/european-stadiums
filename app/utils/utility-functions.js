"use strict";

const utilityFunctions = {
  // Method used to format dates to a more readable format
  dateFormatter: function (dateInput) {
    const output =
      ("0" + dateInput.getDate()).slice(-2) +
      "-" +
      ("0" + (dateInput.getMonth() + 1)).slice(-2) +
      "-" +
      dateInput.getFullYear();
    return output;
  },

  // Method used to categorise stadiums by country
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
