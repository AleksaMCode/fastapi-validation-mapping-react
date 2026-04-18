from typing import Any


def normalize_error_path(loc: tuple[Any, ...]) -> str:
    # Skip request source segment such as body/query/path/header/cookie.
    path_parts = [
        str(part)
        for part in loc
        if part not in {"body", "query", "path", "header", "cookie"}
    ]
    return ".".join(path_parts)
