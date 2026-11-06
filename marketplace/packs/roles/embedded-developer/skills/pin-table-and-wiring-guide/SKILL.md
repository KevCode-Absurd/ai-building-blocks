---
name: pin-table-and-wiring-guide
description: Builds a pin table and a plain wiring guide for a small low-voltage gadget on Arduino, ESP32 or Raspberry Pi. Checks every connection for voltage level (5 V parts on 3.3 V boards), pin current limits, pull-up and pull-down resistors, boot-strapping and reserved pins, shared buses (I2C addresses, SPI chip selects) and the power budget, then writes the parts list, wiring steps, power notes and a first-power-on test. Use it before writing code for a new gadget, when someone asks "how do I wire this?", or when a build behaves oddly and the wiring is in doubt. Not for mains wiring.
---

# Pin table and wiring guide

## When to use

- A new gadget: you have a board and some parts and need to know what goes where.
- A kit you sell needs a wiring guide customers can follow.
- A build behaves strangely and you want the wiring checked against the code.
- You are moving a design from an Arduino Uno (5 V) to an ESP32 or Raspberry Pi (3.3 V).

Not for anything connected to mains voltage. That goes to a qualified electrician.

## What you need

1. The exact board (model and revision), and how it is powered (USB, battery pack, wall adapter with its voltage and current rating).
2. Each part with a part number or product link, so I can read its datasheet: sensors, displays, buttons, relays, LEDs, buzzers.
3. What the gadget should do, so I know which pins need inputs, outputs, interrupts, analog readings or a bus.
4. Any pins already used, and a photo of the wiring if it exists.

**Access:** level 1 is enough. I read photos, datasheets and code. Level 2 lets me add the pin table and guide to your repo in a pull request; level 3 lets me merge it within your limits.

## Steps

### 1. List every connection a part needs

For each part, read its datasheet pin list: power, ground, signals. Note its supply range and its logic level. A part powered at 5 V usually drives its outputs at 5 V too.

### 2. Choose board pins by job

- Digital in and out: plain GPIO. Buttons need a pull-up or pull-down (internal or external).
- Analog in: only pins with an ADC. On ESP32 boards, check the board's documentation for which ADC pins still work while Wi-Fi is on.
- I2C: the board's SDA and SCL pins. Two parts with the same I2C address cannot share a bus without an address change or a multiplexer.
- SPI: shared clock and data lines, one chip-select pin per part.
- Interrupts and PWM: check the board documentation for which pins support them.
- Avoid pins the board uses at boot, for flash memory or for USB serial. On a Raspberry Pi, GPIO2 and GPIO3 have fixed pull-up resistors, which suits I2C but not every input.

### 3. Check voltage levels

- Raspberry Pi GPIO pins work at 3.3 V and are not 5 V tolerant; 5 V on a GPIO pin can permanently damage the chip.
- ESP32 GPIO is also 3.3 V logic; check the chip datasheet before connecting anything above that.
- A 5 V output into a 3.3 V pin needs a level shifter or a resistor divider. Mark which one, with values.
- A 3.3 V output into a 5 V input usually works if the 5 V part's datasheet accepts it as "high". Check, do not assume.

### 4. Check current

- A Raspberry Pi pin can supply at most 16 mA, and all GPIO pins together 50 mA. Other boards have their own limits in their datasheets.
- LEDs get a series resistor sized from the supply, the LED's forward voltage and the target current. Show the sum.
- Relays, motors, solenoids, LED strips and loud buzzers go through a transistor, MOSFET or driver board, with their own supply and a shared ground. Inductive loads need a flyback diode unless the driver board has one.

### 5. Build the power budget

Add up each part's typical and peak current from its datasheet, plus the board's own draw (Wi-Fi bursts are the usual peak). Compare with the supply rating and the board regulator's rating. If the total is close, use a stronger supply. If it runs on batteries, note that run time depends on measured current, so measure it rather than promise a figure.

### 6. Write the pin table

| Part | Part pin | Board pin | Voltage | Direction | Resistor or level shift | Notes |
|---|---|---|---|---|---|---|

One row per wire, including power and ground.

### 7. Write the wiring guide

- Parts list with quantities.
- Steps in order, with the power off: ground first, then power, then signals, one part at a time.
- A "before you power on" check: no 5 V wire on a 3.3 V pin, no short between power and ground (check with a multimeter on continuity mode), polarity of electrolytic capacitors and LEDs.
- First power-on test: what should light up or print, and what to do if it does not.

### 8. Cross-check with the code

If code exists, list every pin it uses and compare with the table. Any mismatch is a finding.

## Checks

- Every wire in the photo or plan has a row in the table, and every row has a voltage.
- No 5 V signal reaches a 3.3 V pin without a level shifter or divider.
- No pin drives more than its rated current; loads use a driver with a shared ground.
- Bus parts have unique addresses or chip selects.
- Boot, flash and serial pins are left alone, or their use is explained.
- The power budget is shown with peaks, and the supply is rated above it.
- Nothing touches mains voltage.
- Values I could not confirm from a datasheet are marked "check datasheet".

## Output format

1. Summary: what the gadget does and how it is powered.
2. Parts list.
3. Pin table.
4. Resistor and level-shift sums.
5. Power budget table.
6. Wiring steps and the before-power-on check.
7. First power-on test.
8. Open questions and anything marked "check datasheet".

## Example of good output (short)

*Made-up business for illustration: "Larch Lane Bakery", a fridge temperature logger on a Raspberry Pi 4.*

> **Summary.** A Pi 4 reads two waterproof temperature probes and lights a red LED if either fridge goes above the limit set in the program. Powered by the official USB-C supply.
>
> | Part | Part pin | Board pin | Voltage | Direction | Resistor or level shift | Notes |
> |---|---|---|---|---|---|---|
> | Probe 1 and 2 (1-Wire) | Data | GPIO4 (pin 7) | 3.3 V | In | 4.7 kOhm pull-up to 3.3 V (check probe datasheet) | Both probes share one data line |
> | Probes | VDD | 3.3 V (pin 1) | 3.3 V | Power | None | Powered at 3.3 V so data stays at 3.3 V |
> | Probes | GND | GND (pin 6) | 0 V | Ground | None | |
> | Red LED | Anode | GPIO17 (pin 11) | 3.3 V | Out | 330 Ohm series | About 4 mA, well under the 16 mA pin limit |
> | Red LED | Cathode | GND (pin 9) | 0 V | Ground | None | |
>
> **LED resistor.** (3.3 V - 2.0 V forward voltage, from the LED's listing) / 330 Ohm = about 4 mA.
>
> **Before power on.** Probes powered from 3.3 V, not 5 V, so the data line never sees 5 V. Continuity check between 3.3 V and GND shows no short.
>
> **First test.** Run `ls /sys/bus/w1/devices/` after enabling 1-Wire: two folders starting `28-` should appear. If none, check the pull-up resistor and the data wire on pin 7.
