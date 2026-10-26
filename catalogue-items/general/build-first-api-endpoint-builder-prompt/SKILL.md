---
name: build-first-api-endpoint-builder-prompt
description: Use to build your first API endpoints and learn what a server does. Paste one prompt into Claude Code and it creates two small Next.js routes, a GET ping and a POST echo, then explains each step in plain English. An optional second prompt writes a brief for your own first endpoint, with request checks, error responses and tests, before any code is written.
---

# First API endpoint prompt for Next.js

This prompt is for a person who is not a developer and wants to see what a server does. You paste it into Claude Code (or another coding AI that can edit files in your project). It builds two tiny routes and explains them.

It is a practice exercise. It does not build a feature for your business. Part 3 is the bridge to your own first endpoint.

## What you need first

- A **Next.js project that uses the App Router** (it has an `app/` folder, or `src/app/`). Next.js is the web framework this prompt is written for.
- **Node.js and npm** installed, so you can run the project on your own computer.
- **Claude Code** or a similar coding AI with access to the project folder. Claude Code needs a paid Claude plan or an Anthropic API account. Check Anthropic's current pricing and sign-in options.
- A terminal window.

No project yet? Make a throwaway one with the setup command on the Next.js website. That installs software on your computer, so do it yourself and only if you want to. Do not ask the AI to install anything for you here.

If your project uses the older `pages/api` folder, or is not Next.js, tell the AI before it starts. It should say what changes and ask before it goes on.

## Part 1: Paste this into your coding AI

```
I'm learning how servers work. I'm not a developer. First, look at my project and tell me whether it uses the Next.js App Router (app/ or src/app/). If it doesn't, stop and tell me what you found.

Then do these things. Don't install packages, change config files or deploy anything.

1. Create a GET route at app/api/ping/route.ts that returns JSON:
   { "status": "ok", "timestamp": <current time as an ISO string>, "message": "Your server is alive" }

2. Create a POST route at app/api/echo/route.ts that:
   - reads the JSON body of the request
   - returns { "received": true, "original": <the body they sent> }
   - if the body isn't valid JSON, returns status 400 with { "error": "Body must be valid JSON" }
   - if the body is larger than 10 KB, returns status 413 with { "error": "Body too large" }

3. After you create both files, explain in plain English:
   - what happens step by step when I open localhost:3000/api/ping in my browser
   - what happens when something sends a POST to localhost:3000/api/echo
   - what "localhost" means and what "3000" means
   - why these files live in the app/api folder
   - what the 400 and 413 replies are for

Keep it simple. Then list every file you created or changed.
```

## Part 2: Check that it works

1. In your terminal, run `npm run dev`. This starts the project on your computer only.
2. Open `http://localhost:3000/api/ping` in your browser. You should see JSON with `status`, `timestamp` and `message`.
3. Test the echo route from a second terminal.
   - Mac or Linux: `curl -X POST http://localhost:3000/api/echo -H "Content-Type: application/json" -d '{"name":"Sam","test":true}'`
   - Windows PowerShell: `Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/echo -ContentType "application/json" -Body '{"name":"Sam","test":true}'`
4. You should get your data back with `received: true`. Now send text that is not JSON, such as `hello`. You should get the 400 reply.

If a step fails, paste the error message back to your AI and ask what it means.

## Part 3 (optional): Brief your own first endpoint

Once the practice routes work, paste this. It makes the AI plan first and code second.

```
I want a real endpoint for my project: <what it should do, in one or two sentences>.
Don't write code yet. First write a short brief with:
- what the endpoint does and who calls it
- the request: method, path and the fields it accepts, with the checks for each field
- the success reply
- the error replies: bad input (400), not allowed (401 or 403), not found (404), too many requests if it applies, and a server error (500). Say what each one returns.
- anything it needs that I may not have: a database, a key, a login
- a list of tests: one for success, one for each error
Wait for my OK before you write any code. Don't add packages or connect any outside service without asking.
```

Read the brief and fix anything wrong before you say OK.

## What good output looks like

- Two new files, `app/api/ping/route.ts` and `app/api/echo/route.ts`, and a list of every file the AI touched.
- A plain-English explanation that answers all five questions in Part 1.
- No new packages, no changed config, nothing deployed.

## Rules for the AI

- Look at the project first. Do not guess paths.
- Do not install packages, change config, start background jobs or deploy unless the person says so.
- Do not claim you ran the project or a test unless you did. Say what the person should run.
- If something the person needs is missing, say exactly what, and do not make it up.
- Keep every explanation short and free of jargon.
- Remind the person once that the echo route sends back whatever it receives, so it is for local practice. They should not send passwords or secrets to it, and should not deploy it as is.

## What you just built

- Two API endpoints. An API endpoint is a web address that does a job and returns data instead of showing a page.
- A GET endpoint: your browser asks, the server answers.
- A POST endpoint: a program sends data, the server checks it and answers.
- This is the same pattern that agents and apps use to send and receive work.
