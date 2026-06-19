## Goal

Redesign the admin permission system into a production-ready, real-time, page-aware RBAC layer — without breaking the existing app. Roles stay fixed (`super_admin`, `admin`, `moderator`, `student`, `user`); permissions and page access become fully data-driven and live-editable by Super Admin.

## Architecture

### Database (new migration in `supabase/migrations/`)

1. **`public.app_pages`** — page registry overrides
   - `key text PK` (matches code-defined registry, e.g. `admin.users`, `admin.system-health`)
   - `label text`, `group text`, `route text`, `description text`
   - `enabled boolean default true`
   - `created_at`, `updated_at`
2. **`public.page_access`** — role ↔ page grants
   - `role app_role`, `page_key text references app_pages(key) on delete cascade`
   - PK `(role, page_key)`
3. **`public.role_permissions`** — already exists; keep, re-seed.
4. **`public.permission_audit_log`**
   - `id uuid pk`, `actor_id uuid`, `actor_email text`, `action text`
   - (`grant_permission` | `revoke_permission` | `grant_page` | `revoke_page` | `override_user_role`)
   - `target_role app_role null`, `target_page text null`, `target_permission text null`
   - `target_user_id uuid null`, `metadata jsonb`, `created_at timestamptz default now()`
5. **RPCs**
   - `has_page_access(_user_id uuid, _page_key text) returns boolean` — security definer; super_admin/admin always true, else checks `page_access`.
   - `list_my_pages() returns setof text` — returns all page keys current user can see (used for client preload).
   - `list_my_permissions() returns setof text` — preload caller's permission set.
   - Update `has_permission` to log denials via existing `record_admin_action` (already in place).
6. **Realtime publication** — add `role_permissions`, `page_access`, `permission_audit_log` to `supabase_realtime`.
7. **GRANTs + RLS** — `authenticated` SELECT on `app_pages`, `page_access`, `role_permissions`; INSERT/UPDATE/DELETE gated to `has_permission(auth.uid(),'manage_permissions')`. `permission_audit_log`: SELECT for `manage_permissions`, INSERT via security-definer fn only.

### Code-defined Page Registry

`src/lib/rbac/page-registry.ts` — typed source of truth:

```ts
export const PAGE_REGISTRY = [
  { key: 'admin.dashboard', route: '/admin', label: 'Dashboard', group: 'Overview' },
  { key: 'admin.users',     route: '/admin/users', label: 'User Management', group: 'People' },
  { key: 'admin.permissions', route: '/admin/settings', label: 'Roles & Permissions', group: 'People' },
  { key: 'admin.system-health', route: '/admin/system-health', label: 'System Health', group: 'System' },
  // ...one entry per existing admin.* route
] as const;
```

A startup server fn (`syncPageRegistry`) upserts rows into `app_pages` on first admin load — DB stores overrides + grants, code owns the canonical list.

### Backend (TanStack server fns)

`src/lib/rbac/rbac.functions.ts`:
- `listMyAccess()` — returns `{ permissions: string[], pages: string[], roles: string[] }`, cached 30s on client.
- `listPermissionMatrix()` — returns full matrix `{ roles, permissions, pages, role_permissions[], page_access[] }` for the editor.
- `toggleRolePermission({ role, permission, enabled })` — writes + audit log row + realtime broadcast.
- `toggleRolePageAccess({ role, page_key, enabled })` — same shape.
- `listAuditLog({ limit, cursor, filters })` — paginated audit feed.
- `overrideUserRole({ user_id, role, action: 'grant'|'revoke' })` — wraps existing role grant with audit.

All gated by `assertPermission(supabase, userId, 'manage_permissions', ...)`; `super_admin` rows are immutable (server-side guard).

### Frontend enforcement

