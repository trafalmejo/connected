/*
  4-key MIDI piano controller
  Reads four pushbuttons, and when any of them have changed, sends
  MIDI noteon or noteoff messages. Sends an all notes off message
  when all buttons are released.
  With four buttons, there are 2^4, or 16, combinations. Each
  combination plays a different note, starting from the base note.
  Uses Serial1 for MIDI, so will work on any board with 2 hardware serial ports
  created 13 Feb 2017
  modified 26 Jan 2018
  by Tom Igoe
*/

int keys[] = {2, 3, 4, 5};   // four pins for pushbuttons (keys)
String lastKeyState = "0000"; // previous state of the keys
int keyCount = 4;             // number of keys
int baseNote = 48;            // C4, used as the base note
const long interval = 100;           // interval at which to blink (milliseconds)
unsigned long previousMillis = 0;        // will store last time LED was updated
int thisCommand;
int thisNote;
void setup() {
  Serial.begin(9600);                  // initialize serial
  Serial1.begin(31250);                // initialize MIDI serial

  for (int k = 0; k < keyCount; k++) { // iterate over the keys
    pinMode(keys[k], INPUT);           // make each an input
  }
}

void loop() {
  String currentKeyState = "0000"; // holds the current state of all keys
  // Serial.println(currentKeyState);            // print note

  for (int k = 0; k < keyCount; k++) {         // iterate over the keys
    int temp = digitalRead(keys[k]);
    if (temp == 1) {
      currentKeyState.setCharAt(k, '1'); // read each key
    }
    else {
      currentKeyState.setCharAt(k, '0'); // read each key
    }
    //Serial.println("Vamos: " + currentKeyState + " Millos");

    if (currentKeyState.charAt(k) != lastKeyState.charAt(k)) {// if a key has changed

      unsigned long currentMillis = millis();
      for (int j = 0; j < keyCount; j++) {         // iterate over the keys

        int temp = digitalRead(keys[j]);
        if (temp == 1) {
          currentKeyState.setCharAt(j, '1'); // read each key
        }
        else {
          currentKeyState.setCharAt(j, '0'); // read each key
        }
      }
      if (currentMillis - previousMillis >= interval) {

        // Serial.println(currentKeyState);
        thisNote = 0;// calculate note
        int value = 0;
        for (int i = 0; i < 4; i++) // for every character in the string  strlen(s) returns the length of a char array
        {
          value *= 2; // double the result so far
          if (currentKeyState.charAt(i) == '1') value++;  //add 1 if needed
        }
        thisNote = value + baseNote;
        //midiCommand1(0xC0, value);  // play or stop the note


        //int thisNote = k + baseNote;                // calculate note
        thisCommand = 0;
        //Serial.println(value, DEC);
        if (value != 0 ) {          // if key is pressed
          thisCommand = 0x90;                     // command is noteOn
          Serial.print(" on: ");
        } else {                                  // if key is released
          thisCommand = 0x80;                     // command is noteOff
          Serial.print("off: ");
        }
        Serial.println(thisNote);
        //midiCommand(thisCommand, thisNote, 127);  // play or stop the note
        // save the last time you blinked the LED
        midiCommand(thisCommand, thisNote, 127);  // play or stop the note

        previousMillis = currentMillis;
        lastKeyState.setCharAt(k, currentKeyState.charAt(k));     // save key state for next time
      }

    }
  }
  // Serial.println(currentKeyState);            // print note


  // read a 10-bit analog input and convert it to
  // 2 7-bit bytes, to send as the least significant byte (lsb)
  // and most significant byte (msb) of a pitch bend message:
  int pitchBendSensor = analogRead(A0);          // read analog input
  int hallSensor = analogRead(A1);          // read analog input
  //Serial.println(hallSensor, DEC);
  //Serial.println(pitchBendSensor, DEC);
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
  //Serial.println("", DEC);            // print note
  Serial1.write(cmd);     // command byte (should be > 127)
  Serial1.write(data1);   // data byte 1 (should be < 128)
  Serial1.write(data2);   // data byte 2 (should be < 128)
}
void midiCommand1(byte cmd, byte data1) {
  //Serial.println("", DEC);            // print note
  Serial1.write(cmd);     // command byte (should be > 127)
  Serial1.write(data1);   // data byte 1 (should be < 128)
}

