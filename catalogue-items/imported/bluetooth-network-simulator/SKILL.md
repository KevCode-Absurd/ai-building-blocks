---
name: matlab-simulate-bluetooth-network
description: >
    Simulate Bluetooth system-level networks using the Bluetooth Toolbox. Use this skill for any Bluetooth topology: BLE ACL (Asynchronous Connection-Less) data connections, CIS (Connected Isochronous Stream) and LE Audio for stereo speakers or hearing aids, BLE GAP (Generic Access Profile) connection establishment with advertising and scanning, Classic BR/EDR piconets with ACL data and SCO (Synchronous Connection-Oriented) voice links, and BLE+BR/EDR coexistence with adaptive frequency hopping. Covers bluetoothLENode, bluetoothNode, bluetoothLEConnectionConfig, bluetoothLECISConfig, bluetoothLEGAPConfig, bluetoothConnectionConfig, configureConnection, kpi(), updateChannelList, and all Bluetooth statistics.
license: https://www.mathworks.com/content/dam/mathworks/license/pmrl/license.md
compatibility: ">=R2026a"
metadata:
  author: MathWorks
  version: "1.0"
---

# Bluetooth System-Level Simulation

Entry point for all Bluetooth system-level simulation. All Bluetooth simulations use `sim = wirelessNetworkSimulator.init` and follow the workflow defined in `matlab-simulate-wireless-network` (simulator init, traffic, mobility, instrumentation, addNodes, run).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **MATLAB with the Bluetooth Toolbox:** The simulation only runs there. It is a paid MathWorks product.
- **Claude Code or another AI that can run MATLAB:** It can write, run and fix the script without you copying code across.
<!-- /needs -->

## Inputs to Gather First

Ask once for anything missing. Do not invent devices, data rates or run times.

- The devices and how they connect (one link, a star, a mix of types).
- The Bluetooth type: BLE data, LE Audio, GAP connection setup, classic BR/EDR, or BLE plus classic together.
- The traffic: data rate (in Kbps) and packet size, and whether it runs all the time or in bursts.
- Distances or movement between nodes (optional).
- How long to simulate.

This skill needs MATLAB R2026a or later with the Bluetooth Toolbox, which are paid MathWorks products. If the AI cannot run MATLAB, write the script and tell the person to run it, then ask them to paste back the output.

## What You Hand Back

1. Setup: Bluetooth type, nodes and roles, traffic, run time.
2. The MATLAB script.
3. Results: throughput, latency and loss per link, read from the layer in the kpi table below.
4. Reading the numbers: one short paragraph on what they mean for the person's case.
5. Next change to try: one setting to change and compare.

If the companion `matlab-simulate-wireless-network` skill is not available (it is a separate MathWorks skill, not part of this item), follow its order. This is an outline of one BLE data link, not code to paste. Check each function name and argument against the MATLAB help for your release:

```matlab
sim = wirelessNetworkSimulator.init;               % 1. start the simulator
central = bluetoothLENode("central");              % 2. create the nodes
peripheral = bluetoothLENode("peripheral");
cfg = bluetoothLEConnectionConfig;                 % 3. link them, one call per peripheral
configureConnection(cfg, central, peripheral);
% 4. add a traffic source (DataRate is in Kbps), then set mobility
% 5. switch on statistics, then addNodes(sim, [central peripheral])
% 6. run(sim, runTime), then read kpi() from the layer in the table below
```

The `references/*.md` files in this folder hold the full pattern for each Bluetooth type.

## When to Use

- BLE ACL point-to-point or star network connections
- LE Audio unicast with CIS/CIG (stereo speakers, hearing aids)
- BLE GAP connection establishment (advertising, scanning, connection timing)
- Classic BR/EDR piconets with ACL data or SCO voice
- BLE + BR/EDR coexistence with adaptive frequency hopping
- Any simulation using `bluetoothLENode`, `bluetoothNode`

## When Not to Use

- Non-Bluetooth wireless simulations (use `matlab-simulate-wireless-network` instead)
- PHY-layer or link level Bluetooth waveform generation, receiver analysis or BER analysis
- Generic simulator setup, traffic models, or mobility (use `matlab-simulate-wireless-network`)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Wireless network simulator](https://useaiblocks.com/skills/wireless-network-simulator).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scenario → Reference Routing

| Scenario | Reference |
|----------|-----------|
| BLE realistic connection setup (advertising, scanning, GAP) | `references/ble-gap-connection.md` |
| BLE point-to-point data, star network, ACL connections | `references/ble-connection.md` |
| LE Audio unicast (stereo speakers, hearing aids, CIS/CIG) | `references/ble-cis.md` |
| Classic Bluetooth earbuds, SCO voice, ACL data | `references/bluetooth-bredr.md` |
| BLE + BR/EDR coexistence, adaptive frequency hopping | `references/bluetooth-coexistence.md` |
| Capture and visualization (PCAP, IQ, event tracing, traffic viewer) | See `matlab-simulate-wireless-network` skill |

## Node Roles

- BLE (ACL, CIS): `bluetoothLENode("central")`, `bluetoothLENode("peripheral")`
- BR/EDR: `bluetoothNode("central")`, `bluetoothNode("peripheral")` — max 7 peripherals per central

## Traffic Attachment Rules

`addTrafficSource(sourceNode, traffic, ...)`:
- **ACL/CIS/BR/EDR**: `DestinationNode=peer` required. CIS also needs `CISConfig=cfgCISOut`.
- **BR/EDR SCO**: No traffic call — implicit via `SCOPacketType` in connection config.

## kpi() Availability

| Topology | `"throughput"` | `"latency"` | `"PLR"` / `"PDR"` | Layer |
|----------|:-:|:-:|:-:|-------|
| BLE ACL | LL only | App only | Both LL and App | `"LL"` or `"App"` |
| BLE CIS | LL only | App only | Both LL and App | `"LL"` or `"App"` |
| BR/EDR | Baseband | — | Baseband | `"Baseband"` |

## Connection/Configuration Setup

| Topology | Config Object | Function | Notes |
|----------|--------------|----------|-------|
| BLE ACL | `bluetoothLEConnectionConfig` | `configureConnection(cfg, central, peripheral)` | Per-peripheral in loop; unique `AccessAddress` per connection |
| BLE CIS | `bluetoothLEConnectionConfig` + `bluetoothLECISConfig` | `[~, cfgCISOut] = configureConnection(cfg, central, peripheral, CISConfig=cfgCIS)` | Pass `cfgCISOut` to `addTrafficSource(..., CISConfig=cfgCISOut)` |
| BR/EDR | `bluetoothConnectionConfig` | `configureConnection(cfg, central, peripherals)` | Single call with vector of peripherals |

## Common Mistakes

- **`bluetoothNode` for BLE** (or vice versa): BR/EDR = `bluetoothNode`, BLE = `bluetoothLENode`
- **Wrong kpi Layer**: BLE throughput → `"LL"`, BLE latency → `"App"`, BR/EDR → `"Baseband"` only
- **Properties locked after `run()`**: Node/connection properties cannot change mid-sim. Use `updateChannelList` for mid-sim channel updates.
- **`configureConnection` with peripheral vector for BLE**: Must call per-peripheral in loop (BR/EDR accepts vector)
- **Unique `AccessAddress` per connection**: Each BLE connection on same central needs different AccessAddress
- **DataRate in Kbps**: `DataRate=100` means 100 Kbps, not 100 bps
- **`GeneratePacket=true` is not valid**: Not applicable for network-level simulation. Use `OnTime=Inf` for continuous traffic.

<!-- Copyright 2026 The MathWorks, Inc. -->

