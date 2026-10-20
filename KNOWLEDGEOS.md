# KnowledgeOS private workspace

## Available functionality

- Invite-only workspaces with signed eight-hour HttpOnly sessions.
- Per-member owner, editor, and viewer roles; invite creation, immediate revocation, and owner activity view.
- Private text/Markdown sources (100 KB), readable PDFs (2 MB / 50 pages), source inventory and deletion.
- Lexical source search without a model call.
- Optional Gemini semantic indexing with persisted 768-dimensional chunk vectors.
- Optional Gemini answer drafts with source citations and validated verbatim supporting quotes. Invalid output/provider failures return original extracts; absent evidence returns a refusal.
- Persistent audit metadata for uploads, deletion, indexing, AI questions, invitations and revocation. No source text, questions or credentials in activity records.
- Atomic create-if-absent daily AI reservations: 50 indexing/question operations per workspace per UTC day, including failed attempts. Each question can use one embedding call plus one generation call; indexing embeds document windows in batches. No recurring jobs.

## Production configuration

Use a private Vercel Blob store with server-only `BLOB_READ_WRITE_TOKEN`. Set:

- `KNOWLEDGEOS_SESSION_SECRET`: independent random 32-byte base64url value.
- `KNOWLEDGEOS_WORKSPACES`: JSON array of `{id,name,key}` bootstrap-owner records. Generate a record with `node scripts/knowledgeos-invite.mjs blair-pilot "Blair Digital Studios"`. Use the generated random key, never a human password. Workspace IDs must be unique lowercase letters/digits/hyphens.
- `GEMINI_API_KEY`: existing server-only Google API key enables AI mode.
- Optional `KNOWLEDGEOS_MODEL` (default `gemini-flash-latest`) and `KNOWLEDGEOS_EMBEDDING_MODEL` (default `gemini-embedding-2`). Changing embedding models requires reindexing existing documents.

Bootstrap keys remain server configuration and should be kept in a password manager. Owners issue individual invitations from Team access. Invitation keys are shown once; only their SHA-256 hashes are stored. Member sessions are checked against current membership on every private operation. Revocation disables existing sessions. Root key rotation needs a redeploy and invalidates root sessions. Signout clears the current browser cookie; a copied cookie otherwise remains valid until revocation, key rotation or expiry.

Preview and production must use separate session secrets and bootstrap keys. Existing preview/prod Blob credentials may point at the same store, so use separate workspace IDs for tests. The integration suite generates unique QA workspaces, then deletes all test documents, membership, audit and budget records it creates.

## Data handling and limits

Uploads are parsed locally and stored privately. Readable PDF text is retained with page markers; original PDF binaries are not retained. Scanned PDFs need OCR first. Password-protected PDFs are rejected. PDF actions/scripts are not executed.

AI indexing sends the selected document to Gemini. AI questions send the question and retrieved evidence to Gemini. Each is an explicit UI choice; source search remains model-free. Model drafts can still contain reasoning errors despite citation and quote validation: verify the displayed original evidence. Retrieved documents are treated as untrusted data and have no tools or access to other workspaces.

50 documents and 50 invitations per workspace are supported. This implementation loads a bounded pilot-sized corpus, not a large external vector database. Capacity checks are advisory under simultaneous uploads/invitations; AI budget reservations are atomic. The owner activity view shows the most recent 50 events from up to 10,000 retained event metadata records. Audit records remain until an administrator applies a retention policy. Completed status is best effort after an intent event; a surviving requested event may indicate an interrupted operation. Refresh after ambiguous errors before retrying mutations.

This is an invite-only product. Public registration, subscriptions/payment collection, enterprise SSO, email password reset, OCR and DOCX ingestion are outside this release. There are no claims of regulatory certification. Public portfolio pages describe the available release without invented adoption or outcome metrics.

## Verification

```
npm run test:knowledgeos
npm run typecheck
npm run build
node test/knowledgeos-http.test.mjs
# With a private Blob token supplied through the environment:
node test/knowledgeos-blob.test.mjs
node test/knowledgeos-release.test.mjs
node --import tsx test/knowledgeos-budget.test.mjs
```

The release suite checks real storage, PDF upload, per-role permissions, invite revocation with existing sessions, audit isolation, AI budget conflicts and source deletion. Provider-specific behavior must also be checked against a deployed Vercel environment with the server-only Gemini key. A compile or unit-test pass alone is not evidence of a working deployed model.

Production smoke checks: sign in, upload a synthetic source, enable semantic search, ask a paraphrased supported question, verify the excerpt/citation, ask an unsupported question, verify viewer mutation rejection, revoke a test invitation, then delete the synthetic source and test member record. Never use customer documents as deployment test fixtures.

## Product experience

The workspace includes an overview and first-run guide, a searchable source library, an authenticated full-text preview with text download, a separate question workspace, copyable evidence and recent questions held only for the current page session. The overview displays actual document/index counts and the current UTC-day AI usage. A read-only tour at `/knowledgeos/workspace?demo=1` uses explicitly synthetic documents and the public sample-query API. It does not call private inventory or membership endpoints, bypass private authentication, or enable writes. `/knowledgeos` directs visitors to this tour.
