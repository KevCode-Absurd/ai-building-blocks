# Fictional worked example

This is an offline practice case, not a live service result.

## Input

Fictional plain 350 ml mug, charcoal brand color #222222, exact photo P1, no offer or reviews. User chooses graphic overlay.

## Result

Six independent prompt jobs: product ID, size, handle detail, desk context, gift occasion without promotion, and care reminder only if a supplied care fact exists; otherwise a sixth scene/layout. Each repeats P1, shape/label locks, charcoal palette and live-type instructions. No discount, review badge or efficacy claim.

## Check

- {"name":"Six independent jobs","passed":true}
- {"name":"Fingerprint repeated in every prompt","passed":true}
- {"name":"Overlay preserves photo","passed":true}
- {"name":"Unknown facts are not invented","passed":true}
