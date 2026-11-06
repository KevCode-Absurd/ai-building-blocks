---
name: firmware-update-and-release-plan
description: Plans how a connected gadget or product gets firmware updates and how each release reaches devices safely. Covers versioning, an update path with rollback (ESP-IDF OTA with app rollback and anti-rollback, Zephyr with MCUboot, a cloud OTA service), self-tests before an image is kept, a staged rollout from test devices to a small group to everyone, release notes and the security baseline buyers and regulators expect (no shared default password, a way to report security issues, a stated update period, secure boot and encrypted storage where the chip supports them). Lists the UK PSTI, EU Cyber Resilience Act and radio, and FCC questions for the client's test lab or adviser, with no legal rulings. Use it before selling a connected device or before the first over-the-air update.
---

# Firmware update and release plan

## When to use

- A gadget is becoming a product other people will own.
- You are about to send the first over-the-air (OTA) update.
- A past update bricked devices or left them on mixed versions.
- A buyer, retailer or adviser asked about security updates, passwords or vulnerability reporting.

## What you need

1. Chip and framework (ESP32 with ESP-IDF or Arduino core, Zephyr board, FreeRTOS on another chip, Raspberry Pi).
2. How devices connect (Wi-Fi, Bluetooth, cellular, none) and how many are in the field.
3. The current flash partition layout or `partitions.csv`, and any bootloader.
4. Where updates come from now, if anywhere (a cloud service, your own server, USB only).
5. Markets: UK, EU, US, elsewhere. Consumer or business buyers.
6. Who signs releases, and where the signing key lives today (describe it; never paste it).

**Access:** level 1 to read code, config and device data. Level 2 to build a release and upload it undeployed, and to draft the plan and release notes. Level 3 to merge release changes and deploy to your named test devices or test group, within your limits. **A release to customers needs a fresh yes every time,** as does anything that burns eFuses, enables secure boot or flash encryption on production units, or touches signing keys.

## Steps

### 1. Version every build

Use a version number in the firmware that the device reports at start and to the update service. Keep a changelog. Tie each release to a tagged commit.

### 2. Choose the update path

- **ESP-IDF OTA.** Two OTA app slots and an `otadata` partition. The device writes the new image to the idle slot and switches on reboot. Turn on app rollback: the new image boots in a pending state, runs its self-tests, and calls `esp_ota_mark_app_valid_cancel_rollback()` only if they pass; otherwise the bootloader returns to the old image. Anti-rollback blocks older images by a security version held in eFuse bits that cannot be reset, with 32 increments available, so raise it only for security fixes.
- **Zephyr.** MCUboot as the bootloader, with the app in its slot and the new image tested before it is confirmed.
- **Arduino Cloud or a device management service such as Memfault.** Use its staged rollout and pause controls; check how it handles a failed update before relying on it.
- **Raspberry Pi.** Package updates with apt or a versioned release of your script, and keep the service's `Restart=` and logs so a failed update shows up.

### 3. Define the self-test

What must work before an image is kept: it boots, reads its sensors, connects to the network and reaches the update server. Run it as early as possible after boot.

### 4. Plan the staged rollout

| Stage | Devices | Watch | Move on when | Stop when |
|---|---|---|---|---|
| 1. Bench | Your own test boards | Boot, self-test, reset count | All pass | Any failure |
| 2. Test group | Devices you name | Resets, errors, crash reports | Agreed watch period clean | Errors above the agreed trigger |
| 3. Customers | Everyone, in waves | Same, by wave | Each wave clean | Any rise in failures |

Stage 3 starts only after the client's yes for this release.

### 5. Set the security baseline

- No shared default password: unique per device or set by the user at setup, never derived from a serial number or MAC address in an obvious way.
- A public way to report security issues, with how fast you will respond.
- A stated security update period with an end date.
- On ESP32: Secure Boot v2, flash encryption in Release Mode with a unique key per device, NVS encryption (it holds Wi-Fi credentials), JTAG and UART download disabled, TLS with certificate checks. Rehearse the full sequence on spare boards first, because eFuse changes are permanent.
- A list of the software components in the firmware (a software bill of materials), kept per release.
- Signing keys created and kept on a machine you control, never shared in chat or a repo.

### 6. List the regulatory questions for the client's lab or adviser

I do not decide whether rules apply. I list the questions with dated facts:
- **UK:** PSTI security requirements (since 29 April 2024) and the statement of compliance; UKCA or CE marking for radio and electrical safety.
- **EU:** radio cybersecurity rules under the Radio Equipment Directive until 11 December 2027; Cyber Resilience Act reporting (since 11 September 2026) and main obligations (from 11 December 2027), including a support period of at least five years unless expected use is shorter; CE marking and the EU declaration of conformity.
- **US:** FCC authorization route (Certification or Supplier's Declaration of Conformity), modular transmitter labelling ("Contains FCC ID"), and what the host still needs.

### 7. Write the release note

Version, date, what changed, what was tested and on which hardware, the rollback plan, known issues, and the security fixes in plain words.

## Checks

- Every build reports its version; releases match tagged commits.
- Rollback is on, and the self-test decides whether an image is kept.
- Anti-rollback increments are reserved for security fixes.
- The rollout has stop triggers and a named person who says yes to stage 3.
- Secure boot and encryption steps were rehearsed on spare boards.
- No signing keys, passwords or tokens in the plan, code or chat.
- Regulatory points are questions with dates and sources, not rulings.

## Output format

1. Current state (versions, partitions, update path, gaps).
2. Update design with rollback and self-test.
3. Rollout table with stop triggers.
4. Security baseline checklist with status.
5. Questions for the test lab or adviser, by market.
6. Release note template, filled in for the next release.
7. Approvals needed: the client's yes for customer rollout and for any permanent device change.

## Example of good output (short)

*Made-up business for illustration: "Brightwater Aquatics", an ESP32 tank monitor sold in the UK and EU, 400 units in the field.*

> **Gap.** Single app partition, no rollback; every unit ships with the admin password "admin".
>
> **Plan.** New partition table with two OTA slots (needs one USB re-flash per unit, done at the next service visit or by a mailed cable guide); rollback on; self-test = probe read + Wi-Fi + server reply within 60 seconds of boot. Setup screen forces a new password on first use.
>
> | Stage | Devices | Stop when |
> |---|---|---|
> | Bench | 3 spare units | Any failed self-test |
> | Test group | 20 units at friendly shops | Any unit rolls back |
> | Customers | Remaining units in 4 waves | Rollbacks above the trigger agreed with the owner |
>
> **For your adviser.** PSTI: password change and the need for a published reporting route and update period. EU: radio cybersecurity rules now; CRA main obligations from 11 December 2027.
>
> **Needs your yes.** Customer waves, and burning secure-boot eFuses on new production units.
