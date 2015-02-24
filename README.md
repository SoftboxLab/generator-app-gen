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
