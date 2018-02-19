# JoinJavaScript
Interact with Join via JavaScript

These are some JavaScript classes that help you interact with [Join](https://joaoapps.com/join/).

These are based on the [Join API](https://joaoapps.com/join/api/)

First of all, create a constant with your Join API KEY and instantiate the **Join** object:
```javascript
const YOUR_API_KEY = ...your actual API key from Join
const join = new Join(apikey);
```

You can start by listing your devices from the Join server
```javascript
var devices = await join.devices;
```
This will get the devices from the server and store them locally. When you call the function again it'll return cached results. 

To send a push to a device, filter the device list by whatever you want and use the send function
```javascript
var result = await join.notify("Hello!","Hello from JoinJavaScript!",device=>device.isAndroidPhone);
```

This example will send a notification with the title **Hello!** and the text **Hello from JoinJavaScript!** to all Android phones you have. The **notify** function returns a promise, so you can await it if you're inside an async function.
To learn what fields a push supports check out the [Join API Documentation](https://joaoapps.com/join/api/).

You can check out an example similar to this in the [example.html](https://github.com/joaomgcd/JoinJavaScript/blob/master/example.html) file.

You can run the [tests.html](https://github.com/joaomgcd/JoinJavaScript/blob/master/tests/tests.html) file on a local server to test if it's working for you.

Let me know if you find any issues! :)
