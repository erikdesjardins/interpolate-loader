# interpolate-loader

Webpack loader to interpolate require results.

Useful if you need to use a manifest file as an entry point to your application.

Pairs well with [`prop-loader`](https://github.com/erikdesjardins/prop-loader) (see below).

## Installation

`npm install --save-dev prop-loader`

## Usage

**webpack.config.js:**

```js
module.exports = {
	entry: 'interpolate!manifest.json',
	module: {
		loaders: [
			{ test: /\.js$/i, loader: 'file?name=[name].[hash:6].[ext]' },
			{ test: /\.html$/, loaders: ['file?name=[name].[ext]', 'extract', 'html'] }
		]
	}
	// ...
};
```

**manifest.json:**

```json
{
	"name": "{{prop?name!package.json}}",
	"version": "{{prop?name!package.json}}",
	"description": "{{prop?description!package.json}}",
	"background": {
		"scripts": [
			"{{main.js}}"
		]
	},
	"options_page": "{{options.html}}",
	"icons": {
		"48": "{{file!images/icon48.png}}",
		"128": "{{file!images/icon128.png}}"
	}
}
```

### Output (example)

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
