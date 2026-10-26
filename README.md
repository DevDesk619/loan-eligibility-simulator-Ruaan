# Loan Eligibility Simulator

A responsive React + TypeScript demo. It estimates loan affordability using deterministic mock data, so **no API server, credentials, or real customer data are required**. Results are illustrative only and are not a lending decision or financial advice.

## Requirements

- Node.js 20+ (Node.js 22 recommended)
- npm
- Docker (optional, for the container workflow)

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Mock mode is enabled by default; no environment file is needed.

## Quality checks

```bash
npm test
npm run build
```

The tests cover loan payment calculations, mock response shape, product limits, and form validation. Before submitting, manually verify the main user journey at desktop and mobile widths, including changing loan type, submitting valid values, invalid values, resetting the form, and checking that the results update.

## Run with Docker

```bash
docker build -t loan-eligibility-simulator .
docker run --rm -p 8080:80 loan-eligibility-simulator
```

Open http://localhost:8080. The Docker image builds the Vite app and serves its static assets through Nginx.

## Project structure

```text
src/
  components/                   Reusable UI components
  features/eligibility/         Feature defaults and loan-product configuration
  hooks/                        React state and submission lifecycle
  services/                     Service boundary and isolated mock implementation
  utils/                        Formatting, validation, and pure calculations
  types.ts                      Shared domain and API contract types
```

## Architecture notes

- `App.tsx` composes the page from smaller components; it does not contain all form and result markup.
- `LoanApplicationForm` renders inputs and emits typed field changes. `EligibilityResults` presents the response. `SiteChrome` owns the reusable page sections.
- `useEligibilitySimulator` owns form state, validation state, submission lifecycle, and error handling.
- `utils/validation.ts` contains deterministic client-side validation. `utils/loanCalculations.ts` contains pure financial formulas.
- `api/client.ts` configures one shared Axios client. `api/mockAdapter.ts` registers mock HTTP routes in the same style as a backend API, with a small simulated response delay. `services/loanService.ts` exposes typed functions the UI calls. `services/mockLoanService.ts` contains deterministic domain calculations and mock response data. This keeps routing, HTTP configuration, business rules, and UI responsibilities separate.
- `features/eligibility/loanConfiguration.ts` centralises loan-type limits, terms, and purpose options.
- Shared request/response contracts are defined in `types.ts`.

## About the supplied endpoint specification

The endpoint document describes a possible backend contract; it does not provide a running API. The app therefore uses an Axios mock adapter by default; no backend is required. Mock requests follow the documented endpoint paths and request/response flow. The optional real HTTP mode is only for future integration; If that happens, set `VITE_API_BASE_URL` to the backend's actual base URL and set `VITE_USE_MOCK_API=false`. Environment variables are embedded at build time, so restart Vite or rebuild the Docker image after changing them.

## Demo and privacy notes

The app does not save submitted form values. Use fictional example values only. Mock approval likelihood and risk categories are for demonstrating the frontend flow and must not be presented as genuine credit demo logic.

## Recent usability and edge-case handling

- Existing monthly debt can be cleared without a forced zero remaining visible in the input; zero is still a valid value.
- An estimate is blocked when monthly expenses plus existing debt exceed monthly income. The form shows an explanatory warning and the submit action remains disabled until the figures are affordable.
- A light/dark theme toggle is available in the header. The selected theme is saved in browser local storage when available; the app continues to work if storage is unavailable.
- Input validation covers out-of-range and non-finite values, zero expenses, zero existing debt, loan-type-specific limits, and incompatible loan purposes.

