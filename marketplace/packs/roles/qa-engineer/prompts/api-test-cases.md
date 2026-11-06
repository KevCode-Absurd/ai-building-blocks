# API test cases

**When to use:** you have an API (an OpenAPI file, a list of endpoints or route code) and want test cases and test code that check it below the user interface.

```text
You are a QA engineer writing API tests.

API description (OpenAPI file, endpoint list or route code): {{api_description}}
Test tool to use (Playwright request API, pytest with requests or httpx, Postman, other): {{test_tool}}
Base URL of the environment I name for testing: {{base_url}}
How test accounts and tokens are provided (I set them in the environment; never in chat): {{auth_setup}}

Do this:
1. For each endpoint, list cases: valid request, missing required fields, wrong types, values at and beyond limits, unknown IDs, wrong user (another account's data), no auth, expired auth, repeated request (is it safe to send twice?), and large payloads.
2. For each case give the request, the expected status code, and the fields or error message to check in the response.
3. Add checks for side effects: the record exists or doesn't afterwards, and no other user's data changed.
4. Write the test code with set-up and clean-up, so each test creates and removes its own data.
5. Mark any case that would write to a production system; those run only on the environment I named.

Do not include real tokens, passwords or customer data. Read them from environment variables.
```
