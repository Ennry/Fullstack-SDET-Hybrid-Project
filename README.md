[![CI](https://github.com/Ennry/Fullstack-SDET-Hybrid-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Ennry/Fullstack-SDET-Hybrid-Project/actions/workflows/ci.yml)

# Playwright Hybrid Testing Framework Made from Scratch by [Ennry](https://github.com/Ennry)

## Architecture

This framework is built as a **hybrid UI + API** test solution using Playwright + TypeScript.

### Key Layers

- **Tests (`tests/*.spec.ts`)**
    - Contains test scenarios only (assertions + orchestration).
    - Uses fixtures for authenticated UI and API contexts.
    - Includes `try/finally` cleanup to prevent orphaned test data.

- **Page Objects (`pages/*.ts`)**
    - Encapsulates UI selectors and UI actions using modern **Locator-based API**.
    - Uses getter pattern for lazy locator initialization.
    - Keeps tests readable and reduces duplication.

- **API Layer (`utils/apiHelper.ts`)**
    - Fluent helper for HTTP requests (`GET/POST/PUT/DELETE`).
    - Built-in **retry mechanism** for flaky requests.
    - **Generic return types** for type-safe responses.
    - Auto-resets endpoint path after each request to prevent stale state.
    - Handles base URL, headers (auth token), logging, and expected status checks.

- **Test Data (`utils/dataFactory.ts`)**
    - Generates unique and reusable payloads for API/UI (e.g., articles).
    - Separate factories for create and update operations.

- **Fixtures (`utils/fixtures.ts`)**
    - Central place for Playwright test fixtures.
    - Provides:
        - `authToken`: shared authentication token (single login per test)
        - `authApi`: authenticated API client (token attached)
        - `authPage`: authenticated browser page (localStorage injection)
        - `stateManager`: test-scoped state (safe for parallel execution)

- **State Management (`utils/stateManager.ts`)**
    - Factory-based instantiation — each test gets its own instance.
    - Stores data created during tests (e.g., `slug`, `articleId`) to share across steps.
    - Supports cleanup and avoids global variables.

- **Contract Testing (`schemas/*.json` + `utils/schemaValidator.ts`)**
    - Validates API responses against JSON Schemas (AJV).
    - **Schema caching** to avoid recompilation overhead.
    - Validates both single article and article list item structures.
    - Ensures response structure is correct, not only status codes.

- **Configuration (`utils/config.ts`)**
    - **Fail-fast validation** for required environment variables.
    - Environment-based configuration via `.env` files.

---

### Hybrid Test Flow (API → UI → API)

1. **API creates data** quickly (e.g., create an article)
2. **UI verifies** the data is displayed correctly
3. **API cleans up** (delete the article) to keep tests isolated
4. **`try/finally`** ensures cleanup runs even on test failure

---

## Skills & Features

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![k6](https://img.shields.io/badge/k6-7D64FF?style=flat&logo=k6&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)

| Category | Skill | Implementation |
|----------|-------|----------------|
| **Testing** | API Testing | Fluent API Helper with retry & generics |
| | UI Testing | Page Object Model (Locator API) |
| | Hybrid Testing | API + UI Combined |
| | Contract Testing | JSON Schema / AJV with caching |
| | Data-Driven | Parameterized Tests |
| | Error Handling | Negative Test Cases (401, 404, 422) |
| | Cross-Browser | Chrome, Firefox, Safari |
| | Mobile Testing | Pixel 5, iPhone 12 |
| | Performance Testing | Page Load & API Response (Performance API) |
| | Load Testing | k6 Scripts with staged load |
| **Design Patterns** | Fluent Interface | `apiHelper.ts` |
| | Factory Pattern | `dataFactory.ts` |
| | Page Object Model | `pages/*.ts` |
| | Builder Pattern | API chaining `.path().getRequest()` |
| | Singleton Guard | Factory-based state management |
| **Utilities** | Custom Logger | Request/Response Logging |
| | Config Manager | Env-based with fail-fast validation |
| | State Manager | Test-scoped (parallel-safe) |
| | Schema Cache | Compiled schema reuse |
| **DevOps** | CI/CD | GitHub Actions (multi-browser matrix) |
| | Reporting | Playwright HTML + Allure |
| | Artifact Upload | Test reports per browser |
---

### Custom Logger Example

```typescript
// Automatic logging for all requests
[REQUEST] 2026-01-08T10:30:45.123Z - POST /articles
Body: { "article": { "title": "Test" } }
[RESPONSE] 2026-01-08T10:30:45.456Z - Status: 201
[SUCCESS] Article created: test-article-123
```

### Fluent API Helper Example

```typescript
// Clean, chainable syntax with retry support
const response = await authApi
    .path('/articles')
    .withRetry(3, 1000)
    .postRequest<ArticleResponse>(201, dataFactory.article('Test'))

// response.article.slug has full autocomplete
```

### Data Factory Example

```typescript
// Reusable test data with unique timestamps
const article = dataFactory.article('CRUD')
// Returns: { article: { title: "CRUD Article 1704700000000", ... } }

const update = dataFactory.updateArticle('Updated')
// Returns: { article: { title: "Updated Article 1704700000001", ... } }
```

### Guaranteed Cleanup Example

```typescript
// Tests always clean up, even on failure
test('Create and verify', async ({ authApi, authPage }) => {
    let slug: string | undefined

    try {
        const response = await authApi
            .path('/articles')
            .postRequest(201, dataFactory.article('Test'))
        slug = response.article.slug
        if (!slug) throw new Error('No slug returned')

        // Test assertions here...
    } finally {
        if (slug) {
            await authApi.path(`/articles/${slug}`).deleteRequest()
        }
    }
})
```

## Hybrid Testing Approach

```text
Traditional UI Test (Slow):
├── Login via UI (5 sec)
├── Create article via UI (10 sec)
├── Verify article (5 sec)
└── Total: 20+ seconds

Hybrid Test (Fast):
├── API: Create article (1 sec)
├── UI: Verify display (3 sec)
├── API: Cleanup (1 sec)
└── Total: 5 seconds (4x faster)
```

### Example Hybrid Test

```typescript
test('Create via API, Verify in UI', async ({ authApi, authPage }) => {
    let slug: string | undefined

    try {
        // API: Fast data creation
        const response = await authApi
            .path('/articles')
            .postRequest(201, dataFactory.article('Hybrid'))
        slug = response.article.slug
        if (!slug) throw new Error('No slug returned')

        // UI: Verify it displays correctly
        const articlePage = new ArticlePage(authPage)
        await articlePage.goto(slug)
        expect(await articlePage.getTitle()).toContain('Hybrid')
    } finally {
        // API: Fast cleanup (always runs)
        if (slug) {
            await authApi.path(`/articles/${slug}`).deleteRequest()
        }
    }
})
```

## Project Structure

```text
Fullstack-SDET-Hybrid-Project/
│
├── 📂 .github/workflows/
│   └── ci.yml                    # CI/CD pipeline (lint → smoke → api/ui → hybrid → allure)
│
├── 📂 pages/
│   ├── BasePage.ts               # Base class with navigation
│   ├── LoginPage.ts              # Login form interactions
│   ├── HomePage.ts               # Article feed & tags
│   ├── ArticlePage.ts            # Article view & delete
│   └── EditorPage.ts             # Article creation form
│
├── 📂 tests/
│   ├── 📂 api/
│   │   ├── api.spec.ts           # CRUD lifecycle + schema validation
│   │   ├── data-driven.spec.ts   # Parameterized positive & negative
│   │   └── error-handling.spec.ts # 401, 404, 422 scenarios
│   ├── 📂 hybrid/
│   │   └── hybrid.spec.ts        # API ↔ UI cross-layer verification
│   ├── 📂 ui/
│   │   └── login.spec.ts         # Login flows & error states
│   └── 📂 performance/
│       └── performance.spec.ts   # Page load & API benchmarks
│
├── 📂 load-tests/
│   └── articles-load.js          # k6 staged load test
│
├── 📂 schemas/
│   ├── article.schema.json       # Single article schema
│   ├── articles.schema.json      # Article list schema (with item validation)
│   └── tags.schema.json          # Tags endpoint schema
│
├── 📂 utils/
│   ├── apiHelper.ts              # Fluent API client (retry, generics, auto-reset)
│   ├── fixtures.ts               # Playwright fixtures (shared auth token)
│   ├── schemaValidator.ts        # JSON Schema validation (with caching)
│   ├── dataFactory.ts            # Test data generators
│   ├── stateManager.ts           # Test-scoped state (parallel-safe)
│   ├── logger.ts                 # Structured request/response logging
│   └── config.ts                 # Config with fail-fast env validation
│
├── .env.example
├── .env.staging.example
├── .env.production.example
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Ennry/Fullstack-SDET-Hybrid-Project.git

# Navigate to project
cd Fullstack-SDET-Hybrid-Project

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Setup environment
cp .env.example .env
# then edit .env with your credentials from https://conduit.bondaracademy.com

# Run all tests
npx playwright test

# View report
npx playwright show-report
```

## Test Commands

| Command                                     | Description              |
| ------------------------------------------- | ------------------------ |
| `npx playwright test`                       | Run all tests            |
| `npx playwright test --project=api-tests`   | Run API tests only       |
| `npx playwright test --project=performance` | Run performance tests    |
| `npx playwright test --grep "@smoke"`       | Run smoke tests          |
| `npx playwright test --grep "@crud"`        | Run CRUD tests           |
| `npx playwright test --grep "@negative"`    | Run error handling tests |
| `npx playwright test --grep "@hybrid"`      | Run hybrid tests         |
| `npx playwright test --grep "@performance"` | Run performance tests    |
| `npx playwright show-report`                | View HTML report         |
| `k6 run load-tests/articles-load.js`        | Run k6 load test         |

## Multi-Environment Support

```bash
# Staging (default)
npx playwright test

# Production
TEST_ENV=prod npx playwright test

# Local development
TEST_ENV=local npx playwright test
```

## Test Categories

| Tag            | Purpose             | Tests                         |
| -------------- | ------------------- | ----------------------------- |
| `@smoke`       | Quick health check  | GET endpoints                 |
| `@crud`        | Full lifecycle      | Create, Read, Update, Delete  |
| `@negative`    | Error handling      | 401, 404, 422 responses       |
| `@data-driven` | Multiple variations | Valid & invalid data          |
| `@schema`      | Contract testing    | JSON Schema validation        |
| `@hybrid`      | UI + API combined   | Fast, reliable tests          |
| `@performance` | Performance testing | Page load, API response times |

## Cross-Browser Testing

| Browser       | Command                                       |
| ------------- | --------------------------------------------- |
| Chrome        | `npx playwright test --project=chromium`      |
| Firefox       | `npx playwright test --project=firefox`       |
| Safari        | `npx playwright test --project=webkit`        |
| Mobile Chrome | `npx playwright test --project=mobile-chrome` |
| Mobile Safari | `npx playwright test --project=mobile-safari` |
| All Browsers  | `npx playwright test`                         |

## API Helper Usage

```TypeScript
// Fluent syntax with generics and retry
const response = await authApi
    .path('/articles')
    .withRetry(3, 1000)
    .postRequest<ArticleResponse>(201, {
        article: {
            title: 'Test Article',
            description: 'Test description',
            body: 'Test body',
            tagList: ['test']
        }
    })

expect(response.article.slug).toBeDefined()
```

## Page Object Model

```TypeScript
// Modern Locator-based Page Objects
export class ArticlePage extends BasePage {
    private get articleTitle() { return this.page.locator('h1') }
    private get deleteButton() { return this.page.locator('button:has-text("Delete Article")') }

    async getTitle() {
        return await this.articleTitle.textContent()
    }
}

// Clean test usage
const articlePage = new ArticlePage(page)
await articlePage.goto(slug)
expect(await articlePage.getTitle()).toContain('My Article')
```

## Environment Variables

Create a .env file based on .env.example:

```env
API_BASE_URL=https://conduit-api.bondaracademy.com/api
UI_BASE_URL=https://conduit.bondaracademy.com
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password
TEST_ENV=staging
```

## CI/CD Pipeline

Tests run automatically on:

- Push to `main` branch
- Pull requests to `main` branch
- Manual trigger with test type selection

View results: [GitHub Actions](https://github.com/Ennry/Fullstack-SDET-Hybrid-Project/actions)

## License & Credits

### License

This project is **proprietary** created by **Ennry** from scratch as a personal portfolio project.
See [LICENSE](LICENSE) for details.

### API Credit

The API used for testing is provided by **[Bondar Academy](https://www.bondaracademy.com)**.

- API: `https://conduit-api.bondaracademy.com/api`
- UI: `https://conduit.bondaracademy.com`

This project is for educational purposes and is not affiliated with Bondar Academy.
