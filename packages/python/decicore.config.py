# ============================================================
# DeciCore Python SDK — Server Configuration
# ============================================================
#
# Set the DECICORE_ENV environment variable to switch servers
# without touching application code.
#
#   DECICORE_ENV=local  python app.py   → http://localhost:5000
#   DECICORE_ENV=test   python app.py   → https://test-api.decicore.dev
#   DECICORE_ENV=prod   python app.py   → https://api.decicore.dev  (default)
#
# Valid values: "local" | "test" | "prod"
# ============================================================

import os

DECICORE_ENV: str = os.environ.get("DECICORE_ENV", "prod")

_SERVERS: dict[str, str] = {
    "local": "http://localhost:5000",
    "test":  "https://test-api.decicore.dev",
    "prod":  "https://api.decicore.dev",
}

#: Resolved base URL for the current environment.
#:
#: Example::
#:
#:     from decicore.config import DECICORE_BASE_URL
#:     print(DECICORE_BASE_URL)  # https://api.decicore.dev
DECICORE_BASE_URL: str = _SERVERS.get(DECICORE_ENV, _SERVERS["prod"])
