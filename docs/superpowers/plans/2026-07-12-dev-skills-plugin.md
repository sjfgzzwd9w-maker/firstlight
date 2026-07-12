# dev-skills Plugin Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone git repo at `~/dev-skills` scaffolded as a Claude Code plugin (mirroring superpowers' plugin/hook mechanism), seeded with copies of three superpowers skills, ready to be registered as a local marketplace plugin whenever the user chooses — registration itself is NOT part of this plan.

**Architecture:** A plugin directory with `.claude-plugin/plugin.json` + `marketplace.json` for discovery, a `hooks/session-start` bash script that injects the `using-dev-skills` skill content on `SessionStart` (same JSON-emission pattern as superpowers, trimmed to the Claude-Code-on-macOS case), and a `skills/` directory holding `using-dev-skills` plus verbatim copies of `writing-skills`, `test-driven-development`, and `systematic-debugging` from `~/superpowers/skills`.

**Tech Stack:** Bash, JSON, Markdown (SKILL.md / plugin manifests), git.

## Global Constraints

- Repo location: `~/dev-skills` (i.e. `/Users/saitanikonda/dev-skills`), a new standalone git repo — not nested inside `stardance`.
- Plugin name: `dev-skills`, version `0.1.0`.
- Only the Unix/Claude Code path of the hook is needed — no Cursor/Windows polyglot handling (per spec).
- Seed skills (`writing-skills`, `test-driven-development`, `systematic-debugging`) are copied byte-for-byte from `~/superpowers/skills/<name>` — do not edit their content in this plan.
- Do NOT add `dev-skills` to `~/.claude/settings.json` `enabledPlugins`, and do NOT run any marketplace-add command. Registration is explicitly deferred to a separate, later step the user triggers themselves.
- Reference spec: `docs/superpowers/specs/2026-07-12-dev-skills-plugin-design.md` (this stardance repo).

---

### Task 1: Initialize the repo and plugin manifest

**Files:**
- Create: `/Users/saitanikonda/dev-skills/.claude-plugin/plugin.json`
- Create: `/Users/saitanikonda/dev-skills/.gitignore`

**Interfaces:**
- Produces: a git repo at `~/dev-skills` with an initial commit containing `plugin.json`, consumed by Task 2 (marketplace.json references this same directory as `source: "./"`).

- [ ] **Step 1: Create the directory and initialize git**

```bash
mkdir -p /Users/saitanikonda/dev-skills
cd /Users/saitanikonda/dev-skills
git init
```

Expected: `Initialized empty Git repository in /Users/saitanikonda/dev-skills/.git/`

- [ ] **Step 2: Create `.claude-plugin/plugin.json`**

```bash
mkdir -p /Users/saitanikonda/dev-skills/.claude-plugin
```

Write `/Users/saitanikonda/dev-skills/.claude-plugin/plugin.json`:

```json
{
  "name": "dev-skills",
  "description": "Personal skills library for Claude Code, seeded from superpowers",
  "version": "0.1.0",
  "license": "MIT"
}
```

- [ ] **Step 3: Add a minimal `.gitignore`**

Write `/Users/saitanikonda/dev-skills/.gitignore`:

```
.DS_Store
```

- [ ] **Step 4: Verify the JSON is valid**

```bash
python3 -m json.tool /Users/saitanikonda/dev-skills/.claude-plugin/plugin.json > /dev/null && echo VALID
```

Expected: `VALID`

- [ ] **Step 5: Commit**

```bash
cd /Users/saitanikonda/dev-skills
git add .claude-plugin/plugin.json .gitignore
git commit -m "Initialize dev-skills plugin scaffold"
```

---

### Task 2: Add the local marketplace manifest

**Files:**
- Create: `/Users/saitanikonda/dev-skills/.claude-plugin/marketplace.json`

**Interfaces:**
- Consumes: `plugin.json`'s `name` (`dev-skills`), `description`, and `version` fields from Task 1 — must match exactly so the marketplace entry and plugin manifest agree.
- Produces: a marketplace manifest that, when later added as a marketplace source, lets `dev-skills` be enabled the same way superpowers is (`dev-skills@dev-skills`) — consumed only when the user chooses to register it (out of scope here).

- [ ] **Step 1: Write `.claude-plugin/marketplace.json`**

```json
{
  "name": "dev-skills",
  "description": "Local marketplace for the dev-skills personal plugin",
  "owner": {
    "name": "Ajay Tanikonda",
    "email": "ajay.tani@gmail.com"
  },
  "plugins": [
    {
      "name": "dev-skills",
      "description": "Personal skills library for Claude Code, seeded from superpowers",
      "version": "0.1.0",
      "source": "./"
    }
  ]
}
```

