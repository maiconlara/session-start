---
name: session-start
description: Standing session rules that must be loaded at the start of every session, before any other work. Covers the quality bar (never trade correctness for token savings), the total ban on em-dashes, the useEffect ban, the comment policy, and per-commit/per-push authorization. After loading, wait for the user's actual request instead of starting work on your own.
---

# Session Start Rules

Standing rules for the entire session. They apply to every reply, every file touched, and every commit or push. When any of them conflicts with default model style, these rules win.

## Best solution first

Always aim for the best possible solution. Any attempt to reduce tokens that produces a worse result is invalid. If the right solution needs more exploration, more edits, or a longer answer, do the full work. Saving effort is never a valid reason to ship something below the best you can do.

## No em-dashes

Never use the em-dash character (`—`) when talking to the user or in any written output.

NEVER use `—` anywhere: chat, code comments, JSDoc, UI copy, markdown, commit messages. Run `grep -rn "—"` over every file touched BEFORE saying done, same as lint.

Rationale: it reads as cluttered and AI-generated.

Rewrite with commas, colons, parentheses, or separate sentences. This applies to all prose and written deliverables: chat replies, docs, commit messages, PR descriptions, comments, CV bullets, descriptions. Plain hyphens in compound words are fine (`cross-platform`, `type-safe`, `build-time`); only the em-dash is unwanted. Note this differs from the default style, which leans on em-dashes, so watch for it.

Examples:

- Bad: `The build runs in two stages — client and server.`
- Good: `The build runs in two stages: client and server.`
- Bad: `Tokens live in @ignite/tokens — never hardcode hex.`
- Good: `Tokens live in @ignite/tokens. Never hardcode hex.`

## No useEffect

`useEffect` is forbidden for the usual cases. Never introduce `useEffect` to set form
defaults from async data, to manage focus, or to sync state.

Rationale: avoid effect cascades, double renders, and imperative side effects in components.

Use instead:

- Form defaults from async data: react-hook-form's `values` prop plus
  `resetOptions: { keepDirtyValues: true }`. The form reacts to value changes while
  preserving user edits.
- Derived values: compute during render with `useMemo`, never `useEffect` + `setState`.
- Focus on mount: the `autoFocus` prop, never `ref.focus()` inside `useEffect`.
- Subscribing to external events: the appropriate hook (react-query, or a subscription
  wrapped in a custom hook), never a raw `useEffect` listener.

Single exception, debounce: for search/filter debounce, reuse the shared
`useDebounce(value, delay)` hook (lives in `src/hooks/`, exported from `@/hooks`),
following the task-manager pattern: `const debounced = useDebounce(value, 500)` plus a
`useEffect` that pushes `debounced` into the filter/query. This was chosen deliberately
over an effect-free ref-timer debounce. Match the existing pattern, do not invent an
alternative.

If something genuinely seems to require `useEffect`, stop and ask before writing it.

## Comment policy

Never leave a useless comment: no "why this was removed", no removal dates, no "this was the user's decision", no notes addressed to the reviewer. Leave NO comments at all, except technical documentation comments that follow the pattern below. Every comment is written in English, and needs to be straightforward, not an entire paragraph.

```ts
/**
 * Marks a production order as overdue.
 *
 * @param order - Production order to evaluate.
 * @param now - Current date, injected to keep the function deterministic
 *             and easy to test.
 * @returns `true` when the order should be considered overdue.
 */
function isProductionOrderOverdue(
  order: ProductionOrder,
  now: Date,
): boolean {
  return (
    order.status !== 'completed' &&
    order.productionDate.getTime() < now.getTime()
  );
}
```

If the user EXPLICITLY states they want a comment, write it.

## Commits and pushes require authorization

Commits are made ONLY with the user's explicit authorization. One authorization covers exactly ONE commit; it never becomes a standing permission for the session. Wait for a new authorization before every commit, even when it touches the same file as the previous one. The exact same rule applies to pushes: each push needs its own fresh authorization.

## After loading

This skill only loads the rules above; it does not start any work.

- If the user has not sent an actual request yet, reply with one short line confirming the session rules are loaded, then wait for the true start of the session.
- If the user's request is already present in the conversation, apply these rules and proceed with that request directly, without a separate acknowledgment.
