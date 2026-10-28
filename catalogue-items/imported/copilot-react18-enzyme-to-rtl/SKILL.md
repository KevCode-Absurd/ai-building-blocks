---
name: react18-enzyme-to-rtl
description: 'Provides exact Enzyme → React Testing Library migration patterns for React 18 upgrades. Use this skill whenever Enzyme tests need to be rewritten - shallow, mount, wrapper.find(), wrapper.simulate(), wrapper.prop(), wrapper.state(), wrapper.instance(), Enzyme configure/Adapter calls, or any test file that imports from enzyme. This skill covers the full API mapping and the philosophy shift from implementation testing to behavior testing. Always read this skill before rewriting Enzyme tests - do not translate Enzyme APIs 1:1, that produces brittle RTL tests.'
---

# React 18 Enzyme → RTL Migration

Enzyme has no React 18 adapter and no React 18 support path. All Enzyme tests must be rewritten using React Testing Library.

Before you start, ask the user to paste this skill into the AI first, then to gather and paste: the Enzyme test files, their React version, the installed React Testing Library version, and any provider setup (such as a customRender helper). Not for test suites outside React, or tests already on React Testing Library.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What you hand back

1. The rewritten test file or files.
2. A table of each old Enzyme call and the React Testing Library call that replaced it.
3. A list of tests that cannot be translated 1:1 (tests of internal state or instance methods), each with the visible outcome you checked instead.
4. A note on how the providers are wrapped (inline, or with the project's customRender helper).

The new tests have not been run, and the AI output is untested. Tell the user to run them in their own project.

Next steps to tell the user: run the full test suite on React 18, have a developer read the list of untranslated tests, and only then merge.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Build it** with the [Oracle migration risk reviewer](https://useaiblocks.com/skills/copilot-reviewing-oracle-to-postgres-migration). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## The Philosophy Shift (Read This First)

Enzyme tests implementation. RTL tests behavior.

```jsx
// Enzyme: tests that the component has the right internal state
expect(wrapper.state('count')).toBe(3);
expect(wrapper.instance().handleClick).toBeDefined();
expect(wrapper.find('Button').prop('disabled')).toBe(true);

// RTL: tests what the user actually sees and can do
expect(screen.getByText('Count: 3')).toBeInTheDocument();
expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
```

This is not a 1:1 translation. Enzyme tests that verify internal state or instance methods don't have RTL equivalents - because RTL intentionally doesn't expose internals. **Rewrite the test to assert the visible outcome instead.**

## API Map

For complete before/after code for each Enzyme API, read these files if they are in the folder. If they are not, use the core template below and say which Enzyme calls you were unsure about:
- **`references/enzyme-api-map.md`** - full mapping: shallow, mount, find, simulate, prop, state, instance, configure
- **`references/async-patterns.md`** - waitFor, findBy, act(), Apollo MockedProvider, loading states, error states

## Core Rewrite Template

```jsx
// Every Enzyme test rewrites to this shape:
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('does the thing', async () => {
    // 1. Render (replaces shallow/mount)
    render(<MyComponent prop="value" />);

    // 2. Query (replaces wrapper.find())
    const button = screen.getByRole('button', { name: /submit/i });

    // 3. Interact (replaces simulate())
    await userEvent.setup().click(button);

    // 4. Assert on visible output (replaces wrapper.state() / wrapper.prop())
    expect(screen.getByText('Submitted!')).toBeInTheDocument();
  });
});
```

## RTL Query Priority (use in this order)

1. `getByRole` - matches accessible roles (button, textbox, heading, checkbox, etc.)
2. `getByLabelText` - form fields linked to labels
3. `getByPlaceholderText` - input placeholders
4. `getByText` - visible text content
5. `getByDisplayValue` - current value of input/select/textarea
6. `getByAltText` - image alt text
7. `getByTitle` - title attribute
8. `getByTestId` - `data-testid` attribute (last resort)

Prefer `getByRole` over `getByTestId`. It tests accessibility too.

## Wrapping with Providers

```jsx
// Enzyme with context:
const wrapper = mount(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  </ApolloProvider>
);

// RTL equivalent (use your project's customRender or wrap inline):
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
// ThemeProvider comes from your own theme library (for example styled-components or MUI).
render(
  <MockedProvider mocks={mocks} addTypename={false}>
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  </MockedProvider>
);
// Or use the project's customRender helper if it wraps providers
```
