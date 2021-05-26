"use strict";

const sanitizeHtml = require("sanitize-html");

// Module used to sanitize input and prevent XSS attacks
const sanitizer = {
  sanitizeContent: function (dirtyInput) {
    let cleanOutput = sanitizeHtml(dirtyInput, {
      allowedTags: [""],
      allowedAttributes: {},
    });
    return cleanOutput;
  },
};

module.exports = sanitizer;
