# Security Specification & Threat Model

## Data Invariants
1. **Research Dossier Invariant**: Any research dossier saved to `/research_dossiers/{dossierId}` must possess a valid author UID matching the authenticated requester. It must have a non-empty query (size <= 500), non-empty summary (size <= 5000), and legitimate timestamp.
2. **Device File Invariant**: A device file metadata record in `/device_files/{fileId}` must be indexed under an authenticated user's UID and bounded strings (name <= 256, path <= 512).
3. **Security Audit Invariant**: Audit records cannot be altered or deleted once written. Only authenticated users can record security events associated with their UID.
4. **Default Deny**: Any path not explicitly matched is denied. Unauthenticated writes are strictly rejected.

## The Dirty Dozen Payloads (Designed to Fail)
1. **Ghost Field Injection**: Adding `isAdmin: true` or `shadowField: "payload"` to `/research_dossiers/{id}` on create. Expected: `PERMISSION_DENIED`.
2. **Identity Spoofing**: Attempting to set `authorId: "victim_uid"` while authenticated as `attacker_uid`. Expected: `PERMISSION_DENIED`.
3. **Unauthenticated Write**: An unauthenticated user writing to `/research_dossiers/doc1`. Expected: `PERMISSION_DENIED`.
4. **Oversized String / DoW Attack**: A 2MB string injected into `query` or `summary`. Expected: `PERMISSION_DENIED`.
5. **Path Traversal / Malicious ID**: Creating a document with ID `../../secrets` or non-alphanumeric ID. Expected: `PERMISSION_DENIED`.
6. **Immutable Field Modification**: An update altering `authorId` or `createdAt`. Expected: `PERMISSION_DENIED`.
7. **Audit Record Deletion**: Attempting to delete a record in `/security_audits/{id}`. Expected: `PERMISSION_DENIED`.
8. **Invalid Device Type**: Setting `device: "HackedPhone"` not in allowed device enum. Expected: `PERMISSION_DENIED`.
9. **Blanket Query Scraping**: Attempting a collection read with no constraints.
10. **Resource Poisoning via Type Mismatch**: Providing an integer or object for string fields. Expected: `PERMISSION_DENIED`.
11. **Spoofed Email Access**: User claiming email admin without verified credentials. Expected: `PERMISSION_DENIED`.
12. **Orphaned File Write**: Creating a device file without required authorId binding. Expected: `PERMISSION_DENIED`.
