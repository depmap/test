const fs = require('fs')
const path = require('path')

// async function readFile(path) {
//   return await new Promise((res, rej) => {
//     fs.stat(path, (err, stats) => {
//       if (err) rej(err)
//       res(stats)
//     })
//   })
// }

// fs.readdir(process.cwd(), (err, files) => {
//   loop(files, (file, next) => {
//     const stats = readFile(file)
//     stats.then(stats => console.log(file)).then(next)
//   }, true)
// });

/*
 * Loop with a tick
 * @param items    {Array}    Required, array to iterate over
 * @param cb       {Function} Required, function to execute before next tick
 * @param count    {Number}   Optional, start point in array, keeps iterative count
 * @param infinite {Boolean}  Optional, while-loop style iteration
 *
 * @returns {Function} Execute when you're ready to continue
 */
function loop(items, cb, count=0, infinite=false) {
  if (typeof count == 'boolean') [count, infinite] = [0, count]
  if (infinite && count === items.length) count = 0

  cb(items[count], (err) => {
    if (err) throw err
    process.nextTick(loop, items, cb, ++count, infinite)
  })
}


function statAsync(file) {
	return new Promise((res, rej) => {
		console.log('Stating', file)
		fs.stat(file, (stats, err) => {
			if (err.message) rej(err)
			console.log(stats || err)
			res(stats || err)
		})
	})
}

function* stats([files]) {
	while(files.length) {
		let stat = yield statAsync(files.shift())
	}
	return
}

function coroutine(gen, ...params) {
	const generator = gen(params)

	try {
		return onFullfilled()
	} catch (err) {
		return Promise.reject(err)
	}

	function onFullfilled(value) {
		let next = generator.next(value)
		handleNext(next)
	}
	
	function onRejected(err) {
		let next = generator.throw(err)
		return handleNext(next)
	}

	function handleNext(next) {
		if (next.done) return Promise.resolve(next.value)
		return next.value.then(onFullfilled).catch(onRejected)
	}
}

let files = fs.readdirSync(process.cwd())
let fileStats = coroutine(stats, files)
fileStats.then(console.log)
