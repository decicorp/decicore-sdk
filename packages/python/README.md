# decicore-sdk

Official Python SDK for the [DECICORE](https://api.decicore.dev) multi-tenant backend platform.

```bash
pip install decicore-sdk
```

```python
import os
from decicore_sdk import DeciCore

session = DeciCore.login(
    user_email=os.environ["DECICORE_EMAIL"],
    user_password=os.environ["DECICORE_PASSWORD"],
)

client = DeciCore(
    token=session["token"],
    user_id=session["user_id"],
    tenant_id=session["tenant_id"],
    project_id=os.environ["DECICORE_PROJECT_ID"],
)

result = client.list("Products", filters={"status": "active"})
```

Full documentation, authentication patterns (single service-account login vs.
per-user login), and the complete API reference live in the main repository:
https://github.com/deciphai/DECICORE-Library
