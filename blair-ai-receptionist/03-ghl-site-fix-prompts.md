# Fix the two demo sites inside GHL AI Studio

GHL → **blair digital studios** sub-account → **AI Studio** → open the project → paste the prompt into the builder chat → review the preview → **Publish**.

---

## Blair MedSpa — replace template placeholders

Paste into the **Blair MedSpa** project:

```
Replace every template placeholder on every page (header, footer, home, treatments and each treatment detail page, about, results, membership, contact, consultation, privacy, terms, SMS terms):

- {{location.phone}} and every "(000) 000-0000" → the plain text "Your practice phone"
- {{location.email}} → the plain text "Your practice email"
- {{location.address}} → the plain text "Your practice address"

Render these as plain text, not links: remove every tel: and mailto: link that points to a {{location.*}} value. The header "CALL" button should scroll to the consultation section instead of dialing.

Replace the generic facebook.com and instagram.com footer links with non-clickable text "Social links".

Add one slim, quiet banner at the very top of every page, in the site's existing typography and colors: "Template preview by Blair Digital Studios — contact details are placeholders."

Do not change anything else: layout, colors, fonts, imagery, copy and section order stay exactly as they are.
```

**Check before publishing:** search the preview for `{{` and `(000)`. Both should be gone.

---

## Cactus Chiro — replace the dead booking link

Paste into the **Cactus Chiro** project:

```
On the /revenue-system page, the "Book a Demo with Blair" button links to https://api.leadconnectorhq.com/widget/bookings/blair-chiro-revenue-demo, which returns a 404.

Change only that button's link to:
mailto:nanadoum81@gmail.com?subject=Blair%20Revenue%20System%20walkthrough

Change the small caption under it from "OPENS BLAIR DIGITAL STUDIOS BOOKING CALENDAR" to "EMAILS BLAIR DIGITAL STUDIOS".

Leave the AI receptionist number (860) 743-4823 and everything else on the page exactly as it is.
```

**Check before publishing:** click the button in the preview. It should open an email, not a 404.
