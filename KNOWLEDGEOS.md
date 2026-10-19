# KnowledgeOS invite-only document pilot

## What this adds

`/knowledgeos/workspace` provides workspace sign-in, private UTF-8 text/Markdown ingestion (100 KB per document), source inventory, permanent deletion, and source-linked extractive search. The existing `/knowledgeos` sample demo stays independent. Private documents are never sent to Gemini or another model. Search returns original text rather than generated answers. This is not semantic search: paraphrases and synonyms can miss evidence; matching passages must be read before drawing conclusions.

## Activate on the existing Vercel project

Use a **private Vercel Blob store** and its server-only `BLOB_READ_WRITE_TOKEN`. Do not use a public store. Add these server-only environment variables:

- `KNOWLEDGEOS_SESSION_SECRET`: independently generate 32 random bytes encoded as base64url (`node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`).
- `KNOWLEDGEOS_WORKSPACES`: JSON array of invitation records, e.g. `[<record>]`. Generate each record locally with `node scripts/knowledgeos-invite.mjs alpha "Alpha Team"`. Use the generated random key, never an ordinary password.

Save keys in a password manager and deliver each invitation privately. Do not commit real keys. Redeploy after configuring variables. Invite keys grant full read/write/delete access to that workspace; issue separate workspaces for separate clients. This is a small invited pilot, not per-user enterprise identity or public self-service SaaS.

Cookies are HttpOnly, Secure in production, SameSite Strict, signed, and expire after eight hours. Changing a workspace key revokes its existing sessions on the next deployment. Removing a workspace disables its access without deleting its files. Signing out clears the current browser cookie; stolen cookies otherwise remain valid until expiry or key rotation.

Workspace IDs come from verified server configuration, never request bodies. Every private operation validates the signed session. Blob document paths are scoped to that ID. Cross-origin mutations are rejected. Read and mutation responses have `Cache-Control: no-store`. Text is rendered as escaped text, never HTML.

## Verification

Run `node --experimental-strip-types --test test/knowledgeos-workspace.test.mjs` and `npm run typecheck` / `npm run build`.

After deployment, use two generated workspaces to validate the real service:

1. Signed-out inventory, upload, search, and delete must return 401.
2. Sign into Alpha, upload a text document with a unique phrase, and verify its title persists after reload.
3. Search that phrase; confirm the excerpt exactly matches the original source.
4. Sign out and sign into Beta; Alpha's title and phrase must be absent. Attempting to delete Alpha's UUID must leave Alpha's document intact.
5. Return to Alpha, delete the document, reload, and confirm it no longer appears in search.
6. Unsupported queries return the refusal. Invalid/expired/tampered sessions fail closed.
7. Missing storage configuration must show an error, never a successful save.

Do not label deployment verified until these real Blob-backed checks pass.

## Pilot limits

No PDF/DOCX parser, OCR, semantic vector index, AI synthesis, SSO, member roles, per-user attribution, audit retention, billing, or public registration is included. Documents remain until explicitly deleted; no backup restore is provided. The API lists and searches the entire workspace, so restrict invitations and corpus size during the pilot. Random 256-bit invitation keys prevent practical guessing; there is no distributed rate limiter, so set platform request limits before broader access. Document deletion removes it from subsequent retrieval; already displayed excerpts remain in an open browser until refresh.
