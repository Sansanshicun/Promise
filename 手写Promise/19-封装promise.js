class Promise {
	//构造方法
	constructor(executor) {
		//添加属性
		this.PromiseState = 'pending'
		this.PromiseResult = null
		//声明属性
		this.callbacks = []
		//保存实例对象的this值
		const that = this
		//resolve函数
		function resolve(data) {
			//判断状态
			if (that.PromiseState !== 'pending') return;
			//1、修改对象的状态（PromiseState）
			that.PromiseState = 'fulfilled'
			//2、设置对象结果值（PromiseResult）
			that.PromiseResult = data
			//调用成功的回调函数
			// if (that.callback.onResolved) {
			// 	that.callback.onResolved(data)
			// }
			setTimeout(() => {
				that.callbacks.forEach(item => {
					item.onResolved(data)
				})
			});
		}
		//reject函数
		function reject(data) {
			if (that.PromiseState !== 'pending') return;
			//1、修改对象的状态（PromiseState）
			that.PromiseState = 'rejected'
			//2、设置对象结果值（PromiseResult）
			that.PromiseResult = data
			//调用失败的回调函数
			// if (that.callback.onRejected) {
			// 	that.callback.onRejected(data)
			// }
			setTimeout(() => {
				that.callbacks.forEach(item => {
					item.onRejected(data)
				})
			});
		}
		//用try-catch接收抛出错误的值
		try {
			//【执行器函数】是同步调用
			executor(resolve, reject)
		} catch (e) {
			reject(e)
		}
	}
	// then方法封装
	then(onResolved, onRejected) {
		const that = this
		//判断回调函数参数
		if (typeof onRejected !== 'function') {
			onRejected = reason => {
				throw reason
			}
		}
	
		if (typeof onResolved !== 'function') {
			onResolved = value => {
				return value
			}
		}
		return new Promise((resolve, reject) => {
			//封装函数
			function callback(type) {
				try {
					//获取回调函数的执行结果
					let result = type(that.PromiseResult);
					//判断
					if (result instanceof Promise) {
						//如果是Promise类型的对象
						result.then(v => {
							resolve(v)
						}, r => {
							reject(r)
						})
					} else {
						//结果的对象状态为成功
						resolve(result)
					}
				} catch (e) {
					reject(e)
				}
			}


			//调用回调函数
			//判断
			if (this.PromiseState === 'fulfilled') {
				setTimeout(() => {
					callback(onResolved)
				});

			}
			if (this.PromiseState == 'rejected') {
				setTimeout(() => {
					callback(onRejected)
				});


			}
			   //判断 pending 状态
			if (this.PromiseState === 'pending') {
				//保存回调函数
				this.callbacks.push({
					onResolved: function () {
						callback(onResolved)

					},
					onRejected: function () {
						callback(onRejected)

					}
				})
			}
		})

	}
	// catch方法封装
	catch(onRejected) {
		return this.then(undefined, onRejected)
	}
	// resolve方法封装
	static resolve(value) {
		//返回Promise对象
		return new Promise((resolve, reject) => {
			if (value instanceof Promise) {
				value.then(v => {
					resolve(v)
				}, r => {
					reject(r)
				})
			} else {
				// 状态设置成功
				resolve(value)
			}
		})
	}
	   
	// reject方法封装
	static reject(reason) {
		return new Promise((resolve, reject) => {
			reject(reason)
		})
	}
	// all方法封装
	static all(promises) {
		return new Promise((resolve, reject) => {
			//声明变量
			let count = 0;
			let arr = [];
			//遍历
			for (let i = 0; i < promises.length; i++) {
				promises[i].then(v => {
					//状态为成功状态
					count++;
					//将当前promise对象成功的结果存入到数组中
					arr[i] = v;
					if (count === promises.length) {
						//修改状态
						resolve(arr)
					}
				}, r => {
					reject(r)
				})
			}
		})
	}
	// race方法封装
	static race(promises) {
		return new Promise((resolve, reject) => {
			//遍历
			for (let i = 0; i < promises.length; i++) {
				promises[i].then(v => {
					//修改返回对象的状态为【成功】
					resolve(v)
				}, r => {
					//修改返回对象的状态为【失败】
					reject(r)
				})
			}
		})
	}
}



