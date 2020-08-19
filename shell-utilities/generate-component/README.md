# Shell Template - Generate Component

The 'generate component' function creates new components using command-line statements.
 
## Installation

### Install dependencies

*npm i prompts --save-dev*

*npm i rimraf --save-dev*

*npm i config --save-dev*


## How to use
To create a component, go to the command-prompt or terminal of the Shell Template Project, and execute `yarn generate:component` or `npm run generate:component`

To access help for 'generate component', execute `yarn generate:component --help` or `npm run generate:component -- --help`

```
Usage: yarn generate:component [options]

Options:
    -h, --help          Help for Generate Documentation
    -n, --name          Set the Name of the compoenent to be created

You could use Yarn / npm to generate components. The following are the commands:
    yarn generate:component
    npm run generate:component

You could use shortcuts as the following:
    yarn gen:c
    npm run gen:c

You could use Yarn / npm to generate components. The following are the commands:
    yarn gen:c --name=LEDLights
    yarn gen:c -n=LEDLights
    npm run gen:c --  --name=LEDLights
    npm run gen:c --  -n=LEDLights

```

The Component Name is mandatory to create a component. It must start with a letter and can contain letters, hyphens, spaces, underscores and numbers. 

Based on the input for component name, the following will be the generated components and file or folder names:

| No | Input Component Name | Generated Component Name  | Generated File and Folder Names |
| -- | -------------------- | ------------------------- | ------------------------------- |
| 01 | LEDLights            | ledlights                 | ledlights                       |
| 02 | ledlights            | ledlights                 | ledlights                       |
| 03 | LEDLIGHTS            | ledlights                 | ledlights                       |
| 04 | LED-Lights           | ledLights                 | led-lights                      |
| 05 | LED_Lights           | ledLights                 | led-lights                      |
| 06 | led-lights           | ledLights                 | led-lights                      |
| 07 | led_lights           | ledLights                 | led-lights                      |
| 08 | led lights           | ledLights                 | led-lights                      |

Each component generated will contain the following files:
- {component}.html
- {component}.js
- {component}.scss
- {component}-emulator.json

The component files will be created inside `./app/components/{component}` folder. 

## Understanding the generated code

All template files are available in the folder `./shell-utilities/generate-component/templates`

### {component}.html
The generated file consists of the following:
1. Section Id - Based on the name of the component as expressed in the table above.
2. Title - Generated baed on name of the component.
3. *div* tag - Styled with reference to the styles in {component}.scss file.

### {component}.js
The generated file consists of the following:
1. Component Module - Based on the name of the component as expressed in the table above.
2. An onInit() method that gets called in the 'afterLoad' event listener.
3. One public method getOutput()
4. Returns public method

### {component}.scss
The generated file consists of the following:
1. Id - Based on the name of the component as expressed in the table above. This must not be removed, and all css must be added inside this id.
2. css selector .message-text for the *div* tag created in the generated html.

### {component}-emulator.json
This file is created for any emulator json file related to the component.


### Change configuration parameters

All configuration parameters are available in the default.json file located at ./shell-utilities/config/

Parameters for "generateComponent" are
- "basePathForComponents": "./app/components/" - This indicates the path where the component will be generated.
- "templatesPath": "./shell-utilities/generate-component/templates/" - This indicates the path where the templates can be found
- "minLengthOfComponentName": 2 - The minimum length for component name
- "maxLengthOfComponentName": 31 - The maximum length for component name

Parameters for "logger" are
- "allowLogging": false - Applicable values are true / false. This can be used for developer debugging.
- "logLevel": 1 - Indicates the logging levels for developer debugging. Applicable values can be found in logger.js file. 


### Copyright
Copyright (C) 2020 to the present, Crestron Electronics, Inc.

All rights reserved.

No part of this software may be reproduced in any form, machine
or natural, without the express written consent of Crestron Electronics.

Use of this source code is subject to the terms of the Crestron Software License Agreement 
under which you licensed this source code. 