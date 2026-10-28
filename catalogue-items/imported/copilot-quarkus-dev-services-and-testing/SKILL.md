---
name: quarkus-dev-services-and-testing
description: 'Quarkus Dev Services and testing: zero-config containers, @QuarkusTest, @QuarkusIntegrationTest, test resources, RestAssured, @InjectMock, profiles and continuous testing. Use when writing or fixing tests in a Quarkus project.'
---

# Quarkus Dev Services and Testing

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can read your project, write the tests and run them with Maven.
- **Claude, ChatGPT or Gemini in a plain chat:** Works if you paste your pom.xml and class. You run the Maven commands yourself.
<!-- /needs -->

## What to ask for first

1. The project's pom.xml, or the Quarkus version in it (required).
2. The class, endpoint or behaviour to test (required).
3. Whether Docker or Podman is running (required for Dev Services; if not, say tests that need containers cannot run yet).
4. The services the app uses, such as PostgreSQL or Kafka (optional; read them from the extensions in pom.xml if not given).

If something is missing after one question, write MISSING and carry on. Never guess a version, an extension or a port.

## Steps

1. Check the project's Quarkus version in pom.xml, and which JUnit and mocking dependencies it already uses. Keep those.
2. Choose how to get the service: Dev Services first, a test resource only if Dev Services does not cover it.
3. Write the test with `@QuarkusTest` and RestAssured. Add `@TestTransaction`, `@TestSecurity`, `@InjectMock` or `@TestProfile` only when the case needs it.
4. Add the `application.properties` lines the test needs.
5. Give the run commands: `./mvnw test`, then `./mvnw verify -DskipITs=false` if there are `*IT` classes.
6. If you can run commands, run them and report the real result. If you cannot, say the tests have not been run.

## Output

Return, in this order:

- **Assumptions and MISSING items**
- **Test classes**: full code for each, with one line on what it checks.
- **Settings**: the `application.properties` lines, or "none needed".
- **Test resource**: code, only if needed.
- **Run commands**: with what each one runs and skips.
- **Open items**: what was not checked or run. Always ask the user to confirm the `skipITs` and failsafe settings in their own pom.xml, since templates differ by version.
- **Next step**: once the tests pass, add the run commands to CI, and for new code use the Build a Quarkus application feature skill.

Check the project's Quarkus version first. Framework-neutral Testcontainers usage can use the optional `java-testcontainers` skill if installed (otherwise see <https://java.testcontainers.org/>); this skill covers only Quarkus-specific features.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Test suite writer](https://useaiblocks.com/skills/test-suite-writer). It takes the code change.
- The [API test suite builder](https://useaiblocks.com/skills/api-test-suite-builder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Dev Services

In dev and test modes Quarkus starts containers (PostgreSQL, MySQL, Kafka, Redis, Keycloak, ...) automatically when the related extension is present and no connection is configured (Docker or Podman required).

```properties
# Global switch
quarkus.devservices.enabled=true
%dev.quarkus.datasource.devservices.image-name=postgres:17
# Reuse container across restarts (also requires testcontainers.reuse.enable=true in ~/.testcontainers.properties)
quarkus.datasource.devservices.reuse=true
# Fixed port (optional)
quarkus.datasource.devservices.port=5432
# Share between apps in dev mode
quarkus.kafka.devservices.shared=true
```

Disable one with `quarkus.<ext>.devservices.enabled=false`; configuring a URL/host explicitly also disables it. Dev UI (`/q/dev-ui`) lists running services.

## Tests

```java
@QuarkusTest
class GreetingResourceTest {
    @Test
    void hello() {
        given().when().get("/hello").then().statusCode(200).body(is("Hello"));
    }
}
```

Dependencies, test scope: `io.quarkus:quarkus-junit` (3.31+, what the 3.40 template generates) or `quarkus-junit5` (3.27 template; still published and resolvable on 3.40) and `io.rest-assured:rest-assured`. Keep whichever the project already uses.

- Inject beans in tests with `@Inject`; mock CDI beans with `io.quarkus.test.InjectMock` (`quarkus-junit-mockito`, formerly `quarkus-junit5-mockito`; the upstream author reports mocking a `PanacheRepository` bean on 3.40.1).
- Security: `@TestSecurity(user="alice", roles="admin")` (`quarkus-test-security`).
- Profiles: `@TestProfile(MyProfile.class)` with `QuarkusTestProfile#getConfigOverrides()`; restarts the app, so use sparingly.
- Transactions: `@TestTransaction` rolls back after the test.
- `@QuarkusIntegrationTest` runs against the packaged artifact (jar, native binary or container); you cannot inject beans there, only call it over HTTP.

## Test resources

```java
public class WireMockResource implements QuarkusTestResourceLifecycleManager {
    public Map<String,String> start() { /* start, return config overrides */ return Map.of(); }
    public void stop() { }
}

@QuarkusTest
@WithTestResource(WireMockResource.class)   // io.quarkus.test.common.WithTestResource
class MyTest { }
```

`@WithTestResource` (the upstream author tested it on 3.40.1) applies to the annotated test class; Quarkus restarts the app when the set of resources changes. The older `@QuarkusTestResource` still compiles and runs on 3.40.1 but applies globally to all tests unless `restrictToAnnotatedClass = true`. Do not put `@ConfigProperty` injection points for resource-supplied values in a test class: test classes are scanned as beans, and the app fails to start for other test classes that lack the resource. Prefer Dev Services over custom resources when an extension supports it.

## Running

```bash
./mvnw test                 # unit/@QuarkusTest
./mvnw verify -DskipITs=false  # also runs *IT via maven-failsafe-plugin
```

Gotcha: `*IT` classes (`@QuarkusIntegrationTest`) are run by Failsafe in the `verify` phase, and need the `quarkus-maven-plugin` `build` goal and the failsafe config (with `java.util.logging.manager` and `maven.home` system properties) generated by the project template. `./mvnw test` silently skips them, and the 3.27 and 3.40 templates also set `<skipITs>true</skipITs>`, so plain `./mvnw verify` skips them too (per the upstream author's tests): pass `-DskipITs=false` (or `-Dnative`, whose profile flips it). With `-Dnative` and a container build on macOS or Windows, the binary is a Linux ELF and the IT fails with `Exit code is: '126'`; use a local Mandrel/GraalVM build for those.

Continuous testing: run `./mvnw quarkus:dev` and press `r` to start or re-run tests and `p` to pause them (`h` lists the hotkeys); once running, tests re-run on code changes (`quarkus.test.continuous-testing=enabled|paused|disabled`).

Upstream author's test notes, as of commit 613efc8 (not rerun by AI Blocks or on the user's setup), Quarkus 3.40.1 (JDK 26, Docker Desktop): `@QuarkusTest` with Dev Services PostgreSQL (`postgres:18` by default), `@TestTransaction`, `@TestProfile`, `@TestSecurity`, `@InjectMock`, `*IT` via Failsafe. `@QuarkusTest` and Dev Services on 3.27.6 as well.

## Checklist

- Use Dev Services before writing a custom resource.
- Keep `@QuarkusTest` classes sharing the same profile/resources to avoid restarts.
- Do not hard-code ports; RestAssured uses `quarkus.http.test-port` automatically.

See also: <https://quarkus.io/guides/dev-services>, <https://quarkus.io/guides/getting-started-testing>; for upgrades use `quarkus update` (<https://quarkus.io/guides/update-quarkus>).
