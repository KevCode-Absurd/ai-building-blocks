---
name: versioned-save-system
description: Designs and writes a save and load system for a Unity game that survives updates - a plain serializable save model with a version number, files under Application.persistentDataPath, safe writes (temporary file then replace, with one backup), a loader that upgrades old versions step by step and falls back cleanly on a damaged file, optional Steam Cloud setup, and Edit Mode tests that load every save version the game has shipped. Keeps runtime progress out of ScriptableObjects. Opens a pull request at access level 2; merges only at level 3 within the client's limits; deleting or overwriting players' saves needs a fresh yes every time. Use it for a first save system, a save format change, or after reports of lost progress.
---

# Versioned save system

## When to use

- The game needs to save level, currency, owned items, settings or a run in progress.
- A new feature changes what is saved, and old saves must still load.
- Players report lost progress after an update or a crash.
- The game is moving to Steam and needs cloud saves.

## What you need

1. Unity version and target platforms (desktop, mobile, console, web).
2. What must be saved, with types: numbers, lists, IDs of owned items, settings.
3. Every save format already shipped, with a sample file for each (personal data removed).
4. When the game saves: checkpoints, on quit, every few minutes, on purchase.
5. Whether Steam Cloud or another cloud save is wanted.
6. Access: level 1 to read. Level 2 to push a branch and open a pull request. Level 3, within the client's limits, to merge after review and tests pass.

## Steps

### 1. Model the save

- A plain C# class marked `[System.Serializable]`, not a MonoBehaviour and not a ScriptableObject. In a built game, changes to ScriptableObject assets are not saved, so they can't hold progress.
- First field: `int version`. Keep IDs (strings or ints) for items and levels, not object references.
- Keep settings that belong to one machine (resolution, graphics quality) in a separate file from progress, so cloud sync doesn't carry them between PCs.
- Check the serializer's limits. Unity's `JsonUtility` doesn't serialise dictionaries, so store lists of key-value pairs or use another serializer the client approves.

### 2. Choose the location

- Save under `Application.persistentDataPath`. On desktop the path includes the company and product names, so renaming either in Player Settings moves the saves. On mobile it includes an identifier based on the bundle ID: keep that the same across updates.
- Use one file per save slot, plus a small settings file.

### 3. Write safely

1. Serialise to a string.
2. Write it to `slot1.json.tmp`.
3. Copy the current `slot1.json` to `slot1.json.bak` if it exists.
4. Replace `slot1.json` with the temporary file.
5. Log the size and the time.

A crash at any step leaves either the old file or the new one, never half of each. Don't save every frame; save at the moments agreed with the designer.

### 4. Load and upgrade

1. If `slot1.json` is missing, start a new game.
2. Read and parse. If parsing fails, try `slot1.json.bak`; if that fails too, keep both files, start a new game, and show a clear message. Never delete the damaged file automatically.
3. Read `version`. Run each upgrade step in order: 1 to 2, 2 to 3, and so on. Each step is a small, tested function.
4. If the version is newer than the game knows (a player rolled back a beta), don't overwrite it; tell the player and keep the file.

### 5. Add Steam Cloud if wanted

- Steam Auto-Cloud syncs files that match the patterns you set, at launch and exit, with no code. The Steam Cloud API gives more control.
- Steam advises small files, splitting state by how often it changes, leaving out machine-specific settings, and making paths unique per user (for example with the Steam ID placeholder in Auto-Cloud).
- Set the per-user byte and file quotas in Steamworks, and test with cloud support limited to developers before turning it on for players.
- Configuring Steam Cloud for players is a Steamworks setting change: level 3 within the client's limits, or the client applies it.

### 6. Test it

- Edit Mode: round trip (save then load gives the same data).
- Edit Mode: load a fixture file for every version ever shipped and check the upgraded result.
- Edit Mode: a damaged file falls back to the backup; a missing file starts a new game; a newer version is not overwritten.
- Play Mode or manual: kill the game during a save on a test machine and confirm the file survives.

### 7. Act at the right level

- Level 2: open a pull request with the model, the save service, upgrade steps, fixtures and tests.
- Level 3, within the client's limits: merge after review and tests pass.
- Fresh yes every time: anything that deletes or overwrites players' existing saves, and any release that changes the save format (the client approves the release).

## Checks

- A version field exists and every shipped version has a fixture and a passing test.
- Writes go through a temporary file and keep one backup.
- Damaged files are kept, not deleted.
- No progress stored in ScriptableObjects or `PlayerPrefs` (keep `PlayerPrefs` for small settings, if at all).
- Machine-specific settings are kept out of cloud-synced files.
- No personal data in saves beyond what the game needs.

## Output format

1. Save model with field list and the version history table (version, change, upgrade step).
2. Save service code in full.
3. Upgrade steps.
4. Steam Cloud settings to apply, if used.
5. Tests and fixtures, and how to run them.
6. Pull request description and anything needing the client's yes.

## Example of good output (short)

*Illustrative structure, not a real business: a game studio shipping Unity 2022.3 and Unity 6 builds on PC and Android. Copy the shape, never the content: every fact comes from the client's own context.*

> | Version | Change | Upgrade step |
> |---|---|---|
> | 1 | level, coins | none |
> | 2 | added `ownedSkins` (list of IDs) | empty list |
> | 3 | coins split into `softCoins` and `gems` | `softCoins = coins; gems = 0` |

```csharp
[System.Serializable]
public class SaveData
{
    public int version = 3;
    public int level;
    public int softCoins;
    public int gems;
    public List<string> ownedSkins = new();
}

static SaveData Upgrade(SaveData d, string raw)
{
    if (d.version < 2) { d.ownedSkins ??= new(); d.version = 2; }
    if (d.version < 3) { d.softCoins = JsonUtility.FromJson<SaveV2>(raw).coins; d.gems = 0; d.version = 3; }
    return d;
}
```

> **Tests:** `Loads_v1_fixture`, `Loads_v2_fixture`, `Damaged_file_falls_back_to_backup`, `Newer_version_is_not_overwritten`.
