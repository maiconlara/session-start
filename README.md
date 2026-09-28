# session-start

Standing session rules, loaded before the first reply of every Claude Code session.

[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Agent Skills compatible](https://img.shields.io/badge/agent%20skills-compatible-black)](https://github.com/vercel-labs/skills)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-skill-d97757)](https://code.claude.com/docs/en/skills)

An [agent skill](https://code.claude.com/docs/en/skills) for Claude Code and any agent that
reads `SKILL.md`, loaded automatically into every session through a one-line import in your
user-level `CLAUDE.md`.

It carries the standing rules a session must follow before doing anything else: the quality
bar (token savings never justify a worse result), questions answered instead of acted on,
plain Brazilian Portuguese that ties every explanation to the file, the screen and a
concrete example, AI-written Jira tickets translated for the user, the full path of every
file created, the total ban on em-dashes, the `useEffect` ban with its single debounce
exception, the Lodash ban, the comment policy (straightforward JSDoc-style technical
documentation or nothing), and per-commit/per-push authorization.

Instead of repeating the same corrections at the start of every session, the rules are
versioned here once and arrive in context before the first reply, every time.

## Installation

**Via CLI.** Works with Claude Code, Cursor, opencode and the other agents supported by
[skills.sh](https://www.skills.sh).

```bash
npx skills add maiconlara/session-start
```

With no flag it installs into the current project only. With `-g` it applies across all of
your projects:

```bash
npx skills add -g maiconlara/session-start
```

**Via git, personal scope.** If you would rather version the skill yourself.

```bash
git clone https://github.com/maiconlara/session-start.git \
  ~/.claude/skills/session-start
```

Update with `git pull` inside the folder.

**claude.ai.** Zip the folder as `session-start.zip`, rename it to `.skill`, and use the
*Save skill* button when you open the file in a conversation.

## Automatic loading

Installing the skill makes `/session-start` available, but the point is not having to
invoke anything. Import it from your user-level `~/.claude/CLAUDE.md` (create the file if it
does not exist) and Claude Code loads the rules into every session, in every project:

```md
@~/.claude/skills/session-start/SKILL.md
```

Point the path at wherever the repo lives. Claude Code expands the import when the session
starts and sends the whole file with every request, so compaction never summarizes it away,
and subagents receive it too.

Upgrading from the old `SessionStart` hook: delete that hook from `~/.claude/settings.json`
and add the import above. Keeping both loads the rules twice, and the hook alone no longer
works (see the FAQ).

## Usage

Nothing to invoke. Open a session, send your first message, and the rules are already in
context before the agent replies.

To re-load mid-session, or to load them in an agent without the import: `/session-start`.
When invoked before any real request, it confirms the rules are loaded and waits for the
actual start of the session.

## The rules

| Rule | What it enforces |
|---|---|
| Best solution first | Any token saving that produces a worse result is invalid |
| Questions get answers | A question is answered, never taken as a cue to change code, files or anything else |
| Talk like a person | Plain Brazilian Portuguese without AI jargon; every code explanation names the file, the screen or column, and a concrete example |
| Translate Jira tickets | Acronyms, niche terms and internal labels of AI-written tickets are explained, never guessed |
| Show created file paths | Every file created, moved or exported comes with its full absolute path, in the operating system's own format |
| No em-dashes | No `—` anywhere: chat, code, docs, commits; `grep` every touched file before saying done |
| No useEffect | Forbidden for form defaults, focus and state sync; the shared `useDebounce` hook is the one exception |
| No Lodash | Native JavaScript only, even when Lodash is installed and the file already uses it |
| Comment policy | No comments except straightforward JSDoc-style technical documentation, in English |
| Commits and pushes | One explicit authorization per commit and per push, never a standing permission |
| After loading | Confirm and wait for the user's actual request instead of starting work |

The full text, with the rationale and the code patterns to use instead, lives in
[SKILL.md](SKILL.md).

## Requirements

Claude Code for the automatic loading. As a plain skill, it works in any agent that reads
`SKILL.md`, with no runtime at all.

## Structure

```
SKILL.md    the rules, the only file loaded into context
```

## FAQ

**Why an import in CLAUDE.md instead of a `SessionStart` hook?**
A hook can inject at most 10,000 characters per output (Claude Code 2.1.281). Past that,
Claude Code saves the text to a file and the model only sees a 2,000-character preview, so
most rules silently stop applying, and this file is already past that. The user-level
`~/.claude/CLAUDE.md` has no such cut (it only shows a performance warning from about 40,000
characters), applies to every project on the machine, is injected by the harness instead of
read at the model's discretion, and also reaches subagents, unless an agent's definition
opts out. The import keeps a single versioned source: the file in this repo.

**Does it survive compaction?**
Yes. `CLAUDE.md` and its imports are sent with every request instead of living in the
conversation history, so compaction never summarizes them away.

**Does it work outside Claude Code?**
The rules themselves, yes: install it as a normal skill and invoke it at the start of the
session. The automatic loading relies on Claude Code's `CLAUDE.md` imports.

**Why does SKILL.md contain em-dashes if they are banned?**
Only in the lines that define the ban and in the "Bad" examples. A rule that forbids a
character has to show it.

## License

[MIT](LICENSE) · Copyright (c) 2026 Maicon Lara
