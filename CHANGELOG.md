# Changelog

## [1.0.1] - 2026-05-07
### Fixed
- Fixed Faculty search results where consultation slots were appearing empty due to ID key mismatch.
- Improved database join logic in request tracking to prevent data loss when schedule is updated.
- Fixed Student Sign In syntax error in the frontend.

### Added
- Unified ID mapping system for consultations across the MVC stack.
- Enhanced FacultyCard UI with premium animations and improved layout.
- Detailed PHPDoc documentation for Search and Consultation controllers.
- Robust student logout mechanism to clear local persistence.

## [1.0.0] - 2026-05-01
- Initial release of the Faculty Consultation Routine Scheduler.
- Basic search and request features.
- Faculty dashboard for schedule management.
