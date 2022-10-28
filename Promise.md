

### promise的理解和使用

#### Promise 是什么?

```html

1. 抽象表达: 
	1) Promise 是一门新的技术(ES6 规范)
	2) Promise 是 JS 中进行异步编程的新解决方案
备注：旧方案是单纯使用回调函数
2. 具体表达:
	1) 从语法上来说: Promise 是一个构造函数
	2) 从功能上来说: promise 对象用来封装一个异步操作并可以获取其成功/失败的结果值

```

#### promise 的状态改变

```html
1. pending 变为 resolved
2. pending 变为 rejected
说明:
	只有这 2 种, 且一个 promise 对象只能改变一次
	无论变为成功还是失败, 都会有一个结果数据
	成功的结果数据一般称为 value, 失败的结果数据一般称为 reason

```

#### promise的工作流程

```html
首先，new一个promise对象，再promise内部封装异步操作，如果异步操作成功则调用resolve（）函数，将promise对象的状态改为resolved状态（成功），在调用then（）方法时时调用的第一个回调函数中的代码返回一个新的promise对象，如果异步操作失败则调用reject（）函数，将promise对象的状态改为rejected状态（失败），在调用then（）方法时时调用的第二个回调函数中的代码返回一个新的promise对象。
```

![image-20221019224936380](C:\Users\86187\AppData\Roaming\Typora\typora-user-images\image-20221019224936380.png)

###  如何使用 Promise?

####  Promise-API

##### 1、Promise 构造函数

```html
(1) executor 函数: 执行器 (resolve, reject) => {} 
(2) resolve 函数: 内部定义成功时我们调用的函数 value => {}
(3) reject 函数: 内部定义失败时我们调用的函数 reason => {}
说明: executor 会在 Promise 内部立即同步调用,异步操作在执行器中执行
```

##### 2、Promise.prototype.then 方法

```html
(1) onResolved 函数: 成功的回调函数 (value) => {}
(2) onRejected 函数: 失败的回调函数 (reason) => {}
说明: 指定用于得到成功 value 的成功回调和用于得到失败 reason 的失败回调
返回一个新的 promise 对象
```

##### 3、 Promise.prototype.catch 方法

```html
(1) onRejected 函数: 失败的回调函数 (reason) => {}
说明: then()的语法糖, 相当于: then(undefined, onRejected)
```

##### 4、Promise.resolve 方法

```html
(1) value: 成功的数据或 promise 对象
说明: 返回一个成功/失败的 promise 对象

```

##### 5、Promise.reject 方法

```html
(1) reason: 失败的原因
说明: 返回一个失败的 promise 对象
```

##### 6、Promise.all 方法

```html
(1) promises: 包含 n 个 promise 的数组
说明: 返回一个新的 promise, 只有所有的 promise 都成功才成功, 只要有一个失败了就直接失败
```

##### 7、Promise.race 方法

```html
(1) promises: 包含 n 个 promise 的数组
说明: 返回一个新的 promise, 第一个完成的 promise 的结果状态就是最终的结果状态
```

#### promise 的几个关键问题

```html
1. 如何改变 promise 的状态?
	(1) resolve(value): 如果当前是 pending 就会变为 resolved
	(2) reject(reason): 如果当前是 pending 就会变为 rejected
	(3) 抛出异常: 如果当前是 pending 就会变为 rejected
2. 一个 promise 指定多个成功/失败回调函数, 都会调用吗?
	当 promise 改变为对应状态时都会调用
3. 改变 promise 状态和指定回调函数谁先谁后?
	(1) 都有可能, 正常情况下是先指定回调再改变状态, 但也可以先改状态再指定回调
	(2) 如何先改状态再指定回调?
		① 在执行器中直接调用 resolve()/reject()
		② 延迟更长时间才调用 then()
	(3) 什么时候才能得到数据?
		① 如果先指定的回调, 那当状态发生改变时, 回调函数就会调用, 得到数据
		② 如果先改变的状态, 那当指定回调时, 回调函数就会调用, 得到数据
4. promise.then()返回的新 promise 的结果状态由什么决定?
	(1) 简单表达: 由 then()指定的回调函数执行的结果决定
	(2) 详细表达:
		① 如果抛出异常, 新 promise 变为 rejected, reason 为抛出的异常
		② 如果返回的是非 promise 的任意值, 新 promise 变为 resolved, value 为返回的值
		③ 如果返回的是另一个新 promise, 此 promise 的结果就会成为新 promise 的结果
5. promise 如何串连多个操作任务?
	(1) promise 的 then()返回一个新的 promise, 可以开成 then()的链式调用
	(2) 通过 then 的链式调用串连多个同步/异步任务
6. promise 异常传透?
	(1) 当使用 promise 的 then 链式调用时, 可以在最后指定失败的回调, 
	(2) 前面任何操作出了异常, 都会传到最后失败的回调中处理
7. 中断 promise 链?
	(1) 当使用 promise 的 then 链式调用时, 在中间中断, 不再调用后面的回调函数
	(2) 办法: 在回调函数中返回一个 pendding 状态的 promise 对象
```

#### 手写promise

```javascript
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




```

#### async 与 await

```html
1. async 函数
	1. 函数的返回值为 promise 对象
	2. promise 对象的结果由 async 函数执行的返回值决定
2. await 表达式
	1. await 右侧的表达式一般为 promise 对象, 但也可以是其它的值
	2. 如果表达式是 promise 对象, await 返回的是 promise 成功的值
	3. 如果表达式是其它值, 直接将此值作为 await 的返回值
3. 注意
	1. await 必须写在 async 函数中, 但 async 函数中可以没有 await
	2. 如果 await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理
```

