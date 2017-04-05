const pug = require('pug-loader')
const styl = require('stylus-loader')
const js = require('babel-loader')

module.exports = {
	path: 'src/**/*',
	load: { pug, styl, js },
	js: {
		babelrc: true
	}
}
