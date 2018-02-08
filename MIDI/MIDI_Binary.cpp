/*
  4-key MIDI piano controller
  Read
  This s four pushbuttons, and when any of them have changed, sends
  MIDI noteon or noteoff messages. Sends an all notes off message
  when all buttons are released.
  With four buttons, there are 2^4, or 16, combinations. Each
  combination plays a different note, starting from the base note.
  Uses Serial1 for MIDI, so will work on any board with 2 hardware serial ports
  created 13 Feb 2017
  modified 26 Jan 2018
  by Tom Igoe
*/

int keys[] = {5, 6, 9, 10};   // four pins for pushbuttons (keys)
int lastKeyState[] = {0, 0, 0, 0}; // previous state of the keys
String lastState = "0000";
int keyCount = 4;             // number of keys
int baseNote = 48;            // C4, used as the base note


void setup() {
  Serial.begin(9600);                  // initialize serial
  Serial1.begin(31250);                // initialize MIDI serial

  for (int k = 0; k < keyCount; k++) { // iterate over the keys
    pinMode(keys[k], INPUT);           // make each an input
  }
}

void loop() {
  int currentKeyState[] = {0, 0, 0, 0}; // holds the current state of all keys
  String currentState;
  for (int k = 0; k < keyCount; k++) {   
    currentKeyState[k] = digitalRead(keys[k]); // read each key
    currentState += currentKeyState[k] + "";
  }      // iterate over the keys

    if (currentState != lastState) {// if a key has changed

      int thisNote = std::stoi(currentState, nullptr, 2);// calculate note
      int thisCommand = 0;

      if (currentState != "0000" ) {          // if key is pressed
        thisCommand = 0x90;                     // command is noteOn
        Serial.print(" on: " + currentKeyState[0] + ":" + currentKeyState[1] + ":" +currentKeyState[2] + ":" +currentKeyState[3]);
        // 0000
        // 0001
        // 0010
        // 0011
        // 0100
        // 0101
        // 0110
        // 0111
        // 1000
        // 1001
        // 1010
        // 1011
        // 1100
        // 1101
        // 1110
        // 1111
      } else {                                  // if key is released 
        thisCommand = 0x80;                     // command is noteOff
        Serial.print("off: " + currentKeyState[0] + ":" + currentKeyState[1] + ":" +currentKeyState[2] + ":" +currentKeyState[3]);
      }

      midiCommand(thisCommand, thisNote, 127);  // play or stop the note
      Serial.println(thisNote, HEX);            // print note
      lastKeyState[k] = currentKeyState[k];     // save key state for next time
    }


  // read a 10-bit analog input and convert it to
  // 2 7-bit bytes, to send as the least significant byte (lsb)
  // and most significant byte (msb) of a pitch bend message:
  int pitchBendSensor = analogRead(A0);          // read analog input
  if (pitchBendSensor > 10 ) {                   // if it's > 10
    byte msb = highByte(pitchBendSensor << 1);   // get the high bits
    byte lsb = lowByte(pitchBendSensor);         // get the low 8 bits
    bitWrite(lsb, 7, 0);                         // clear the top bit
    midiCommand(0xE0, lsb, msb);                 // send the pitch bend message
  }

  // when all else fails, turn everything off:
  // midiCommand(0xB0, 0x7B, 0x00);
  // Serial.println("all notes off");
}

// send a 3-byte midi message
void midiCommand(byte cmd, byte data1, byte  data2) {
  Serial1.write(cmd);     // command byte (should be > 127)
  Serial1.write(data1);   // data byte 1 (should be < 128)
  Serial1.write(data2);   // data byte 2 (should be < 128)
}
