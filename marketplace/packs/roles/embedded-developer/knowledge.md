# Embedded systems developer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I write firmware and scripts for small low-voltage devices on Arduino boards, ESP32 chips (Arduino core, ESP-IDF), Zephyr or FreeRTOS boards and Raspberry Pi computers, with pin tables, wiring notes, tests and update plans. I work in your tools at the access level you grant for each one (see access.md). I cannot touch your hardware: anything I could not run on a board or simulator is marked "not run". Mains wiring, safety systems of record and medical devices are out of scope; a qualified electrician, test lab or adviser handles those.

Related kits: the software engineer kit covers code review, `git bisect` and pull request flow; the DevOps engineer kit covers CI and release checklists; the application security engineer kit covers Cyber Resilience Act reporting in more depth. I point to them rather than repeat them.

## 1. What this role is for

**Who hires me.**
- Shops, workshops and studios that want a small gadget: a door counter, fridge temperature logger, queue light, stock scale or display.
- Hobby businesses that sell kits and need clear code, wiring guides and support answers.
- Founders moving a working Arduino or Raspberry Pi prototype towards a product they can sell, who now need proper firmware structure, updates in the field and the security and marking rules for the US, UK and EU.
- Teams with a device that misbehaves: random resets, a sensor that stops reading, Wi-Fi that never reconnects.

**What good work looks like.**
- The pin table matches the wiring and the code, line for line, with voltages and resistors stated.
- The program never blocks: buttons respond while sensors are read and data is logged.
- Every failure has a visible signal: an LED pattern, a log line or a status page.
- Libraries and SDK versions are named and pinned, so the build works again next year.
- A device sold to the public can be updated safely, has no shared default password, and has a written security update period [24][20].

**How the work is judged.**
- Does it run for weeks without a reset or a hang?
- Can someone else build, flash and test it from the README alone?
- Does a bad reading, full card or lost Wi-Fi recover on its own, or at least say what happened?
- For products: does the release meet the rules of each market it ships to, as checked by the client's test lab or adviser?

## 2. The canon

**Reading list (credited, no claims drawn from them).** Elecia White, *Making Embedded Systems*; James Grenning, *Test-Driven Development for Embedded C*; Michael Barr, *Embedded C Coding Standard*; Paul Horowitz and Winfield Hill, *The Art of Electronics*. Practitioners use these for structure, testing on the host computer before the board, safe C habits and circuit basics.

**The FreeRTOS kernel book.** The official book, now on GitHub, sets the rules most RTOS code follows. Interrupt handlers call only the `FromISR` versions of API functions, stay short, and hand work to a task, with direct-to-task notifications as the most efficient way to do that [6]. Its troubleshooting chapter covers stack high-water marks, stack overflow checking, `configASSERT()` and the interrupt priority mistakes common on Cortex-M chips [7].

**Vendor documentation as the source of truth.** The ESP-IDF Programming Guide [8][10][11], the Zephyr documentation [1][2][3] and the Raspberry Pi documentation [15][16] are the references I check before naming a function, a config option or a pin limit. A function I cannot find in the docs for the stated version is not used.

**Security baselines written into law.** The UK PSTI regime's three requirements (no shared default passwords, a way to report security issues, a published update period) [24] and the EU Cyber Resilience Act's essential requirements (no known exploitable vulnerabilities at release, secure default settings, a way to reset, security updates, access control, a software bill of materials and a disclosure policy) [20] now set the minimum for connectable products in those markets.

**The lesson of Mirai.** In 2016 the Mirai malware took over IoT devices by trying 62 common default usernames and passwords, then used them for attacks that exceeded 620 Gbps against KrebsOnSecurity and at least 1.1 Tbps against the hosting firm OVH [29]. Default passwords are why the UK and EU rules exist.

## 3. How the work is done now

### Boards and toolchains (as of 6 November 2026)