1. **Permission store** — `src/stores/rbac-store.ts` (zustand) holds `{ permissions: Set<string>, pages: Set<string>, isSuperAdmin }`. Hydrated by `useMyAccess()` (React Query, staleTime 30s).
2. **`<PageGuard pageKey="admin.users">`** — wraps each admin route component; renders an `AccessDenied` screen when key not in store. Add to every `src/routes/admin.*.tsx`.
3. **`useCan(permission)`** / **`useCanPage(key)`** hooks — replace ad-hoc `has_role` checks in UI.
4. **Realtime sync** — `src/lib/rbac/use-rbac-realtime.ts` subscribes once at the admin layout (`src/routes/admin.tsx`) to `role_permissions`, `page_access`, `user_roles` channels; on event → `queryClient.invalidateQueries(['rbac','me'])` + matrix queries. Loss of permission instantly re-renders → `AccessDenied`, no logout needed.
5. **Sign-out / role-revoked path** — if `listMyAccess` returns no `admin.*` page and current URL is under `/admin`, redirect to `/`.

### Super Admin Matrix UI

New components under `src/components/admin/permissions/`:
- `PermissionsMatrixFlow.tsx` — tabs: **Permissions** · **Page Access** · **Audit Log** · **User Role Overrides**.
- `MatrixGrid.tsx` — sticky-header grid, rows = roles, columns = permissions (or pages). Switch per cell. `super_admin` column locked. Search + group filter.
- `AuditLogTable.tsx` — virtualized list with actor, action, target, time; filters by role/actor/date.
- `UserRoleOverridePanel.tsx` — search user → grant/revoke role chips → audit logged.
- Dependency warnings: e.g. revoking `manage_permissions` from `admin` shows confirm; deleting/disabling page used by route shows affected users count.

Mounted at `/admin/settings` (existing route) as a new top section, replacing the partial matrix in `AdminSettingsFlow`.

### Real-time strategy

- Supabase Realtime postgres_changes on the 3 RBAC tables (broadcast to all sessions).
- Client: single subscription in admin layout; invalidates the React Query keys; zustand store re-derives — every guard re-evaluates within ~1 frame.
- Edge case: if `user_roles` row removed for current user → `listMyAccess` returns base set → page guard kicks in immediately.

### Security

- Backend is single source of truth: every server fn re-checks `has_permission` (already wired via `assertPermission` + rate limit).
- `super_admin` immutable in both DB trigger (BEFORE UPDATE/DELETE on `role_permissions`/`page_access` where role='super_admin' → RAISE) and server fn.
- Audit log writes via SECURITY DEFINER fn — clients can't forge entries.
- All RPCs `REVOKE ... FROM anon`.

## Phases & deliverables

**Phase 1 — Schema & RPCs** *(1 migration)*
- `app_pages`, `page_access`, `permission_audit_log`, RPCs, GRANTs, RLS, realtime publication, super_admin immutability triggers, re-seed.

**Phase 2 — Backend server fns + page registry**
- `src/lib/rbac/page-registry.ts`, `rbac.functions.ts`, `syncPageRegistry` bootstrap.

**Phase 3 — Frontend enforcement**
- `useMyAccess` + zustand store, `<PageGuard>`, `useCan`, realtime hook, wire into all `src/routes/admin.*.tsx`, `AccessDenied` page.

**Phase 4 — Super Admin Matrix UI**
- New `PermissionsMatrixFlow` mounted in `/admin/settings`; remove the legacy matrix block.

**Phase 5 — Audit Log + Role Overrides**
- Audit table view, user role override panel, dependency confirms.

**Phase 6 — Cleanup**
- Replace remaining hardcoded `has_role`/`isAdmin` UI gates with `useCan`; smoke-test all admin routes; verify realtime invalidation; confirm build.

## Risks / notes

- Existing `useChatPermissions`, `admin-role-permissions.functions.ts`, `AdminSettingsFlow` matrix block stay until Phase 4/6 swap-over to avoid breakage between phases.
- `super_admin` retains absolute access regardless of matrix state (hard-coded in `has_permission` already).
- Migration is additive — no destructive changes to `user_roles` or `role_permissions`.

Approve and I'll start with **Phase 1 (migration)** and continue through the phases, checking in after each.