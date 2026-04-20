# FastAPI + React Validation Mapping PoC

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.13.7](https://img.shields.io/badge/python-3.13.7-blue.svg)](https://www.python.org/downloads/release/python-3137/)
[![Code style (Python): black](https://img.shields.io/badge/code%20style%20(python)-black-000000.svg)](https://github.com/psf/black)
[![Node 22.19.0](https://img.shields.io/badge/node-22.19.0-3C873A.svg)](https://nodejs.org/en/blog/release/v22.19.0)
[![Code style (TS): Prettier](https://img.shields.io/badge/code%20style%20(TS)-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

<p align="justify">I've always noticed that teams often receive rich validation data from Pydantic but choose to ignore it instead of using its full potential to improve UX in React apps.</p>

<p align="justify">This PoC shows how to keep backend validation as the source of truth and still provide per-field, user-friendly errors on the frontend.</p>

## What was implemented

### Backend (`FastAPI`)

- A single endpoint: `POST /new`
- Request model validation with Pydantic for:
  - `name` (`str`)
  - `email` (`EmailStr`)
  - `company_id` (`UUID`)
  - `type` (`enum`: `admin` or `user`)
  - `startdate` (`datetime`)
- Custom validation error normalization, where FastAPI can return for example this response:

```json
{
  "errors": {
    "email": "value is not a valid email address: The part after the @-sign contains invalid characters: '@'.",
    "company_id": "Input should be a valid UUID, invalid character: found `s` at 2",
    "type": "Input should be 'admin' or 'user'",
    "startdate": "Input should be a valid datetime or date, unexpected extra characters at the end of the input"
  }
}
```

instead of the default `detail` array format.

### Frontend (`React + TypeScript`)

- Vite-based React app with a single form
- UI built with MUI
- Form state handled with React Hook Form
- Optional client-side schema validation with Zod
- On submit, frontend calls backend `POST /new`
- If backend returns validation errors, they are mapped directly to form fields:
  - field marked as invalid (red)
  - helper text shown under the exact field

<p align="center">
<img
src="./resources/ui_validation.png?raw=true"
alt="PNLS system overview"
width="70%"
class="center"
/>
<p align="center">
    <label><b>Fig. 1</b>: PoC UI validation</label>
    </p>
</p>

## Architecture (simple client-server)

This PoC follows a standard client-server flow:

1. User fills the React form and clicks submit.
2. React sends JSON payload to FastAPI.
3. Pydantic validates payload in backend.
4. Backend transforms validation errors into a flat `errors` map.
5. React maps each key (for example, `email` or `company_id`) to the matching input and renders inline feedback.

> [!NOTE]
> The key idea is: backend owns validation rules, frontend owns presentation.

## Run with Docker Compose

Build and run both services:

```bash
docker compose up -d --build
```

Compose starts the backend first, waits until it is healthy, then starts the frontend.

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
