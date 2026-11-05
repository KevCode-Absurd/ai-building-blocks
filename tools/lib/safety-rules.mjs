// The rules behind tools/safety-scan.mjs. Static patterns only: nothing here runs, imports or fetches an item's code.
// A match is a candidate for a person to review, not a verdict. Severity:
//   critical  almost never legitimate in a shared skill (remote code, hidden payloads, credential theft, miners)
//   high      can be legitimate, but someone must look (destructive commands, persistence, opaque binaries)
//   medium    worth a note on the page (shorteners, raw IPs, unpinned installs)
// Capabilities are not findings: they describe what an item can do, and become its guardrails.
export const RULES_VERSION = "2026-11-05.1";

const re = (s, f = "i") => new RegExp(s, f);

// Places that only make sense as a drop box for stolen data, a tunnel, or a paste host.
export const EXFIL_HOSTS = ["webhook.site", "requestbin", "pipedream.net", "ngrok.io", "ngrok-free.app", "ngrok.app", "trycloudflare.com",
  "pastebin.com", "hastebin", "paste.ee", "transfer.sh", "file.io", "0x0.st", "interact.sh", "oast.fun", "oast.pro", "oast.live", "oastify.com",
  "burpcollaborator", "beeceptor.com", "serveo.net", "loca.lt", "localtunnel.me", "canarytokens", "discord.com/api/webhooks",
  "discordapp.com/api/webhooks", "api.telegram.org/bot", "hookbin.com", "requestcatcher.com", "ipinfo.io/json", "anonfiles", "gofile.io"];
export const SHORTENERS = ["bit.ly", "tinyurl.com", "goo.gl", "t.co/", "is.gd", "ow.ly", "buff.ly", "rebrand.ly", "cutt.ly", "shorturl.at", "rb.gy", "tiny.cc"];

