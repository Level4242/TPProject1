// Copyright (C) 2020 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.
const fs = require("fs"); // global object - always available
const process = require("process"); // global object - always available
const prompts = require("prompts");

process.env["NODE_CONFIG_DIR"] = "./shell-utilities/config/";
const config = require("config");

const utils = require("../helpers/utils");
const logger = require("../helpers/logger");
const namingHelpers = require("../helpers/naming-helpers");

const basePathForComponents = config.generateComponent.basePathForComponents;

const minLengthOfComponentName = config.generateComponent.minLengthOfComponentName; // Minimum length of Component Name
const maxLengthOfComponentName = config.generateComponent.maxLengthOfComponentName; // Maximum length of Component Name

/**
 * Lists of the questions that will be asked to the developer for creating a component
 */
const questionsArray = [
  {
    type: "text",
    name: "componentName",
    message: "Please enter Component Name",
    validate: (compName) => {
      let output = validateComponentName(compName);
      return output === "" ? true : output;
    },
  },
];

/**
 * Public Method called to Generate Component on 'yarn gen:c'
 */
generateComponent();

/**
 * Method for generating component
 */
function generateComponent() {
  let initialErrorMessage = "";
  let componentName = "";
  let showHelp = false;

  process.argv.forEach((val, index) => {
    logger.log(`${index}: ${val}`);
    if (utils.isValidInput(val)) {
      let valData = val.split("=");
      logger.log("valData", valData);
      if (String(valData[0]).toLowerCase() === "--help" || String(valData[0]).toLowerCase() === "-h") {
        showHelp = true;
      } else if (String(valData[0]).toLowerCase() === "-n" || String(valData[0]).toLowerCase() === "--name") {
        let validateComponentMessage = validateComponentName(valData[1]);
        if (validateComponentMessage === "") {
          questionsArray.splice(questionsArray.indexOf(questionsArray.find((tempObj) => tempObj.name === "componentName")), 1);
          componentName = valData[1];
        } else {
          initialErrorMessage += "Please re-enter component name as it does not meet the expected criteria. " + validateComponentMessage + " ";
        }
      }
    }
  });

  if (showHelp === true) {
    displayHelp();
    return;
  }

  if (utils.isValidInput(initialErrorMessage)) {
    logger.printWarning(initialErrorMessage);
  }

  (async () => {
    await prompts(questionsArray)
      .then((response) => {
        logger.log(response);

        if (utils.isValidInput(response.componentName)) {
          componentName = response.componentName;
        }
        logger.log("  Input: " + componentName);
        let originalInputName = namingHelpers.convertMultipleSpacesToSingleSpace(componentName.trim().toLowerCase());
        componentName = namingHelpers.camelize(originalInputName);

        logger.log("  Component Name: " + componentName);

        if (utils.isValidInput(componentName)) {
          let fileName = namingHelpers.dasherize(originalInputName);
          logger.log("  File Name: " + fileName);
          createFolder(fileName)
            .then((folderPathGenerated) => {
              logger.log("  Folder Path (generated): " + folderPathGenerated);

              if (utils.isValidInput(folderPathGenerated)) {
                createNewFile(folderPathGenerated, fileName, componentName, "html", true);
                createNewFile(folderPathGenerated, fileName, componentName, "js", true);
                createNewFile(folderPathGenerated, fileName, componentName, "scss", true);
                createNewFile(folderPathGenerated, fileName + "-emulator", componentName, "json", false);
                logger.printSuccess("Congratulations!!! The component '" + componentName + "' has been created at the location '" + folderPathGenerated + "'.");
                logger.printSuccess("If web server (ex: npm script ‘start’) is running, please restart to load the new component.");
              } else {
                logger.printError("Something went wrong with the input values for Folder Path !!!! Please check the folder path and try again.");
              }
            })
            .catch((err) => {
              logger.error(err);
              logger.printError(err);
            });
        } else {
          logger.printError("Something went wrong with the input values for Component Name !!!! Please check the component name and try again.");
        }
      })
      .catch((err) => {
        return onErr(err);
      });
  })();
}

/**
 * Generate the component and file names as per requirement.
 * @param {string} input
 */
function convertToExpectedName(input) {
  return utils.replaceAll(utils.replaceAll(utils.replaceAll(String(input).trim().toLowerCase(), "_", ""), "-", ""), " ", "");
}

/**
 * Method for Displaying Help
 */
