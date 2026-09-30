# Move your two numbers out of GoHighLevel (LC Phone → your own Twilio)

Your numbers are on HighLevel's LC Phone, which is HighLevel's own Twilio account. Moving them to **your** Twilio is a Twilio-to-Twilio account transfer, not a carrier port. It keeps the same numbers, and there's no LOA or 4–6 week carrier wait.
Source: [HighLevel agency support — Moving numbers out of LC Phone to the client's own Twilio account](https://agencysupport.ladesk.com/255641-Moving-numbers-out-of-an-LC-Phone-account-to-the-clients-own-Twilio-account)

## ⚠️ Do this before GHL access ends
Your agency shows **failed payments**. If the sub-account is suspended or closed before the transfer completes, the numbers can be released and lost. Keep the GHL account in good standing until Twilio confirms both numbers are in your account.

## What's moving

| Number | GHL name | Today | After the move |
|---|---|---|---|
| **+1 860-746-9160** | Emmanuel's number (default) | Forwards to 602-810-1271 | Blair Digital Studios business line → forwards to your cell |
| **+1 860-743-4823** | Emmanuel's number 2 | AI demo line on the Cactus revenue system | **Blair Digital Studios AI receptionist** |

- **GHL sub-account:** blair digital studios, Phoenix, AZ
- **Location ID:** `LkfbqNLntxrlHJzfSdsk`

## Step 1: create your own Twilio account (you must do this — I can't create accounts)
1. Sign up at twilio.com and verify your email and phone.
2. **Upgrade out of trial**: add a payment method and fund it. A trial account can't receive transferred numbers.
3. Copy your **Account SID** (starts with `AC`) from the Twilio Console home page. This is the **gaining account SID**.
4. Register for A2P 10DLC (Messaging → Regulatory Compliance) if you want to send SMS from these numbers. Voice works without it.

## Step 2: get HighLevel's losing account SID
Email HighLevel support (support@gohighlevel.com, or chat in-app under **? → Support**):

> Subject: LC Phone number transfer to my own Twilio account — Location LkfbqNLntxrlHJzfSdsk
>
> Hi HighLevel team,
>
> I'm moving my LC Phone numbers to my own Twilio account. Please provide the ISV / losing Twilio Account SID for my sub-account so I can submit the transfer to Twilio, and approve the request when Twilio contacts migration@leadconnectorhq.com.
>
> - Sub-account: blair digital studios (Phoenix, AZ)
> - Location ID: LkfbqNLntxrlHJzfSdsk
> - Numbers: +1 860-746-9160, +1 860-743-4823
> - Gaining Twilio Account SID: AC__________________ (my account)
>
> Thank you,
> Emmanuel Nanadoum

## Step 3: submit the transfer to Twilio support
Twilio Console → **Help → Create a support ticket** (category: Phone Numbers → Transfer numbers between accounts). Paste:

> Subject: Transfer phone numbers between Twilio accounts — HighLevel LC Phone migration
>
> Please transfer the following numbers from the losing account to my gaining account.
>
> - Phone numbers: +18607469160, +18607434823
> - Losing account SID: AC__________________ (HighLevel ISV account, provided by HighLevel)
> - Gaining account SID: AC__________________ (my account)
> - HighLevel Location ID: LkfbqNLntxrlHJzfSdsk
>
> HighLevel is copied for approval: migration@leadconnectorhq.com
>
> This is business-critical; please process at the earliest.

- Add **migration@leadconnectorhq.com** as CC.
- Set impact to **P2 – Degraded** and timeframe to **ASAP**, as HighLevel's article instructs.

## Step 4: after the numbers land in your Twilio
Tell me, and I'll:
1. Attach **+1 860-743-4823** to the Blair Digital Studios AI receptionist (see `02-ai-receptionist-spec.md`).
2. Point **+1 860-746-9160** at a simple forward to 602-810-1271 (or to the receptionist after hours, your choice).
3. Update the portfolio and demo pages with the new setup.

Until the transfer completes, both numbers keep working in GHL as they do today.
