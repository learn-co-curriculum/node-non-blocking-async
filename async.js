var a = 1
console.log('The value of a is ', a)
setTimeout(function(){
  a = 2
  console.log('While the value of a is', a)
}, 500)
console.log('Now the value of a is', a)