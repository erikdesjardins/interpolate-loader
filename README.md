# interpolate-loader

Webpack loader to interpolate require results.

Useful if you need to use a manifest file as an entry point to your application.

Pairs well with [`prop-loader`](https://github.com/erikdesjardins/prop-loader) and [`entry-loader`](https://github.com/eoin/entry-loader) / [`spawn-loader`](https://github.com/erikdesjardins/spawn-loader) (see below).

Usually, you will want to pipe the output from this loader into [`extricate-loader`](https://github.com/erikdesjardins/extricate-loader) (to resolve the imports) and then [`file-loader`](https://github.com/webpack/file-loader) (to emit a non-js manifest file).

## Installation

`npm install --save-dev interpolate-loader`

## Options

### Prefix/suffix

If you supply a query, it must contain both `prefix` and `suffix`.

#### Examples

`interpolate-loader?prefix=(*&suffix=*)`

`interpolate-loader?prefix=%3C%25&suffix=%25%3E` (lodash-style `<%` and `%>`)

#### Defaults

`prefix`: `{{`

`suffix`: `}}`

## Example Usage

**webpack.config.js:**

```js
var InertEntryPlugin = require('inert-entry-webpack-plugin'); // maybe unnecessary, see below

module.exports = {
  entry: 'extricate-loader!interpolate-loader!manifest.json',
  output: { filename: 'manifest.json' },
  module: {
    rules: [{
      test: /\.html$/,
      use: [
        { loader: 'file-loader', options: { name: '[name].[ext]' } },
        'extricate-loader',
        'html-loader'
      ]
    }]
  },
  plugins: [
  	// This is required to use manifest.json as the entry point.
  	// If the entry point is a .js file and this loader is only used
  	// for subresources, then it is not necessary.
  	new InertEntryPlugin()
  ],
};
```

**manifest.json:**

```json
{
  "name": "{{prop-loader?name!package.json}}",
  "version": "{{prop-loader?name!package.json}}",
  "description": "{{prop-loader?description!package.json}}",
  "background": {
    "scripts": [
      "{{entry-loader!main.js}}" // or {{spawn-loader!main.js}}
    ]
  },
  "options_page": "{{options.html}}",
  "icons": {
    "48": "{{file-loader!images/icon48.png}}",
    "128": "{{file-loader!images/icon128.png}}"
  }
}
```

### Output

**manifest.json:**
```json
{
  "name": "my-package",
  "version": "3.2.1",
  "description": "This is my package.",
  "background": {
    "scripts": [
      "main.109fa8.js"
    ]
  },
  "options_page": "options.html",
  "icons": {
    "48": "e43b20c069c4a01867c31e98cbce33c9.png",
    "128": "0dcbbaa701328a3c262cfd45869e351f.png"
  }
}
```
