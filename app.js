const config = require('./config')
const Promise = require('bluebird')
const cmd = require('node-cmd')
const Nexmo = require('nexmo');

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })

function whoamiCall() {
    getAsync('whoami').then(data => {
        try {
            console.log(config.apiKey)
            const originalString = data[0]
            var loggedUser = originalString.split("\\")
            var whiteSpaceRemoval = loggedUser[1].replace(/(\r\n|\n|\r)/gm, "")
            netStatCall(whiteSpaceRemoval)
        } catch(err) {
            console.log('cmd err', err.stack)
        }
    }).catch(err => {
        console.log('cmd err', err)
    })
}

function netStatCall(loggedUser) {
    getAsync('netstat -n | find ":4499" | find "ESTABLISHED"').then (data => { // Replace find ":4499" with find ":3389" for default RDP connections
        try {
            var originalString = data[0].trim();
            var ipAddressSplitter = originalString.split(" ") // This is splitting it on spaces, 3 spaces between tcp and source IP
            var ipFiltering = ipAddressSplitter.filter(Boolean) // This is running the array through a check whereby it removes empty objects
            var connectionIP = ipFiltering[2] // This is grabbing the ip address from the array, spot 9    
            var splitConnectionIP = connectionIP.split(':') // Splits the IP and port
            var useInApiCall = splitConnectionIP[0] // Drops the port ready for use in a API to find the location]
            whatsappAlert(loggedUser, useInApiCall)
        } catch(err) {
            console.log('cmd err', err.stack)
        }
    }).catch(err => {
        console.log('cmd err', err)
    })
}

function whatsappAlert(loggedUser, netstatInfo) {
    const nexmo = new Nexmo({
    	apiKey: config.apiKey,
	apiSecret: config.apiSecret,
    });
    const text = 'New login for ' + loggedUser + ' from IP: ' + netstatInfo;
    nexmo.message.sendSms(config.sendFrom, config.sendTo, text);
}

whoamiCall()