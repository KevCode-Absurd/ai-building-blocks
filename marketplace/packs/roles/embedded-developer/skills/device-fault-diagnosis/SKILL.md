---
name: device-fault-diagnosis
description: Finds the likely cause of a misbehaving Arduino sketch, ESP32 or RTOS firmware, or Raspberry Pi script from the code, wiring notes, photos and serial or journal output, then writes the fix and a check to prove it. Works through power and brownouts, wiring and voltage levels, reset reasons and watchdogs, stack overflow and heap exhaustion, blocking code, interrupt misuse, timer rollover, bus address clashes, Wi-Fi reconnects, library or core version changes and Raspberry Pi service problems, one hypothesis at a time. Use it for random resets, frozen devices, wrong readings, a sensor that is not found, or a gadget that worked until an update.
---

# Device fault diagnosis

## When to use

- Random resets or reboot loops.
- A device that freezes after hours or days.
- A sensor that reads wrong, reads nothing or is "not found".
- Wi-Fi that drops and never comes back.
- It worked until a library, core, SDK or OS update.
- A Raspberry Pi script that runs by hand but not on boot.

For general debugging method (restate the bug, ask what changed, bisect history) see the software engineer kit's bug diagnosis skill. This skill adds the hardware side.

## What you need

1. The code, and the pin table or a clear wiring photo.
2. The full serial output from power-on to the fault, including any reset reason or panic message. On a Pi: `journalctl -u <service> -b` and `systemctl status <service>`.
3. Board, core or SDK version, library versions, and what changed recently.
4. How it is powered, and what else runs off the same supply.
5. When it fails: at start, after a time, when something switches on, at random.

**Access:** level 1 to read code, logs and photos. Level 2 to put the fix on a branch with a pull request. Level 3 to merge it and flash your own test device within your limits. Shipping the fix to customers' devices is a fresh yes every time (see the `firmware-update-and-release-plan` skill).

## Steps

### 1. Read the first error, not the last

Find the earliest sign of trouble in the log. ESP32 boards print a reset reason at start (for example a brownout, a watchdog or a panic); Arduino boards often print nothing, so add a start-up line with the version and, where the board offers it, the reset cause.

### 2. Restate the fault in one sentence

"When the relay switches on, the ESP32 restarts and the log shows a brownout reset." If you cannot write it, ask for the missing detail.

### 3. Rank causes by evidence

| Cause family | Typical evidence | Quick test |
|---|---|---|
| Power: weak supply, thin cable, shared rail with a motor or relay | Resets when Wi-Fi starts or a load switches; brownout messages | Separate supply for the load, shorter thicker cable, measure the voltage at the board during the event |
| Wiring and levels: 5 V into 3.3 V, missing pull-up, loose jumper | Readings that change when you touch wires; dead pins | Check against the pin table; continuity test; wiggle test |
| Stack overflow or heap exhaustion | Resets that move when you add code; stack check hook fires; allocation failures | Log stack high-water marks and free heap; enlarge the stack |
| Blocking code | Missed button presses; watchdog resets | Search for `delay()`, blocking reads, waits with no timeout |
| Interrupt misuse | Crashes in interrupt context; non-`FromISR` calls in a handler | Move work to a task; check interrupt priorities against the RTOS setting |
| Timer arithmetic | Fails after a fixed time, or after about 50 days | `int` timestamps; comparisons instead of subtraction |
| Bus clash | "Sensor not found" with two I2C parts | Run an I2C scan; check for duplicate addresses |
| Network | Works until the router restarts | Reconnect logic with waits; log Wi-Fi status changes |
| Version change | Started after an update | Diff library and core versions; read the changelog |
| Pi service | Runs by hand, not on boot | Wrong working directory or user, virtual environment not used, missing `Restart=`, waiting on the network |

Tie each cause to a log line, a photo detail or a code line. A cause that needs something I have not seen becomes a question.

### 4. Test one hypothesis at a time

Predict what you should see if the cause is real, then check. Change one thing per test. Keep a short table: test, prediction, result.

### 5. Add instruments where the evidence is thin

- RTOS: turn on `configASSERT()` and stack overflow checking in a debug build, and log `uxTaskGetStackHighWaterMark()` for each task.
- ESP-IDF: log the reset reason and free heap at start and every few minutes.
- Pi: `Restart=on-failure` and `Type=exec` in the service, so a failed start is reported and logged.
- Any board: a heartbeat LED or log line every few seconds shows whether the loop still runs.

### 6. Write the smallest fix

Fix the cause, not the symptom. A watchdog that hides a hang is not a fix on its own. Mark changed lines. If the real fix is hardware (a bigger supply, a level shifter, a diode), say so plainly.

### 7. Prove it

A test that would fail before and pass after: run the load that caused the brownout fifty times, leave it running overnight with the heartbeat logged, unplug the router and watch it reconnect. Say how long to watch and what "fixed" looks like.

## Checks

- The first error in the log is identified and explained.
- Each cause cites evidence or is marked as a question.
- Hardware causes are not "fixed" in software.
- The fix changes one thing, with the reason.
- The proof test is something you can run and watch.
- Nothing claims it was run on hardware unless you shared the output.
- No secrets appear in shared logs.

## Output format

1. The fault in one sentence.
2. Evidence: log lines, code lines, photo details.
3. Ranked causes with evidence and a quick test for each.
4. The fix (code with changed lines marked, or the hardware change).
5. Proof test and what passing looks like.
6. What to log next time.

## Example of good output (short)

*Made-up business for illustration: "Pebble & Pine Gifts", an ESP32 door chime that drives a 5 V relay for a bell.*

> **Fault.** The ESP32 restarts each time the bell relay switches on; the serial log shows a brownout reset at that moment.
>
> | Cause | For | Against | Test |
> |---|---|---|---|
> | Relay coil current dips the USB supply | Reset lines up with the relay; relay coil and board share one USB phone charger | None found | Power the relay from its own 5 V supply, grounds joined; repeat 50 presses |
> | No flyback diode on the relay coil | Bare relay, not a module | Would more often show as noise than a clean brownout | Check the relay board photo; add a diode across the coil |
> | Code fault | None | Resets only when the relay moves | None needed yet |
>
> **Fix.** Hardware first: separate 5 V supply for the relay, shared ground, diode across the coil if the relay is not on a module. No code change.
>
> **Proof.** Press the doorbell button 50 times; the start-up line ("door-chime v1.2 start") should appear only once in the log. Not run by me.
