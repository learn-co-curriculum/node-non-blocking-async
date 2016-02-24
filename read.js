var fs = require('fs')
console.log('Start reading file')
fs.readFile('README.md', 'utf-8', function(error, content) {
  if (error) return console.error(error)
  console.log('Finish reading file')
  console.log(content)
})
console.log('I CAN DO SOMETHING ELSE WHILE WAITING!')