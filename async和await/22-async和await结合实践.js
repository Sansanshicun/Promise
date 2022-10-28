const { rejects } = require('assert');
const fs = require('fs')

const util = require('util');
const mineReadFile = util.promisify(fs.readFile)


//回调函数
// fs.readFile('./resource/1.html', (err, data) => {
// 	if (err) throw err;
// 	fs.readFile('./resource/2.html', (err, data1) => {
// 		if (err) throw err;
// 		fs.readFile('./resource/3.html', (err, data2) => {
// 			if (err) throw err;
// 			console.log(data + data1 + data2);
// 		})
// 	})
// })

//async和await
async function main() {
	try {
		//读取第一个文件的内容
		let data = await mineReadFile('./resource/1.html')
		let data1 = await mineReadFile('./resource/2.html')
		let data2 = await mineReadFile('./resource/3.html')
		console.log(data + data1 + data2);
	} catch (e) {
		console.log(e);
	}
}
main()