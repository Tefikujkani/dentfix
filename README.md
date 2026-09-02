# Dentfix

A full-stack clinic site: a Next.js + Tailwind frontend and an Express REST API with MongoDB, double-booking protection, and booking emails.

## Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React
- **Backend:** Express, Zod validation, Mongoose
- **Database:** MongoDB (in-memory fallback in development if Mongo is not running)
- **Email:** SendGrid, SMTP, or Ethereal test inboxes in development

## Run locally

**1. API**

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

The API starts at `http://localhost:4000`. If MongoDB is not available, development mode keeps data in memory for the lifetime of the process.

**2. Optional MongoDB**

```bash
docker compose up -d
cd backend
npm run seed
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Next.js proxies `/api/*` to the Express server.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/appointments` | Create a pending appointment, upsert the patient, reject double-booked dentist slots |
| `GET` | `/api/availability?date=YYYY-MM-DD&dentist_id=` | Remaining morning/afternoon slots |
| `GET` | `/api/services` | Treatment catalog with duration and base price |
| `GET` | `/api/dentists` | Available dentists |

Appointment payload:

```json
{
  "full_name": "Jordan Lee",
  "email": "jordan@example.com",
  "phone": "+1 555 010 8899",
  "service_type": "general-checkup",
  "dentist_id": "<dentist id>",
  "date": "2026-09-04",
  "time_slot": "morning",
  "notes": ""
}
```

`time_slot` is `morning` or `afternoon`. Status values are `pending`, `confirmed`, `completed`, and `cancelled`.

## Email

Set `SENDGRID_API_KEY` or SMTP fields in `backend/.env`. With neither set, Nodemailer uses an Ethereal test account and prints preview URLs in the API console.
