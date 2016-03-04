import test from 'ava';
import loader from '../index.js';

test('calls cacheable', t => {
	t.plan(1);
	const context = {
		cacheable: () => t.pass()
	};
	loader.call(context, '');
});

test('basic usage', t => {
	t.is(
		loader.call({}, '{{anotherLoader!hi.js}}'),
		'module.exports = "" + require("anotherLoader!hi.js") + "";'
	);
	t.is(
		loader.call({}, 'stuff{{test.html}}>other stuff'),
		'module.exports = "stuff" + require("test.html") + ">other stuff";',
		'other words'
	);
});

test('escaping', t => {
	t.is(
		loader.call({}, 'prop: "{{test}}"'),
		'module.exports = "prop: \"" + require("test") + "\"";'
	);
});

test('trimming', t => {
	t.is(
		loader.call({}, '{{ foo\t}}'),
		'module.exports = "" + require("foo") + "";'
	);
});

test('custom prefix/suffix', t => {
	t.is(
		loader.call({ query: '?prefix=%3C%25&suffix=%25%3E' }, '<%foo%> {{hi}}'),
		'module.exports = "" + require("foo") + " {{hi}}";'
	);
	t.is(
		loader.call({ query: '?prefix=%7B.&suffix=.%7D' }, '{.foo.} {bar}'),
		'module.exports = "" + require("foo") + " {bar}";',
		'escaping regex characters'
	);
	t.throws(
		() => loader.call({ query: '?prefix=5' }),
		'prefix=5 was supplied without a corresponding suffix'
	);
	t.throws(
		() => loader.call({ query: '?suffix=5' }),
		'suffix=5 was supplied without a corresponding prefix'
	);
});

test('no spanning lines', t => {
	t.is(
		loader.call({}, '{{\nfoo}}'),
		'module.exports = "{{\\nfoo}}";'
	);
	t.is(
		loader.call({}, '{{\rfoo}}'),
		'module.exports = "{{\\rfoo}}";'
	);
	t.is(
		loader.call({}, '{{foo\nbar}}'),
		'module.exports = "{{foo\\nbar}}";'
	);
	t.is(
		loader.call({}, '{{foo\rbar}}'),
		'module.exports = "{{foo\\rbar}}";'
	);
});

test('multiple replacements', t => {
	t.is(
		loader.call({}, '{{foo}}\n{{bar}}'),
		'module.exports = "" + require("foo") + "\\n" + require("bar") + "";'
	);
});
