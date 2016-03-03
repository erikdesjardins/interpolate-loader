/**
 * @author Erik Desjardins
 * See LICENSE file in root directory for full license.
 */

module.exports = function(source) {
	this.cacheable && this.cacheable();
	var exec = this.exec;
	return source.replace(/\{\{(.+?)\}\}/i, function(_, url) {
		return exec(url);
	});
};
