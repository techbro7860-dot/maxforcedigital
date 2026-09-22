# Maxforce Digital — local and production setup

## Local development

1. Copy `.env.local.example` to `.env.local` and fill in the required values.
2. Run `npm ci`.
3. Start MongoDB or provide a MongoDB Atlas connection string.
4. Run `npm run dev`.
5. Create the administrator with `npm run setup:admin`.

## Import approved WordPress content

The importer is deliberately dry-run by default:

```bash
npm run import:maxforce
```

Review the approved and excluded post slugs, then write to MongoDB:

```bash
npm run import:maxforce -- --write
```

Imported courses and eBooks are active with manual fulfilment. Customers can
complete checkout, and an administrator sends the course or download link
after confirming payment. Products can later be changed to secure-download or
protected external-link delivery in Admin → Products.

## Payment setup

Use Razorpay test credentials during development. Configure the production
webhook as:

```text
https://maxforcedigital.com/api/payments/razorpay/webhook
```

Do not enable live payments until signature verification, webhook replay,
purchase confirmation, invoice delivery, and protected access have all been
tested in staging.

## Launch checklist

- Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to the production domain.
- Use production MongoDB, Cloudinary, Razorpay, SMTP and SMS credentials.
- Import only the reviewed WordPress products and three approved blog posts.
- Verify every legacy redirect in `next.config.js`.
- Replace placeholder team biographies and confirm the legal company name,
  address, phone number, policies and refund rules.
- Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- Keep WordPress available as a rollback until payment and download monitoring
  remain healthy after launch.
