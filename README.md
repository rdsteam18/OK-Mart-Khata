# OK Mart Khata

**OK Mart Khata** is an "udhar khata" (customer credit ledger) PWA for OK Mart —
a small shop's complete credit book: who owes what, who paid, group accounts,
expenses, and net collections. Static HTML + JavaScript, no build step,
no backend server. Data lives in Firebase (Firestore + Email/Password Auth).

**Status:** not deployed anywhere yet. There is no live URL — deploy the repo
root as a static site (GitHub Pages, Netlify, or Firebase Hosting) to go live.
See [Deploy](#deploy) below.

> **Admin-only app (owner decision, 2026-11-13):** the customer self-service
> page (`customer-view.html`, phone + PIN balance check) has been **removed
> entirely**, along with the `customer_pins` PIN system. Customers cannot check
> their own balance in the app — they ask the shopkeeper. Every page in this
> repo requires the admin to be signed in.

## What it does

- **Admin dashboard** (`index.html`) — total due, today's collections, top
  defaulters, recent activity.
- **Customers** (`customers.html`) — add/edit/delete customers, search by name
  or phone, per-customer totals.
- **Customer ledger** (`customer-detail.html`) — add credit (udhar) or payment
  entries per customer, voucher numbers, running balance, printable statement,
  and a proper **invoice** (logo, customer + phone, date, ledger table with
  running balance, totals, footer) with **Download PDF** (html2pdf.js),
  **Share** (Web Share API with PDF file, download fallback) and **Print**.
- **Group khata** (`group-khata.html`) — group accounts with shared members and
  a combined due.
- **Expenses** (`expenses.html`) — record shop expenses by category.
- **Net collection report** (`profit-loss.html`) — collections vs expenses for a
  day/week/month/year or custom range, with category breakdown, trend chart,
  and printable report. Note: the figure labelled "Net Collection" is net cash
  collections (payments received − expenses), not accounting profit — it does
  not count credit extended in the period or cost of goods.
- **Reports** (`reports.html`) — dues and collections reports.
- **Loyalty points** (`loyalty-points.html`) — customer loyalty points.
- **Bulk reminders** (`bulk-reminder.html`) — WhatsApp reminders for customers
  with dues. Each reminder opens one WhatsApp chat; the status logged is
  honest — `opened` (chat opened, owner must still press Send in WhatsApp),
  `blocked` (browser blocked the popup), or `invalid-phone`. Nothing is ever
  logged as `sent`: delivery cannot be confirmed from here.
- **Settings** (`settings.html`) — store name, logo, and app settings.
- **Admin login** (`login.html`) — Firebase Email/Password sign-in; all admin
  pages redirect here when logged out.

## Tech

- 11 HTML pages sharing one stylesheet (`css/khata.css`, OKmart green theme
  `#006d37`, mobile-first) and one Firebase module (`js/firebase.js` — the
  single copy of the Firebase config + init; every page imports
  `{ auth, db }` from it). No framework, no bundler.
- Firebase JS SDK 10.7.0: Firestore for all data, Firebase Auth for the admin.
- PWA: `manifest.json` + `service-worker.js` (cache-first for the app shell,
  versioned cache `okmart-khata-v1`, registered on all pages). The service
  worker only caches same-origin pages plus the logo; Firebase and CDN traffic
  always goes to the network.
- Firebase project: **`ok-mart-khata`** (config lives in `js/firebase.js`).
- Dates are local (IST) date strings everywhere — no UTC shift after evening.
- User-entered text (names, phones, notes) is escaped with `escapeHtml`
  wherever it is rendered via `innerHTML`.

## Run locally

Serve the folder over HTTP — a static server is required (ES module scripts
and the service worker do not work from `file://`):

```bash
cd OK-Mart-Khata
python3 -m http.server 8000
# open http://localhost:8000/
```

Log in with an admin account created in Firebase Auth (project
`ok-mart-khata`).

## Deploy

Deploy the repo root as a static site — no build command needed. Examples:

- **GitHub Pages:** Settings → Pages → deploy from the `main` branch.
- **Netlify:** drag the folder in, or connect the repo (no build command,
  publish directory is the repo root).
- **Firebase Hosting:** `firebase init hosting` and deploy.

After deploying, update the Firebase project (`ok-mart-khata`) Authorized
Domains in the Firebase console to include the deployed domain.

> **Security note:** there is no `firestore.rules` file in this repo, so the
> live Firestore rules must be set in the Firebase console. The app is
> admin-only now (the unauthenticated customer page is gone), but the rules
> still need to be written and deployed before going live. See
> `audit-2026-11-13.md` for the full audit (written before the customer page
> was removed — its customer-view findings no longer apply).

## Repo layout

```
index.html            Dashboard
customers.html        Customer list
customer-detail.html  Per-customer ledger + invoice (PDF / Share / Print)
group-khata.html      Group accounts
expenses.html         Expenses
profit-loss.html      Net collection report
reports.html          Reports
loyalty-points.html   Loyalty points
bulk-reminder.html    Bulk WhatsApp reminders (honest status logging)
settings.html         Store settings
login.html            Admin login
manifest.json         PWA manifest
service-worker.js     PWA service worker
css/khata.css         ONE shared stylesheet (green theme, all pages)
js/firebase.js        ONE shared Firebase config + init
assets/images/
  okmart-logo.png     Local OKmart logo (Blogger URL is the onerror fallback)
```

## History

- Built in a single day (13 May 2026), untouched for ~6 months.
- 2026-11-13 cleanup: manifest icons fixed to the hosted logo and `start_url`
  set to the dashboard; service worker registered on all pages; "Profit"
  relabelled "Net Collection"; `createdAt` switched to Firestore
  `serverTimestamp()`; date handling fixed to local (IST) dates; demo
  credentials removed from `login.html`; this README added.
- 2026-11-13 UI overhaul + invoice: `css/khata.css` rebuilt as the one shared
  stylesheet (OKmart green `#006d37`, mobile-first) and linked from all pages;
  consistent brand bar (logo + app name) on every admin page; Firebase config
  extracted into `js/firebase.js`; user data escaped via `escapeHtml`;
  per-customer invoice template on `customer-detail.html` (Download PDF /
  Share / Print); billing flow with inline success/error feedback; reminder
  flows log honest status (`opened` / `blocked` / `invalid-phone`).
- 2026-11-13 owner decision: **customer self-service removed** —
  `customer-view.html` and the `customer_pins` PIN system deleted; the app is
  admin-only.
