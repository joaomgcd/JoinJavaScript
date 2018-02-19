# JoinJavaScript
Interact with Join via JavaScript

These are some JavaScript classes that help you interact with [Join](https://joaoapps.com/join/).

These are based on the [Join API](https://joaoapps.com/join/api/)

First of all, create a constant with your Join API KEY:
```javascript
const YOUR_API_KEY = ...your actual API key from Join
```

You can start by listing your devices from the Join server
```javascript
var devices = Devices.fromServer(YOUR_API_KEY,{"forceRefresh":false})
```
This will get the devices from the server and store them locally. When you call the function again it'll return cached results. 
If you want to get a fresh list from the server set **forceRefresh** to true. Please use this only if you really must because refreshing from the server too much will strain the server and bring its costs up. Join doesn't charge a subscription, so let's keep it that way ;)

To send a push to a device, filter the device list by whatever you want and use the send function
```javascript
var result = await devices.filter(device=>device.isAndroidPhone).sendPush({"text":"hello","apikey":YOUR_API_KEY})
```

This example will send a push with the text **hello** to all Android phones you have. The **sendPush** function returns a promise, so you can await it if you're inside an async function.
To learn what fields a push supports check out the [Join API Documentation](https://joaoapps.com/join/api/).

You can check out an example similar to this in the [example.html](https://github.com/joaomgcd/JoinJavaScript/blob/master/example.html) file.

You can run the [tests.html](https://github.com/joaomgcd/JoinJavaScript/blob/master/tests/tests.html) file on a local server to test if it's working for you.

Let me know if you find any issues! :)
