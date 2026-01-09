# Evolution of Todo Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All features must originate from refined specifications in `/specs`. No code shall be written without a corresponding specification document that has been reviewed and approved. The workflow is: Specification → Refinement → Review → Implementation.

### II. Zero Manual Coding
All implementation is performed exclusively by Claude Code subagents following specifications. Direct manual code editing is prohibited except for emergency hotfixes. Subagents are the sole code generators to maintain consistency and compliance.

### III. Reusable Intelligence
Development leverages six specialized subagents (spec-refiner, fullstack-todo-agent, nextjs-frontend-builder, backend-builder, auth-specialist, deployment-prep) and seven custom skills to maximize code generation efficiency and earn the +200 bonus points for reusable intelligence.

### IV. User Isolation and Security
All API endpoints follow the `/api/{user_id}/tasks` pattern with strict user-scoped data access. JWT tokens are validated on every request, and user identity from tokens must match URL parameters. No cross-user data leakage permitted.

### V. Bonus Feature Integration
Urdu language support (i18n with RTL layout, +100 points) and voice commands (Web Speech API, +200 points) are first-class features, not afterthoughts. Both must be integrated from the start of any feature implementation.

### VI. Monorepo Integrity
Frontend and backend exist as separate directories within a single repository, sharing authentication secrets (`BETTER_AUTH_SECRET`) and maintaining consistent API contracts defined in `/specs/api/`.

## Key Standards

### Code Generation Rules
- All backend routes must implement user isolation via JWT middleware
- All frontend components must support Urdu language toggling and RTL layout
- Voice command integration must be available on task creation and management pages
- Shared `BETTER_AUTH_SECRET` environment variable must be configured identically in both frontend and backend

### Security Requirements
- JWT tokens validated on every protected API request
- User ID in URL must match authenticated user ID from token
- SQL injection prevention via SQLModel parameterized queries
- CORS configured to allow only frontend origin
- No sensitive data in client-side code or logs

### Internationalization Standards
- English and Urdu language support with next-intl
- RTL layout automatically applied for Urdu
- All UI text externalized to translation files
- No hardcoded strings in components

### Voice Commands Standards
- Web Speech API integration for hands-free task management
- Microphone permission handling with graceful fallback
- Voice input for adding, editing, and searching tasks
- Clear visual feedback during voice recognition

### Testing Requirements
- API endpoints must be manually testable via provided HTTP client examples
- Frontend must render without console errors
- Authentication flow must be demonstrable end-to-end
- Each bonus feature must have a documented test scenario

## Technology Constraints

### Immutable Tech Stack
- Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- Backend: Python FastAPI, SQLModel, Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- Database: Neon.tech serverless Postgres
- Development Tools: Claude Code, Spec-Kit Plus

### Prohibited Substitutions
- No alternative authentication services (must use Better Auth with JWT)
- No alternative databases (must use Neon PostgreSQL)
- No additional package managers beyond npm (frontend) and pip (backend)
- No technology changes without constitutional amendment

### Spec-Kit Structure Compliance
All specifications must follow Spec-Kit Plus organizational conventions:
- `/specs/overview.md` → Project status
- `/specs/features/` → Feature specs
- `/specs/api/` → REST endpoints
- `/specs/database/` → Schema and models
- `/specs/ui/` → Components and pages

## Success Criteria

### Core Functionality
Users can register, log in, create/read/update/delete tasks, and log out with full user isolation.

### Deployment Readiness
Application runs locally via Docker Compose and is deployable to Vercel (frontend) and Render/Railway (backend).

### Bonus Features Demonstrated
- Urdu language toggle works with proper RTL layout (+100)
- Voice commands successfully create and manage tasks (+200)
- Reusable intelligence (6 subagents + 7 skills) documented and utilized (+200)

### Submission Requirements
README with setup instructions, demo video, deployed URLs, and specification artifacts complete and accurate.

## Governance

This Constitution supersedes all other development practices and documentation. All code generation, architectural decisions, and feature implementations must comply with these principles.

### Enforcement
Violations—including manual code edits, technology substitutions, or bypassing spec-driven workflows—will result in immediate rollback of changes and re-implementation via proper subagent channels.

### Amendments
Constitutional amendments require documented justification, stakeholder approval, and migration plan. Emergency amendments permitted only for critical security vulnerabilities.

### Compliance Verification
The project maintainer is responsible for ensuring all contributors and subagents adhere to these principles. All pull requests and code reviews must verify constitutional compliance.

**Version**: 1.0.0 | **Ratified**: 2026-01-05 | **Last Amended**: 2026-01-05
