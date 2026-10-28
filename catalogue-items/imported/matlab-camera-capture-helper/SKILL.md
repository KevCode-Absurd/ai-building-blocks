---
name: matlab-use-cameras
description: >
  Connect to and acquire images from cameras in MATLAB using Image Acquisition
  Toolbox. Use this skill when the user wants to: use a webcam, acquire images,
  capture video, stream from a camera, connect to a GigE Vision camera, preview
  live video, list available cameras, configure camera properties, use a CoaXPress
  frame grabber, or use a Camera Link frame grabber. Covers USB webcams, GigE
  Vision, USB3 Vision, CoaXPress, Camera Link, and GenICam-compliant cameras.
  Always prefer videoinput from Image Acquisition Toolbox over webcam support
  package or gigecam.
license: https://www.mathworks.com/content/dam/mathworks/license/pmrl/license.md
metadata:
  author: MathWorks
  version: "1.0"
---

# Using Cameras in MATLAB

AI Blocks note on the licence: the licence link in the front matter above points to a different MathWorks page. In this catalogue, the LICENSE.md file in this folder governs (BSD 2-Clause, with the rule that you use it only with MathWorks products).

What you hand back, in this order: 1. device listing code, 2. connect code, 3. capture code (a preview, then one snapshot or a set number of frames with timestamps), 4. clean-up code, 5. the list of support packages and vendor files to install first. Put each in its own code block with one line saying what it does.

Use Image Acquisition Toolbox's `videoinput` as the primary interface for all camera workflows. Other interfaces (`webcam`, `gigecam`) are secondary and should only be used when explicitly requested or when `videoinput` is unavailable.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- User wants to connect to a camera (webcam, USB, GigE, USB3 Vision, CoaXPress, Camera Link)
- User wants to acquire images or video frames
- User wants to preview live camera feed
- User wants to list or enumerate available cameras
- User wants to acquire images from a CoaXPress frame grabber
- User wants to acquire images via a Camera Link frame grabber
- User asks "how do I use my webcam/camera in MATLAB?"
- User mentions Image Acquisition Toolbox

## When NOT to Use

- User explicitly requests `webcam()` from the webcam support package
- User is on MATLAB Online (where `videoinput` is not available — use `webcam()`)
- User is doing image processing on existing files (no camera involved)
- User is working with non-imaging hardware (oscilloscopes, data acquisition boards)

## Conventions

### API Priority Rules

These rules are critical. Follow them unless the user explicitly requests otherwise.

1. **Always use `videoinput()` from Image Acquisition Toolbox** as the primary camera interface
2. **Always use `imaqhwinfo`** for device enumeration — not `webcamlist` or `gigecamlist`
3. **For GigE Vision cameras:** use `videoinput("gentl", ...)` — not `gigecam` or `videoinput("gige")`
4. **For USB/built-in webcams on Windows:** use `videoinput("winvideo", ...)`
5. **For USB/built-in webcams on macOS:** use `videoinput("macvideo", ...)`
6. **For USB/built-in webcams on Linux:** use `videoinput("linuxvideo", ...)`
7. **For CoaXPress cameras:** use `videoinput("gentl", ...)` — CoaXPress frame grabbers always provide GenTL producers
8. **For Camera Link cameras:** prefer `videoinput("gentl", ...)` if the frame grabber provides a GenTL producer; otherwise use the vendor-specific adaptor (e.g., `videoinput("ni", ...)`, `videoinput("dalsa", ...)`)
9. **If user specifies a CoaXPress or Camera Link camera without naming the frame grabber:** ask the user which frame grabber they are using before writing code — the adaptor choice depends on the frame grabber
10. **Never describe `videoinput` as "legacy" or "advanced"** — it is the primary, full-featured interface

### When to use `webcam()` instead

Only in these cases:
- User explicitly asks for it
- User is on MATLAB Online
- Image Acquisition Toolbox is not installed (confirm with `imaqhwinfo`)

### Required support packages

