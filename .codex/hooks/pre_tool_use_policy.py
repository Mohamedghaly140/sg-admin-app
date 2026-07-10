#!/usr/bin/env python3
"""Block repository-local paths that Claude config already protects."""

from __future__ import annotations

import json
import re
import sys
from pathlib import PurePosixPath


PATH_PREFIX = r"(^|[\s'\"`=:/])"
ENV_PATH_RE = re.compile(rf"{PATH_PREFIX}\.env[^/\s'\"`]*")
GENERATED_PATH_RE = re.compile(rf"{PATH_PREFIX}generated(/|$)")
MUTATING_GENERATED_RE = re.compile(
    rf"(\b(rm|mv|cp|touch|mkdir|tee|truncate)\b|>>?|sed\s+-i|perl\s+-pi).*{PATH_PREFIX}generated(/|$)",
    re.DOTALL,
)
PATCH_PATH_RE = re.compile(
    r"^\*\*\* (?:Add File|Update File|Delete File|Move to): (?P<path>.+)$",
    re.MULTILINE,
)


def emit_denial(message: str, event_name: str) -> None:
    output = {
        "hookSpecificOutput": {
            "hookEventName": event_name,
            "permissionDecision": "deny",
            "permissionDecisionReason": message,
        }
    }
    print(json.dumps(output))


def normalized_path(path: str) -> str:
    cleaned = path.strip().strip('"').strip("'")
    return PurePosixPath(cleaned.replace("\\", "/")).as_posix()


def path_is_env(path: str) -> bool:
    return bool(ENV_PATH_RE.search(normalized_path(path)))


def path_is_generated(path: str) -> bool:
    return bool(GENERATED_PATH_RE.search(normalized_path(path)))


def deny_reason(tool_name: str, command: str) -> str | None:
    if ENV_PATH_RE.search(command):
        return "Blocked by repository policy: do not read or modify .env* files."

    if tool_name in {"apply_patch", "Edit", "Write"}:
        changed_paths = [normalized_path(match.group("path")) for match in PATCH_PATH_RE.finditer(command)]
        if any(path_is_env(path) for path in changed_paths):
            return "Blocked by repository policy: do not modify .env* files."
        if any(path_is_generated(path) for path in changed_paths):
            return "Blocked by repository policy: do not edit generated/ files."

    if tool_name == "Bash" and MUTATING_GENERATED_RE.search(command):
        return "Blocked by repository policy: do not modify generated/ files."

    return None


def main() -> int:
    payload = json.load(sys.stdin)
    tool_name = payload.get("tool_name", "")
    event_name = payload.get("hook_event_name", "PreToolUse")
    tool_input = payload.get("tool_input") or {}
    command = tool_input.get("command") if isinstance(tool_input, dict) else ""

    if not isinstance(command, str):
        return 0

    reason = deny_reason(tool_name, command)
    if reason:
        emit_denial(reason, event_name)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
