# session-start

Standing session rules, loaded before the first reply of every Claude Code session.

[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Agent Skills compatible](https://img.shields.io/badge/agent%20skills-compatible-black)](https://github.com/vercel-labs/skills)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-skill-d97757)](https://code.claude.com/docs/en/skills)

An [agent skill](https://code.claude.com/docs/en/skills) for Claude Code and any agent that
reads `SKILL.md`, plus the `SessionStart` hook script that injects it automatically.

It carries the standing rules a session must follow before doing anything else: the quality
bar (token savings never justify a worse result), the total ban on em-dashes, the
`useEffect` ban with its single debounce exception, the comment policy (straightforward
JSDoc-style technical documentation or nothing), and per-commit/per-push authorization.

Instead of repeating the same corrections at the start of every session, the rules are
versioned here once and arrive in context before the first reply, every time.

## Installation

**Via CLI.** Works with Claude Code, Cursor, opencode and the other agents supported by
[skills.sh](https://www.skills.sh).

```bash
npx skills add maiconlara/start-session
```

With no flag it installs into the current project only. With `-g` it applies across all of
your projects:

```bash
npx skills add -g maiconlara/start-session
```

**Via git, personal scope.** If you would rather version the skill yourself.

```bash
git clone https://github.com/maiconlara/start-session.git \
  ~/.claude/skills/session-start
```

Update with `git pull` inside the folder.

**claude.ai.** Zip the folder as `session-start.zip`, rename it to `.skill`, and use the
*Save skill* button when you open the file in a conversation.

## Automatic loading

Installing the skill makes `/session-start` available, but the point is not having to
invoke anything. Add a `SessionStart` hook to `~/.claude/settings.json` (merge into the
existing JSON) so the rules are injected on every session start: startup, resume, clear
and compact.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"~/.claude/skills/session-start/session-start-hook.js\"",
            "statusMessage": "Loading session-start rules"
          }
        ]
      }
    ]
  }
}
```

`session-start-hook.js` prints the `SKILL.md` body (frontmatter stripped) to stdout, and
Claude Code injects that output as context. Point the command at wherever the repo lives;
the script always reads the `SKILL.md` sitting next to it.

Running on `compact` as well is deliberate: long sessions are exactly where standing rules
get summarized away, so the hook re-injects them right after compaction.

## Usage

Nothing to invoke. Open a session, send your first message, and the rules are already in
context before the agent replies.

To re-load mid-session, or to load them in an agent without the hook: `/session-start`.
When invoked before any real request, it confirms the rules are loaded and waits for the
actual start of the session.

## The rules

| Rule | What it enforces |
|---|---|
| Best solution first | Any token saving that produces a worse result is invalid |
| No em-dashes | No `—` anywhere: chat, code, docs, commits; `grep` every touched file before saying done |
| No useEffect | Forbidden for form defaults, focus and state sync; the shared `useDebounce` hook is the one exception |
| Comment policy | No comments except straightforward JSDoc-style technical documentation, in English |
| Commits and pushes | One explicit authorization per commit and per push, never a standing permission |
| After loading | Confirm and wait for the user's actual request instead of starting work |

The full text, with the rationale and the code patterns to use instead, lives in
[SKILL.md](SKILL.md).

## Requirements

Node.js for the hook script, and Claude Code for the automatic loading. As a plain skill,
it works in any agent that reads `SKILL.md`, with no runtime at all.

## Structure

```
SKILL.md                 the rules, the only file loaded into context
session-start-hook.js    prints the SKILL.md body for the SessionStart hook
```

## FAQ

**Why a hook instead of CLAUDE.md?**
CLAUDE.md is per project, so personal rules end up copied and drifting across repos and
machines. A user-level `SessionStart` hook applies to every project on the machine from a
single versioned source, and unlike a memory file it cannot be skipped: the harness injects
it, the model does not decide to read it.

**Why does it re-run on resume and compact?**
Because those are the moments context gets rebuilt or summarized, which is when standing
rules are most likely to fade. Re-injecting costs about one kilobyte.

**Does it work outside Claude Code?**
The rules themselves, yes: install it as a normal skill and invoke it at the start of the
session. The automatic injection relies on Claude Code's `SessionStart` hook.

**Why does SKILL.md contain em-dashes if they are banned?**
Only in the lines that define the ban and in the "Bad" examples. A rule that forbids a
character has to show it.

## License

[MIT](LICENSE) · Copyright (c) 2026 Maicon Lara
