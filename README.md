# Async Code

## Overview

One of the major challenges in learning Node.js is its asynchronous code patterns. Human brain just didn't evolve to think in parallel processes. This hurdle is exacerbated when people learning Node are experienced developers in other more traditional and synchronous languages (PHP, Java, Ruby, Python, C). 

Understanding asynchronous code and its patterns is the key to mastering Node.js. Besides the async code, and a few differences like module system, globals and data types, Node is almost the same as browser JavaScript. For this reason, let's dig deeper into the async code and how we can implement it.

This lesson will cover the async code on the example of `fs`.

## Objectives

1. Illustrate async code wtih fs read method
1. Illustrate async code wtih fs write method

## Async Way of Thinking

To warm up with the async code, consider an example in which we have a few `console.log` statements and a timeout:

```js
var a = 1
console.log('The value of a is ', a)
setTimeout(function(){
  a = 2 
  console.log('While the value of a is', a)
}, 500)
console.log('Now the value of a is', a)
```

For someone not versed in async way of thinking, it might appear that the resulting output will be 

```
The value of a is  1
While the value of a is 2
Now the value of a is 2
```

Because in most languages the execution goes in the order of the statements, a person might think that because `a =2` precedes `Now the value...`, the second and third output will have the values of 2. This is incorrect, because `setTimeout()` is scheduled asynchronously in the future. The right output will be:

```js
The value of a is  1
Now the value of a is 1
// delay of roughly 500 miliseconds
While the value of a is 2
```

This misunderstanding of async code leads to many bugs especially for developers new to JavaScript and Node. That's why it's important to start thinking async way.


## fs.readFile

So to read a file in the synchronous mode, we would use this method:

```js
var content = fs.readFileSync(filename, options)
```

The above code will block the execution of everything until the file is read. So if we add output:

```js
var fs = require('fs')
console.log('Start reading file')
var content = fs.readFileSync('readme.md', 'utf-8')
console.log('Finish reading file')
console.log(content)
```

The code will produce "Start reading file", then wait until the file reading is over and finally print "Finish reading file".

The async method `fs.readFile` is a better because our program can do something else while it waits for the content of the file. There are a few things which are different in `fs.readFile` comparing to `fs.readFileSync`:

1. We need to use callback
2. The callback has an error object
3. The callback has the content object (the data from the file)
4. We don't get the content right away because `readFile` is **not an expression** like `fs.readFileSync`. (Expressions are functions which return something.) In other words, we cannot write `var content = fs.readFile(...)`.

```js
var fs = require('fs')
console.log('Start reading file')
fs.readFile('README.md', 'utf-8', function(error, content) {
  console.log('Finish reading file')
  console.log(content)
})
console.log('I CAN DO SOMETHING ELSE WHILE WAITING!')
```

You might wonder what would be the output of our async code? It's shown below. You can observe that while the app was waiting on the file system task (reading), it processed the "I CAN DO SOMETHING ELSE WHILE WAITING!" console log. Typically a Node.js web server will be processing and handling multiple requests from clients at the same time while waiting for some input/output operation to finish.

```
Start reading file
I CAN DO SOMETHING ELSE WHILE WAITING!
Finish reading file
... // Content of the file
```

In the synchronous world, we would handle errors with `try/catch` so that `readFileSync` is wrapped in it:

```js
var fs = require('fs')
console.log('Start reading file')
try {
  var content = fs.readFileSync('readme.md', 'utf-8')
} catch (error) {
  console.log(error)
}
console.log('Finish reading file')
console.log(content)
```

If we do not do that, the entire app will crash if there's an error with reading a file (like the wrong file name). On the other hand, in async coding `try/catch` is useless because the events scheduled by the event loop will happen in the future and we lose the context of `try/catch` (if you don't understand what it says—don't worry, just know that with async we don't use `try/catch`). 

The way to handle async errors is by receiving them in callbacks and checking for them. If we got an error, we bubble it up or handle it right there:

```js
fs.readFile('README.md', 'utf-8', function(error, content) {
  if (error) return console.error(error)
  console.log('Finish reading file')
  console.log(content)
})
```

By using the `return` statement, we guarantee that the execution flow will stop and won't execute the "Finish reading file" statement. 


## fs.writeFile

The `fs.writeFile` work similarly to `fs.readFile` in a way that it requires a callback. The callback has one argument `error`:

```
var fs = require('fs')
console.log('Start writing file')
fs.writeFile('test.txt', 'Look Mam I\'m Writing!', 'utf-8', function(error) {
  if (error) return console.error(error)
  console.log('Finish writing file')
})
console.log('I ALSO can do something else while waiting!')
```

As you might guess by now, the output will have the "Finish..." statement as the last one due to the non-blocking nature of this async example:

```
Start writing file
I ALSO can do something else while waiting!
Finish writing file
```

Note: We don't recommend using `throw error` as your error handling strategy (as you might see in some examples online), because it will automatically exit your application (similar to a crash). A better way is to output a user-friendly error message (e.g., a `console.error()` or 500 Internal Server Error page) and exit gracefully. You can achieve it by bubbling the error higher up the chain of callbacks until it reaches the place where you have the code to output your user-friendly message.

## Resources

1. [fs.readFile Official Documentation](https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback)
1. [fs.writeFile Official Documentation](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback)
2. [Thinking Asynchronously video](http://nodecasts.net/episodes/5-thinking-asynchronously)


---

<a href='https://learn.co/lessons/node-non-blocking-async' data-visibility='hidden'>View this lesson on Learn.co</a>