function displayHelp() {
  fs.readFile(
    config.generateComponent.templatesPath + "help.template",
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
 * Method to validate Component Name
 * @param {string} componentName
 */
function validateComponentName(componentName) {
  logger.log("componentName", componentName);
  if (utils.isValidInput(componentName)) {
    componentName = String(componentName).trim();
    if (componentName.length < minLengthOfComponentName || componentName.length > maxLengthOfComponentName) {
      return "Component Name is mandatory, and must be minimum " + minLengthOfComponentName + " chars and maximum " + maxLengthOfComponentName + " chars.";
    } else {
      let componentValidity = new RegExp(/^[a-zA-Z][a-zA-Z0-9-_ $]*$/).test(componentName);
      if (componentValidity === false) {
        return "Component Name is mandatory, must start with a letter and can contain letters, numbers, spaces, underscore(s), and hyphen(s).";
      } else {
        return "";
      }
    }
  } else {
    return "Component Name is mandatory, must start with a letter and can contain letters, numbers, spaces, underscore(s), and hyphen(s).";
  }
}

/**
 * Create Folder for the Components to be created
 * @param {string} folderPath
 */
async function createFolder(fileName) {
  let isFolderCreated = false;
  let fullPath = "";

  let folderPath = basePathForComponents + fileName + "/";
  let folderPathSplit = folderPath.toString().split("/");
  for (let i = 0; i < folderPathSplit.length; i++) {
    logger.log(folderPathSplit[i]);
    if (folderPathSplit[i] && folderPathSplit[i].trim() !== "") {
      let previousPath = fullPath;
      fullPath += folderPathSplit[i] + "/";
      if (!fs.existsSync(fullPath)) {
        logger.log("Creating new folder " + folderPathSplit[i] + " inside the folder " + previousPath);
        fs.mkdirSync(fullPath, {
          recursive: true,
        });
        isFolderCreated = true;
      } else {
        logger.log(fullPath + " exists !!!");
      }
    }
  }

  // Check if Folder exists
  if (isFolderCreated === false) {
    // No folder is created. This implies that the component folder already exists.

    let files = fs.readdirSync(fullPath);

    if (files.length === 0) {
      // Check if folder is empty.
      return fullPath;
    } else {
      // listing all files using forEach
      for (let j = 0; j < files.length; j++) {
        let file = files[j];
        // If a single file exists, do not continue the process of generating component
        // If not, ensure to send message that folder is not empty but still created new files
        logger.log(file);
        logger.log(fileName.toLowerCase() + ".html");
        if (file.toLowerCase() === fileName.toLowerCase() + ".html" || file.toLowerCase() === fileName.toLowerCase() + ".scss" || file.toLowerCase() === fileName.toLowerCase() + ".js") {
          // logger.printError("Component Already Exists. No Component Created");
          throw onErr("Component Already Exists. No Component Created");
        }
      }
      return fullPath;
    }
  } else {
    return fullPath;
  }
}

/**
 *
 * @param {string} folderPath - Complete folder path
 * @param {string} fileName - Name of the file
 * @param {string} fileExtenstion - File extenstion - applicable values are .html, .js, .scss
 * @param {boolean} addFileContent
 */
function createNewFile(folderPath, fileName, componentName, fileExtenstion, addFileContent) {
  // Open function with filename, file opening mode and callback function
  let completeFilePath = folderPath + fileName + "." + fileExtenstion;
  fs.open(completeFilePath, "w", function (err, file) {
    if (err) {
      throw onErr(err);
    }

    logger.log("File is opened in write mode.");
    if (addFileContent === true) {
      fs.readFile(config.generateComponent.templatesPath + fileExtenstion + ".template", (err, data) => {
        let actualContent = utils.replaceAll(data, "<%componentName%>", componentName);
        actualContent = utils.replaceAll(actualContent, "<%titleComponentName%>", namingHelpers.capitalizeEachWordWithSpaces(componentName));
        actualContent = utils.replaceAll(actualContent, "<%styleComponentName%>", namingHelpers.dasherize(componentName));
        actualContent = utils.replaceAll(actualContent, "<%copyrightYear%>", String(new Date().getFullYear()));
        actualContent = utils.replaceAll(actualContent, "<%fileName%>", fileName);

        let commonContentInGeneratedFiles = config.generateComponent.commonContentInGeneratedFiles;
        for (let i = 0; i < commonContentInGeneratedFiles.length; i++) {
          actualContent = utils.replaceAll(actualContent, "<%" + commonContentInGeneratedFiles[i].key + "%>", commonContentInGeneratedFiles[i].value);
        }

        // Write to a new file
        fs.writeFile(completeFilePath, actualContent, (err) => {
          if (err) {
            throw onErr(err);
          }

          // Success case, the file was saved
          logger.log("File contents saved!");
        });
      });
    }
  });
}

/**
 * Throw any error raised
 * @param {any} err
 */
function onErr(err) {
  logger.error(err);
  throw err;
}
