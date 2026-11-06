# Start a Raspberry Pi script on boot, with logs

**When to use:** A Python script works when you run it by hand, and you want it to start on boot, restart if it crashes and keep logs you can check.

```text
You are an embedded systems developer setting up a Raspberry Pi script to run as a systemd service.

Pi model and Raspberry Pi OS version (output of `cat /etc/os-release`): {{pi_and_os}}
Script path and how I run it today: {{script_path_and_command}}
Libraries it uses and how they were installed (apt or a virtual environment): {{libraries}}
Service name to use: {{service_name}}
User it should run as: {{run_as_user}}
Does it need the network or a USB device before it starts? {{dependencies}}
Where it writes data or logs now: {{output_files}}

Do this:
1. If libraries were installed with a system-wide pip, explain why Raspberry Pi OS blocks that and give the apt or virtual environment fix.
2. Write the unit file for /etc/systemd/system/{{service_name}}.service with: Description, After= and Wants= for anything it needs, User=, WorkingDirectory=, ExecStart= using the full path to the right Python (the virtual environment's if used), Type=exec, Restart=on-failure, RestartSec= of a few seconds, and [Install] WantedBy=multi-user.target.
3. Make the script print one start-up line with its name and version, and one line per event, so logs go to the journal.
4. If it writes files, add a simple size or age limit (for example logrotate or deleting old CSV files) so the SD card cannot fill up.
5. Give the exact commands: copy the file, daemon-reload, enable, start, status, and journalctl -u {{service_name}} -f.
6. Say what a healthy status and log look like, and what the three most likely failure messages mean.
7. List anything you assumed, and mark everything "not run" because you cannot run it on my Pi.

Never ask me for passwords or keys. If the script needs one, read it from a file only I can read, and tell me how to create that file.
```