- [ ] **Step 2: Verify the JSON is valid and the name matches plugin.json**

```bash
python3 -c "
import json
p = json.load(open('/Users/saitanikonda/dev-skills/.claude-plugin/plugin.json'))
m = json.load(open('/Users/saitanikonda/dev-skills/.claude-plugin/marketplace.json'))
assert p['name'] == m['plugins'][0]['name'] == 'dev-skills'
assert p['version'] == m['plugins'][0]['version']
print('OK')
"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd /Users/saitanikonda/dev-skills
git add .claude-plugin/marketplace.json
git commit -m "Add local marketplace manifest"
```

---

### Task 3: Add the SessionStart hook

**Files:**
- Create: `/Users/saitanikonda/dev-skills/hooks/hooks.json`
- Create: `/Users/saitanikonda/dev-skills/hooks/session-start` (executable)

**Interfaces:**
- Consumes: `skills/using-dev-skills/SKILL.md` (created in Task 4) — the script reads this file path relative to its own location (`${SCRIPT_DIR}/../skills/using-dev-skills/SKILL.md`).
- Produces: on `SessionStart`, JSON on stdout of the form `{"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": "..."}}`, matching the shape Claude Code expects (same as superpowers' hook).

- [ ] **Step 1: Create `hooks/hooks.json`**

```bash
mkdir -p /Users/saitanikonda/dev-skills/hooks
```

Write `/Users/saitanikonda/dev-skills/hooks/hooks.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/session-start\"",
            "async": false
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Write `hooks/session-start`**

```bash
#!/usr/bin/env bash
# SessionStart hook for dev-skills plugin
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

using_dev_skills_content=$(cat "${PLUGIN_ROOT}/skills/using-dev-skills/SKILL.md" 2>&1 || echo "Error reading using-dev-skills skill")

escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

using_dev_skills_escaped=$(escape_for_json "$using_dev_skills_content")
session_context="<EXTREMELY_IMPORTANT>\nYou have dev-skills.\n\n**Below is the full content of your 'dev-skills:using-dev-skills' skill:**\n\n${using_dev_skills_escaped}\n</EXTREMELY_IMPORTANT>"

printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$session_context"

exit 0
```

- [ ] **Step 3: Make it executable**

```bash
chmod +x /Users/saitanikonda/dev-skills/hooks/session-start
```

- [ ] **Step 4: Verify both hooks.json is valid JSON**

```bash
python3 -m json.tool /Users/saitanikonda/dev-skills/hooks/hooks.json > /dev/null && echo VALID
```

Expected: `VALID`

(The `session-start` script itself can't be fully verified until Task 4 creates the file it reads — full end-to-end verification happens in Task 6.)

- [ ] **Step 5: Commit**

```bash
cd /Users/saitanikonda/dev-skills
git add hooks/hooks.json hooks/session-start
git commit -m "Add SessionStart hook"
```

---

### Task 4: Write the using-dev-skills enforcement skill

**Files:**
- Create: `/Users/saitanikonda/dev-skills/skills/using-dev-skills/SKILL.md`

**Interfaces:**
- Produces: the file `hooks/session-start` (Task 3) reads and injects verbatim at session start.

- [ ] **Step 1: Create the skill directory and file**

```bash
mkdir -p /Users/saitanikonda/dev-skills/skills/using-dev-skills
```

Write `/Users/saitanikonda/dev-skills/skills/using-dev-skills/SKILL.md`:

```markdown
---
name: using-dev-skills
description: Use when starting any conversation - checks for the user's personal dev-skills before acting
---

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance one of your personal dev-skills might apply to what you are doing, you ABSOLUTELY MUST invoke it via the Skill tool.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.
</EXTREMELY-IMPORTANT>

## The Rule

Invoke relevant dev-skills BEFORE any response or action — including clarifying questions or exploring the codebase. If it turns out wrong for the situation, you don't have to use it.

This works alongside superpowers: superpowers' process skills (brainstorming, systematic-debugging, etc.) still take priority for their own domains. Check both plugins' skill lists.

## Red Flags

These thoughts mean STOP—you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
```

- [ ] **Step 2: Verify frontmatter parses**

```bash
python3 -c "
import re
text = open('/Users/saitanikonda/dev-skills/skills/using-dev-skills/SKILL.md').read()
assert text.startswith('---\n')
assert 'name: using-dev-skills' in text
assert 'description:' in text
print('OK')
"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd /Users/saitanikonda/dev-skills
git add skills/using-dev-skills/SKILL.md
git commit -m "Add using-dev-skills enforcement skill"
```

---

### Task 5: Copy the seed skills from superpowers

**Files:**
- Create: `/Users/saitanikonda/dev-skills/skills/writing-skills/` (full directory copy)
- Create: `/Users/saitanikonda/dev-skills/skills/test-driven-development/` (full directory copy)
- Create: `/Users/saitanikonda/dev-skills/skills/systematic-debugging/` (full directory copy)

**Interfaces:**
- Consumes: `~/superpowers/skills/{writing-skills,test-driven-development,systematic-debugging}` as the copy source (read-only — do not modify the superpowers repo).
- Produces: three complete skill directories under `dev-skills/skills/`, each with an unmodified `SKILL.md` plus their original supporting files, discoverable by Claude Code's skill listing once the plugin is registered.

- [ ] **Step 1: Copy the three skill directories**

```bash
cp -R /Users/saitanikonda/superpowers/skills/writing-skills /Users/saitanikonda/dev-skills/skills/writing-skills
cp -R /Users/saitanikonda/superpowers/skills/test-driven-development /Users/saitanikonda/dev-skills/skills/test-driven-development
cp -R /Users/saitanikonda/superpowers/skills/systematic-debugging /Users/saitanikonda/dev-skills/skills/systematic-debugging
```

- [ ] **Step 2: Verify each copy's SKILL.md matches the source byte-for-byte**

```bash
for s in writing-skills test-driven-development systematic-debugging; do
  diff /Users/saitanikonda/superpowers/skills/$s/SKILL.md /Users/saitanikonda/dev-skills/skills/$s/SKILL.md \
    && echo "OK: $s"
done
```

Expected: `OK: writing-skills`, `OK: test-driven-development`, `OK: systematic-debugging` (no diff output before each OK line)

- [ ] **Step 3: Verify no stray git metadata was copied**

```bash
find /Users/saitanikonda/dev-skills/skills -iname ".git*"
```

Expected: no output (superpowers skill dirs don't contain nested `.git` — this just confirms it)

- [ ] **Step 4: Commit**

```bash
cd /Users/saitanikonda/dev-skills
git add skills/writing-skills skills/test-driven-development skills/systematic-debugging
git commit -m "Seed dev-skills with copies of writing-skills, test-driven-development, systematic-debugging"
```

---

### Task 6: End-to-end verification of the hook

**Files:**
- None created — this task only runs and inspects existing files from Tasks 3–5.

**Interfaces:**
- Consumes: `hooks/session-start` (Task 3), `skills/using-dev-skills/SKILL.md` (Task 4).

- [ ] **Step 1: Run the hook script directly and capture output**

```bash
cd /Users/saitanikonda/dev-skills
./hooks/session-start > /tmp/dev-skills-hook-output.json
echo "exit code: $?"
```

Expected: `exit code: 0`

- [ ] **Step 2: Verify the output is valid JSON with the expected shape**

```bash
python3 -c "
import json
d = json.load(open('/tmp/dev-skills-hook-output.json'))
out = d['hookSpecificOutput']
assert out['hookEventName'] == 'SessionStart'
assert 'using-dev-skills' in out['additionalContext']
assert 'dev-skills' in out['additionalContext']
print('OK')
"
```

Expected: `OK`

- [ ] **Step 3: Clean up the temp file**

```bash
rm /tmp/dev-skills-hook-output.json
```

No commit for this task — verification only, nothing changed.

---

### Task 7: Write a minimal README

**Files:**
- Create: `/Users/saitanikonda/dev-skills/README.md`

**Interfaces:**
- None — documentation only.

- [ ] **Step 1: Write `README.md`**

```markdown
# dev-skills

Personal Claude Code skills plugin, structured like [superpowers](https://github.com/obra/superpowers).

## Status

Scaffolded but **not yet registered** as an active plugin. To activate:

1. Add this directory as a local marketplace source.
2. Add `"dev-skills@dev-skills": true` to `enabledPlugins` in `~/.claude/settings.json`.
3. Start a new Claude Code session to trigger the SessionStart hook.

## Skills

- `using-dev-skills` — enforcement rule, injected on session start.
- `writing-skills`, `test-driven-development`, `systematic-debugging` — copied verbatim from superpowers as reference templates. Replace or extend with your own.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saitanikonda/dev-skills
git add README.md
git commit -m "Add README"
```

---

## Explicitly out of scope

- Adding `~/dev-skills` as a marketplace source.
- Editing `~/.claude/settings.json` `enabledPlugins`.
- Starting a new Claude Code session to test live discovery.

These are left for the user to trigger explicitly when they want the plugin active.
