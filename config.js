const fs = require('fs')
const pug = require('@depmap/pug-loader')
const styl = require('@depmap/stylus-loader')
const js = require('@depmap/babel-loader')
const img = require('@depmap/img-loader')

const collections = require('@depmap/collection-loader')({
  files: { '.cache/posts.json': 'articles' },
  dependsOn: 'src/html/_post-template.pug',
	dependents: ['src/html/index.pug'],
	onUpdate: (article) => {
		console.log(article)
		let filename = article.title.toLowerCase().replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-')
		console.log(`compiling article: ${article.title}`)
		if (!fs.existsSync('build/posts')) fs.mkdirSync('build/posts')
		fs.writeFileSync(`build/posts/${filename}.html`, pug.compile.file('src/html/_post-template.pug', article))
	},
	fetch: (cachePath) => {
		// Hit API and return data
		return JSON.stringify([
			{
				title: `It's fast, no bamboozle`,
				author: `You know who`,
				lastUpdated: new Date(),
				body: `Go, go, go, go, go, go, go, go, go, go\nGotta go fast, gotta go fast,\nGotta go faster, faster, faster, faster, faster\nMovin' at speed of sound`
			}
		], null, '  ')
	}
})

module.exports = {
  path: 'src/**/*',
  output: 'build',
  load: { pug, styl, js, img, collections },
  cache: {
    // pass false, rather than the object, to disable cache
    path: '.cache'
  },
  js: {
    babelrc: true
  }
}
