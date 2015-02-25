# generator-app-gen
[![Build Status](https://travis-ci.org/tarcisiojr/generator-app-gen.svg)](https://travis-ci.org/tarcisiojr/generator-app-gen)
[![Coverage Status](https://coveralls.io/repos/tarcisiojr/generator-app-gen/badge.svg)](https://coveralls.io/r/tarcisiojr/generator-app-gen)
[![npm version](https://badge.fury.io/js/generator-app-gen.svg)](http://badge.fury.io/js/generator-app-gen)
[![Codacy Badge](https://www.codacy.com/project/badge/8ccf53d479d14691ae6dd9693c7298f8)](https://www.codacy.com/public/tarcisiojunior/generator-app-gen)
Customizable code generator based on Yeoman Generator.

## Usage

Install `generator-app-gen`:
```
npm install -g generator-app-gen
```

Go into your project directory:
```
cd my-project
```

Create a file `app-gen.json` (see above for more details):
```
vi app-gen.json
```

Run `yo app-gen` to start code generation.

## Configuration (app-gen.json)

The `app-gen.json` file contains information about code generation for your project. In this file going to describe the configurations for artifacts code generation.

The code generation is performed by two components: `plugins` and `drivers-in`.

The `drivers-in` are responsibles to read the configurations for `plugins`, meanwhile `plugins` are responsible for write the artifact.

### Plugins

* [`FILE`](#plugin-file)
* [`OUT`](#plugin-out)


### Drivers-in

* [`JSON`](#driver-in-json)
* [`PROMPT`](#driver-in-prompt)
* [`MYSQL`](#driver-in-mysql)

### File Structure - app-gen.json

```js

{
    "name": "Project Name",
    "artifacts": {
        "Artifact ID - 1": {
            "type": "FILE", # Plugin Id. eg.: FILE - required
            "template": "./templates/sample1.js", # Template file - required
            "out" : "./out/sample-out.js", # Outpout file name - required
            "in": { # required
                "driver": "JSON", # Driver-in type
                "config": { # Driver-in configs
                    "message": "Hello World!"
                }
            }
        },
        "Artifact ID - 2": { ... },
        ...
        "Artifact ID - n": { ... }
    }
}

```

## Plugins

<a name="plugin-file" />
### FILE
Writes the rendered template at output file specified.
```js
{
    "type": "FILE", # Plugin Id.
    "template": "./templates/sample1.js", # Template file - required
    "out" : "./out/sample-out.js", # Outpout file name - required
    "in": { ... }
    }
}
```

<a name="plugin-out" />
### OUT
Writes the rendered template at console output.
```js
{
    "type": "OUT", # Plugin Id.
    "template": "./templates/sample1.js", # Template file - required
    "in": { ... }
    }
}
```

## Drivers-in
<a name="driver-in-json" />
### JSON
Read the static supplied JSON config for template bindings.

```js
...
"in": { # required
    "driver": "JSON", # Driver-in type
    "config": { # Driver-in configs
        "message": "Hello World!"
    }
}
...
```

<a name="driver-in-prompt" />
### PROMPT
Request configuration with prompt api (see inquirer)

```js
...
"in": {
    "driver": "PROMPT", # Driver-in type
    "config": [{
        "message": "Supply the message", # Message
        "name" : "message" # Config property
    }]
}
...
```

<a name="driver-in-mysql" />
### MYSQL
Request configuration from database.

```js
...
"in": {
    "driver": "MYSQL", # Driver-in type
    "config": [{
        "message": "Supply the message", # Message
        "name" : "message" # Config property
    }]
}
...
```

## Examples