| Camera type | Adaptor | Support Package | Vendor GenTL Producer (.cti) |
|-------------|---------|-----------------|------------------------------|
| USB/built-in webcam (Windows) | `"winvideo"` | OS Generic Video Interface | Not required |
| USB/built-in webcam (macOS) | `"macvideo"` | OS Generic Video Interface | Not required |
| USB/built-in webcam (Linux) | `"linuxvideo"` | OS Generic Video Interface | Not required |
| GigE Vision camera | `"gentl"` | GenICam Interface | **Required** — from camera vendor |
| USB3 Vision camera | `"gentl"` | GenICam Interface | **Required** — from camera vendor |
| CoaXPress camera (via frame grabber) | `"gentl"` | GenICam Interface | **Required** — from frame grabber vendor |
| Camera Link camera (GenTL producer) | `"gentl"` | GenICam Interface | **Required** — from frame grabber vendor |
| Camera Link camera (vendor adaptor) | vendor-specific (e.g., `"ni"`, `"dalsa"`) | Vendor-provided hardware adaptor | Not applicable |

**Important:** The GenICam Interface support package provides only the MATLAB-side consumer. For `gentl` cameras, you must **also** install the vendor's GenTL producer (a `.cti` file). Examples: Spinnaker SDK for FLIR, Vimba X for Allied Vision, ImpactAcquire for Balluff, Euresys eGrabber for Euresys frame grabbers. The producer is NOT bundled with the MATLAB support package.

## Workflow

### 1. Enumerate devices

```matlab
% List all available adaptors and devices
info = imaqhwinfo;
disp(info.InstalledAdaptors)

% Get details for a specific adaptor
adaptorInfo = imaqhwinfo("winvideo");
disp(adaptorInfo.DeviceInfo)
```

### 2. Connect to camera

```matlab
% USB/built-in webcam on Windows
vid = videoinput("winvideo", 1);

% GigE Vision camera via GenTL
vid = videoinput("gentl", 1);

% Specify a format
vid = videoinput("winvideo", 1, "YUY2_1280x720");
```

### 3. Configure properties

```matlab
% Set color space
vid.ReturnedColorSpace = "rgb";

% Set region of interest [x_offset y_offset width height]
vid.ROIPosition = [0 0 640 480];

% Access device-specific properties via the source object
src = getselectedsource(vid);
```

### 4. Preview live video

```matlab
preview(vid);
pause(3);
```

### 5. Acquire frames

Single snapshot:
```matlab
img = getsnapshot(vid);
imshow(img);
```

Multiple frames (immediate trigger):
```matlab
vid.FramesPerTrigger = 10;
start(vid);
wait(vid);
[frames, timestamps] = getdata(vid);
```

Manual trigger (acquire on demand):
```matlab
triggerconfig(vid, "manual");
vid.FramesPerTrigger = 1;
start(vid);
trigger(vid);
img = getdata(vid);
```

### 6. Clean up

```matlab
stoppreview(vid);
stop(vid);
delete(vid);
clear vid;
```

## Key Functions

| Function | Purpose | Source |
|----------|---------|--------|
| `imaqhwinfo` | List adaptors and devices | Image Acquisition Toolbox |
| `videoinput` | Create video input object (primary interface) | Image Acquisition Toolbox |
| `preview` | Show live video feed | Image Acquisition Toolbox |
| `getsnapshot` | Capture single frame immediately | Image Acquisition Toolbox |
| `start` | Begin acquisition | Image Acquisition Toolbox |
| `getdata` | Retrieve acquired frames from buffer | Image Acquisition Toolbox |
| `stop` | Stop acquisition | Image Acquisition Toolbox |
| `getselectedsource` | Access device-specific properties | Image Acquisition Toolbox |
| `triggerconfig` | Configure trigger type (immediate, manual, hardware) | Image Acquisition Toolbox |
| `trigger` | Execute manual trigger after `start` | Image Acquisition Toolbox |
| `imageAcquisitionExplorer` | Launch interactive acquisition app | Image Acquisition Toolbox |

## Patterns

### USB/Built-in Webcam (Windows)

```matlab
% Enumerate
info = imaqhwinfo("winvideo");
disp(info.DeviceInfo.DeviceName)

% Connect and configure
vid = videoinput("winvideo", 1, "YUY2_1280x720");
vid.ReturnedColorSpace = "rgb";
vid.FramesPerTrigger = 1;

% Preview and capture
preview(vid);
pause(2);
img = getsnapshot(vid);
imshow(img);

% Clean up
stoppreview(vid);
delete(vid);
clear vid;
```

### GigE Vision Camera (GenTL)

