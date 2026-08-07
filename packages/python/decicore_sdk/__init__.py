"""
decicore-sdk — Python
=====================

Official Python SDK for the DECICORE API.

Every operation except ``DeciCore.login()`` requires an authenticated user —
log in first, then construct the client from the result.

Quick start::

    from decicore_sdk import DeciCore

    session = DeciCore.login(
        user_email="jane@acme.com",
        user_password="Temp1234!",
        project_id="PROJ0000001",
    )

    client = DeciCore(
        token=session["token"],
        user_id=session["user_id"],
        tenant_id=session["tenant_id"],
        project_id=session["project_id"],
    )

    # List records
    result = client.list("Products", filters={"status": "active"}, page_size=50)
    for product in result["records"]:
        print(product["name"])

    # Create a record
    new_product = client.create("Products", {
        "name": "Studio Monitor", "price": 299.99, "status": "active"
    })

    # Run a saved AI Action
    tagged = client.run_action("AIA0000123", prompt="Tag each ticket: billing, technical, or other.")
"""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

try:
    import requests
    from requests import Response
except ImportError as exc:
    raise ImportError(
        "The 'requests' package is required. Install it with: pip install requests"
    ) from exc

__version__ = "1.0.0"
__all__ = ["DeciCore", "DecicoreError"]

_DEFAULT_BASE_URL = "https://api.decicore.dev"


# ── Error ─────────────────────────────────────────────────────

class DecicoreError(Exception):
    """Raised when the DECICORE API returns a non-2xx response."""

    def __init__(self, message: str, status_code: int) -> None:
        super().__init__(message)
        self.status_code = status_code

    def __repr__(self) -> str:
        return f"DecicoreError(status={self.status_code}, message={str(self)!r})"


# ── Internal request helper ───────────────────────────────────

def _request(
    base_url: str,
    headers: Dict[str, str],
    method: str,
    path: str,
    body: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, str]] = None,
) -> Any:
    url = f"{base_url}{path}"
    response: Response = requests.request(
        method, url, headers=headers, json=body, params=params, timeout=30,
    )
    try:
        payload: Any = response.json()
    except (json.JSONDecodeError, ValueError):
        payload = {"message": response.text}

    if not response.ok:
        msg = (
            payload.get("error") or payload.get("message")
            if isinstance(payload, dict) else str(payload)
        ) or f"HTTP {response.status_code}"
        raise DecicoreError(msg, response.status_code)

    return payload


# ── Sub-clients ───────────────────────────────────────────────

class PlansClient:
    """Subscription plan operations."""

    def __init__(self, base_url: str, headers: Dict[str, str]) -> None:
        self._base_url = base_url
        self._headers  = headers

    def list(self) -> Any:
        """List all active subscription plans for the tenant's Stripe account.

        Each plan includes prices with ``platform_price_id`` for checkout.

        Example::

            plans = client.plans.list()
            price_id = plans[0]["prices"][0]["id"]
        """
        return _request(self._base_url, self._headers, "GET", "/api/stripe_plans/")


