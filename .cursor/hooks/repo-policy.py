#!/usr/bin/env python3
"""Block repository-local paths protected by project policy."""

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


def emit_denial(message: str) -> None:
    print(json.dumps({"permission": "deny", "user_message": message}))


def normalized_path(path: str) -> str:
    cleaned = path.strip().strip('"').strip("'")
    return PurePosixPath(cleaned.replace("\\", "/")).as_posix()


def path_is_env(path: str) -> bool:
    return bool(ENV_PATH_RE.search(normalized_path(path)))


def path_is_generated(path: str) -> bool:
    return bool(GENERATED_PATH_RE.search(normalized_path(path)))


def deny_reason_for_path(path: str) -> str | None:
    if path_is_env(path):
        return "Blocked by repository policy: do not read or modify .env* files."
    if path_is_generated(path):
        return "Blocked by repository policy: do not edit generated/ files."
    return None


def deny_reason_for_shell(command: str) -> str | None:
    if ENV_PATH_RE.search(command):
        return "Blocked by repository policy: do not read or modify .env* files."
    if MUTATING_GENERATED_RE.search(command):
        return "Blocked by repository policy: do not modify generated/ files."
    return None


def deny_reason_for_write(tool_name: str, tool_input: dict) -> str | None:
    if tool_name in {"Write", "StrReplace", "Delete"}:
        path = tool_input.get("path", "")
        if isinstance(path, str):
            return deny_reason_for_path(path)

    if tool_name == "Shell":
        command = tool_input.get("command", "")
        if isinstance(command, str):
            return deny_reason_for_shell(command)

    # Legacy patch-style writes (Codex compat)
    command = tool_input.get("command", "")
    if isinstance(command, str) and tool_name in {"apply_patch", "Edit", "Write"}:
        changed_paths = [
            normalized_path(match.group("path"))
            for match in PATCH_PATH_RE.finditer(command)
        ]
        for path in changed_paths:
            reason = deny_reason_for_path(path)
            if reason:
                return reason

    return None


def main() -> int:
    payload = json.load(sys.stdin)
    event_name = payload.get("hook_event_name", "")

    if event_name == "beforeReadFile":
        file_path = payload.get("file_path", "")
        if isinstance(file_path, str):
            reason = deny_reason_for_path(file_path)
            if reason:
                emit_denial(reason)
        return 0

    if event_name == "afterFileEdit":
        file_path = payload.get("file_path", "")
        if isinstance(file_path, str):
            reason = deny_reason_for_path(file_path)
            if reason:
                emit_denial(reason)
        return 0

    if event_name == "preToolUse":
        tool_name = payload.get("tool_name", "")
        tool_input = payload.get("tool_input") or {}
        if isinstance(tool_input, dict):
            reason = deny_reason_for_write(tool_name, tool_input)
            if reason:
                emit_denial(reason)
        return 0

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
