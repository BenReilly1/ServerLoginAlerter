const Promise = require('bluebird')
const cmd = require('node-cmd')
 
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })

getAsync('whoami').then(data => {
    try {
        const originalString = data[0]
        var loggedUser = originalString.split("\\")
        console.log(loggedUser[1])
    } catch(err) {
        console.log('cmd err', err.stack)
    }
}).catch(err => {
    console.log('cmd err', err)
})

getAsync('netstat -n | find ":4499" | find "ESTABLISHED"').then (data => {
    console.log(data)    
}) 