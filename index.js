/**
 * @author Erik Desjardins
 * See LICENSE file in root directory for full license.
 */

'use strict';

var loaderUtils = require('loader-utils');
var escapeStringRegexp = require('escape-string-regexp');

function validateQuery(query) {
	if ('prefix' in query) {
		if (typeof query.prefix !== 'string') {
			throw new TypeError('prefix must be a string');
		}
		if (query.prefix === '') {
			throw new TypeError('prefix may not be empty');
		}
	}
	if ('suffix' in query) {
		if (typeof query.suffix !== 'string') {
			throw new TypeError('suffix must be a string');
		}
		if (query.suffix === '') {
			throw new TypeError('suffix may not be empty');
		}
	}
	if (query.prefix && !query.suffix) {
		throw new Error('prefix was supplied without a corresponding suffix');
	}
	if (query.suffix && !query.prefix) {
		throw new Error('suffix was supplied without a corresponding prefix');
	}

	return query;
}

module.exports = function(source) {
	var query = Object.assign(
		{ prefix: '{{', suffix: '}}' },
		validateQuery(loaderUtils.getOptions(this) || {})
	);
	var prefix = escapeStringRegexp(query.prefix);
	var suffix = escapeStringRegexp(query.suffix);

	var requires = [];
	var placeholder = '__INTERPOLATE_LOADER_' + String(Math.random()).slice(2) + '__';

	var content = source.replace(new RegExp(prefix + '([^\\r\\n]+?)' + suffix, 'g'), function(_, url) {
		requires.push(loaderUtils.stringifyRequest(this, url.trim()));
		return placeholder;
	}.bind(this));

	var i = 0;
	var interpolated = JSON.stringify(content).replace(new RegExp(placeholder, 'g'), function() {
		return '" + require(' + requires[i++] + ') + "';
	});

	return 'module.exports = ' + interpolated + ';';
};
