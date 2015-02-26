# generator-app-gen
[![Build Status](https://travis-ci.org/tarcisiojr/generator-app-gen.svg)](https://travis-ci.org/tarcisiojr/generator-app-gen)
[![Coverage Status](https://coveralls.io/repos/tarcisiojr/generator-app-gen/badge.svg)](https://coveralls.io/r/tarcisiojr/generator-app-gen)
[![npm version](https://badge.fury.io/js/generator-app-gen.svg)](http://badge.fury.io/js/generator-app-gen)
[![Codacy Badge](https://www.codacy.com/project/badge/8ccf53d479d14691ae6dd9693c7298f8)](https://www.codacy.com/public/tarcisiojunior/generator-app-gen)
[![Code Climate](https://codeclimate.com/github/tarcisiojr/generator-app-gen/badges/gpa.svg)](https://codeclimate.com/github/tarcisiojr/generator-app-gen)
[![NPM](https://nodei.co/npm/generator-app-gen.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/generator-app-gen/)

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

Create a file `app-gen.[json|js]` (see above for more details):
```
vi app-gen.json
```

Run `yo app-gen` to start code generation.

## Configuration (app-gen.[json|js])

The `app-gen.[json|js]` file contains information about code generation for your project. In this file going to describe the configurations for artifacts code generation.

The artifact code generation is performed by 3 configurations: `from`, `in` and `to`.

The configuration `from` is the template source.
The configuration `in` is the input source.
The configuration `to` is the destination.

Below are the available drivers for each configuration.

### From
* [`FILE`](#driver-from-file)


### In

* [`JSON`](#driver-in-json)
* [`PROMPT`](#driver-in-prompt)
* [`MYSQL`](#driver-in-mysql)

### To

* [`FILE`](#plugin-file)
* [`CONSOLE`](#plugin-console)


### File Structure - app-gen.json

In this example, the artifact "Sample1" is getting a template from a file, reading the inputs from JSON and will write resultant text on console and in a file.
```js
{
    "name": "Project Name",
    "artifacts": {
        "Sample1": {
            "from": {
                "driver": "FILE",
                "template": "./templates/sample-from.js"
            },
            "in": {
                "driver": "JSON",
                "config": {
                    "message": "Hello World!"
                }
            },
            "to": [{
                "driver": "CONSOLE"
            }, {
                "driver": "FILE",
                "out" : "./out/sample-out.js"
            }]
        },
        "Sample2": { ... },
        ...
        "SampleN": { ... }
    }
}

```

## From
<a name="driver-from-file" />
Read a template from file.
```js
...
"in": {
    "driver": "FILE",
    "template": "template file path"
}
...
```

## In
<a name="driver-in-json" />
### JSON
Read the static supplied JSON config for template bindings.

```js
...
"in": { # required
    "driver": "JSON",
    "config": {
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
    "driver": "PROMPT",
    "config": [{
        "message": "Supply the message",
        "name" : "message"
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
    "driver": "MYSQL",
    "config": {
        "host": "localhost",
        "port" : "3306",
        "user" : "root",
        "password": "root",
        "query": "SELECT NULL"
    }
}
...
```

## To

<a name="plugin-file" />
### FILE
Writes the rendered template at output file specified.
```js
{
    "driver": "FILE",
    "out": "path to destination file",
}
```

<a name="plugin-console" />
### CONSOLE
Writes the rendered template at console output.
```js
{
    "driver": "CONSOLE"
}
```
