# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add UI to create new branches from within editing activity
- Add support for configurable preCommit hook
- Add support for file input

### Fixed

- Fix rendering of single line field disabled state
- Fix invalid use of stale cached Git adapter
- Fix missing internal UI data after commit

### Changed

- Streamline and declutter application UI
- Introduce configurable activities for UI extensibility
- Upgrade to TailwindCSS 4
- Upgrade dependencies
- Upgrade Docker builds to Node.js 22
- Commit processing is moved to server-side

## [0.30.0] - 2025-03-19

### Added

- Show 404 and 500 error pages when invalid data is accessed

### Fixed

- Fix stale page content when re-opening an entry after committing a change to this entry
- Gracefully handle lists where fields marked with `visibleList:true` are null

### Changed

- Upgrade to Commitspark GraphQL API 0.80.0
- Refactor data fetching to server-side page render instead of asynchronously upon client request
- Upgrade dependencies
- Retrieve up to 100 GitHub repositories of current user
- Show entry ID in reference pickers when no entry field is marked as visible in list views in schema

### Removed

- Remove `cookies-next` package

## [0.12.0] - 2024-11-30

### Added

- Warn user before navigating away on unsaved editor changes

### Fixed

- Fix entry editing route generation for entry IDs that require URL encoding
- Fix unsuitable navigation guard warnings after committing new entries and deletions

### Changed

- Upgrade to `@commitspark/git-adapter-github` 0.7.0
- Replace mandatory automatic entry ID generation with manual custom ID input when creating new entries
- Refactor pages and layout to no longer cause branch list reload on every navigation
- Move Git provider authentication to server and only expose encrypted tokens to client
- Harmonize domain wording
- Upgrade dependencies

## [0.11.0] - 2024-08-17

### Changed

- Upgrade to latest Commitspark packages
- Upgrade dependencies

## [0.10.0] - 2024-08-10

### Fixed

- Fix nested button elements due to button generated by HeadlessUI
- Fix error about missing sharp package

### Added

- Redirect to sign-in screen when not authenticated

### Changed

- Improve Next.js configuration
- Refactor code to be Git provider-agnostic
- Refactor code to allow Git provider configuration

### Removed

- Remove theoretical ability to have multiple Git providers enabled simultaneously
- Remove OpenAI integration

## [0.9.0] - 2024-03-01

### Added

- Initial release
