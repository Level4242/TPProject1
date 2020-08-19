// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement 
// under which you licensed this source code.  
var utils = (function () {
    "use strict";

    function log(...input) {
        let allowLogging = true;
        if (allowLogging === true) {
            console.log(...input);
        }
    }

    return {
        log: log,
    };
})();