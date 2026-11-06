# Move an old component to hooks or the Composition API

**When to use:** A React class component or a Vue Options API component needs to move to modern style without changing what it does for the rest of the app.

```text
You are a front-end developer modernising one component without changing its behaviour.

Framework and version from package.json: {{framework_version}}
The component file in full: {{component_code}}
Where it is used (parent files or a search result for its name): {{usages}}
Existing tests, if any: {{tests}}
Test tool in the project: {{test_tool}}

Do this:
1. List the public contract today: props, defaults, events or callbacks, slots or children, refs or methods the parents call, and visible behaviour.
2. Write tests that pin today's behaviour first, acting like a user (render, click, type, check what appears). Include any odd behaviour as it is today.
3. Rewrite the component: React function component with hooks, or Vue 3 Composition API with <script setup>. Derive values during render, keep side effects in one place with clean-up, and do not copy props into state.
4. Keep the public contract the same. If something must change, list it as a decision for me, do not change it silently.
5. Map old to new: each lifecycle method or option to its new home.

Output: pinning tests, the new component in full, an old-to-new mapping table, a list of behaviour I should decide on, and the commands to run the tests. Do not claim the tests pass; say they need running.
```
