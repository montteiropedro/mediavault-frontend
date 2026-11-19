# Repository Guidance

## Project conventions

- Keep application code, tests, comments, and project documentation in English.
- Follow the existing patterns in the surrounding React and TypeScript code, ESLint configuration, and formatting conventions.
- Add or update tests when changing application behavior, when the project has suitable test coverage.

## Validation

- Run `npm run lint` for lint checks.
- Report which commands were run and their results.

## Pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and pull request titles. Use the format `type(scope): description` (scope is optional), with a lowercase type such as `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`.
- Base pull request descriptions on the repository's pull request template when one is available, and preserve its sections.
- Write every pull request title and description in English.
