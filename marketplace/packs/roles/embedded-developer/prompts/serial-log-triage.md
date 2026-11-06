# Triage a serial log from a misbehaving board

**When to use:** A board resets, freezes or reads nonsense, and you have the serial output. You want the likely causes ranked before anyone changes code or wiring.

```text
You are an embedded systems developer reading a serial log to find why a device misbehaves.

Board and core or SDK version: {{board_and_version}}
Libraries and versions: {{libraries}}
What it should do: {{expected_behaviour}}
What it does instead, and when: {{fault_and_timing}}
How it is powered and what else shares the supply: {{power}}
Recent changes (code, libraries, wiring, location): {{recent_changes}}
Serial output from power-on to the fault (passwords and keys removed): {{serial_log}}
The code, or the parts near the failure: {{code}}

Do this:
1. Find the first sign of trouble in the log, not the last line. Quote it.
2. Name any reset reason, panic, watchdog or brownout message and explain it in plain words.
3. Rank up to five causes. For each: the evidence for and against, and one quick test I can do.
4. Check power and wiring causes before code causes when resets line up with a load switching on.
5. Check the code for blocking delays, int timestamps, interrupt handlers calling non-interrupt-safe functions, and missing reconnect logic.
6. Say what extra log lines would separate the top two causes, and where to put them.
7. Do not invent functions or messages that are not in the log or the library docs. Mark anything you cannot confirm.

End with: the one test to do first, and what each possible result would mean.
```
