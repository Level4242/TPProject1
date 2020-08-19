// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement 
// under which you licensed this source code.  
"use strict";

var utils = {

  isValidInput: function (input) {
    if (input && input.trim !== "") {
      return true;
    } else {
      return false;
    }
  },

  deepCopy: function (input) {
    return JSON.parse(JSON.stringify(input));
  },

  replaceAll: function (str, find, replace) {
    return this.replaceText(str, new RegExp(find, "g"), replace);
  },

  replaceText: function (str, find, replace) {
    if (str && str.trim !== "") {
      return String(str).replace(find, replace);
    } else {
      return str;
    }
  },
};

module.exports = utils;