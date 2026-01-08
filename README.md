![API Tests](https://github.com/Ennry/playwright-api-testing-framework/actions/workflows/ci.yml/badge.svg)

# 🚀 Playwright Hybrid Testing Framework Made from Scratch by Ennry

A professional **Hybrid UI + API** testing framework built with Playwright and TypeScript. Features Page Object Model (POM), Fluent API design, and seamless integration between API and UI testing layers.

---

## 👤 Author

**Ennry** - [GitHub](https://github.com/Ennry)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Hybrid Testing** | Combine API and UI tests for maximum efficiency |
| **Page Object Model** | Clean, maintainable UI test structure |
| **Fluent API Design** | Chainable syntax for readable API tests |
| **JSON Schema Validation** | Contract testing with AJV |
| **Data-Driven Testing** | Multiple test cases from arrays |
| **Automatic Authentication** | Token management via fixtures |
| **Custom Logger** | Detailed request/response logging |
| **Environment Configuration** | Secure credential management |
| **CI/CD Pipeline** | Automated testing with GitHub Actions |

---

## 🔥 Hybrid Testing Approach

Traditional UI Test (Slow ❌):
├── Login via UI (5 sec)
├── Create article via UI (10 sec)
├── Verify article (5 sec)
└── Total: 20+ seconds

Hybrid Test (Fast ✅):
├── API: Create article (1 sec)
├── UI: Verify display (3 sec)
├── API: Cleanup (1 sec)
└── Total: 5 seconds

### Example Hybrid Test

```typescript
test('Create via API, Verify in UI', async ({ authApi, authPage }) => {
    // ⚡ API: Fast data creation
    const response = await authApi
        .path('/articles')
        .postRequest(201, dataFactory.article('Hybrid'))

    // 🖥️ UI: Verify it displays correctly
    const articlePage = new ArticlePage(authPage)
    await articlePage.goto(response.article.slug)
    expect(await articlePage.getTitle()).toContain('Hybrid')

    // ⚡ API: Fast cleanup
    await authApi.path(`/articles/${slug}`).deleteRequest()
})
```

## 📁 Project Structure

playwright-hybrid-testing-framework/
│
├── 📂 pages/                        # Page Object Model
│   ├── BasePage.ts                  # Base page class
│   ├── LoginPage.ts                 # Login page actions
│   ├── HomePage.ts                  # Home page actions
│   ├── ArticlePage.ts               # Article page actions
│   └── EditorPage.ts                # Editor page actions
│
├── 📂 tests/
│   ├── api.spec.ts                  # CRUD + Schema validation
│   ├── data-driven.spec.ts          # Parameterized tests
│   ├── error-handling.spec.ts       # Negative test cases
│   └── hybrid.spec.ts               # UI + API hybrid tests
│
├── 📂 schemas/
│   ├── article.schema.json          # Single article schema
│   ├── articles.schema.json         # Articles list schema
│   └── tags.schema.json             # Tags schema
│
├── 📂 utils/
│   ├── apiHelper.ts                 # Fluent HTTP client
│   ├── fixtures.ts                  # Test fixtures (API + UI)
│   ├── schemaValidator.ts           # AJV wrapper
│   ├── dataFactory.ts               # Test data generation
│   ├── stateManager.ts              # Shared test state
│   ├── logger.ts                    # Custom logging
│   └── config.ts                    # Configuration
│
├── 📂 .github/workflows/
│   └── ci.yml                       # GitHub Actions pipeline
│
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies
└── README.md                        # Documentation

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Ennry/Fullstack-SDET-Hybrid-Project.git

# Navigate to project
cd Fullstack-SDET-Hybrid-Project

# Install dependencies
npm install

# Setup environment
cp .env.example .env (Sign up and replace .env credentials in "https://conduit.bondaracademy.com/")

# Run all tests
npx playwright test

# View report
npx playwright show-report
```
## 📊 Test Commands

```bash
npx playwright test	Run all tests
npx playwright test --project=api-tests -> Run API tests only
npx playwright test --project=hybrid-tests -> Run hybrid tests only
npx playwright test --project=hybrid-tests --headed	-> Run hybrid with browser visible
npx playwright test --grep "@smoke" -> Run smoke tests
npx playwright test --grep "@crud" -> Run CRUD tests
npx playwright test --grep "@negative" -> Run error handling tests
npx playwright test --grep "@data-driven" -> Run data-driven tests
npx playwright test --grep "@hybrid" -> Run hybrid tests
npx playwright show-report -> View HTML report
```

## 🧪 Test Categories

```bash
@smoke -> Quick health check GET endpoints
@crud -> Full lifecycle Create, Read, Update, Delete
@negative -> Error handling 401, 404, 422 responses
@data-driven -> Multiple variations Valid & invalid data
@schema -> Contract testing JSON Schema validation
@hybrid -> UI + API combined Fast, reliable tests
```
## 🔧 API Helper Usage

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
## 🖥️ Page Object Model

```TypeScript
// Clean UI testing with POM
const articlePage = new ArticlePage(page)
await articlePage.goto(slug)

const title = await articlePage.getTitle()
expect(title).toContain('My Article')
```
## ⚙️ Environment Variables

Create a .env file based on .env.example:

```env
API_BASE_URL=https://conduit-api.bondaracademy.com/api
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password
```

## 📈 CI/CD Pipeline

Tests run automatically on:

```
✅ Push to main branch
✅ Pull requests to main branch
```

## 🎯 Skills Demonstrated
✅ API Testing with Playwright
✅ UI Testing with Page Object Model
✅ Hybrid Testing (API + UI)
✅ TypeScript
✅ JSON Schema Validation
✅ CI/CD with GitHub Actions
✅ Data-Driven Testing
✅ Error Handling Testing
✅ Framework Architecture

## 📝 License

This project is open source and available for learning purposes.
