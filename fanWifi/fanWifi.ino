/*
 * WebSocketClient.ino
 *
 *  Created on: 24.05.2015
 *
 */



#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>

#include <Hash.h>


#include <ArduinoJson.h>



ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

#define USE_SERIAL Serial

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

	switch(type) {
		case WStype_DISCONNECTED:
			USE_SERIAL.printf("[WSc] Disconnected!\n");
			break;
		case WStype_CONNECTED: {
			USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);

			// send message to server when Connected
			webSocket.sendTXT("ConnectedHHH");
		}
			break;
		case WStype_TEXT:
			USE_SERIAL.printf("[WSc] get text: %s\n", payload);

			// send message to server
			// webSocket.sendTXT("message here");
			break;
		case WStype_BIN:
			USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
			hexdump(payload, length);

			// send data to server
			// webSocket.sendBIN(payload, length);
			break;
        case WStype_PING:
            // pong will be send automatically
            USE_SERIAL.printf("[WSc] get ping\n");
            break;
        case WStype_PONG:
            // answer to a ping we send
            USE_SERIAL.printf("[WSc] get pong\n");
            break;
    }

}



void scanWifi()
{
  DynamicJsonDocument doc(1024);
  int n = WiFi.scanNetworks(); // 开始扫描WiFi网络
  if (n == 0) {
    Serial.println("No networks found");
  } else {

    doc["amount"] = n; // 接收到的wifi个数
    JsonArray point = doc.createNestedArray("wifi_point"); // 存储扫描到的wifi的数组
    for (int i = 0; i < n; ++i) {
      // 打印每个WiFi网络的信息
      JsonObject wifiPoint = point.createNestedObject();
      wifiPoint["ssid"] = WiFi.SSID(i); // wifi名
      wifiPoint["rssi"] = WiFi.RSSI(i); // 信号强度
      wifiPoint["et"] = WiFi.encryptionType(i) == ENC_TYPE_NONE ? "open" : "encrypted"; // 加密类型
      delay(10); // 短暂延迟以确保稳定性
    }


    Serial.write(0xFF);
    // 发送扫描到的wifi数据到串口，再通过stm32转发数据到蓝牙，手机端通过蓝牙数据来显示扫描到的wifi网络
    serializeJson(doc, Serial); 
    Serial.write(0xFE);
  }
}




void setup() {
	// USE_SERIAL.begin(921600);
	USE_SERIAL.begin(9600);
	USE_SERIAL.setDebugOutput(false);
  
	for(uint8_t t = 4; t > 0; t--) {
		delay(1000);
	}

 
	//WiFiMulti.addAP("abcd", "12345678");
	//WiFi.disconnect();
	// while(WiFiMulti.run() != WL_CONNECTED) {
	// 	delay(100);
	// }
	// server address, port and URL 
	webSocket.begin(WiFi.gatewayIP(), 5000, "/echo");



	// event handler
	webSocket.onEvent(webSocketEvent);

	// try ever 5000 again if connection has failed
	webSocket.setReconnectInterval(5000);
  
  // start heartbeat (optional)
  // ping server every 15000 ms
  // expect pong from server within 3000 ms
  // consider connection disconnected if pong is not received 2 times
  webSocket.enableHeartbeat(15000, 3000, 2);

}


/*
  {
    type: "wificmd"
    cmd: "connect",
    ssid: "wifiname",
    password: "password"
  }

  {
    type: "wificmd"
    cmd: "scan"
  }





*/

void loop() {
	//webSocket.loop();
  if(Serial.available() > 0)
  {
    byte start = Serial.read();
    if(start == 0xFF)
    {
      String command = Serial.readStringUntil(0xFE);
      // 解析JSON
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, jsonString);
      String cmd = doc["cmd"];
      if(cmd == "scan")
      {
        scanWifi(); // 返回扫描到的结果，并发送到串口
      }
      else if(cmd == "connect")
      {
        String ssid = doc["ssid"];
        String pwd = doc["password"];
        WiFi.begin(ssid, pwd);
        while (WiFi.status() != WL_CONNECTED) {
          delay(500);
        }

        
        // Serial.write(0xFF);
        // Serial.print("{type:'status',code:'ok'}");
        // Serial.write(0xFE);
      }
    }
  }


}
