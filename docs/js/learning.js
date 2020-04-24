// 1. Boolean
let b1 = true
let b2 = false
let x
// x false: null, undefined, NaN, 0, '', false
// x true: else value
if(x) {

}

// 2. String
// ""  ''  ``
let name = 'Linh'
let message = `Hello ${name}` // message == 'Hello Linh'

let str = 'Abc'
str.length // 3
str.toLowerCase() // 'abc'
str.toUpperCase() // 'ABC'
let str2 = ' ab c d e  \t\r\n'
str2.trim() // 'ab c d e'
str2.trim().split(' ') // ['ab', 'c', 'd', 'e']
str2.trim().split('') // ['a', 'b', ' ', 'c'..]

let str3 = `Hello i'm Linh`
str3.startsWith('Hello') // true
str3.endsWith('Nam') // false
str3.includes('i') // true
str3.includes('u') // false

// Regex ~ regular expression
let regex = /linh/gi
let strs = ['Nam', 'Thế Linh', 'Quang', 'Bách']
for(let str of strs) {
  console.log(str, regex.test(str))
}

// 3. Number
parseInt('12.1') // 12
parseFloat('12.1') // 12.1

Math.sqrt(2) // 1.41...
Math.pow(10, 5) // 100000
Math.sin(Math.PI / 2)

Math.floor(10.5) // 10
Math.ceil(10.5) // 11

// 4. Class, Object - OOP
// OOP: 
// 5 khái niệm: Object - đối tượng, Attribute - thuộc tính, Method - phương thức, Class - Lớp, Constructor - hàm tạo

// 4 tính chất: Inheritance - Kế thừa, Encapsulation - Đóng gói, Polymorphism - Đa hình (Override, Overloading), Abstraction - Trừu tượng
// Class in JS
// Date
let date1 = new Date() // date now
let date2 = new Date('2010-03-04')
date1.toISOString()

date1.toLocaleString()
// Error
let err1 = new Error()
let err2 = new Error('Invalid time!')

err1.message
err1.name
err1.stack
err1.toString()

// 5. Array
let arr = [2, 1, 3]
arr.length // 3
// them vao cuoi, loai bo phan tu cuoi
arr.push(0) // [2, 1, 3, 0]
arr.pop() // [2, 1, 3]
// them vao dau, loai bo phan tu dau
arr.unshift(0) // [0, 2, 1, 3]
arr.shift() // [2, 1, 3]
// xoa/them phan tu vao bat cu dau
arr.splice(2, 1) // xoa 1 phan tu tu index 2 // [2, 1]

arr = [1, 2, 3, 4]
arr.includes(3) // true
arr.includes(10) // false
arr.indexOf(1) // 0
arr.indexOf(4) // 3

// loc mang
let filteredArray = arr.filter(function(element) {
  return element > 1
})
// filteredArray = [2, 3, 4]
let filteredArray2 = arr.filter(function(element) {
  return element % 2 == 0
})
// filteredArray2 = [2, 4]

// bien doi mang
arr = [1, 2, 3] // >>> [2, 4, 6]
let mappedArray = arr.map(function(element) {
  return element * 2
})
// mappedArray = [2, 4, 6]
// forEach
// findIndex
// find
arr = [1, 2, 4, 5, 7]
let evenNumber = arr.find(function(element) {
  return element % 2 == 0
})
// evenNumber = 2
let evenNumberIndex = arr.findIndex(function(element) {
  return element % 2 == 0
})
// eventNumberIndex = 1

arr = [2, 1, 3]
arr.sort() // [1, 2, 3]
arr.sort(function(element1, element2) {
  return element1 - element2
})
// [1, 2, 3]
arr.sort(function(element1, element2) {
  return element2 - element1
})
// [3, 2, 1]

// *6. ES6 ~ Ecmascript 6 (Ecmascript == Javascript)
// arrow function
function sum(a, b) {
  return a + b
}

const sum2 = (a, b) => (a + b)
const sum3 = (a, b) => {
  return a + b
}