import {Devices} from "./device.js";
export class Join {
	constructor(apiKey){
		this.apiKey = apiKey;
	}
	get devices(){
		return (async () => {
			if(!this.devicesInMemory){
				this.devicesInMemory = await Devices.fromServer(this.apiKey);
			}
			return this.devicesInMemory;
		})();
	}
	async sendPush(push,deviceFilter,options){
		push.apikey = this.apiKey;
		var devices = await this.devices;
		if(deviceFilter){
			if(typeof deviceFilter == "function"){
				devices = devices.filter(deviceFilter);	
			}else{
				var fromDevice = deviceFilter.asDevices;
				devices = fromDevice ? fromDevice : deviceFilter;
			}
		}
		if(!devices || devices.length == 0) throw "No devices to send push to";
		return devices.sendPush(push,options);
	}
	sendCommand(command,deviceFilter,options){
		return this.sendPush({"text":command},deviceFilter,options);
	}
	notify(title,text,deviceFilter,options){
		return this.sendPush({"title":text,"text":text},deviceFilter,options);
	}
}