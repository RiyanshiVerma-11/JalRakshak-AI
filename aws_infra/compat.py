"""
Shared datetime compatibility module for Python 3.10 and 3.11+.
Provides datetime.UTC emulation on Python 3.10 while preserving standard datetime functionality.
Extracted as a shared single source of truth (TASK 9 & TASK 18c).
"""
from datetime import datetime as _dt, timezone

try:
    from datetime import UTC
except ImportError:
    UTC = timezone.utc

class _DateTimeMeta(type):
    def __getattr__(cls, name):
        if name == 'UTC':
            return UTC
        return getattr(_dt, name)

class datetime(_dt, metaclass=_DateTimeMeta):
    pass

__all__ = ["datetime", "UTC"]
