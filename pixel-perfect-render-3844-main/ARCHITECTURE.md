# ARCHITECTURE.md

# Personal Life Explorer — System Architecture

## 1. Purpose

This document defines the technical architecture for the Personal Life Explorer platform.

The platform is a mobile-first personal exploration and entertainment service combining:

- evidence-based self-assessment
- traditional/cultural interpretation
- entertainment-based fortune systems
- AI-generated personal reflection

The architecture must keep these three domains logically separated.

---

## 2. Core Architecture Principles

1. Mobile-first.
2. API-first.
3. Modular and replaceable services.
4. Server-side authorization.
5. Deterministic scoring for assessments.
6. Deterministic calculation/generation for Tarot and Domino results.
7. AI is used for interpretation and natural-language generation, not for changing official raw scores.
8. Business rules must not be hard-coded into UI components.
9. All user-facing text must use the internationalization system.
10. User language is selected automatically from the device/browser locale, with manual language switching available.
11. Historical assessment/profile versions must not be silently overwritten.
12. Production infrastructure must be replaceable without rewriting business logic.

---

## 3. High-Level System

```text
Mobile / Desktop Browser
        |
        v
Frontend Application
        |
        +---- i18n / Locale Detection
        |
        +---- Authentication
        |
        +---- Profile UI
        |
        +---- Assessment UI
        |
        +---- Daily Advice UI
        |
        v
Backend API
        |
        +---- Auth Service
        +---- User/Profile Service
        +---- Assessment Service
        +---- Scoring Engine
        +---- Traditional Calculation Engine
        +---- Tarot Engine
        +---- Domino Engine
        +---- Daily Advice Engine
        +---- AI Interpretation Service
        +---- Membership Service
        +---- Payment Service
        +---- Image Service
        +---- Audit/Logging
        |
        v
Relational Database
        |
        +---- Object/Image Storage
        +---- External AI Provider
        +---- Payment Provider
```

---

## 4. Frontend

Recommended architecture:

- React + TypeScript
- mobile-first responsive UI
- component-based design
- centralized API client
- centralized authentication state
- centralized membership state
- centralized i18n

Primary routes:

```text
/
 /innate
 /acquired
 /daily
 /membership
 /account
 /knowledge/*
```

Bottom navigation contains exactly five primary sections:

1. Home
2. Innate Profile
3. Acquired Profile
4. Daily Advice
5. Membership

---

## 5. Automatic Language Environment

The application must automatically determine the initial UI language from the customer's device/browser language environment.

Priority:

```text
1. Saved user language preference
2. Authenticated account language
3. Browser/device locale
4. Application default locale
```

Example:

```text
zh-CN → Simplified Chinese
zh-TW / zh-HK → Traditional Chinese
en-* → English
ja-* → Japanese
ko-* → Korean
fr-* → French
de-* → German
es-* → Spanish
```

If an exact locale is not supported, fall back to its language family.

If the language is unsupported:

```text
Unsupported locale
        ↓
English fallback
```

The architecture must allow additional languages without rewriting application logic.

All user-facing strings must use translation keys:

```text
t("home.title")
t("membership.unlock")
t("daily.tarot.title")
```

Never hard-code customer-facing Chinese or English text directly inside reusable components.

User-generated assessment data must not be automatically translated or altered.

AI-generated reports should be requested/generated in the user's active locale.

---

## 6. Authentication

Support:

- registration
- login
- logout
- password reset
- session management
- account deletion

Authentication must be independent of membership.

---

## 7. User Profile Domain

Separate profile data into:

### Account Profile

Identity and account information.

### Innate Profile

Birth and traditional-system inputs.

### Acquired Profile

40-question assessment responses and results.

### Membership

Subscription/payment state.

### Daily Records

Daily Tarot, Domino and advice records.

---

## 8. Innate Profile Domain

Data includes:

```text
name
preferred_name
date_of_birth
birth_time
birth_place
country
preferences
palm_images
face_image
```

The system must not expose private profile data through public APIs.

Submission lifecycle:

```text
DRAFT
→ MEMBERSHIP CHECK
→ CONFIRMED
→ SUBMITTED
→ LOCKED
```

Future edits must create a new profile version.

---

## 9. Acquired Assessment Domain

Four modules:

```text
IQ/Cognitive       10
EQ                 10
Communication      10
Wellbeing          10
----------------------
Total              40
```

Question definitions are data-driven.

Recommended entities:

```text
Assessment
Question
QuestionOption
AssessmentAttempt
AssessmentAnswer
AssessmentScore
AssessmentReport
```