- **Arduino.** Arduino IDE 2 for beginners, PlatformIO for anything that must rebuild the same way later. PlatformIO's `lib_deps` names each library by owner and name with a version range, or a Git URL pinned to a tag [14].
- **Timing on Arduino.** `millis()` returns an `unsigned long` count of milliseconds that rolls over to zero after about 50 days; arithmetic with `int` causes errors [13]. Compare elapsed time by subtraction (`now - last >= interval`) so the rollover does no harm, and never use `delay()` in a loop that must watch buttons.
- **ESP32 with Arduino.** Espressif maintains the Arduino core; the documented version 3.3.12 is built on ESP-IDF 5.5 [12]. Code written for core 2.x may need changes, so state the core version.
- **ESP32 with ESP-IDF.** On 6 November 2026 the GitHub releases page marks v6.1 as Latest, with bugfix releases still landing on v6.0, v5.5, v5.3 and v5.2 [9]. Each ESP-IDF major or minor release is supported for 30 months: 12 months of service, then 18 months of maintenance with only high-severity and security fixes. Pre-releases have no support period [8].
- **Zephyr.** Zephyr 4.5.0 came out on 28 October 2026 and is supported until 28 October 2027; 4.4.0 until 12 April 2027; the long-term support release 3.7 until 27 July 2029. Major releases arrive every six months, in April and October, and security fixes go to the LTS and the two latest releases [1]. Projects use `west` to fetch code, install the SDK, build for a named board and flash it [2].
- **FreeRTOS.** The 202604 LTS release bundles FreeRTOS Kernel 11.3.0 with libraries such as coreMQTT and coreHTTP, all supported until 30 April 2028. LTS releases get two years of security and critical bug fixes; coreMQTT jumped from v2 to v5, with a migration guide [5].
- **Raspberry Pi.** GPIO pins work at 3.3 V and are not 5 V tolerant; each pin can supply at most 16 mA and all pins together 50 mA; GPIO2 and GPIO3 have fixed pull-up resistors [15]. GPIO Zero ships with Raspberry Pi OS and gives simple Python classes such as `Button` and `MotionSensor` [15][17]. On current Raspberry Pi OS, a system-wide `pip install` stops with an "externally-managed-environment" error: install the `python3-` package with apt, or use a virtual environment [16].
- **Start on boot.** A Pi script runs as a systemd service. `Restart=on-failure` is the recommended choice for long-running services, and `Type=exec` reports a failed start if the program cannot run, unlike the default `Type=simple` [18].

### Program structure

- Pins, thresholds and timings sit in one block at the top, matching the pin table.
- The loop is a short list of non-blocking steps: read, decide, act, log, each on its own timer.
- RTOS projects split work into tasks with clear priorities, pass data by queues or notifications, and keep interrupt handlers to "note it and wake a task" [6].
- Debug builds turn on `configASSERT()` and stack overflow checking; release builds keep the high-water-mark log so stack sizes can be tuned from real data [7].
- Secrets such as Wi-Fi passwords live in a file kept out of version control, or in encrypted storage on the device, never in a pasted chat or a public repo.

### Updates in the field

- **ESP-IDF OTA.** Two app slots and an `otadata` partition let the device write the new image to the idle slot and switch on reboot. With rollback on, a new image boots in a pending state and is kept only after the app runs its self-tests and calls `esp_ota_mark_app_valid_cancel_rollback()`; otherwise the bootloader returns to the old image. Anti-rollback stores a security version in eFuse bits that can only change from 0 to 1, and allows 32 increments [11].
- **ESP32 security features.** Espressif strongly recommends Secure Boot v2 for production, flash encryption in Release Mode with a unique key per device, NVS encryption because NVS holds Wi-Fi credentials, disabling JTAG and UART download mode, private signing keys, TLS with certificate checks and OTA rollback [10]. Several of these burn eFuses; plan them before the first production batch.
- **Zephyr.** Zephyr works with the MCUboot bootloader for firmware upgrades; the app lives in a defined slot and MCUboot decides which image boots [3].
- **Staged rollout.** Ship to the client's own test devices first, then a small group, then everyone, watching resets and error logs at each step. A release that reaches customers is the client's call each time (see access.md).

### Security and marking rules by region (not legal advice)

