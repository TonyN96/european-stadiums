"use strict";

const sanitizeHtml = require("sanitize-html");

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
