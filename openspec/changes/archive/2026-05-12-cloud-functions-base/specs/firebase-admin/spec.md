## ADDED Requirements

### Requirement: Firebase Admin SDK Initialization

The system SHALL initialize Firebase Admin SDK with credentials from environment variables.

### Requirement: Admin Database Export

The system SHALL export an `adminDb` reference to the Firebase Realtime Database for use in API routes.

### Requirement: API Error Handling

The system SHALL provide an `ApiError` class that formats errors consistently for Next.js API responses.

#### Scenario: Firebase Admin initialization with valid credentials
- **WHEN** environment variables `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` are set
- **THEN** `adminDb` is successfully initialized and exported

#### Scenario: Firebase Admin initialization with missing credentials
- **WHEN** any required environment variable is missing
- **THEN** a descriptive error is thrown at module load time

#### Scenario: ApiError returns valid NextResponse
- **WHEN** an `ApiError` is created with a status code and message
- **THEN** `apiError.toResponse()` returns a NextResponse with the correct status and JSON body

#### Scenario: ApiError with error code
- **WHEN** an `ApiError` is created with status code, message, and error code
- **THEN** the JSON body contains `{ error: { message, code } }`

#### Scenario: Common HTTP status codes supported
- **WHEN** `ApiError` is instantiated with status 400, 401, 403, 404, or 500
- **THEN** `toResponse()` returns a NextResponse with the corresponding status
