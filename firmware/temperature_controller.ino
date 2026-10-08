// ICPS - Industrial Temperature Monitoring and Automatic Cooling System
// CAPP PBL - Group 89

const int lm35Pin = A0;   // LM35 connected to analog pin A0
const int relayPin = 7;   // Relay control pin connected to digital pin 7

// Constants based on project specifications
const int fanOnThreshold = 82;  // ≈ 40.0°C
const int fanOffThreshold = 71; // ≈ 34.7°C
const unsigned long sampleInterval = 1000; // 1 second

// State variables
int currentFanState = 0; // 0 = OFF, 1 = ON
unsigned long lastSampleTime = 0;
unsigned long sequenceNumber = 0;

void setup() {
  Serial.begin(115200); // Fast baud rate for reliable data transmission
  
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW); // Fan off by default
  
  // Wait a moment for serial to initialize
  delay(100);
  Serial.println("ICPS_START");
}

void loop() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastSampleTime >= sampleInterval) {
    lastSampleTime = currentTime;
    
    // 1. Take 4 ADC samples
    int sample1 = analogRead(lm35Pin);
    delay(2); // Small delay between samples
    int sample2 = analogRead(lm35Pin);
    delay(2);
    int sample3 = analogRead(lm35Pin);
    delay(2);
    int sample4 = analogRead(lm35Pin);
    
    // 2. Add the four samples
    int sum = sample1 + sample2 + sample3 + sample4;
    
    // 3. Calculate the average using bitwise right shift (equivalent to sum / 4)
    int avg = sum >> 2;
    
    // 4. Calculate temperature for logging/display (T = ADC * 125 / 256)
    // We use a 32-bit intermediate for safety as 1023 * 125 = 127,875 (exceeds 16-bit)
    uint32_t intermediate = (uint32_t)avg * 125;
    float temperature = (float)intermediate / 256.0;
    
    // 5. Apply the control logic with hysteresis
    if (avg >= fanOnThreshold) {
      currentFanState = 1;
    } else if (avg <= fanOffThreshold) {
      currentFanState = 0;
    }
    // else: maintain previous FAN state
    
    // 6. Control the relay
    digitalWrite(relayPin, currentFanState == 1 ? HIGH : LOW);
    
    // 7. Send structured data through USB Serial
    // Format: SEQ=[seq],ADC=[avg],TEMP=[temp],FAN=[state],RELAY=[state],S1=[s1],S2=[s2],S3=[s3],S4=[s4]
    Serial.print("SEQ=");
    Serial.print(sequenceNumber++);
    Serial.print(",ADC=");
    Serial.print(avg);
    Serial.print(",TEMP=");
    Serial.print(temperature, 2); // 2 decimal places
    Serial.print(",FAN=");
    Serial.print(currentFanState == 1 ? "ON" : "OFF");
    Serial.print(",RELAY=");
    Serial.print(currentFanState == 1 ? "ON" : "OFF");
    Serial.print(",S1=");
    Serial.print(sample1);
    Serial.print(",S2=");
    Serial.print(sample2);
    Serial.print(",S3=");
    Serial.print(sample3);
    Serial.print(",S4=");
    Serial.println(sample4);
  }
}
