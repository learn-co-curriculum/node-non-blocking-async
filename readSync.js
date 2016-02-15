var fs = require('fs')
console.log('Start reading file')
try {
  var content = fs.readFileSync('readme.md', 'utf-8')
} catch (error) {
  console.log(error)
}
console.log('Finish reading file')
console.log(content)
