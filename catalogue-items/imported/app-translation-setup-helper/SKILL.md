---
name: i18n-localization
description: "Internationalization and localization patterns. Detecting hardcoded strings, managing translations, locale files, RTL support."
risk: safe
source: community
date_added: "2026-02-27"
---

# i18n & Localization

> Internationalization (i18n) and Localization (L10n) best practices.

This skill prepares an app to be translated. It finds text written straight into screens, moves it into translation files, and sets up the folders and patterns for each language. It does not translate the text itself. Say so in your reply, and point to the Translator item for the translation.

---

## Before you start

Ask once for anything missing. Never guess.

1. **The project folder.** If you cannot read it, stop and ask for the files.
2. **Languages to support.** The source language and each new one, such as English to Turkish and Arabic. If the user has none yet, set up the structure for the source language only.
3. **Framework.** React, Next.js, Vue or Python. Look at `package.json` or the imports to find out. If it is something else, say so and give the closest pattern.
4. **Existing translation files (optional).** Read them first and keep their key style.

## When not to use

- An app that will only ever be in one language, with no plan to change. Say it is not needed yet and stop. The table in section 2 helps decide.
- You only want text translated: use the Translator item.
- You want translations checked across languages: use the Check translation parity across three languages item.

---

## Steps

1. **Run the checker.** `python scripts/i18n_checker.py <project_path>` finds likely hardcoded strings and compares locale files. It needs Python 3. If you cannot run code, read the screen files yourself and say you did.
2. **Treat the checker as a start, not the truth.** It matches simple patterns in React, Vue and Python files. It can miss strings and flag ones that are not user text. Open each file it flags before you change anything.
3. **List what you found** in the table under "Output".
4. **Propose a key for each string,** grouped by feature (common, auth, errors). Keep keys short and stable, such as `auth.login.submit`. Never build a sentence from joined pieces.
5. **Set up the folders** as in section 4, with one folder per language.
6. **Show the code change** for one screen as a before and after, then apply it everywhere only if the user agrees.
7. **Run the checker again** and report what is left.

---

## Output

Reply with these four parts, in this order.

**1. Hardcoded strings found**

| File | Line | Text | Proposed key | File for key |
|---|---|---|---|---|
| `<path>` | `<line>` | `<the text>` | `<namespace.key>` | `<locales/en/file.json>` |

**2. Locale file structure.** The folder tree you set up or propose, in the shape of section 4.

**3. One before and after.** For example:

```tsx
// Before
<button>Save changes</button>

// After
<button>{t('common.save')}</button>
```
```json
// locales/en/common.json
{ "save": "Save changes" }
// locales/ar/common.json (same key, translated text goes here)
{ "save": "" }
```

Leave other languages' values empty or marked "TODO translate". Never invent translations.

**4. Right-to-left checklist** (only if Arabic, Hebrew or similar is on the list): which CSS and icons need to change, by file.

End with a "Next" line: the first thing to do (usually send the locale files to a translator or the Translator item), and any strings you were unsure about.

---

## 1. Core Concepts

| Term | Meaning |
|------|---------|
| **i18n** | Internationalization - making app translatable |
| **L10n** | Localization - actual translations |
| **Locale** | Language + Region (en-US, tr-TR) |
| **RTL** | Right-to-left languages (Arabic, Hebrew) |

---

## 2. When to Use i18n

| Project Type | i18n Needed? |
|--------------|--------------|
| Public web app | Yes |
| SaaS product | Yes |
| Internal tool | Maybe |
| Single-region app | Consider future |
| Personal project | Optional |

---

## 3. Implementation Patterns

### React (react-i18next)

```tsx
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

### Next.js (next-intl)

```tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('Home');
  return <h1>{t('title')}</h1>;
}
```

### Python (gettext)

```python
from gettext import gettext as _

print(_("Welcome to our app"))
```

---

## 4. File Structure

```
locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   └── errors.json
├── tr/
│   ├── common.json
│   ├── auth.json
│   └── errors.json
└── ar/          # RTL
    └── ...
```

---

## 5. Best Practices

### Do

- Use translation keys, not raw text
- Namespace translations by feature
- Support pluralization
- Handle date/number formats per locale
- Plan for RTL from the start
- Use ICU message format for complex strings

### Don't

- Hardcode strings in components
- Concatenate translated strings
- Assume text length. Some languages, such as German, often run longer than English, so leave room in buttons and menus
- Forget about RTL layout
- Mix languages in same file

---

## 6. Common Issues

| Issue | Solution |
|-------|----------|
| Missing translation | Fallback to default language |
| Hardcoded strings | Use linter/checker script |
| Date format | Use Intl.DateTimeFormat |
| Number format | Use Intl.NumberFormat |
| Pluralization | Use ICU message format |

---

## 7. RTL Support

```css
/* CSS Logical Properties */
.container {
  margin-inline-start: 1rem;  /* Not margin-left */
  padding-inline-end: 1rem;   /* Not padding-right */
}

[dir="rtl"] .icon {
  transform: scaleX(-1);
}
```

---

## 8. Checklist

Before shipping:

- [ ] All user-facing strings use translation keys
- [ ] Locale files exist for all supported languages
- [ ] Date/number formatting uses Intl API
- [ ] RTL layout tested (if applicable)
- [ ] Fallback language configured
- [ ] No hardcoded strings in components

---

## Script

| Script | Purpose | Command |
|--------|---------|---------|
| `scripts/i18n_checker.py` | Detect hardcoded strings & missing translations | `python scripts/i18n_checker.py <project_path>` |

## Limitations

- The checker covers React, Vue and Python files. Other languages need a manual read.
- The output is a plan and a first pass. Have a native speaker review the real translations and the RTL layout before you ship.
- Stop and ask if the project folder, the languages or the framework are missing.
