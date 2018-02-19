
import {Devices,Device} from "../device.js";	
import {AutoAppsCommand} from "../autoapps.js";	
class Test {
	constructor(testsElement){
		this.testsElement = testsElement;
	}
	async test(options){
		var resultsString = null;
		var resultError = null;
		try{
			var results = await this.doIt(options);
			resultsString = await this.getResultsString(results);
		}catch(error){
			resultError = error;
			console.error(error);
		}		
		var isSuccess = resultError ? false : true;
		var testElement = document.createElement("div");
		testElement.classList.add("test");
		testElement.classList.add("card");
		testElement.setAttribute("success",isSuccess);
		var testElementHtml = `<div class="title">${this.title}</div>`;
		if(isSuccess){
			testElementHtml += `<div class="message">${resultsString}</div>`; 
		}else{
			testElementHtml += `<div class="message">${resultError}</div>`; 
		}
		testElement.innerHTML = testElementHtml;
		this.testsElement.appendChild(testElement);
		return results;
	}
	doIt(options){
		throw "I can't do it. I'm just an empty shell of a test...";
	}
	getResultsString(results){
		throw "I can't get the result's string. I'm just an empty shell of a test...";
	}
}
export class TestListDevices extends Test{
	constructor(testsElement){
		super(testsElement);
	}
	get title(){
		return "List Devices";
	}
	doIt(options){
		return Devices.fromServer(options.apiKey);
	}
	getResultsString(devices){
		return "Devices: " + devices.map(device=>device.deviceName).join(", ");
	}

}
export class TestFindDevice extends Test{
	constructor(testsElement, deviceTypeName, filter){
		super(testsElement);
		this.deviceTypeName = deviceTypeName;
		this.filter = filter;
	}
	get title(){
		return `Find ${this.deviceTypeName} device`;
	}
	doIt(options){
		if(!options || options.length == 0) throw "No devices to find in";
		return options.find(this.filter);
	}
	getResultsString(device){
		if(!device) throw "Device doesn't exist";
		return `Found: ${device.deviceName}`;
	}

}
export class TestPush extends Test {
	constructor(testsElement, title, forceServer, apiKey){
		super(testsElement);
		this.pushesTitle = title || "Send Pushes";
		this.forceServer = forceServer;
		this.apiKey = apiKey;
	}
	get title(){
		return this.pushesTitle;
	}
	doIt(devices){
		if(!devices || devices.length == 0) throw "No devices to send pushes to";
		var push = {"text":"ping","apikey": this.apiKey};
		var options = {
			"forceServer": this.forceServer			
		}		
		return devices.sendPush(push,options);
	}
	getResultsString(result){
		if(!result) throw "No result from push";
		if(result.failure>0){
			var failure = result.find(result=>!result.success);
			var errorMessage = failure.message || "Couldn't send push"
			throw errorMessage;
		}
		return `Sucess: ${result.success}; Failure: ${result.failure}`;
	}

}
export class TestAutoAppsCommand extends Test {
	constructor(testsElement,checker){
		super(testsElement);
		this.checker = checker;
	}
	get title(){
		return `AutoApps Command`;
	}
	doIt(options){
		var command = options.command;
		var variables = options.variables;
		if(!command || command.length == 0) throw "No command to test";
		return new AutoAppsCommand(command,variables,options)
	}
	getResultsString(result){
		if(this.checker) this.checker(result);
		return `Command: ${result.command}; Payload: ${JSON.stringify(result.payload)}`;
	}

}