class UsersClient:
    """User management operations."""

    def __init__(self, base_url: str, headers: Dict[str, str]) -> None:
        self._base_url = base_url
        self._headers  = headers

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user in the tenant. Requires an Admin token.

        Args:
            data: Must include ``user_name``, ``user_email``,
                  ``user_password``, and ``user_role`` ('Admin' or 'User').

        Example::

            user = client.users.create({
                "user_name":     "Jane Doe",
                "user_email":    "jane@acme.com",
                "user_password": "Temp1234!",
                "user_role":     "User",
            })
            print(user["ID"])
        """
        return _request(self._base_url, self._headers, "POST", "/api/users/create-user", body=data)


class FormsClient:
    """Form schema lookups."""

    def __init__(self, base_url: str, headers: Dict[str, str]) -> None:
        self._base_url = base_url
        self._headers  = headers

    def get(self, form_id: str) -> Dict[str, Any]:
        """Get a form's schema — its fields (name, type, label, required,
        FK links) and any linked dialogs.

        Useful for rendering a custom UI around a DECICORE-defined form, or
        validating data before calling ``client.create()``.

        Example::

            schema = client.forms.get("FRM0000001")
            print(schema["collection_name"], schema["data"])  # fields
        """
        return _request(self._base_url, self._headers, "GET", f"/api/form/{form_id}/data")


class DashboardsClient:
    """Dashboard and widget data."""

    def __init__(self, base_url: str, headers: Dict[str, str]) -> None:
        self._base_url = base_url
        self._headers  = headers

    def list(self) -> Any:
        """List dashboards visible to the caller's project."""
        return _request(self._base_url, self._headers, "GET", "/api/liquid-dashboards/list")

    def structure(self, dashboard_id: str) -> Dict[str, Any]:
        """Get a dashboard's widget layout (which widgets, in what order/size)."""
        return _request(self._base_url, self._headers, "GET", f"/api/liquid-dashboards/structure/{dashboard_id}")

    def get(self, dashboard_id: str, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get a dashboard's live widget data, keyed by widget instance ID.

        Args:
            dashboard_id: The dashboard's ID.
            filters: Query filters forwarded as-is — use the same field/key
                names your dashlet's pipeline was built against (e.g.
                ``status``, ``region``), plus the built-in ``time_range_days``.

        Example::

            data = client.dashboards.get("DSH0000001", filters={
                "time_range_days": 30,
                "status": "active",
            })
        """
        params = {k: str(v) for k, v in filters.items()} if filters else None
        return _request(self._base_url, self._headers, "GET", f"/api/liquid-dashboards/{dashboard_id}", params=params)

    def widget(self, widget_definition_id: str, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get a single widget's data by its widget definition ID — useful
        for embedding one chart/table without loading a whole dashboard.

        Example::

            widget = client.dashboards.widget("WDG0000001", filters={"time_range_days": 7})
        """
        params = {k: str(v) for k, v in filters.items()} if filters else None
        return _request(
            self._base_url, self._headers, "GET",
            f"/api/liquid-dashboards/widgets/{widget_definition_id}", params=params,
        )