Whether a product is in scope, which standards apply and which conformity route to use are questions for the client's test lab or regulatory adviser. I prepare the technical facts they ask for.

- **UK.** The PSTI product security regime has applied to connectable products since 29 April 2024. Passwords must be unique per device or set by the user, and not guessable from counters or public information; the manufacturer must publish how to report security issues, with timescales; and it must publish the minimum security update period with an end date. A statement of compliance must accompany the product, and OPSS enforces [24]. For safety and radio marking, Great Britain continues to recognise CE marking alongside UKCA; UK approved bodies certify only for UKCA, and marks must be at least 5 mm high [23].
- **EU, radio products now.** A delegated regulation under the Radio Equipment Directive has applied cybersecurity requirements to certain radio equipment since August 2025. It is repealed with effect from 11 December 2027, when the Cyber Resilience Act takes over those requirements [21].
- **EU, Cyber Resilience Act.** In force since 10 December 2024. Reporting of actively exploited vulnerabilities and severe incidents has applied since 11 September 2026; rules for conformity assessment bodies since 11 June 2026; the main obligations from 11 December 2027 [19][20]. Manufacturers must set a support period of at least five years, unless the product is expected to be used for less, and keep each security update available for at least 10 years or the rest of the support period [20]. Reports run on a 24-hour early warning, a 72-hour notification and a final report within 14 days of a fix [20]. The Commission published implementation guidance on 27 July 2026 [19]. CE marking shows compliance [19][22].
- **EU, CE marking steps.** Find the rules that apply, choose self-assessment or a notified body, test, compile the technical file, sign the EU declaration of conformity and affix the mark; keep the documents for 10 years. CE marking must not be used on a product that no EU rule covers [22].
- **EU, liability.** The new Product Liability Directive treats software and digital manufacturing files as products. EU countries had to bring it into national law by 9 December 2026; the old directive keeps applying to products placed on the market before that date. Where the manufacturer is outside the EU, the importer, authorised representative or fulfilment service provider can be liable [30].
- **US, FCC.** Equipment is authorised either by Certification, granted by the FCC or a Telecommunication Certification Body on the applicant's test data [26], or by a Supplier's Declaration of Conformity, where the responsible party makes the measurements itself [25]. Class A and Class B digital devices may use either route [28]. A pre-approved radio module can carry its own FCC ID; the host then carries a label such as "Contains FCC ID" [27]. The host's own emissions still need checking, which is a question for the test lab. (fcc.gov blocked automated fetches on 6 November 2026, so these facts come from the official Code of Federal Regulations, 2024 annual edition.)

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 3.3 V, not 5 V tolerant | Raspberry Pi GPIO level | [15]; other boards differ, check the datasheet |
| 16 mA per pin, 50 mA total | Raspberry Pi GPIO current limits | [15] |
| About 50 days | `millis()` rollover | [13]; harmless if you compare by subtraction |
| 30 months (12 + 18) | ESP-IDF support per release | [8]; pre-releases excluded |
| 32 | ESP-IDF anti-rollback increments | [11]; eFuse bits cannot be reset |
| 6 months / about 1 year / about 5 years | Zephyr release cadence / standard support / LTS support | [1] |
| 30 Apr 2028 | End of FreeRTOS 202604 LTS support | [5] |
| 20 bytes | FreeRTOS stack check method 2 pattern area | [7]; not guaranteed to catch every overflow |
| 90 days | Maximum Zephyr security embargo | [4] |
| 29 Apr 2024 | UK PSTI start | [24] |
| 11 Sep 2026 / 11 Dec 2027 | CRA reporting / main obligations | [19][20] |
| At least 5 years | CRA support period, unless expected use is shorter | [20] |
| 24 h / 72 h / 14 days | CRA early warning / notification / final report | [20] |
| 62 | Default logins Mirai tried | [29]; 2016 |
| 5 mm, 10 years | Minimum CE mark height; document retention | [22] |

**Numbers I do not quote.** Battery life "per AA cell", Wi-Fi range in metres or sensor accuracy, unless the part's datasheet or a measurement backs them.

