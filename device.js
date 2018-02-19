import { SenderGCM,SenderIP,SenderIFTTT,SenderServer,SendResults } from './sender.js';
import {listDevices} from './api.js';
import './extensions.js';
export class Device {
	isAnyType(...types){
		for(var type of types){
			if(type === this.deviceType) return true;
		}
		return false;
	}
	get isAndroidPhone(){
		return this.isAnyType(Devices.TYPE_ANDROID_PHONE);
	}
	get isAndroidTablet(){
		return this.isAnyType(Devices.TYPE_ANDROID_TABLET);
	}
	get isChrome(){
		return this.isAnyType(Devices.TYPE_CHROME_BROWSER);
	}
	get isGCM(){
		return this.isAndroidPhone || this.isAndroidTablet || this.isChrome;
	}
	get isIP(){
		return this.isAnyType(Devices.TYPE_IP);
	}
	get isIFTTT(){
		return this.isAnyType(Devices.TYPE_IFTTT);
	}
	get onlySendPushes(){
		return this.isIP || this.isIFTTT;
	}

	get senderClass(){
		if(this.isGCM) return SenderGCM;
		if(this.isIP) return SenderIP;
		if(this.isIFTTT) return SenderIFTTT;
		return SenderServer;
	}
	get sender(){
		return new this.senderClass();
	}
	/*send(options){
		var gcmRaw = options.gcmRaw;
		if(!gcmRaw || !gcmRaw.json || !gcmRaw.type) return Promise.reject("Missing gcmRaw in options");

		options.devices = [this];
		options.gcmParams = {};
		if(this.onlySendPushes){
			var gcmPush = JSON.parse(gcmRaw.json);
			if(!gcmPush || !gcmPush.push) return Promise.reject("Can only send GCMPush");
			options.gcmPush = gcmPush;
		}
		return this.sender.send(options);
	}*/
}

export class Devices extends Array {
	static get TYPE_ANDROID_PHONE() {return 1;}
	static get TYPE_ANDROID_TABLET() {return 2;}
	static get TYPE_CHROME_BROWSER() {return 3;}
	static get TYPE_WINDOWS_10() {return 4;}
	static get TYPE_TASKER() {return 5;}
	static get TYPE_FIREFOX() {return 6;}
	static get TYPE_GROUP() {return 7;}
	static get TYPE_ANDROID_TV() {return 8;}
	static get TYPE_GOOGLE_ASSISTANT() {return 9;}
	static get TYPE_IOS_PHONE() {return 10;}
	static get TYPE_IOS_TABLET() {return 11;}
	static get TYPE_IFTTT() {return 12;}
	static get TYPE_IP() {return 13;}
	static get TYPE_MQTT() {return 14;}

	static fromJson(json){
		var array = JSON.parse(json);
		return Devices.fromArray(array);
	}

	static fromArray(array){
		var devices = new Devices();
		for(var element of array){
			devices.push(Object.assign(new Device, element));
		}
		return devices;
	}

	static async fromServer(apiKey,options){
		if(!apiKey) throw "Api Key is missing";
		var devicesResult = null;
		if(!options){
			options = {};
		}		
		if(!options.forceRefresh){
			var cachedDevicesJson = localStorage.joinCachedDevices;
			if(cachedDevicesJson){
				devicesResult = JSON.parse(cachedDevicesJson);
			}
		}	
		if(!devicesResult){
			devicesResult = await listDevices(apiKey);
			localStorage.joinCachedDevices = JSON.stringify(devicesResult);
		}		
		if(!devicesResult.success){
			delete localStorage.joinCachedDevices
			throw devicesResult.errorMessage;
		}
		return Devices.fromArray(devicesResult.records);
	}

	sendPush(push,options){
		var gcmPush = {
			"push" : push
		};
		var gcmRaw = {
			"json" : JSON.stringify(gcmPush),
			"type" : "GCMPush"
		};
		var gcmOptions = {
			"gcmRaw" : gcmRaw
		}		
		gcmOptions = Object.assign(gcmOptions, options);
		return this.send(gcmOptions);
	}
	async send(options){
		var groupsBySender = null;
		if(options.forceServer){
			groupsBySender = this.groupBy(device=>true);
		}else{
			groupsBySender = this.groupBy(device=>device.senderClass);	
		}
		var isPush = options.gcmRaw.type == "GCMPush";
		var results = await Promise.all(groupsBySender.map(group=>{
			var sender = options.forceServer ? new SenderServer() : new group.key();
			options.devices = group.values;
			if(!isPush){
				options.devices = options.devices.filter(device=>!device.onlySendPushes);
			}else{
				options.gcmPush = JSON.parse(options.gcmRaw.json);
			}
			if(options.devices.length == 0) return Promise.resolve(Sender.newSuccessResult)

			options.gcmParams = {};
			return sender.send(options);
		}));
		return SendResults.fromMany(results)
	}

}