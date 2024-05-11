#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>

ESP8266WiFiMulti WiFiMulti;

#define LED2 D5
#define LED1 D8

const char* ssid = "#SSID#";
const char* password = "#PASSWOERD#";
const char* host = "https://x8c0cgkj-3000.asse.devtunnels.ms/api/getBulbStatus";

void setup() {
  Serial.begin(9600);
  delay(500);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, password);
  Serial.println("");

  pinMode(LED2, OUTPUT);
  digitalWrite(LED2, LOW);

  pinMode(LED1, OUTPUT);
  digitalWrite(LED1, LOW);

  Serial.print("Connecting to WiFi");
  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("");
}

void controlLED(int pin, int status) {
  digitalWrite(pin, status ? HIGH : LOW);
}

void loop() {
  if (WiFiMulti.run() == WL_CONNECTED) {
    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);
    client->setInsecure();  // Bypass SSL certificate verification

    HTTPClient https;
    Serial.println("Connecting to server...");
    Serial.println(host);
    if (https.begin(*client, host)) {  // Use HTTPS connection
      int httpCode = https.GET();  // Send the HTTP GET request
      if (httpCode > 0) {
        if (httpCode == HTTP_CODE_OK) {
          String payload = https.getString();
          Serial.println("Response received:");
          Serial.println(payload);

          DynamicJsonDocument doc(1024);
          DeserializationError error = deserializeJson(doc, payload);

          if (error) {
            Serial.print("JSON parsing failed: ");
            Serial.println(error.c_str());
          } else {
            // Control LEDs based on bulb status
            for (int i = 0; i < 2; i++) {
              int bulbStatus = doc["products"][i]["bulb_status"];
              controlLED((i == 0) ? LED1 : LED2, bulbStatus);
              Serial.println("Bulb " + String(i + 1) + " Status: " + String(bulbStatus));
            }
          }
        }
      } else {
        Serial.print("HTTPS error: ");
        Serial.println(https.errorToString(httpCode).c_str());
      }
      https.end();
    } else {
      Serial.println("Failed to connect to server");
    }
  }
  Serial.println("Waiting for 0.1 seconds...");
  delay(100);
}
