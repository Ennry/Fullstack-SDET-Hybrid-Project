![API Tests](https://github.com/Ennry/playwright-api-testing-framework/actions/workflows/ci.yml/badge.svg)

# 🚀 Playwright API Testing Framework Made in Scratch By Ennry

A professional API testing framework built with Playwright and TypeScript.

## ✨ Features

- **Fluent API Design** - Clean, chainable syntax
- **JSON Schema Validation** - Contract testing with AJV
- **Data-Driven Testing** - Multiple test cases from arrays
- **Automatic Authentication** - Token management via fixtures
- **Custom Logger** - Detailed request/response logging
- **Environment Configuration** - Secure credential management

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Test runner & HTTP client |
| TypeScript | Type safety |
| AJV | JSON Schema validation |
| Dotenv | Environment variables |

## 📁 Project Structure

├── tests/
│ ├── api.spec.ts # CRUD + Schema validation
│ ├── data-driven.spec.ts # Parameterized tests
│ └── error-handling.spec.ts # Negative test cases
├── schemas/ # JSON Schema definitions
├── utils/
│ ├── apiHelper.ts # Fluent HTTP client
│ ├── fixtures.ts # Test fixtures
│ ├── schemaValidator.ts # AJV wrapper
│ ├── dataFactory.ts # Test data generation
│ ├── logger.ts # Custom logging
│ └── config.ts # Configuration
└── playwright.config.ts

## 🚀 Quick Start
