# LoopQA Playwright Test Suite

Data-driven Playwright tests for the LoopQA demo Kanban app using Page Object Model.

## Project Structure
- pages/ - LoginPage and BoardPage (POM)
- 	ests/data/ - testCases.json (all 6 scenarios)
- 	ests/ - board.spec.js (data-driven test runner)
- utils/ - constants.js (credentials)

## Setup
`
npm install
npx playwright install chromium
`

## Run Tests
`
npx playwright test
`

## Run with browser visible
`
npx playwright test --headed
`
