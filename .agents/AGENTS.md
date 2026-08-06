# Rules

- **Kontrol Sistemi (Control System):** Before reporting that a task is complete, YOU MUST ALWAYS run a verification step (like `npx tsc --noEmit` or checking the build) to ensure no syntax or type errors were introduced. Do not give the code to the user if it has crashing bugs.
