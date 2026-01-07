![API Tests](https://github.com/Ennry/playwright-api-testing-framework/actions/workflows/ci.yml/badge.svg)

# 🚀 Playwright API Testing Framework Made from Scratch by Ennry

A professional Hybrid UI + API testing framework built with Playwright and TypeScript.

## 👤 Author

**Ennry** - [GitHub](https://github.com/Ennry)

## ✨ Features

- **Fluent API Design** - Clean, chainable syntax
- **JSON Schema Validation** - Contract testing with AJV
- **Data-Driven Testing** - Multiple test cases from arrays
- **Automatic Authentication** - Token management via fixtures
- **Custom Logger** - Detailed request/response logging
- **Environment Configuration** - Secure credential management
- **CI/CD Pipeline** - Automated testing with GitHub Actions

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Test runner & HTTP client |
| TypeScript | Type safety |
| AJV | JSON Schema validation |
| Dotenv | Environment variables |
| GitHub Actions | CI/CD pipeline |

## 📁 Project Structure

playwright-hybrid-testing-framework/
│
├── 📂 tests/
│ ├── api.spec.ts # CRUD + Schema validation
│ ├── data-driven.spec.ts # Parameterized tests
│ └── error-handling.spec.ts # Negative test cases
│
├── 📂 schemas/
│ ├── article.schema.json # Single article schema
│ ├── articles.schema.json # Articles list schema
│ └── tags.schema.json # Tags schema
│
├── 📂 utils/
│ ├── apiHelper.ts # Fluent HTTP client
│ ├── fixtures.ts # Test fixtures
│ ├── schemaValidator.ts # AJV wrapper
│ ├── dataFactory.ts # Test data generation
│ ├── logger.ts # Custom logging
│ └── config.ts # Configuration
│
├── 📂 .github/workflows/
│ └── ci.yml # GitHub Actions pipeline
│
├── .env.example # Environment template
├── .gitignore # Git ignore rules
├── playwright.config.ts # Playwright configuration
├── tsconfig.json # TypeScript configuration
├── package.json # Dependencies
└── README.md # Documentation

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Ennry/Fullstack-SDET-Hybrid-Project.git

# Navigate to project
cd Fullstack-SDET-Hybrid-Project

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run all tests
npx playwright test

# View report
npx playwright show-report
```
## 📊 Test Commands

```powershell
npx playwright test	Run all tests
npx playwright test --grep "@smoke"	Run smoke tests
npx playwright test --grep "@crud"	Run CRUD tests
npx playwright test --grep "@negative"	Run error handling tests
npx playwright test --grep "@data-driven"	Run data-driven tests
npx playwright show-report	View HTML report
```

## 🧪 Test Categories

```powershell
@smoke -	Quick health check	GET endpoints
@crud -	Full lifecycle	Create, Read, Update, Delete
@negative -	Error handling	401, 404, 422 responses
@data-driven - Multiple variations	Valid & invalid data
@schema -	Contract testing	JSON Schema validation
```

## ⚙️ Environment Variables

Create a .env file based on .env.example:

```powershell
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

## 📝 License

This project is open source and available for learning purposes.
