var fs = require('fs')
console.log('Start writing file')
fs.writeFile('test.txt', 'Look Mam I\'m Writing!', 'utf-8', function(error) {
  if (error) return console.error(error)
  console.log('Finish writing file')
})
console.log('I ALSO can do something else while waiting!')