class BillingClient:
    """Stripe billing operations."""

    def __init__(self, base_url: str, headers: Dict[str, str]) -> None:
        self._base_url = base_url
        self._headers  = headers

    def subscribe(
        self,
        stripe_account_id: str,
        customer_email: str,
        price_id: str,
        payment_method_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Subscribe a customer to a plan via Stripe.

        Creates or reuses a Stripe Customer by email, attaches the payment
        method, and creates a Subscription. If ``payment_intent.status``
        is ``'requires_action'`` the caller must confirm 3D Secure.

        Args:
            stripe_account_id:  Connected Stripe account ID (``acct_...``).
            customer_email:     Customer's email address.
            price_id:           Stripe Price ID. Use ``platform_price_id``
                                from ``plans.list()`` results.
            payment_method_id:  Optional Stripe Payment Method ID (``pm_...``).

        Example::

            plans = client.plans.list()
            price_id = plans[0]["prices"][0]["id"]

            result = client.billing.subscribe(
                stripe_account_id="acct_1AbCdEfGhIjKl",
                customer_email="jane@acme.com",
                price_id=price_id,
                payment_method_id="pm_...",
            )
            print(result["subscription"]["status"])  # "active"
        """
        body: Dict[str, Any] = {
            "stripe_account_id": stripe_account_id,
            "customer_email":    customer_email,
            "price_id":          price_id,
        }
        if payment_method_id:
            body["payment_method_id"] = payment_method_id

        return _request(
            self._base_url, self._headers, "POST",
            "/api/stripe/create-tenant-subscription", body=body,
        )


# ── Main client ───────────────────────────────────────────────

class DeciCore:
    """DECICORE API client.

    Every operation except ``DeciCore.login()`` requires an authenticated
    user — log in first, then construct the client from the result.

    Args:
        token:      The raw ``token`` from ``DeciCore.login()``, sent as-is
                    on the ``Authorization`` header — DECICORE does not use
                    the ``Bearer `` prefix.
        user_id:    The authenticated user's ID from ``DeciCore.login()``.
                    Sent as ``Core-User-ID`` header on every request.
        project_id: Sent as ``Core-Project-ID`` header on every request.
        tenant_id:  Sent as ``Core-Tenant-ID`` header on every request.
        base_url:   Optional server URL override. Defaults to
                    ``https://api.decicore.dev``. Pass a local or staging
                    URL to target a different environment::

                        DeciCore(..., base_url="http://localhost:5000")

    Example::

        import os
        from decicore_sdk import DeciCore

        session = DeciCore.login(
            user_email=os.environ["DECICORE_EMAIL"],
            user_password=os.environ["DECICORE_PASSWORD"],
            project_id=os.environ["DECICORE_PROJECT_ID"],
        )

        client = DeciCore(
            token=session["token"],
            user_id=session["user_id"],
            tenant_id=session["tenant_id"],
            project_id=session["project_id"],
        )
    """

    def __init__(
        self,
        token: str,
        user_id: str,
        project_id: str,
        tenant_id: str,
        base_url: Optional[str] = None,
    ) -> None:
        self._base_url = (base_url or _DEFAULT_BASE_URL).rstrip("/")
        self._headers: Dict[str, str] = {
            "Content-Type":    "application/json",
            "Authorization":   token,
            "Core-User-ID":    user_id,
            "Core-Project-ID": project_id,
            "Core-Tenant-ID":  tenant_id,
        }

        self.plans      = PlansClient(self._base_url, self._headers)
        self.users      = UsersClient(self._base_url, self._headers)
        self.billing    = BillingClient(self._base_url, self._headers)
        self.forms      = FormsClient(self._base_url, self._headers)
        self.dashboards = DashboardsClient(self._base_url, self._headers)

    @staticmethod
    def login(
        user_email: str,
        user_password: str,
        project_id: str,
        tenant_id: Optional[str] = None,
        base_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Authenticate a user and get back the credentials needed to
        construct a ``DeciCore`` client.

        This is the only call that works without already being
        authenticated — every other method requires a full client built
        from its result. Rate limited to 5 attempts per minute.

        Always authenticates in the target project's production context —
        ``project_id`` is required, and the tenant-level dev/Studio context
        (no project selected) is never used.

        Args:
            user_email:    The user's email address.
            user_password: The user's password.
            project_id:    The project you're logging into.
            tenant_id:     Required only if the account belongs to more
                            than one tenant.
            base_url:      Optional server URL override.

        Example::

            session = DeciCore.login("jane@acme.com", "Temp1234!", project_id="PROJ0000001")
            client = DeciCore(
                token=session["token"],
                user_id=session["user_id"],
                tenant_id=session["tenant_id"],
                project_id=session["project_id"],
            )
        """
        body: Dict[str, Any] = {
            "user_email": user_email,
            "user_password": user_password,
            "project_id": project_id,
            # The API only checks production-plan access (never blocks login
            # on failure) when this is true — the SDK always claims it since
            # it never operates in the tenant-level dev/Studio context.
            "is_production_context": True,
        }
        if tenant_id:
            body["tenant_id"] = tenant_id
        result = _request(
            (base_url or _DEFAULT_BASE_URL).rstrip("/"),
            {"Content-Type": "application/json"},
            "POST", "/api/users/login", body=body,
        )
        # The login response doesn't echo project_id back — attach it
        # ourselves so callers don't have to pass it twice.
        result["project_id"] = project_id
        return result

    # ── CRUD ──────────────────────────────────────────────────────

    def list(
        self,
        collection: str,
        filters:    Optional[Dict[str, Any]] = None,
        search:     Optional[str]            = None,
        sort_by:    Optional[str]            = None,
        sort_order: str                      = "desc",
        page:       int                      = 1,
        page_size:  int                      = 25,
        fields:     Optional[List[str]]      = None,
    ) -> Dict[str, Any]:
        """List records in a collection.

        Args:
            collection: Collection name (e.g. ``"Products"``).
            filters:    Exact-match filters, e.g. ``{"status": "active"}``.
            search:     Full-text search term.
            sort_by:    Field to sort by.
            sort_order: ``"asc"`` or ``"desc"``. Default: ``"desc"``.
            page:       1-based page number.
            page_size:  Records per page. Default: 25. Max: 200.
            fields:     Return only these fields (projection).

        Returns:
            Dict with keys ``records``, ``total``, ``page``, ``page_size``.

        Example::

            result = client.list(
                "Products",
                filters={"status": "active"},
                sort_by="price",
                sort_order="asc",
                page_size=50,
            )
            for p in result["records"]:
                print(p["name"], p["price"])
        """
        params: Dict[str, str] = {
            "page":       str(page),
            "page_size":  str(page_size),
            "sort_order": sort_order,
        }
        if search:  params["search"]  = search
        if sort_by: params["sort_by"] = sort_by
        if fields:  params["fields"]  = ",".join(fields)
        if filters:
            for k, v in filters.items():
                params[k] = ",".join(str(i) for i in v) if isinstance(v, list) else str(v)

        return _request(self._base_url, self._headers, "GET", f"/api/{collection}", params=params)

    def get(self, collection: str, record_id: str) -> Dict[str, Any]:
        """Get a single record by its ID.

        Example::

            product = client.get("Products", "PROD0000001")
            print(product["name"])
        """
        return _request(self._base_url, self._headers, "GET", f"/api/{collection}/{record_id}")

    def create(self, collection: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record. The ID is auto-generated by the server.

        Example::

            product = client.create("Products", {
                "name":   "Studio Monitor",
                "price":  299.99,
                "status": "active",
            })
            print(product["ID"])
        """
        return _request(self._base_url, self._headers, "POST", f"/api/{collection}", body=data)

    def update(
        self, collection: str, record_id: str, data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Update an existing record. Only the supplied fields are modified.

        Example::

            client.update("Products", "PROD0000001", {"price": 249.99, "status": "sale"})
        """
        return _request(
            self._base_url, self._headers, "PUT", f"/api/{collection}/{record_id}", body=data,
        )

    def delete(self, collection: str, record_id: str) -> Dict[str, Any]:
        """Permanently delete a record.

        Example::

            client.delete("Products", "PROD0000001")
        """
        return _request(
            self._base_url, self._headers, "DELETE", f"/api/{collection}/{record_id}",
        )

    # ── AI Inference ───────────────────────────────────────────────

    def run_action(
        self,
        action_id: str,
        prompt: Optional[str] = None,
        response_format: Optional[Dict[str, Any]] = None,
        **extra: Any,
    ) -> Dict[str, Any]:
        """Run a pre-configured AI Action by its ID — one you (or a teammate)
        built and saved in DECICORE Studio, with its own stored instructions
        and response schema.

        Unlike ``infer()``, which sends ad-hoc instructions on every call,
        this runs the action as-is: ``prompt`` just appends extra runtime
        input, and ``response_format`` optionally overrides the saved schema.

        Args:
            action_id:       The saved AI Action's ID (e.g. ``"AIA0000123"``).
            prompt:          Optional extra input appended to the action's
                              saved instructions.
            response_format: Optional override for the action's saved
                              response schema.
            **extra:         Any other field the action expects (model,
                              provider, temperature, timeout, ...).

        Example::

            result = client.run_action(
                "AIA0000123",
                prompt="Focus on the last 30 days only.",
            )
        """
        body: Dict[str, Any] = dict(extra)
        if prompt is not None:
            body["prompt"] = prompt
        if response_format is not None:
            body["response_format"] = response_format
        return _request(
            self._base_url, self._headers, "POST",
            f"/api/chatgpt/run-ai-action/{action_id}", body=body,
        )
