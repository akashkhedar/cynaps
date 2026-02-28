# Cynaps Frontend

Cynaps Frontend (CF) is a crucial module of the Cynaps ecosystem, pivotal in driving the entire annotation flow. It's a front-end-only module, combining a user interface for annotation creation with a data layer that standardizes the annotation format. Every manual annotation in Cynaps has been crafted using CF, making it integral to the system.

### Usage Instructions

CF provides specific scripts for operation and testing:

_Important Note: These scripts must be executed within the web folder or its subfolders. This is crucial for the scripts to function correctly, as they are designed to work within the context of the web directory's structure and dependencies._

- **`yarn CF:watch`: Build CF continuously**
  - Crucial for development, this script continuously builds Cynaps Frontend (CF), allowing developers to observe their changes in real-time within the Cynaps environment.
- **`yarn CF:serve`: Run CF standalone**
  - To run Cynaps Frontend in standalone mode. Visit http://localhost:3000 to use the application in standalone mode.
- **`yarn CF:e2e`: Execute end-to-end (e2e) tests on CF**
  - To run comprehensive e2e tests, ensuring the frontend works as expected from start to finish. The Cynaps environment must be running, typically at `http://localhost:8080`.
- **`yarn CF:integration`: Run integration tests**
  - To conduct integration tests using Cypress, verifying that different parts of CF work together correctly. The CF in standalone mode (`yarn CF:serve`) must be running.
- **`yarn CF:integration:ui`: Run integration tests in UI mode**
  - Facilitates debugging during integration tests by running them in a UI mode, allowing you to visually track what is being tested. The CF in standalone mode (`yarn CF:serve`) must be running.
- **`yarn CF:unit`: Run unit tests on CF**
  - Essential for maintaining code quality and reliability, especially in collaborative development.

<img src="https://github.com/Cynaps/cynaps/blob/develop/images/opossum_looking.png?raw=true" title="Hey everyone!" height="140" width="140" />


