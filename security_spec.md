# Security Specification — SahiKhata Firestore Rules

## 1. Data Invariants
- Every document in `/users/{userId}` can only be read, created, or updated by the authenticated user whose `request.auth.uid == userId` and `request.auth.token.email_verified == true`.
- Every document in `/requests/{requestId}` MUST belong to an authenticated, email-verified user (`ownerId == request.auth.uid`).
- Unauthenticated users have zero read or write access to `/users` or `/requests`.
- `createdAt` and `ownerId` / `uid` are immutable after creation; `createdAt` and `updatedAt` must equal `request.time`.
- Once a request `status` reaches `'cancelled'`, no further updates are permitted (terminal state lock).

## 2. Adversarial Payloads ("Dirty Dozen")
1. **Unauthenticated read** on `/users/uid123` -> `PERMISSION_DENIED`.
2. **Cross-user profile read** (`uidA` reads `/users/uidB`) -> `PERMISSION_DENIED`.
3. **Unverified email write** (`email_verified == false`) on `/requests/req1` -> `PERMISSION_DENIED`.
4. **UID spoofing on create** (`ownerId: "victimUid"`) -> `PERMISSION_DENIED`.
5. **Shadow field injection** (`isAdmin: true`) on `/users/uidA` -> `PERMISSION_DENIED`.
6. **Oversized ID poisoning** (`requestId` > 128 chars or invalid chars) -> `PERMISSION_DENIED`.
7. **Client-forged timestamp** (`createdAt: "2020-01-01"`) -> `PERMISSION_DENIED`.
8. **Blanket list scraping** (`list /requests` without `ownerId == request.auth.uid` query) -> `PERMISSION_DENIED`.
9. **Cross-user request update** (`uidA` cancels `uidB`'s request) -> `PERMISSION_DENIED`.
10. **Immutable field mutation** (changing `ownerId` or `createdAt` on update) -> `PERMISSION_DENIED`.
11. **Terminal state bypass** (re-opening `status: 'cancelled'` back to `'submitted'`) -> `PERMISSION_DENIED`.
12. **Type/length poisoning** (`companyName` > 160 chars or non-string) -> `PERMISSION_DENIED`.
