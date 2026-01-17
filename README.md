[![CI](https://github.com/Ennry/Fullstack-SDET-Hybrid-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Ennry/Fullstack-SDET-Hybrid-Project/actions/workflows/ci.yml)

## Architecture

This framework is built as a **hybrid UI + API** test solution using Playwright + TypeScript.

### Key Layers

- **Tests (`tests/*.spec.ts`)**
  - Contains test scenarios only (assertions + orchestration).
  - Uses fixtures for authenticated UI and API contexts.

- **Page Objects (`pages/*.ts`)**
  - Encapsulates UI selectors and UI actions.
  - Keeps tests readable and reduces duplication.

- **API Layer (`utils/apiHelper.ts`)**
  - Fluent helper for HTTP requests (`GET/POST/PUT/DELETE`).
  - Handles base URL, headers (auth token), logging, and expected status checks.

- **Test Data (`utils/dataFactory.ts`)**
  - Generates unique and reusable payloads for API/UI (e.g., articles).

- **Fixtures (`utils/fixtures.ts`)**
  - Central place for Playwright test fixtures.
  - Provides:
    - `authApi`: authenticated API client (token attached)
    - `authPage`: authenticated browser page (storage state/cookies)

- **State Management (`utils/stateManager.ts`)**
  - Stores data created during tests (e.g., `slug`, `articleId`) to share across steps.
  - Supports cleanup and avoids global variables.

- **Contract Testing (`schemas/*.json` + `utils/schemaValidator.ts`)**
  - Validates API responses against JSON Schemas (AJV).
  - Ensures response structure is correct, not only status codes.

### Hybrid Test Flow (API → UI → API)

1. **API creates data** quickly (e.g., create an article)
2. **UI verifies** the data is displayed correctly
3. **API cleans up** (delete the article) to keep tests isolated

---

## Author

**Ennry** - [GitHub](https://github.com/Ennry)

---

## Skills & Features

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

| Category | Skill | Implementation |
|----------|-------|----------------|
| **Testing** | API Testing | Fluent API Helper |
| | UI Testing | Page Object Model |
| | Hybrid Testing | API + UI Combined |
| | Contract Testing | JSON Schema / AJV |
| | Data-Driven | Parameterized Tests |
| | Error Handling | Negative Test Cases |
| | Cross-Browser | Chrome, Firefox, Safari |
| | Mobile Testing | Pixel 5, iPhone 12 |
| | Performance Testing | Page Load & API Response |
| **Design Patterns** | Fluent Interface | `apiHelper.ts` |
| | Factory Pattern | `dataFactory.ts` |
| | Page Object Model | `pages/*.ts` |
| **Utilities** | Custom Logger | Request/Response Logging |
| | Config Manager | Environment Variables |
| | State Manager | Shared Test State |
| | Test Fixtures | Auto-Authentication |
| **DevOps** | CI/CD | GitHub Actions |
| | Reporting | Playwright HTML Reports |
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
// Clean, chainable syntax
const response = await authApi
    .path('/articles')
    .postRequest(201, dataFactory.article('Test'))
```

### Data Factory Example
```typescript
// Reusable test data
const article = dataFactory.article('CRUD')
// Returns: { article: { title: "CRUD Article 1234567890", ... } }
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
└── Total: 5 seconds
```

### Example Hybrid Test

```typescript
test('Create via API, Verify in UI', async ({ authApi, authPage }) => {
    // API: Fast data creation
    const response = await authApi
        .path('/articles')
        .postRequest(201, dataFactory.article('Hybrid'))

    // UI: Verify it displays correctly
    const articlePage = new ArticlePage(authPage)
    await articlePage.goto(response.article.slug)
    expect(await articlePage.getTitle()).toContain('Hybrid')

    // API: Fast cleanup
    await authApi.path(`/articles/${slug}`).deleteRequest()
})
```

## Project Structure

```text
Fullstack-SDET-Hybrid-Project/
│
├── 📂 pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── ArticlePage.ts
│   └── EditorPage.ts
│
├── 📂 tests/
│   ├── api.spec.ts
│   ├── data-driven.spec.ts
│   ├── error-handling.spec.ts
│   ├── hybrid.spec.ts
│   └── performance.spec.ts
│
├── 📂 schemas/
│   ├── article.schema.json
│   ├── articles.schema.json
│   └── tags.schema.json
│
├── 📂 utils/
│   ├── apiHelper.ts
│   ├── fixtures.ts
│   ├── schemaValidator.ts
│   ├── dataFactory.ts
│   ├── stateManager.ts
│   ├── logger.ts
│   └── config.ts
│
├── 📂 .github/workflows/
│   └── ci.yml
│
├── .env.example
├── .gitignore
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

# Setup environment
cp .env.example .env
# then edit .env with your credentials from https://conduit.bondaracademy.com

# Run all tests
npx playwright test

# View report
npx playwright show-report
```
## Test Commands

| Command | Description |
|---------|-------------|
| `npx playwright test` | Run all tests |
| `npx playwright test --project=api-tests` | Run API tests only |
| `npx playwright test --project=performance` | Run performance tests |
| `npx playwright test --grep "@smoke"` | Run smoke tests |
| `npx playwright test --grep "@crud"` | Run CRUD tests |
| `npx playwright test --grep "@negative"` | Run error handling tests |
| `npx playwright test --grep "@hybrid"` | Run hybrid tests |
| `npx playwright test --grep "@performance"` | Run performance tests |
| `npx playwright show-report` | View HTML report |

## Test Categories

| Tag | Purpose | Tests |
|-----|---------|-------|
| `@smoke` | Quick health check | GET endpoints |
| `@crud` | Full lifecycle | Create, Read, Update, Delete |
| `@negative` | Error handling | 401, 404, 422 responses |
| `@data-driven` | Multiple variations | Valid & invalid data |
| `@schema` | Contract testing | JSON Schema validation |
| `@hybrid` | UI + API combined | Fast, reliable tests |
| `@performance` | Performance testing | Page load, API response times |

## Cross-Browser Testing

| Browser | Command |
|---------|---------|
| Chrome | `npx playwright test --project=chromium` |
| Firefox | `npx playwright test --project=firefox` |
| Safari | `npx playwright test --project=webkit` |
| Mobile Chrome | `npx playwright test --project=mobile-chrome` |
| Mobile Safari | `npx playwright test --project=mobile-safari` |
| All Browsers | `npx playwright test` |

## API Helper Usage

```TypeScript
// Fluent syntax for API testing
const response = await authApi
    .path('/articles')
    .postRequest(201, {
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
// Clean UI testing with POM
const articlePage = new ArticlePage(page)
await articlePage.goto(slug)

const title = await articlePage.getTitle()
expect(title).toContain('My Article')
```

## Environment Variables

Create a .env file based on .env.example:

```env
API_BASE_URL=https://conduit-api.bondaracademy.com/api
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password
```

## CI/CD Pipeline

Tests run automatically on:

- Push to `main` branch
- Pull requests to `main` branch

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
