# dev-skills plugin — design

## Context

The user runs Claude Code with the `superpowers` plugin installed from the official
marketplace (source at `~/superpowers`, enabled via `enabledPlugins` in
`~/.claude/settings.json`). Superpowers works by:

1. A `SessionStart` hook (`hooks/session-start`) that reads
   `skills/using-superpowers/SKILL.md` and injects its full contents as
   `hookSpecificOutput.additionalContext` on every session start/clear/compact.
2. That injected content is a hard rule: "if a skill might apply, you MUST use it,"
   plus a pointer to use the `Skill` tool to invoke any other skill by name.
3. Individual skills live as `skills/<name>/SKILL.md` (YAML frontmatter with
   `name` + `description`, then instructions/checklists in the body), optionally
   with supporting scripts/references alongside.
4. Registration happens through `.claude-plugin/plugin.json` (plugin metadata) +
   `.claude-plugin/marketplace.json` (marketplace entry), which is how Claude Code
   discovers and loads the plugin.

The user wants their own plugin, `dev-skills`, that follows this same mechanism but
holds skills they author themselves — separate from superpowers, running alongside
it, not replacing it.

## Goal

Scaffold a new local Claude Code plugin, `dev-skills`, at `~/dev-skills`, structurally
mirroring superpowers' skill-injection mechanism, so the user can add their own
SKILL.md files over time and have Claude reliably discover and apply them.

## Non-goals

- Not replacing or modifying superpowers itself.
- Not writing any brand-new domain skills yet — the plugin is seeded with a few
  skills copied from superpowers as working templates/references, not original
  content.
- Not publishing to a public marketplace — this is a local-only plugin for one user.

## Design

### Directory layout

```
dev-skills/
  .claude-plugin/
    plugin.json
    marketplace.json
  hooks/
    hooks.json
    session-start
  skills/
    using-dev-skills/
      SKILL.md
    writing-skills/         # whole dir copied from superpowers, unmodified
      SKILL.md
      testing-skills-with-subagents.md
      anthropic-best-practices.md
      persuasion-principles.md
      render-graphs.js
      graphviz-conventions.dot
      examples/
    test-driven-development/  # whole dir copied from superpowers, unmodified
      SKILL.md
      testing-anti-patterns.md
    systematic-debugging/     # whole dir copied from superpowers, unmodified
      SKILL.md
      root-cause-tracing.md
      condition-based-waiting.md
      condition-based-waiting-example.ts
      defense-in-depth.md
      find-polluter.sh
      test-pressure-1.md
      test-pressure-2.md
      test-pressure-3.md
      test-academic.md
      CREATION-LOG.md
```

### `.claude-plugin/plugin.json`

Plugin metadata: `name: "dev-skills"`, short description, version `0.1.0`, no
author/homepage required since it's local-only.

### `.claude-plugin/marketplace.json`

A minimal single-plugin marketplace manifest pointing at this same directory, so
the plugin can be registered as a local marketplace source (mirrors
`~/superpowers/.claude-plugin/marketplace.json`'s shape, trimmed to one entry).

### `hooks/hooks.json` + `hooks/session-start`

Same pattern as superpowers, trimmed to the Unix/Claude Code case only (no
Cursor/Windows polyglot handling — the user runs Claude Code on macOS):

- `hooks.json` registers a `SessionStart` hook (matcher
  `startup|clear|compact`) that runs `session-start`.
- `session-start` is a bash script that reads
  `skills/using-dev-skills/SKILL.md`, JSON-escapes it, and emits
  `{"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": "..."}}`.

Because both plugins register independent `SessionStart` hooks, both fire on every
session start and both inject their own `<EXTREMELY_IMPORTANT>` block. Claude Code
does not deduplicate or override between plugins — this has been confirmed by
inspecting how superpowers itself performs this injection (there is no
plugin-to-plugin coordination in the mechanism).

### `skills/using-dev-skills/SKILL.md`

A trimmed-down version of superpowers' `using-superpowers` skill: states the same
"if a skill might apply, you must use it" rule, but scoped to the user's own skill
set, and does not duplicate superpowers' "Skill Priority" section (that guidance
already applies globally once injected by superpowers). Content:

- Frontmatter: `name: using-dev-skills`, `description: Use when starting any
  conversation - checks for the user's personal dev-skills before acting`.
- Body: the invocation rule + red-flag table, adapted from superpowers' version,
  pointing at the user's own skills instead.

### Seed skills: `writing-skills`, `test-driven-development`, `systematic-debugging`

Each of these three directories is copied verbatim (all files, not just
`SKILL.md`) from `~/superpowers/skills/<name>` into
`~/dev-skills/skills/<name>`. They're unmodified — same frontmatter, same
`name:` field — so they serve as both working references for how a real skill
is structured and immediately-usable copies in their own right.

**Known tradeoff — name collision:** because dev-skills runs alongside
superpowers, both plugins will register a skill literally named
`writing-skills` (and the other two). Claude Code namespaces skill
invocations by plugin (`superpowers:writing-skills` vs. `dev-skills:writing-skills`),
so this doesn't break anything, but both will appear in the available-skills
list, which is redundant until the user diverges the `dev-skills` copies from
the originals or removes ones they don't need.

### Registration

1. Add `~/dev-skills` as a local marketplace source.
2. Add `"dev-skills@<marketplace-name>": true` to `enabledPlugins` in
   `~/.claude/settings.json`, alongside the existing superpowers entry.
3. Start a new Claude Code session (or `/clear`) to trigger the `SessionStart`
   hook and confirm both plugins' context blocks appear.

### Testing / verification

- Manually run `hooks/session-start` and confirm it emits valid JSON with the
  expected `additionalContext` field.
- Start a fresh session and confirm the system reminder shows
  `dev-skills:writing-skills`, `dev-skills:test-driven-development`, and
  `dev-skills:systematic-debugging` under available skills, alongside
  superpowers' own copies.
- Invoke one (e.g. `dev-skills:writing-skills`) via the `Skill` tool and confirm
  its body is returned correctly.
- Confirm superpowers' skills are still listed and functional alongside it.

## Future work

Once verified, the user adds real skills under `dev-skills/skills/<name>/SKILL.md`
using the existing `superpowers:writing-skills` skill as the authoring guide — no
new tooling needed for that step, since it's a personal-plugin instance of a
process superpowers already documents.
