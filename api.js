
import {post,get} from "./web.js";
const USE_LOCAL_SERVER = false;
const JOIN_SERVER_LOCAL = "http://localhost:8080";
const JOIN_SERVER = "https://joinjoaomgcd.appspot.com";
const JOIN_BASE_URL = `${USE_LOCAL_SERVER ? JOIN_SERVER_LOCAL : JOIN_SERVER}/_ah/api/`;


export function sendPush(push){
	return post(`${JOIN_BASE_URL}messaging/v1/sendPush`,push);
}
export function sendRawGcm(rawGcmWithOptions){
	return post(`${JOIN_BASE_URL}messaging/v1/sendGenericPush`,rawGcmWithOptions);
}
export function listDevices(apiKey){
	return get(`${JOIN_BASE_URL}registration/v1/listDevices/?apikey=${apiKey}`);
}
