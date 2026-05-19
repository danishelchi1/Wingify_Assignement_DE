# Dream Portal Playwright Automation

This project contains automated tests for the Dream Portal assignment using Playwright, TypeScript, and the Page Object Model.

The tests validate the public Dream Portal site:

```text
https://arjitnigam.github.io/myDreams/
```

## What Is Covered

- Home page loader behavior
- Home page `My Dreams` button behavior
- Dream Diary table validation
- Dream Summary statistics validation
- Optional AI-based dream classification validation using OpenAI

## Tech Stack

- Playwright Test
- TypeScript
- Page Object Model
- HTML report
- Allure reporter
- OpenAI Node SDK

## Project Structure

```text
.
|-- pages/
|   |-- HomePage.ts
|   |-- DreamDiaryPage.ts
|   `-- DreamSummaryPage.ts
|-- tests/
|   |-- homepage.spec.ts
|   |-- dreamDiary.spec.ts
|   |-- dreamTotal.spec.ts
|   `-- APIvalidation.spec.ts
|-- utils/
|   `-- aiValidator.ts
|-- test-data/
|-- playwright.config.ts
|-- package.json
|-- .env.example
`-- README.md
```

## Important Files

`playwright.config.ts`

Contains the test configuration, including:

- base URL: `https://arjitnigam.github.io/myDreams/`
- HTML reporter
- Allure reporter
- screenshots only on failure
- video retained on failure
- trace on first retry
- headed browser mode

`pages/`

Contains page object classes. Tests should call page methods instead of directly repeating selectors.

`utils/aiValidator.ts`

Contains `classifyDream(dreamName)` for OpenAI-based dream classification.

## Prerequisites

Install these before running the project:

- Node.js
- npm

To check if they are installed:

```powershell
node -v
npm -v
```

## Setup

Install project dependencies:

```powershell
npm install
```

Install Playwright browsers:

```powershell
npx.cmd playwright install
```

In GitHub Actions, the workflow installs `xvfb` and runs tests with `xvfb-run -a` to avoid WebKit display errors.

## Environment Variables

The OpenAI validation test can use an API key from `.env`.

Create a local `.env` file:

```powershell
Copy-Item .env.example .env
```

Add your API key:

```text
OPENAI_API_KEY= Your API key
```

Do not commit `.env`. It is ignored by `.gitignore`.

## Running Tests

Run all tests:

```powershell
npx playwright test
```

Run only Chromium:

```powershell
npx playwright test --project chromium
```

Run a specific test file:

```powershell
npx playwright test tests/homepage.spec.ts
npx playwright test tests/dreamDiary.spec.ts
npx playwright test tests/dreamTotal.spec.ts
npx playwright test tests/APIvalidation.spec.ts
```

List tests without running them:

```powershell
npx playwright test --list
```

## Test Files

`tests/homepage.spec.ts`

Validates:

- loader is visible
- loader disappears after about 3 seconds
- `My Dreams` button is visible
- clicking `My Dreams` opens diary and summary pages in new tabs

`tests/dreamDiary.spec.ts`

Validates:

- Dream Diary has exactly 10 entries
- dream types are only `Good` or `Bad`
- every row has populated values
- table headers are correct

`tests/dreamTotal.spec.ts`

Validates:

- Good Dreams count is `6`
- Bad Dreams count is `4`
- Total Dreams count is `10`
- Recurring Dreams count is `2`
- recurring dream names are exactly:
  - `Flying over mountains`
  - `Lost in maze`

`tests/APIvalidation.spec.ts`

Validates:

- each dream name from the diary table is classified by `classifyDream()`
- the AI classification matches the UI dream type
- duplicate dream names are classified only once using a `Map` cache

## OpenAI Usage In This Assignment

This is a recruitment assignment, and I am unable to purchase paid OpenAI tokens for this submission.

I have still implemented `tests/APIvalidation.spec.ts` to demonstrate how website data can be passed to an AI validation utility. If a valid `OPENAI_API_KEY` with available quota is provided, the test calls OpenAI and compares the AI classification with the Dream Diary table value.

If the key is missing, invalid, or has no available quota, `utils/aiValidator.ts` falls back to a local keyword-based classifier. This keeps the assignment runnable for reviewers while still showing the intended OpenAI integration approach.

During validation, the OpenAI request reached the API successfully, but the account returned a quota/token error:

```text
429 You exceeded your current quota
```

This confirms that the SDK integration and API-key loading are wired correctly. With an API key that has available tokens/quota, the same test will use the live OpenAI response instead of fallback.

## Reports

After running tests, open the Playwright HTML report:

```powershell
npx.cmd playwright show-report
```

Allure result files are generated in:

```text
allure-results/
```

## Test Screenshots And Evidence

Important successful checkpoints are captured as screenshots during the tests using `testInfo.attach()`.

Screenshots are stored in:

```text
test-results/
```

They are also attached to the Playwright report and the generated Allure result files.

Examples of captured evidence:

- homepage loader visible
- homepage main content visible
- Dream Diary row count verified
- Dream Diary dream types verified
- Dream Summary counts verified
- recurring dream validation
- AI validation table data loaded
- AI classifications compared with UI values

Run all Chromium tests and generate fresh screenshots:

```powershell
npx playwright test --project chromium
```

The Playwright HTML report can be opened with:

```powershell
npx playwright show-report
```

To generate the Allure HTML report from `allure-results/`, Java must be installed and configured. Then run:

```powershell
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## Notes For Windows PowerShell

Use `npx.cmd` instead of `npx` if PowerShell blocks script execution.

Example:

```powershell
npx.cmd playwright test
```

## Troubleshooting

If no tests are found, run:

```powershell
npx.cmd playwright test --list
```

If browser binaries are missing, run:

```powershell
npx.cmd playwright install
```

If OpenAI validation does not use the API, confirm:

- `.env` exists
- `OPENAI_API_KEY` is set
- the key is valid

If the OpenAI API call fails, `classifyDream()` falls back to local keyword-based classification so the test can still complete.
