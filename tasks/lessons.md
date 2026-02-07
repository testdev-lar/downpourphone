# Lessons Learned

Track patterns and mistakes to prevent repeating them.

---

## Session: 2026-02-02

### Lesson 1: Create workflow docs before diving into implementation
**Context:** Started planning paywall implementation without establishing workflow rules first.
**Pattern:** Always check if project has CLAUDE.md workflow rules before starting work.
**Rule:** At session start, read CLAUDE.md, ROADMAP.md, and CLAUDE_HANDOFF.md before any implementation.

---

## Session: 2026-02-07 (Round 2 - Claude Code)

### Lesson 2: Race conditions on navigation cause duplicate entries
**Context:** A single release duplicated 7 times and triggered the paywall on S22. Root cause was saveEntry() firing multiple times before navigation completed.
**Pattern:** Any async action that triggers navigation can fire multiple times if the user taps quickly or the UI re-renders.
**Rule:** Always add an `isSubmitting` guard flag for any action that saves data + navigates. Also use `isMounted` checks for callbacks that fire after component may have unmounted.

### Lesson 3: Samsung devices need longer haptic durations
**Context:** Haptic feedback at 25/50/100ms was imperceptible on Samsung S24. Web Vibration API behaves differently across Android OEMs.
**Pattern:** Short vibration durations (<50ms) may not register on Samsung devices.
**Rule:** Minimum 50ms for light haptics. Use pulsed patterns (e.g., [50,30,80]) for heavy feedback to ensure perceptibility.

### Lesson 4: Bash tool returns no output on Windows
**Context:** Every Bash command in this Windows environment returns empty output, making it impossible to run git or build commands programmatically.
**Pattern:** The Bash tool doesn't work reliably on Windows for this project.
**Rule:** Provide PowerShell commands for the user to run manually instead of trying to execute via Bash tool. Don't waste turns retrying.

### Lesson 5: Plan mode blocks edits - exit before implementing
**Context:** Plan mode activated automatically multiple times during the session, preventing file edits.
**Pattern:** Plan mode is read-only except for the plan file.
**Rule:** Always exit plan mode before attempting any file edits. If plan mode activates unexpectedly, exit it immediately.

---

## Template for New Lessons

```
### Lesson N: [Brief title]
**Context:** What happened
**Pattern:** What went wrong or could be improved
**Rule:** Specific rule to prevent this in future
```
