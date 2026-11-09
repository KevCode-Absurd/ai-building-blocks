---
name: non-blocking-device-program
description: Writes the program for one small sensor, counter or display gadget as an Arduino sketch, ESP32 program (Arduino core or ESP-IDF), FreeRTOS or Zephyr app, or Raspberry Pi Python script. Uses a settings block that matches the pin table, non-blocking timers instead of delays, a read-decide-act-log structure, named and pinned library versions, secrets kept out of the code, a visible signal for every failure (sensor missing, bad reading, full storage, lost Wi-Fi), and a serial or log test with the expected output. Use it for any new gadget program or a rewrite of one that blocks, hangs or cannot be rebuilt.
---

# Non-blocking device program

## When to use

- A new gadget program once the pin table is agreed (see the `pin-table-and-wiring-guide` skill).
- A rewrite of a sketch full of `delay()` calls, where buttons are missed.
- A Raspberry Pi script that needs to run unattended and log what it does.
- Moving a prototype sketch onto ESP-IDF, FreeRTOS or Zephyr.

## What you need

1. The pin table, board and core or SDK version (for example Arduino-ESP32 3.3.x, ESP-IDF 6.1, Zephyr 4.5, Raspberry Pi OS with Python 3).
2. What the gadget does, as a list of events: "when the door sensor triggers, add one to the count", "every 60 seconds, log the temperature".
3. Where data goes: serial, SD card, CSV file, local web page, a cloud service.
4. What should happen on each failure.
5. Any existing code.

**Access:** level 1 to read your code and logs; level 2 to write the program on a branch, build it and open a pull request; level 3 to merge it and flash your own test board, within your limits.

## Steps

### 1. Write the settings block

All pins, thresholds, intervals and file names at the top, named in words (`DOOR_PIN`, `LOG_INTERVAL_MS`), with a comment pointing to the pin table row.

### 2. Name the libraries and versions

Use well-known libraries, named exactly as they appear in the Arduino Library Manager, PlatformIO registry, ESP-IDF component registry or apt/pip. Pin versions: in PlatformIO, `lib_deps` takes an owner/name with a version range, or a Git URL pinned to a tag. On Raspberry Pi OS, install Python libraries with `sudo apt install python3-<name>` or in a virtual environment; a system-wide `pip install` is blocked by the OS. GPIO Zero ships with Raspberry Pi OS.

### 3. Structure the loop

- **Arduino and ESP32 (Arduino core):** `setup()` starts the hardware and checks each part; `loop()` runs short steps, each guarded by a timer: `if (now - lastRead >= READ_INTERVAL_MS) { lastRead = now; ... }`. `millis()` returns an `unsigned long` and rolls over after about 50 days; subtraction on unsigned values keeps working across the rollover, and `int` does not.
- **FreeRTOS or ESP-IDF tasks:** one task per job (read, log, network), sized stacks, data passed by queues or task notifications. Interrupt handlers call only `FromISR` functions, record the event and wake a task.
- **Zephyr:** devices described in Devicetree, features switched on in Kconfig (`prj.conf`), work in threads or work queues.
- **Raspberry Pi Python:** GPIO Zero callbacks (`when_pressed`) for events, and a main loop that sleeps briefly between scheduled jobs.

### 4. Debounce inputs

Buttons and reed switches bounce. Use the library's debounce option (GPIO Zero `bounce_time`) or ignore changes within a short window after the last one, set in the settings block.

### 5. Handle every failure

| Failure | Detection | Signal | Recovery |
|---|---|---|---|
| Sensor missing at start | No response on the bus | LED pattern, log line | Retry every few seconds |
| Bad reading | Outside the sensor's documented range, or a library error value | Log line | Skip it, keep the last good value, count errors |
| Storage full or missing | Write fails | LED pattern, log | Stop writing, keep running, report |
| Wi-Fi lost | Status check | Log line | Reconnect with a growing wait between tries |
| Hang | Watchdog | Reset, log the reset reason at start | Find the cause from the log |

### 6. Keep secrets out

Wi-Fi passwords and API keys go in a separate file (`secrets.h`, `.env`) listed in `.gitignore`, or in encrypted storage on the device. The program ships with placeholders. Never paste real values into chat.

### 7. Log usefully

At start: program name, version, board, reset reason. During running: one line per event with a timestamp or uptime. Keep logs small on SD cards and flash.

### 8. Write the run and test steps

- Arduino IDE 2 or PlatformIO upload steps, or `idf.py build flash monitor`, or `west build -b <board>` and `west flash`.
- The serial monitor baud rate and the exact lines you should see.
- For a Pi: how to run it in the virtual environment, and how to start it on boot (see the `pi-script-start-on-boot` prompt).

## Checks

- Every pin in the settings block matches the pin table.
- Every library exists for this board and version; no invented functions.
- No `delay()` or blocking `sleep()` in a loop that also watches inputs.
- Time arithmetic uses unsigned types and subtraction.
- Each failure in the table has detection, a signal and recovery.
- No secrets in the code or the pull request.
- I mark the program "not run" unless you shared the output.

## Output format

1. Header: what it does, board, core or SDK version, libraries with versions.
2. The full program, in one file where possible, with comments.
3. Settings to change and where.
4. Failure table.
5. Build, upload and test steps with expected output.
6. What I could not test.

## Example of good output (short)

*Illustrative structure, not a real business: a bike shop with an ESP32 queue counter with a 4-digit display, Arduino core 3.3.x. Copy the shape, never the content: every fact comes from the client's own context.*

```cpp
// Queue counter v1.0 for [Business] (illustrative example). ESP32, Arduino-ESP32 3.3.x.
// Libraries: a TM1637 display library, version pinned in platformio.ini lib_deps.
const int TAKE_BUTTON_PIN = 25;   // pin table row 1, button to GND, internal pull-up
const int CALL_BUTTON_PIN = 26;   // pin table row 2
const unsigned long DEBOUNCE_MS = 50;

int takeState = HIGH;             // last stable state
unsigned long takeChanged = 0;    // when it last changed
int ticket = 0, nowServing = 0;

void setup() {
  Serial.begin(115200);
  pinMode(TAKE_BUTTON_PIN, INPUT_PULLUP);
  pinMode(CALL_BUTTON_PIN, INPUT_PULLUP);
  Serial.println("queue-counter v1.0 start");
}

void loop() {
  unsigned long now = millis();
  int reading = digitalRead(TAKE_BUTTON_PIN);
  if (reading != takeState && now - takeChanged >= DEBOUNCE_MS) {
    takeChanged = now;
    takeState = reading;
    if (takeState == LOW) {                 // count the press, not the hold
      ticket = (ticket + 1) % 10000;
      Serial.printf("take ticket=%d\n", ticket);
    }
  }
  // call button handled the same way; display refresh on its own timer
}
```

> **Test.** Open the serial monitor at 115200 baud. Press the customer button three times: you should see `take ticket=1`, `take ticket=2`, `take ticket=3`. Not run on hardware by me.