/** Rules over every text file. `where`: "script" (code files), "doc" (markdown and text an AI reads), or "any". */
export const RULES = [
  // Remote code and hidden payloads
  { id: "remote-shell", severity: "critical", where: "any", title: "Downloads code and runs it straight away",
    re: re(String.raw`(?:curl|wget)\b[^\n|]{0,300}\|\s*(?:sudo\s+)?(?:ba|z|da)?sh\b|(?:irm|iwr|Invoke-WebRequest|Invoke-RestMethod|DownloadString)\b[^\n]{0,300}\|\s*(?:iex|Invoke-Expression)\b|\biex\s*\(\s*(?:New-Object\s+Net\.WebClient|irm|iwr)`) },
  { id: "encoded-execution", severity: "critical", where: "any", title: "Runs code that is hidden by encoding",
    re: re(String.raw`(?:eval|exec)\s*\(\s*(?:(?:base64|b64|codecs|zlib|marshal|bz2|lzma)\.|atob\s*\(|Buffer\.from\s*\(|bytes\.fromhex|__import__\s*\(\s*['"](?:base64|zlib|marshal)|compile\s*\(\s*(?:base64|zlib))|powershell[^\n]{0,80}\s-e(?:nc(?:odedcommand)?)?\s+[A-Za-z0-9+/=]{20,}|marshal\.loads\s*\(|exec\s*\(\s*["'][^"']{0,20}\\x[0-9a-f]{2}`) },
  { id: "reverse-shell", severity: "critical", where: "any", title: "Opens a remote control connection",
    re: re(String.raw`/dev/tcp/\d|\bnc(?:at)?\b[^\n]{0,60}\s-(?:e|c)\s+(?:/bin/)?(?:ba)?sh|bash\s+-i\s+>&|socket\.socket\([^\n]*\)[\s\S]{0,200}?(?:pty\.spawn|subprocess\.call\(\s*\[\s*["']/bin/(?:ba)?sh)|os\.dup2\s*\(\s*\w+\.fileno\(\)`) },
  { id: "crypto-miner", severity: "critical", where: "any", title: "Mentions cryptocurrency mining software",
    re: re(String.raw`\bxmrig\b|stratum\+(?:tcp|ssl)://|\bminerd\b|\bcryptonight\b|coinhive|\bnicehash\b`) },
  { id: "exfil-host", severity: "critical", where: "script", title: "Sends data to a drop box, tunnel or paste site",
    re: re(EXFIL_HOSTS.map((h) => h.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|")) },
  { id: "credential-theft", severity: "critical", where: "script", title: "Reads saved passwords, keys or browser cookies",
    re: re(String.raw`\.ssh/(?:id_[a-z0-9]+|authorized_keys)|\.aws/credentials|\.netrc\b|\.docker/config\.json|\.kube/config|Login Data|Local State['"]|\bCookies['"]\s*\)|security\s+find-(?:generic|internet)-password|wallet\.dat|\bkeychain\b[^\n]{0,40}(?:dump|export)|Library/Keychains|AppData[\\/]+(?:Local|Roaming)[\\/]+(?:Google|Microsoft|Mozilla|BraveSoftware)[\\/]|\.mozilla/firefox|lsass|mimikatz`) },
  { id: "persistence", severity: "high", where: "any", title: "Sets itself to start again later or on login",
    re: re(String.raw`crontab\s+(?:-l\s*\|[^\n]*\|\s*crontab|-[a-z]*\s+-?\s*$|-\s)|launchctl\s+(?:load|bootstrap)|Library/LaunchAgents|systemctl\s+(?:--user\s+)?enable|schtasks\s+/create|CurrentVersion\\\\?Run\b|>>\s*~?/?\S*\.(?:bashrc|zshrc|bash_profile|profile)\b|Start Menu\\\\?Programs\\\\?Startup`) },
  { id: "destructive-command", severity: "high", where: "any", title: "Can delete files or rewrite history",
    re: re(String.raw`\brm\s+-[a-z]*(?:rf|fr)[a-z]*\s+(?:/|~|\$HOME|\*|\.\s|\$\{?[A-Z_]+\}?/?\s*$)|shutil\.rmtree\s*\(\s*(?:os\.path\.expanduser\(\s*["']~|["']/["']|Path\.home\(\))|\bmkfs\.|\bdd\s+if=[^\n]*of=/dev/(?:sd|nvme|disk)|\bformat\s+[a-z]:\s*/[qy]|Remove-Item\b[^\n]*-Recurse[^\n]*(?:\$env:USERPROFILE|C:\\\\|~)|git\s+push\s+(?:-f|--force)(?:\s|$)|\bDROP\s+(?:DATABASE|SCHEMA)\b|del\s+/[sq]\s+/[sq]`) },
  { id: "privilege", severity: "medium", where: "script", title: "Asks for administrator rights",
    re: re(String.raw`\bsudo\s+(?!-n\s+true)|chmod\s+(?:-R\s+)?777|Set-ExecutionPolicy\s+(?:Unrestricted|Bypass)|runas\s+/user`) },
  { id: "download-and-run", severity: "high", where: "any", title: "Downloads a program and makes it runnable",
    re: re(String.raw`(?:curl|wget)\b[^\n]{0,200}(?:-o|-O|>)\s*\S+[^\n]{0,120}(?:&&|;)\s*chmod\s+\+x|urlretrieve\([^\n]*\)[\s\S]{0,120}?(?:os\.chmod|subprocess)`) },
  { id: "raw-ip-url", severity: "medium", where: "any", title: "Connects to a bare IP address instead of a named site",
    re: re(String.raw`https?://(?!127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|169\.254\.)(?:\d{1,3}\.){3}\d{1,3}`) },
  { id: "url-shortener", severity: "medium", where: "any", title: "Uses a link shortener that hides where it goes",
    re: re(String.raw`https?://(?:www\.)?(?:${SHORTENERS.map((h) => h.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|")})`) },
  { id: "unpinned-remote-install", severity: "medium", where: "any", title: "Installs a package straight from a web address",
    re: re(String.raw`pip3?\s+install\s+(?:-[^\s]+\s+)*(?:git\+|https?://)|npm\s+(?:i|install)\s+(?:-g\s+)?https?://|npx\s+(?:-y\s+)?github:`) },
  { id: "credential-in-file", severity: "high", where: "any", title: "Contains what looks like a real secret key",
    re: re(String.raw`\b(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{32,}|gh[pousr]_[A-Za-z0-9]{36,}|AKIA[A-Z0-9]{16}|xox[baprs]-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{35}|sk_live_[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)`, "") },

  // A note asking a scanner to skip a line is reported, never obeyed: every line is scanned anyway.
  { id: "scanner-suppression", severity: "medium", where: "any", title: "Has a note asking security scanners to skip a line",
    re: re(String.raw`noqa:\s*SEC|auditor:\s*ignore|security-allowlist|#\s*nosec\b|(?:scanner|safety-scan|semgrep)\s*:\s*(?:ignore|skip|off)|nosemgrep`) },

  // Prompt injection: text that tries to take over the AI that reads it
  { id: "instruction-override", severity: "critical", where: "doc", title: "Tells the AI to ignore its rules",
    re: re(String.raw`\b(?:ignore|disregard|forget|override)\s+(?:all\s+|any\s+|the\s+|your\s+)?(?:previous|prior|above|earlier|system|developer|safety|original)\s+(?:instructions|rules|prompts?|guidelines|messages)`) },
  { id: "role-hijack", severity: "high", where: "doc", title: "Tries to replace the AI's instructions",
    re: re(String.raw`\b(?:you are no longer|from now on,? you (?:will|must) ignore|new system prompt|enter (?:developer|god|DAN) mode|jailbreak(?:ed)? mode|act as an? unrestricted)`) },
  { id: "concealed-action", severity: "critical", where: "doc", title: "Tells the AI to hide what it does",
    re: re(String.raw`\b(?:silently|secretly|covertly|quietly)\s+(?:send|upload|post|forward|delete|install|exfiltrate|copy|email|transmit|run|execute)(?![a-z])|(?:do not|don't|never)\s+(?:tell|inform|notify|mention (?:this |it )?to|reveal (?:this |it )?to)\s+(?:the\s+)?user|without\s+(?:telling|notifying|asking|informing)\s+(?:the\s+)?user|hidden\s+(?:recipient|bcc|cc)`) },
  { id: "approval-bypass", severity: "high", where: "doc", title: "Tells the AI to skip safety checks or approvals",
    re: re(String.raw`\b(?:skip|bypass|disable|turn off)\s+(?:all\s+|any\s+)?(?:approvals?|confirmations?|permission (?:prompts|checks)|security checks?|safety (?:checks?|filters?))\b|--dangerously-skip-permissions|--no-verify\b|--yolo\b`) },
  { id: "data-exfil-instruction", severity: "critical", where: "doc", title: "Tells the AI to send private data somewhere",
    re: re(String.raw`\b(?:send|post|upload|forward|email|transmit|copy|paste)\s+(?:the\s+|all\s+|any\s+|your\s+|their\s+)?(?:full\s+)?(?:conversation|chat history|system prompt|api keys?|credentials|passwords?|secrets|tokens|\.env|environment variables|ssh keys?|cookies)\s+(?:\w+\s+){0,3}(?:to|into)\s+(?:https?://|this url|the url|an? (?:external|remote))`) },
  { id: "remote-instructions", severity: "high", where: "doc", title: "Tells the AI to fetch and obey instructions from the web",
    re: re(String.raw`\b(?:fetch|download|curl|load|read)\s+(?:the\s+)?(?:latest\s+)?(?:instructions|prompt|rules|commands)\s+from\s+https?://|follow (?:any|all|the) instructions (?:found |contained )?(?:at|in|on) (?:https?://|the (?:url|page|website))`) },
  { id: "hidden-text-instruction", severity: "critical", where: "doc", title: "Hides instructions in a comment the reader can't see",
    // Our own markers ("written by tools/add-needs.mjs for AI Blocks", "Modified by AI Blocks", licence notes) are left out.
    re: re(String.raw`<!--(?![^>]{0,200}?(?:for AI Blocks|by AI Blocks|\(AI Blocks\)))[^>]{0,400}?\b(?:ignore|disregard|override|secretly|silently|system prompt|you must|do not tell|don't tell|execute|exfiltrat\w*|upload|curl|wget|api key|password|instead,? (?:output|reply|respond|say|send))\b[^>]{0,400}?-->`) },
];

// Invisible characters that can hide text from a human reader but not from a model.
export const INVISIBLE = [
  { id: "bidirectional-control", severity: "critical", title: "Uses hidden text-direction characters", re: /[\u202a-\u202e\u2066-\u2069]/ },
  { id: "unicode-tag-chars", severity: "critical", title: "Uses invisible tag characters that can carry hidden text", re: /[\u{E0000}-\u{E007F}]/u },
  { id: "zero-width-run", severity: "high", title: "Has a run of zero-width characters", re: /[\u200b-\u200f\u2060-\u2064\ufeff]{3,}/ },
];

/** Files that can't be read as text: they ship as opaque code or data, so a person must vouch for them. */
export const OPAQUE = [
  { id: "binary-executable", severity: "critical", title: "Includes a program file", re: /\.(?:exe|dll|msi|scr|com|lnk|so|dylib|bin|elf|app|dmg|pkg|deb|rpm|apk)$/i },
  { id: "compiled-code", severity: "high", title: "Includes compiled code that can't be read", re: /\.(?:pyc|pyo|class|jar|wasm|p|mex\w*)$/i },
  { id: "pickle-file", severity: "high", title: "Includes a Python pickle, which can run code when opened", re: /\.(?:pkl|pickle|joblib|pt|pth|ckpt)$/i },
  { id: "macro-document", severity: "high", title: "Includes an Office file that can hold macros", re: /\.(?:xlsm|xlsb|docm|pptm|dotm|xltm|xla|xlam)$/i },
  { id: "archive", severity: "medium", title: "Includes an archive whose contents weren't scanned", re: /\.(?:zip|tar|gz|tgz|7z|rar|bz2|xz)$/i },
];

export const SCRIPT_EXT = /\.(?:py|[cm]?js|jsx|tsx?|sh|bash|zsh|ps1|psm1|bat|cmd|rb|go|rs|php|pl|lua|r|m|swift|kt|java|cs|c|cc|cpp|h|sql|ipynb|applescript|vbs)$/i;
export const TEXT_EXT = /\.(?:md|markdown|txt|ya?ml|json|toml|ini|cfg|conf|csv|tsv|html?|xml|svg|tex|sty|bib|bst|cls|template|tmpl|j2|env\.example|gitignore|rst|org|adoc)$/i;
export const IMAGE_FONT_EXT = /\.(?:png|jpe?g|gif|webp|ico|bmp|tiff?|ttf|otf|woff2?|eot|mp3|wav|mp4|mov|pdf|xlsx|docx|pptx)$/i;

/** Words near a match that mean the text is warning against the thing, or showing an attack to defend against. */
export const GUARD_CONTEXT = /\b(?:never|do not|don't|must not|should not|forbid|prohibit|refuse|reject|block|detect|flag|watch (?:out )?for|example (?:of )?(?:an? )?(?:attack|injection|payload)|attackers?|malicious|prompt injection|injection attempt|red[- ]team|jailbreak attempts?|untrusted|phishing|warning|dangerous|avoid|e\.g\.|such as|like "|pattern|regex|signature|scanner|audit)\b/i;

/** Capabilities: what an item's files let it do. Each becomes one plain guardrail on its page. */
export const CAPABILITIES = [
  { id: "network", where: "script", re: re(String.raw`\b(?:requests\.(?:get|post|put|patch|delete|request)|httpx\.|urllib\.request|urlopen\(|http\.client|aiohttp\.|fetch\s*\(|axios\.|got\(|node-fetch|XMLHttpRequest|WebSocket\(|curl\s|wget\s|Invoke-WebRequest|Invoke-RestMethod|smtplib|socket\.connect)`) },
  { id: "shell", where: "script", re: re(String.raw`\bsubprocess\.|os\.system\(|os\.popen\(|child_process|execSync\(|spawnSync?\(|\bexec\(\s*["'\`]|Runtime\.getRuntime\(\)\.exec|Start-Process\b|shell=True`) },
  { id: "file-delete", where: "script", re: re(String.raw`\bos\.(?:remove|unlink|rmdir)\(|shutil\.rmtree\(|fs\.(?:rm|rmSync|unlink|unlinkSync|rmdir)\(|\.unlink\(\)|\brm\s+-|Remove-Item\b|\bdel\s`) },
  { id: "file-write", where: "script", re: re(String.raw`open\([^)]*["'][wa]b?\+?["']|\.write_text\(|\.write_bytes\(|fs\.(?:write|writeFile|writeFileSync|appendFile)|>\s*[\w./-]+\.\w+|Set-Content|Out-File|to_csv\(|to_excel\(|\.save\(`) },
  { id: "secrets", where: "any", re: re(String.raw`\b[A-Z][A-Z0-9_]{2,}_(?:API_KEY|TOKEN|SECRET|KEY|PASSWORD)\b|os\.environ\[|os\.getenv\(|process\.env\.|\$env:[A-Z_]+(?:KEY|TOKEN)`) },
  { id: "installs", where: "any", re: re(String.raw`\b(?:pip3?|uv pip|npm|pnpm|yarn|brew|apt(?:-get)?|choco|winget|cargo|gem|go)\s+(?:install|add|i)\s+[\w@./-]`) },
  { id: "browser", where: "any", re: re(String.raw`\b(?:playwright|puppeteer|selenium|webdriver|chromedp|browser-use)\b`) },
  { id: "messaging", where: "any", re: re(String.raw`\b(?:smtplib|sendgrid|mailgun|nodemailer|twilio|slack_sdk|chat\.postMessage|hooks\.slack\.com|gmail\.users\.messages\.send|resend\.emails)\b`) },
  { id: "payments", where: "any", re: re(String.raw`\b(?:stripe\.(?:charges|paymentIntents|refunds|transfers|payouts)|api\.stripe\.com|paypal|braintree|square\.com/v2/payments)\b`) },
  { id: "database", where: "script", re: re(String.raw`\b(?:INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|DROP\s+TABLE|ALTER\s+TABLE|TRUNCATE)\b`, "") },
  { id: "git", where: "any", re: re(String.raw`\bgit\s+(?:push|commit|reset|rebase|merge)\b`) },
  { id: "untrusted-input", where: "doc", re: re(String.raw`\b(?:scrape|crawl|web ?pages?|fetch(?:es|ed)? (?:the )?url|read (?:the |your )?(?:inbox|emails?)|incoming emails?|customer messages|user[- ]submitted|support tickets|pdfs? (?:you|they) (?:upload|send)|reviews? from|social media posts|search results)\b`) },
];
