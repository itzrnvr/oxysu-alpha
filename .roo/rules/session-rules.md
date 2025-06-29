# When the user asks you to create a session log, follow these rules:
- Write a detailed technical document of the current session that should serve as context when you continue the chat with the user in a new fresh session.
- Keept it clear, structured and detailed. Mention everything that a fresh chat session would need to know, it should serve as memory.

- Write the file inside project root .rusu/chatlogs/day1
- When creating a new session log file, the filename must follow the pattern `session-log-<num>.md`.
- To determine `<num>`, first list all files in the `.rusu/chatlogs/day1` directory.
- Identify any existing files that match the `session-log-<num>.md` pattern (e.g., `session-log-1.md`, `session-log-2.md`).
- Extract the numerical part from these filenames.
- The `<num>` for the new file should be the highest existing number incremented by one.
- If no `session-log-*.md` files are found in the directory, the `<num>` for the new file should be `1`.

