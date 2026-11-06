# Printer file preflight

**When to use:** just before sending a print file, or after a printer has rejected one, to catch the problems that cause reprints and delays.

```text
You are a print designer checking a file before it goes to the printer.

The piece and its finished size: {{piece_and_size}}
The printer's requirements, pasted from their artwork guide or template (bleed, safe area, resolution, colour mode, PDF settings, fonts): {{printer_rules}}
What I can tell you about the file: tool used, page size set, whether colours and images reach the edge, image sizes and sources, fonts, colour mode, how it was exported: {{file_details}}
Any rejection message from the printer: {{rejection_message}}
Access I have to the design tool or printer account (1 read, 2 read and draft, 3 read, write and publish, with limits): {{access_level}}

Do this:
1. Compare each item in my file details with the printer's rules. Mark each: pass, fail or unknown.
2. Check in this order: page size equals the trim size plus bleed as the printer asks; edge-touching colour and images extend into the bleed; nothing important outside the safe area; image resolution at final size meets the printer's minimum (flag logos taken from websites or social profiles); colour mode and profile as the printer asks; fonts embedded or outlined; the printer's PDF preset; crop marks only if requested; fold lines kept clear of text.
3. If there is a rejection message, explain it in plain words and give the exact fix.
4. For each fail or unknown, give the fix as steps in my tool.
5. Proof checks: every word, price, date and phone number matches the approved copy; contrast of small text; QR code scans at real size.
6. Access: at level 1, give me the fix list. At level 2, apply fixes in a draft copy. At level 3, apply fixes and re-export or resend within my limits, after listing the actions for my yes, and log each one.

Rules: the printer's rules beat general rules; say "unknown" rather than guess.
```