The scoring engine calculates official scores.

AI cannot modify official raw scores.

---

## 10. Traditional Calculation Domain

Traditional interpretation must be isolated from scientific assessment.

Examples:

```text
Five Elements
Chinese Zodiac
Heavenly Stems
Earthly Branches
Yin-Yang
Astrology
Feng Shui
```

Each system should have its own calculation/rules module where applicable.

The output should be structured data before being passed to AI.

---

## 11. Tarot Engine

Daily Tarot generation must be deterministic/reproducible once generated.

Lifecycle:

```text
User + Date
    ↓
Daily Tarot Generator
    ↓
Card
    ↓
Orientation
    ↓
Stored Daily Record
    ↓
AI Interpretation
```

Only one official Tarot result per user per day.

No unlimited redraw.

---

## 12. Domino Engine

Generate one official electronic Domino result per user per day.

Store:

- date
- domino values
- generation seed/metadata
- interpretation

The result is entertainment/traditional interpretation.

---

## 13. Daily Advice Engine

Inputs:

```text
Innate Profile
+
Acquired Profile
+
Traditional Calculation
+
Daily Tarot
+
Daily Domino
+
Current Date
+
User Locale
```

Outputs:

```text
Clothing
Food
Home
Movement
Work
Study
Relationships
Social
Finance Behaviour
```

Medical diagnosis and deterministic future prediction are prohibited.

---

## 14. AI Interpretation Service

AI is downstream of deterministic systems.

```text
Structured Data
      ↓
AI Prompt Builder
      ↓
AI Provider
      ↓
Validation
      ↓
Localized Report
```

The AI must receive explicit labels identifying the source type:

```text
EVIDENCE_BASED
TRADITIONAL_CULTURAL
ENTERTAINMENT
```

AI output must not merge them into a false scientific claim.

AI provider must be abstracted behind an interface so the model/provider can be changed later.

---

## 15. Membership Architecture

Initial plan:

```text
FREE
MEMBER — ¥9
```

FREE:

- Home
- Acquired Profile
- IQ result
- EQ result
- Communication result
- Wellbeing result

MEMBER:

- Innate Profile submission and analysis
- Daily Tarot
- Daily Domino
- Daily Advice
- Full personal dashboard

Authorization must be enforced on the backend.

---

## 16. Payment Architecture

Use a provider-independent interface:

```text
PaymentService
├── createPayment()
├── verifyPayment()
├── handleWebhook()
├── refund()
└── getPaymentStatus()
```

Payment states:

```text
PENDING
PAID
FAILED
REFUNDED
EXPIRED
```

Do not store raw card details.

---

## 17. Image Architecture

Images:

- palm images
- face images

Requirements:

- private storage
- authenticated access
- file type validation
- file size limits
- malware/security validation where supported
- signed/private URLs
- deletion support

Images must never become public by default.

---

## 18. Database Principles

Use a relational database.

Core entities:

```text
users
profiles
innate_profiles
innate_profile_versions
assessment_questions
assessment_attempts
assessment_answers
assessment_scores
assessment_reports
traditional_calculations
tarot_daily_records
domino_daily_records
daily_advice
memberships
payments
images
audit_logs
```

Use migrations.

Never manually alter production schema.

---

## 19. Background Jobs

Use background jobs for:

- daily Tarot generation
- daily Domino generation
- daily advice generation
- AI report generation
- email/notification tasks if later added

Jobs must be idempotent.

A repeated job must not create duplicate daily records.

---

## 20. Observability

Implement:

- structured logs
- error tracking
- request IDs
- audit events
- payment event logs
- AI request metadata without storing unnecessary private content

Do not log passwords, payment secrets or sensitive personal data.

---

## 21. Testing Architecture

Required layers:

```text
Unit Tests
Integration Tests
API Tests
Authorization Tests
Assessment Scoring Tests
Daily Generation Tests
i18n Tests
Security Tests
End-to-End Tests
```

Critical business rules require automated tests.

---

## 22. Deployment

Environment separation:

```text
LOCAL
STAGING
PRODUCTION
```

Secrets must be environment variables or secure secret storage.

Production deployment requires human approval.

---

## 23. Extensibility

Future systems should be addable without redesigning the core platform.

Potential future modules:

- numerology
- additional Tarot decks
- additional traditional systems
- additional languages
- additional membership plans
- additional payment providers
- additional AI providers

The architecture must use interfaces/modules rather than hard-coded provider-specific logic.
