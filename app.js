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

getAsync('netstat -n | find ":4499" | find "ESTABLISHED"').then (data => { // Replace find ":4499" with find ":3389" for default RDP connections
    try {
        var originalString = data[0].trim();
        var ipAddressSplitter = originalString.split(" ") // This is splitting it on spaces, 3 spaces between tcp and source IP
        var ipFiltering = ipAddressSplitter.filter(Boolean) // This is running the array through a check whereby it removes empty objects
        var connectionIP = ipFiltering[2] // This is grabbing the ip address from the array, spot 9    
        var splitConnectionIP = connectionIP.split(':') // Splits the IP and port
        var useInApiCall = splitConnectionIP[0] // Drops the port ready for use in a API to find the location
        console.log(useInApiCall)
    } catch(err) {
        console.log('cmd err', err.stack)
    }
}).catch(err => {
    console.log('cmd err', err)
})