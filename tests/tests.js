
import {Join} from "../join.js";	
import {AutoAppsCommand} from "../autoapps.js";	
export class Tests extends Array {
	constructor(testsElement,apiKey){
		super();
		this.testsElement = testsElement;
		this.join = new Join(apiKey);
	}

	async test(){
		var results = [];
		for(var test of this){
			test.testsElement = this.testsElement;
			results.push(await test.test(this.join));
		}
		return results;
	}
}
class Test {
	constructor(){	
	}
	async test(join){
		var resultsString = null;
		var resultError = null;
		try{
			var results = await this.doIt(join);
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
	constructor(){
		super();
	}
	get title(){
		return "List Devices";
	}
	doIt(join){
		return join.devices;
	}
	getResultsString(devices){
		return "Devices: " + devices.map(device=>device.deviceName).join(", ");
	}

}
export class TestFindDevice extends Test{
	constructor(deviceTypeName, filter){
		super();
		this.deviceTypeName = deviceTypeName;
		this.filter = filter;
	}
	get title(){
		return `Find ${this.deviceTypeName} device`;
	}
	async doIt(join){
		var devices = await join.devices;
		if(!devices || devices.length == 0) throw "No devices to find in";
		return devices.find(this.filter);
	}
	getResultsString(device){
		if(!device) throw "Device doesn't exist";
		return `Found: ${device.deviceName}`;
	}

}
export class TestPush extends Test {
	constructor(title, forceServer, deviceFilter){
		super();
		this.pushesTitle = title || "Send Pushes";
		this.forceServer = forceServer;
		this.deviceFilter = deviceFilter;
	}
	get title(){
		return this.pushesTitle;
	}
	async doIt(join){
		var options = {
			"forceServer": this.forceServer			
		}		
		return join.sendCommand("ping",this.deviceFilter,options);
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
export class TestPushSingleDevice extends Test {
	constructor(device){
		super();
		this.device = device;
	}
	get title(){
		return `Send Push to ${this.device.deviceName}`;
	}
	async doIt(join){
		return join.sendCommand("ping",this.device);
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
	constructor(options,checker){
		super();
		this.checker = checker;
		this.options = options;
	}
	get title(){
		return `AutoApps Command`;
	}
	doIt(options){
		var command = this.options.command;
		var variables = this.options.variables;
		if(!command || command.length == 0) throw "No command to test";
		return new AutoAppsCommand(command,variables,this.options)
	}
	getResultsString(result){
		if(this.checker) this.checker(result);
		return `Command: ${result.command}; Payload: ${JSON.stringify(result.payload)}`;
	}

}