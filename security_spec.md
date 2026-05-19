# Security Specification - LiteraTrack Kelas 6

## Data Invariants
1. A student record must belong to a specific teacher (`ownerId`).
2. Only the owner can read, update, or delete their student records.
3. Scores must be between 60 and 100.
4. `level` must match the defined proficiency levels.
5. `createdAt` must be set by the server.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to create a student record with someone else's `ownerId`.
2. **Resource Poisoning**: Create a student record with a 1MB string name.
3. **Invalid Score**: Create/Update a student with a score of 150.
4. **Invalid Level**: Create/Update a student with level "GOD_MODE".
5. **Unauthorized Read**: Attempt to list students without being authenticated.
6. **Cross-User Leak**: Authenticated User A tries to get User B's student record.
7. **Cross-User Delete**: Authenticated User A tries to delete User B's student record.
8. **Bypassing Server Timestamp**: Attempt to set `createdAt` to a date in 1999.
9. **Illegal ID**: Attempt to create a document with ID `../../secrets`.
10. **Shadow Update**: Attempt to add an `isAdmin: true` field to a student record.
11. **Malicious List Query**: Attempt to list all students in the database without an `ownerId` filter.
12. **Unverified User Write**: Attempt to write data as a user whose email is not verified (if applicable).

## Test Runner Plan
I will create `firestore.rules.test.ts` to verify these protections.
