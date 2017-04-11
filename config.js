const pug = require('pug-loader')
const styl = require('stylus-loader')
const js = require('babel-loader')
const img = require('img-loader')

module.exports = {
	path: 'src/**/*',
	output: 'build',
	load: { pug, styl, js, img },
	js: {
		babelrc: true
	}
}
