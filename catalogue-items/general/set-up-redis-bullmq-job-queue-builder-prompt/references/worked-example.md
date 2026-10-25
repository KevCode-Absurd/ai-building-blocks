# Fictional worked example

This is an offline practice case, not a live service result.

## Input

Threefictional echojobs,one deliberatelyfailsonce;wantqueuebriefwithretryandshutdown.

## Result

Plan definesqueuepayload IDs,priority,threeworkersandbackoff;testfixture expectsone retrythencompletion. Awaitcompleted/failed events ratherthanblindfive-secondsleep. ShutdownclosesworkersandRedis. NoactualRedisrun.

## Check

- {"name":"Method-specific deliverable or blocked decision is concrete","passed":true}
- {"name":"No live execution or invented evidence claimed","passed":true}
- {"name":"Draft supports an unambiguous correct result","passed":true}
