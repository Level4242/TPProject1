// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.
const fs = require("fs"); // global object - always available
const process = require("process"); // global object - always available
const fsExtra = require("fs-extra");
const zl = require("zip-lib");
const rimraf = require("rimraf");

process.env["NODE_CONFIG_DIR"] = "./shell-utilities/config/";
const config = require("config");

const utils = require("../helpers/utils");
const packageJson = require("./../../package.json");
const logger = require("../helpers/logger");
const namingHelpers = require("../helpers/naming-helpers");

/**
 * Public Method called to exporting project code
 */
exportProject();

/**
 * Method for exporting project
 */
async function exportProject() {
  let fileName = "";
  let showHelp = false;

  process.argv.forEach((val, index) => {
    logger.log(`${index}: ${val}`);
    if (utils.isValidInput(val)) {
      let valData = val.split("=");
      logger.log("valData", valData);
      if (valData[0] === "--help" || valData[0] === "-h") {
        showHelp = true;
      }
    }
  });

  if (showHelp === true) {
    displayHelp();
    return;
  }

  fileName = namingHelpers.removeAllSpaces(String(packageJson.name).trim());

  logger.log("  File Name: " + fileName);

  let completeFileName = config.export.zipFileDestinationPath + fileName + ".zip";
  logger.log("  Complete File Name: " + completeFileName);
  deleteFile(completeFileName);
  await sleep(2000);

  let folderPathName = packageJson.name + "-Code-Folder-Temp";
  let folderPathActual = createTempFolder(folderPathName);
  logger.log("  Temp Folder Path: " + folderPathActual);

  let excludedFiles = config.export.ignoreFilesFolders;
  excludedFiles.push(folderPathName);

  fsExtra
    .copy("./", folderPathActual, {
      filter: (path) => {
        let isValidOutput = true;
        for (var i = 0; i < excludedFiles.length; i++) {
          if (path.indexOf(excludedFiles[i]) > -1) {
            logger.log("path ===", path);
            isValidOutput = false;
          }
        }
        return isValidOutput;
      },
    })
    .then(() => {
      logger.info("Copy Done.");
      zl.archiveFolder(folderPathActual, completeFileName).then(
        function () {
          logger.info("Zip Done.");
          rimraf(folderPathActual, function (e) {
            logger.info("Clean up Done.");
            logger.printSuccess("Congratulations!!! The project is exported to '" + completeFileName + "' in the project.");
          });
        },
        function (err) {
          logger.log(err);
        }
      );
    })
    .catch((err) => {
      logger.error(err);
    });
}

/**
 * Timeout method
 * @param {number} ms 
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

/**
 * Create Temporary Folder for copy files before zipping
 */
function createTempFolder(folderPathName) {
  let folderPathActual = config.export.zipFileDestinationPath + folderPathName;
  fs.mkdirSync(folderPathActual, {
    recursive: true,
  });
  return folderPathActual;
}

/**
 * Delete directory by path
 * @param {string} temporaryDirectory
 */
function deleteTempDir(temporaryDirectory) {
  try {
    return rimraf(temporaryDirectory);
  } catch (e) {
    return false;
  }
}

/**
 * Delete File
 * @param {string} completeFilePath
 */
async function deleteFile(completeFilePath) {
  try {
    return await rimraf.sync(completeFilePath);
  } catch (e) {
    return false;
  }
}

/**
 * Method for Displaying Help
 */
function displayHelp() {
  fs.readFile(
    config.export.templatesPath + "help.template",
    {
      encoding: "utf-8",
    },
    function (err, data) {
      if (!err) {
        logger.printLog(data);
      } else {
        throw onErr(err);
      }
    }
  );
}

/**
 * Throw Error
 * @param {object | string | any} err
 */
function onErr(err) {
  logger.error(err);
  throw err;
}
