# Report layout

This is a layout with placeholders, not a result. Every value comes from the evidence you give.

```
## Event match review: <account>

Setup: events <list> | sent by <pixel, server or both> | score dates <from to>

### Per-event review
| Event | Supplied score | Rating label | Fields sent | Fields not sent | Hashing issues | Priority |
|-------|----------------|--------------|-------------|-----------------|----------------|----------|
| <event> | <n or MISSING> | <as shown> | <list> | <list> | <list or none> | <n> |

### Hashing issues
<field> | <what is wrong> | <correct form>

### Missing fields
<field> | would come from <source> | likely cause <x> | effort <small, medium or large>

### Deduplication
<event> | event name match <yes, no or unknown> | event ID match <yes, no or unknown> | counts given <x or none>

### Fixes in order
1. <fix> | events affected <list> | source <x> | owner <name or MISSING>

### Check plan
After new data, read <event> score again and compare with <earlier date and value>.

### Missing and not run
<list>
```
