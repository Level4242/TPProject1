// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement 
// under which you licensed this source code.  
/*jslint es6 */
/*global document, window, XMLHttpRequest, CrComLib, event, translateModule, setTimeout, requestAnimationFrame, serviceModule */
var appModule = (function () {
    'use strict';
    /**
     * All public and local(prefix '_') properties
     */
    let triggerview = document.querySelector('.triggerview');
    let navbarThumb = document.querySelector('.swiper-thumb');
    let activeIndex = 0;
    let previousActiveIndex = -1;
    let themeTimer;
    var NAV_PAGE_COUNT = 0; // Number of buttons in the navigation menu
    var logger = {};

    /**
     * This is public method to change the theme
     * @param {string} theme pass theme type like 'LIGHT', 'DARK'
     */
    function changeTheme(theme) {
        clearTimeout(themeTimer);
        themeTimer = setTimeout(function () {
            let body = document.body;
            body.classList.remove('light-theme', 'dark-theme');
            if (theme === 'LIGHT') {
                body.classList.add('light-theme');
                CrComLib.publishEvent('s', 'common_background_url', './assets/img/ch5-stone-light-bg.jpg');
                document.getElementById('brandLogo').src = './assets/img/ch5-logo-light.svg';
            } else {
                body.classList.add('dark-theme');
                CrComLib.publishEvent('s', 'common_background_url', './assets/img/ch5-stone-dark-bg.jpg');
                document.getElementById('brandLogo').src = './assets/img/ch5-logo-dark.svg';
            }
        }, 500);
    }

    /**
     * This is public method for bottom navigation to navigate to next page
     * @param {number} idx is current index for navigate to appropriate page
     */
    function navMenu(idx) {
        if (triggerview !== null && idx !== activeIndex) {
            triggerview.setActiveView(idx);
        }
    }

    /**
     * This is public method for bottom navigation to set active state
     * @param {number} idx is current index for active state
     */
    function navActiveState(idx) {
        // If the previous and current index are same then return
        if (previousActiveIndex === idx) return;

        CrComLib.publishEvent('b', 'active_state_class_' + String(previousActiveIndex), false);
        if (activeIndex === idx) {
            previousActiveIndex = idx;
            CrComLib.publishEvent('b', 'active_state_class_' + String(idx), true);
        }
    }

    /**
     * This is public method for triggerview
     * @param {number} navItemSize is number of bottom navigation list
     */
    function triggerviewOnInit(navItemSize) {
        NAV_PAGE_COUNT = navItemSize;
        // storing active class index
        let storedActiveCls = document.querySelectorAll('.swiper-thumb .ch5-button');
        storedActiveCls.forEach(function (cls, navIdx) {
            if (cls.classList.contains('ch5-button--selected')) {
                navActiveState(navIdx);
            }
        });

        // on Init after language load
        if (navItemSize !== storedActiveCls.length) {
            CrComLib.publishEvent('n', 'nav.items.size', navItemSize);
            navActiveState(activeIndex);
        }
    }

    /**
     * This is public method to show language dropdown in smaller screen
     * @param {object} self is current element
     */
    function openLngMenu(self) {
        self.className += ' open';
        event.stopPropagation();
    }

    /**
     * This method will call till element is load
     */
    function rafAsync() {
        return new Promise(function (resolve) {
            requestAnimationFrame(resolve);
        });
    }

    /**
     * This method will return true if element loads
     * @param {string} selector is string of element, like class, id, tag name etc...
     */
    function checkElement(selector) {
        if (document.querySelector(selector) === null) {
            return rafAsync().then(() => checkElement(selector));
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * This is private method for add the class on targeted class element
     * @param {array} gatherElementsClass is array of class which you have to target.
     * @param {string} appendClass is class name which you have to add.
     */
    function addClassOnClick(gatherElementsClass, appendClass) {
        let elements = document.querySelectorAll(gatherElementsClass);
        if (elements) {
            elements.forEach(function (element) {
                element.addEventListener('click', function (e) {
                    e.currentTarget.classList.add(appendClass);
                    let myButton = e.currentTarget;
                    setTimeout(function () {
                        myButton.classList.remove(appendClass);
                    }, 1500);
                });
            });
        }
    }

    /**
     * This is public method to show/hide bottom navigation in smaller screen
     */
    function openThumbNav() {
        navbarThumb.className += ' open';
        event.stopPropagation();
    }

    /**
     * This method will invoke on body click
     */
    document.body.addEventListener('click', function (event) {
        navbarThumb.classList.remove('open');
    });

    /**
     * Load the emulator, theme, default language and listeners
     */
    function onLoadInit() {
        changeTheme('LIGHT');
        translateModule.getLanguage(translateModule.defaultLng);
        triggerview.addEventListener('select', function (event) {
            setTimeout(() => {
                activeIndex = event.detail;
                navActiveState(activeIndex);
            });
        });

        /* Note: You can uncomment below line to enable remote logger. 
         * Refer below documentation link to know more about remote logger.
         * https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/UI-Remote-Logger.htm
         */
        // initializeLogger(serverIPAddress, serverPortNumber);
    }

    /**
     * Initialize remote logger
     * @param {string} hostName - docker server IPaddress / Hostname
     * @param {string} portNumber - docker server Port number
     */
    function initializeLogger(hostName, portNumber) {
        setTimeout(() => {
            var lg = loggerService.setRemoteLoggerConfig(hostName, portNumber);
            if (lg) {
                logger = lg;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', onLoadInit);

    /**
     * All public method and properties exporting here
     */
    return {
        changeTheme: changeTheme,
        triggerviewOnInit: triggerviewOnInit,
        openLngMenu: openLngMenu,
        openThumbNav: openThumbNav,
        checkElement: checkElement,
        addClassOnClick: addClassOnClick,
        navMenu: navMenu
    };

}());

/**
 * Loader method is for spinner
 */
function loader() {
    'use strict';
    let spinner = document.getElementById('loader');
    setTimeout(function () {
        spinner.style.display = 'none';
    }, 1000);
}

document.addEventListener('DOMContentLoaded', loader, false);