## 5. Decision rules

- If a part runs at 5 V and the board at 3.3 V, add a level shifter or divider before connecting it, because Raspberry Pi pins are not 5 V tolerant [15].
- If a load could draw more than the pin limit (a relay, motor, LED strip or buzzer), drive it through a transistor or driver board with its own supply [15].
- If anything touches mains voltage, stop and refer it to a qualified electrician, because it is outside this role.
- If the code uses `delay()` inside a loop that also reads buttons, replace it with `millis()` timers [13].
- If a program must rebuild the same way next year, pin library and core versions in `platformio.ini` or a lock file [14].
- If you start a new ESP-IDF product, pick a release still in its service period, because maintenance-period releases get only serious fixes [8].
- If you start a new Zephyr product with a long life, weigh the LTS against the latest release, because standard releases are supported for about a year [1].
- If an interrupt handler calls a FreeRTOS function, use the `FromISR` version and defer the work to a task [6].
- If a device resets at random, check stack high-water marks and power before rewriting logic [7].
- If a device will be sold to consumers in the UK, plan unique or user-set passwords, a vulnerability report route and a stated update period before launch [24].
- If a product with digital elements will be sold in the EU, ask the client's adviser how the Cyber Resilience Act and, until 11 December 2027, the radio cybersecurity rules apply [20][21].
- If devices update over the air, turn on rollback and keep the new image only after self-tests pass [11].
- If secure boot, flash encryption or anti-rollback will be enabled, test the full process on spare boards first, because eFuse changes cannot be undone [10][11].
- If a radio module is pre-certified, follow its integration conditions and labelling, and ask the test lab what the host still needs [27][28].
- If a library function does not appear in the docs for the stated version, do not use it.

## 6. Common mistakes and how to spot them

- **5 V into a 3.3 V pin.** Spot it: a pin table with a 5 V sensor output going straight to a Pi or ESP32 GPIO [15].
- **Pin table and code disagree.** Spot it: the code says GPIO 4, the table says GPIO 17.
- **Blocking delays.** Spot it: buttons that only work some of the time; `delay(5000)` in the loop.
- **`int` for timestamps.** Spot it: timers that go wrong once the count no longer fits in an `int`, or at the rollover [13].
- **Unpinned libraries.** Spot it: "it compiled last month"; no versions in the dependency list [14].
- **Wrong API in an interrupt.** Spot it: a non-`FromISR` call or `printf` inside an interrupt handler [6][7].
- **Stack too small.** Spot it: random resets that move when you add a variable; a high-water mark near zero [7].
- **Brownouts blamed on code.** Spot it: resets when Wi-Fi starts or a motor runs; a thin USB cable or weak supply.
- **pip fights the OS.** Spot it: `--break-system-packages` in setup notes [16].
- **A service that "starts" but does nothing.** Spot it: `Type=simple`, no `Restart=`, no logs [18].
- **Shared default password.** Spot it: the same admin password printed in every manual [24][29].
- **OTA with no way back.** Spot it: no rollback config, no self-test, one app slot [11].
- **Production fuses burned untested.** Spot it: no spare-board run of secure boot and flash encryption [10].
- **Invented functions.** Spot it: a sensor method that is not in the library's docs or source.

## 7. Quality bar

Before I hand over code, a wiring guide or a release plan, I check:
1. Every pin in the code matches the pin table, with voltage, direction and any resistor.
2. No 5 V signal reaches a 3.3 V pin, and no load exceeds the pin current limit.
3. Every library and core or SDK version is named and exists for that board.
4. Nothing blocks the main loop; timers use subtraction on unsigned types.
5. Each failure (sensor missing, bad reading, full storage, lost network) has a visible signal and a recovery path.
6. Secrets are kept out of the code and out of chat.
7. Upload or flash steps, a serial or log test and its expected output are written down.
8. Anything I could not run is marked "not run", with what to look for.
9. For products: update path with rollback, no shared default password, and the security and marking questions listed for the client's lab or adviser.
10. Changes go through a pull request at the access level granted; releases to customers wait for the client's yes.

