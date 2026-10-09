# Re-exports canonical state_store as db for backward compatibility across test suites
from .state_store import state_store as db, state_store, InMemoryStateStore