The GenTL adaptor is the preferred interface for GigE Vision and USB3 Vision cameras. It supports the full GenICam standard and works across camera vendors.

```matlab
% Enumerate
info = imaqhwinfo("gentl");
disp(info.DeviceInfo.DeviceName)

% Connect
vid = videoinput("gentl", 1);
vid.ReturnedColorSpace = "rgb";

% Configure acquisition
vid.FramesPerTrigger = 10;

% Access GenICam properties via source object
src = getselectedsource(vid);

% Acquire
start(vid);
wait(vid);
[frames, timestamps] = getdata(vid);

% Clean up
stop(vid);
delete(vid);
clear vid;
```

If the GenTL adaptor is not installed, guide the user through setup:
1. Install "Image Acquisition Toolbox Support Package for GenICam Interface" via Add-On Explorer
2. Install the vendor's GenTL producer (a `.cti` file) — e.g., Spinnaker SDK for FLIR cameras, Vimba X for Allied Vision, or the vendor's GigE Vision SDK
3. Verify with `imaqhwinfo("gentl")` — the camera should appear in `DeviceInfo`

See `references/gentl-setup.md` for detailed GenTL producer configuration and troubleshooting.

### CoaXPress Camera (via Frame Grabber)

CoaXPress frame grabbers always provide a GenTL producer, so the workflow is identical to GigE Vision via the `gentl` adaptor.

```matlab
% Enumerate — CoaXPress cameras appear under the gentl adaptor
info = imaqhwinfo("gentl");
disp(info.DeviceInfo.DeviceName)

% Connect and acquire
vid = videoinput("gentl", 1);
vid.ReturnedColorSpace = "rgb";
vid.FramesPerTrigger = 10;
src = getselectedsource(vid);
start(vid);
wait(vid);
[frames, timestamps] = getdata(vid);

% Clean up
stop(vid);
delete(vid);
clear vid;
```

### Camera Link Camera (via Frame Grabber)

Camera Link has two paths depending on whether the frame grabber vendor provides a GenTL producer:

**With GenTL producer (preferred):** Use `videoinput("gentl", ...)` — same as GigE/CoaXPress above.

**Without GenTL producer (vendor adaptor):** Use the vendor-specific adaptor registered with `imaqhwinfo`:

```matlab
% Check which adaptors are available
info = imaqhwinfo;
disp(info.InstalledAdaptors)

% Connect via vendor adaptor (e.g., "ni" for National Instruments)
vid = videoinput("ni", 1);
vid.ReturnedColorSpace = "rgb";
src = getselectedsource(vid);
```

**Important:** If the user mentions a Camera Link or CoaXPress camera without specifying the frame grabber, ask which frame grabber they are using. The correct adaptor depends on the frame grabber, not the camera.

## Common Mistakes

| Mistake | Why it's wrong | Correct approach |
|---------|---------------|-----------------|
| Using `webcam()` for USB cameras | Bypasses IMAQ's full feature set (triggering, ROI, logging, callbacks) | Use `videoinput("winvideo", ...)` |
| Using `webcamlist` to find cameras | Only finds webcam-support-package devices, misses industrial cameras | Use `imaqhwinfo` |
| Using `gigecam` for GigE cameras | Limited interface, doesn't support full GenICam feature set | Use `videoinput("gentl", ...)` |
| Using `videoinput("gige", ...)` | Legacy adaptor, not actively maintained | Use `videoinput("gentl", ...)` |
| Using `gigecamlist` for GigE enumeration | Limited to GigE Vision Hardware Support Package | Use `imaqhwinfo("gentl")` |
| Calling `videoinput` "legacy" | It is the primary, actively maintained interface | Present `videoinput` as the recommended approach |
| Using `snapshot(cam)` for capture | That's the webcam support package function | Use `getsnapshot(vid)` with videoinput |
| Using `now`/`datenum` for timestamps | Deprecated serial date numbers | Use `datetime("now")` for timing metadata |
| Assuming Camera Link needs a special interface | GenTL works for Camera Link if the frame grabber vendor provides a producer | Try `videoinput("gentl", ...)` first, fall back to vendor adaptor |

----

Copyright 2026 The MathWorks, Inc.

----

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [MATLAB report builder](https://useaiblocks.com/skills/matlab-report-builder).
- The [MATLAB bug tracer](https://useaiblocks.com/skills/matlab-bug-tracer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
