function minReadFile(path) {
	return new Promise((resolve, reject) => {
		//读取文件
		require('fs').readFile(path, (err, data) => {
			//判断
			// 失败
			if (err) reject(err);
			// 成功
			resolve(data)
		})
	})
}
minReadFile('./resource/content.txt').then((value) => {
	//输出文件内容
	console.log(value.toString());
}, (reason) => {
	console.log(reason);
})