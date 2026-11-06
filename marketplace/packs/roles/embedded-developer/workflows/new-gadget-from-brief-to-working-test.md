# New gadget: from brief to a working test

**Trigger:** A client asks for a new small gadget (a counter, logger, queue light, display or sensor alarm) on Arduino, ESP32 or Raspberry Pi.

## Steps

1. **Agree access and limits.** Ask which level the client grants for each tool (code host, build tools, device cloud, Pi access) and the limits. Write them under "Access I have". Until the client answers, use level 1.
2. **Intake (level 1).** Board and version, parts with links, power supply, what it should do as a list of events, where data goes, what happens on failure, and whether anything touches mains voltage. Mains parts go to a qualified electrician; stop that part here.
3. **Pin table and wiring guide.** Use the `pin-table-and-wiring-guide` skill: pins by job, voltage levels, current limits, power budget, wiring steps and the first power-on test. *Approval: the client confirms the pin table and parts before code is written.*
4. **Check libraries.** Run the `library-and-version-check` prompt on the planned libraries and the core or SDK version. Pin versions.
5. **Write the program.** Use the `non-blocking-device-program` skill: settings block, timers, failure table, secrets file, start-up log line, build and test steps.
6. **Simulate where possible.** For Arduino and ESP32 logic, run it in Wokwi or a copy of the project before wiring (level 2 in the simulator).
7. **Deliver for review (level 2).** Push a branch and open a pull request with the program, pin table, README and test steps. Without a code host, deliver the files.
8. **Merge and flash (level 3, within limits).** Merge after review and checks, and flash the client's own test board if my AI tool can run commands on the computer it is plugged into. *Approval: the first live action list is confirmed by the client.*
9. **Test together.** The client (or I, at level 3 on their test board) runs the first test and shares the serial or journal output. Compare with the expected lines; if they differ, use the `device-fault-diagnosis` skill.
10. **Start on boot (Pi).** Use the `pi-script-start-on-boot` prompt for a systemd service with restarts and log limits.
11. **Write the README.** Use the `wiring-guide-readme` prompt for the reader the client names.
12. **Report.** What was built, what was tested and how, what was not run, open questions, and the action log.

## Outputs

- Pin table, wiring guide and power budget
- The program with pinned libraries, failure table and secrets file template
- Build, upload and test steps with expected output
- Pull request (level 2) or merged change (level 3), with the action log
- README for the named reader
- For Pi projects: the systemd unit file and log commands

## Needs the client's approval

The access level for each tool and the level 3 limits; the pin table and parts list before coding; the first live action list at level 3; buying any parts or paid plans (the client pays); anything outside the agreed devices or repos. If the gadget will be sold to other people, switch to the `staged-firmware-rollout` workflow and the `firmware-update-and-release-plan` skill before the first sale.