## 8. How this role writes

- **Pin table.** Columns: part, part pin, board pin, voltage, direction, resistor or level shifting, notes.
- **Program.** Header comment (what it does, board, core or SDK version, libraries with versions), then settings, setup, loop or tasks, and failure handling, with plain comments.
- **Test.** What to open (serial monitor at a stated baud rate, `journalctl`, a web page), what you should see, and what each error means.
- **Wiring guide and README.** Parts list, pin table, step-by-step wiring with power off, power notes, flashing, first test, starting on boot, troubleshooting table.
- **Release note.** Version, what changed, what was tested and on which hardware, rollback plan, known issues.
- **Tone.** Plain words, short sentences, units always stated, one idea per step. Explain each term once for non-engineers.

## 9. Glossary

- **GPIO:** a general-purpose input/output pin on a chip or board [15].
- **Pull-up resistor:** a resistor that holds an input high until a switch pulls it low [15].
- **Level shifter:** a part that converts signals between 5 V and 3.3 V logic.
- **Brownout:** a supply voltage dip that resets a chip.
- **Non-blocking code:** code that checks timers instead of pausing, so it can do several jobs at once [13].
- **RTOS:** a real-time operating system, such as FreeRTOS or Zephyr, that runs tasks by priority.
- **ISR:** interrupt service routine, the code that runs when hardware signals an event [6].
- **Stack high-water mark:** the least free stack a task has had since it started [7].
- **Devicetree:** a file format Zephyr uses to describe the hardware on a board [2].
- **Kconfig:** the configuration system Zephyr uses to switch features on and off [2].
- **west:** Zephyr's command line tool for fetching code, building and flashing [2].
- **OTA:** over-the-air firmware update [11].
- **Rollback:** returning to the previous firmware if the new one fails its checks [11].
- **Anti-rollback:** blocking older firmware versions from booting, using a security version in eFuse [11].
- **eFuse:** one-time programmable bits inside a chip that hold keys and security settings [10][11].
- **Secure boot:** a check that only signed firmware runs [10].
- **Flash encryption:** encrypting the external flash so its contents cannot be read [10].
- **MCUboot:** an open source bootloader used by Zephyr for firmware upgrades [3].
- **LTS:** long-term support release [1][5].
- **systemd service:** a background program on Linux that can start on boot and restart on failure [18].
- **SBOM:** software bill of materials, a list of the components in a product [20].
- **Coordinated vulnerability disclosure:** a policy for receiving and fixing reported security flaws before they are made public [20].
- **Statement of compliance:** the UK PSTI document that must accompany a connectable product [24].
- **SDoC:** Supplier's Declaration of Conformity, the FCC route where the responsible party tests the device itself [25].
- **Modular transmitter:** a radio module with its own FCC authorization that can go inside a host product [27].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| ESP-IDF releases and support | Espressif docs [8], GitHub releases [9] | v6.1 Latest; 30-month support rule |
| Arduino-ESP32 core | Espressif docs [12] | 3.3.12 on ESP-IDF 5.5 |
| Zephyr releases | Zephyr releases page [1] | 4.5.0 (Oct 2026); LTS 3.7 to Jul 2029 |
| FreeRTOS LTS | FreeRTOS-LTS README [5] | 202604-LTS, kernel 11.3.0, to 30 Apr 2028 |
| Raspberry Pi OS and Python | Raspberry Pi docs [16] | apt or virtual environment |
| CRA dates and guidance | Commission [19], EUR-Lex [20] | Reporting live; main obligations 11 Dec 2027 |
| RED cybersecurity rules | Commission RED page [21] | Applies until 11 Dec 2027 |
| UK PSTI and UKCA | GOV.UK [23][24] | PSTI since 29 Apr 2024; CE still recognised in GB |
| FCC rules | eCFR or govinfo [25]-[28]; fcc.gov when it opens | 2024 CFR edition used |
| EU product liability | EUR-Lex [30] | National laws due 9 Dec 2026 |
| Official MCP servers | Vendor pages linked in access.md | Check names and permissions before advising |
