// 创建fs模块
const fs = require('fs')



// 回调函数的形式
// // 读取文件
// fs.readFile('./resource/content.txt',(err,data)=>{
// // 如果出错则抛出错误
// if(err) throw err
// // 输出文件内容
// console.log(data.toString());
// })


// 使用promise形式 封装
let p = new Promise((resolve, reject) => {
	// 读取文件
	fs.readFile('./resource/content.txt', (err, data) => {
		// 如果出错则抛出错误
		if (err) reject(err);
		// 输出文件内容
		resolve(data)
	})
})

p.then((value) => {
	console.log(value.toString());
}, (reason) => {
	console.log(reason);
})