# generator-app-gen

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

Run `yo app-gen` for start code generation.

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

### app-gen.json - File Structure

```js

{
    "name": "Project Name",
    "artifacts": {
        "Artifact ID - 1": {
            "type": "FILE", # Plugin Id. eg.: FILE
            "template": "./templates/sample1.js", # Template file
            "out" : "./out/sample-out.js", # Outpout file name
            "in": {
                "driver": "JSON", # Driver-in type
                "config": { # Driver-in configs
                    "message": "Hello World!"
                }
            }
        },

        "Artifact ID - 2": {
            ...
        },

        ...

        "Artifact ID - n": {
            ...
        }
    }
}

```

## Plugins

<a name="plugin-file" />
### FILE
