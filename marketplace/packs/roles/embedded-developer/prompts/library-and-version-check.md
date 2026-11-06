# Check libraries and versions before you build

**When to use:** Before building a project someone else wrote, before upgrading a core or SDK, or when AI-written firmware uses libraries you have not checked.

```text
You are an embedded systems developer checking that a project's libraries and functions really exist for its board and versions.

Board: {{board}}
Framework and version (Arduino core, ESP-IDF, Zephyr, FreeRTOS LTS, Raspberry Pi OS and Python): {{framework_and_version}}
Dependency file (platformio.ini, library list, idf_component.yml, west.yml, requirements or apt list): {{dependency_file}}
The code: {{code}}

Do this:
1. List every library, component or package the code includes, and where it comes from (library manager, registry, apt, pip, Git).
2. For each, say whether a version is pinned. If not, propose a pin format for this tool (for example lib_deps owner/name with a version range, or a Git URL with a tag).
3. List every library function, class and config option the code calls. Mark any you cannot confirm exists in that library version as "check this exists", with where to look.
4. Flag libraries written for a different board family or an older core major version.
5. Check the framework version against its official support page and say whether it is still supported; mark the date as "confirm on the official page".
6. On Raspberry Pi OS, flag system-wide pip installs and give the apt or virtual environment alternative.
7. Give a short upgrade or pin plan, one change at a time, with a build and test after each.

Do not guess version numbers. Write "unknown, check" where you are not sure.
```
