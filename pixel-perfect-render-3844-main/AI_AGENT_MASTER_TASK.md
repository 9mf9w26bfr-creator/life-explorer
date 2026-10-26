# AI_AGENT_MASTER_TASK.md

# AI Agent Autonomous Development Task

# AI Agent 自主开发任务书

## 0. Mission / 总任务

Build a production-ready bilingual (Chinese/English) personal exploration and entertainment platform based on the project's constitution.

The product combines:

- Traditional Chinese culture
- Five Elements
- Yin-Yang
- Heavenly Stems and Earthly Branches
- Chinese Zodiac
- Western Astrology
- Feng Shui traditions
- Tai Chi philosophy
- Tarot
- Electronic Domino fortune interpretation
- Palmistry-style entertainment interpretation
- Physiognomy-style entertainment interpretation
- Cognitive/IQ-style testing
- Emotional intelligence testing
- Communication testing
- Psychological wellbeing screening
- Career and lifestyle reflection

The platform MUST clearly distinguish:

1. Evidence-based assessment
2. Traditional/cultural interpretation
3. Entertainment interpretation

Do not present metaphysical interpretations as scientific facts, medical diagnoses, or deterministic predictions.

---

# 1. Product Navigation / 五大底部功能

Implement exactly five primary navigation buttons:

1. Home / 首页
2. Innate Profile / 先天档案
3. Acquired Profile / 后天档案
4. Daily Advice / 每日建议
5. Membership / 会员

The mobile-first interface should be simple, elegant, fast and easy to use.

---

# 2. Home / 首页

Public/free area.

Content categories:

## Traditional Culture

- Five Elements
- Yin-Yang
- Heavenly Stems
- Earthly Branches
- Chinese Zodiac
- Tai Chi
- Feng Shui
- 24 Solar Terms

## Western/Popular Systems

- Zodiac signs
- Astrology
- Lucky numbers
- Lucky colours

## Entertainment Systems

- Tarot
- Electronic Domino
- Palmistry
- Physiognomy

## Self-Assessment

- IQ-style cognitive test
- EQ test
- Communication test
- Psychological wellbeing screening

Every knowledge section must explain whether it is:

- evidence-based
- traditional/cultural
- entertainment/interpretive

---

# 3. Acquired Profile / 后天档案

FREE.

The user completes one 40-question assessment:

## A. IQ / Cognitive Ability — 10 questions

Test:

- pattern recognition
- logical reasoning
- numerical reasoning
- verbal reasoning
- spatial reasoning
- sequences
- deduction
- working memory
- problem solving
- abstract reasoning

Difficulty:
Easy → Medium → Hard → Very Hard

Result is FREE.

Important:
This is an IQ-style assessment, not a professionally administered standardized IQ examination.

## B. EQ / Emotional Intelligence — 10 questions

Assess:

- self-awareness
- self-control
- empathy
- emotional regulation
- social awareness
- conflict handling
- listening
- emotional expression
- relationship management
- stress response

## C. Communication — 10 questions

Assess:

- listening
- speaking
- explanation
- questioning
- negotiation
- conflict communication
- body-language awareness
- written communication
- persuasion
- teamwork communication

## D. Psychological Wellbeing — 10 questions

Assess:

- stress
- sleep
- mood
- motivation
- social connection
- energy
- concentration
- anxiety-related feelings
- life satisfaction
- emotional balance

This is wellbeing screening only.
It MUST NOT diagnose mental illness.

All four assessment results are FREE.

---

# 4. Innate Profile / 先天档案

MEMBERSHIP FEATURE.

Collect:

## Personal information

- name
- preferred name
- date of birth
- birth time
- birth place
- country
- optional gender where genuinely required

## Traditional analysis inputs

- Chinese Zodiac
- Five Elements
- Heavenly Stem
- Earthly Branch
- birth season
- Yin-Yang
- traditional astrology associations

## Personal preferences

- favourite colour
- favourite food
- favourite season
- favourite number
- favourite music
- favourite animal
- favourite environment
- favourite places
- lifestyle preferences

## Optional image inputs

- left palm
- right palm
- face image

Palm and face interpretation must be explicitly presented as entertainment/traditional interpretation.

---

# 5. Innate Profile Submission Rules

The first profile may exist as DRAFT.

Suggested flow:

DRAFT
→ Membership Check
→ Payment/Active Membership
→ Confirm
→ SUBMITTED
→ LOCKED

After submission, the original assessment cannot be silently overwritten.

If future editing is introduced:
create a new version instead of overwriting historical data.

Example:

- Innate Profile V1
- Innate Profile V2

---

# 6. Membership / 会员

Initial membership price:

¥9 RMB

Membership unlocks:

- Innate Profile
- Five Elements personal interpretation
- Chinese Zodiac interpretation
- Heavenly Stems / Earthly Branches interpretation
- Astrology interpretation
- Palmistry interpretation
- Physiognomy-style entertainment interpretation
- Daily Tarot
- Daily Electronic Domino
- Daily Advice
- Personal combined profile

FREE users retain:

- Home
- IQ-style test
- EQ test
- Communication test
- Psychological wellbeing screening
- Acquired Profile results

---

# 7. Daily Advice / 每日建议

MEMBERS ONLY.

Generate one daily result per user/day.

Input:

User Innate Profile +
Acquired Profile +
Current date +
Traditional interpretation systems +
Daily Tarot +
Daily Domino

Output:

## Tarot

One daily card.

The daily card is locked after generation and cannot be repeatedly redrawn during the same day.

## Electronic Domino

Generate one daily domino result.

The result is entertainment/traditional interpretation only.

## Daily categories

### Clothing / 衣

- lucky/traditional colours
- clothing suggestions

### Food / 食

- general lifestyle suggestions
- hydration/reminder
- ordinary dietary suggestions

Never provide medical treatment claims.

### Home / 住

- organisation
- environment
- light
- colour
- plants
- traditional Feng Shui interpretation

### Movement / 行

- activity suggestions
- social suggestions
- study/work suggestions

### Affairs / 事

- work
- study
- relationships
- social activity
- personal development

### Finance / 财

Only behavioural/lifestyle suggestions.
Never guarantee financial profit.

---

# 8. Daily Tarot Rules

Generate exactly one official daily Tarot result per user.

Daily lifecycle:

00:00
→ generate
→ save
→ lock
→ display

Do not allow unlimited redraws.

Store:

- date
- card
- orientation if used
- interpretation
- generation metadata

---

# 9. Daily Domino Rules

Generate exactly one official daily Domino result per user.

Store:

- date
- domino combination
- interpretation
- generation metadata

Clearly label it as entertainment/traditional interpretation.

---

# 10. Combined Analysis

Generate separate sections rather than mixing all systems into one "scientific" score.

Required report sections:

1. Cognitive Profile
2. Learning Profile
3. Emotional Intelligence
4. Communication Profile
5. Wellbeing Reflection
6. Relationship Reflection
7. Marriage/Lifestyle Reflection
8. Career Exploration
9. Workplace Profile
10. Social Profile
11. Financial Behaviour
12. Traditional Cultural Interpretation
13. Daily Entertainment Interpretation

Do not produce deterministic claims about:

- lifespan
- death
- disease
- guaranteed wealth
- guaranteed marriage
- guaranteed career success
- future events

For longevity:
use "Longevity & Lifestyle Reflection", not lifespan prediction.

---

# 11. AI Safety and Content Rules

The AI must never claim:

- "Your face proves your intelligence."
- "Your horoscope proves you will become rich."
- "You will live until age X."
- "You definitely have depression."
- "You will definitely marry this year."
- "You will definitely lose money tomorrow."

Preferred wording:

- "Traditional interpretation suggests..."
- "For entertainment, this reading indicates..."
- "Your responses suggest..."
- "This screening result may be worth reflecting on..."
- "This is not a medical diagnosis."

---

# 12. Privacy and Security

Protect:

- date of birth
- birth time
- birth location
- photographs
- wellbeing responses
- assessment results
- membership/payment data

Requirements:

- encryption in transit
- secure authentication
- access control
- private image storage
- account deletion
- data deletion workflow
- no unauthorised data sharing
- minimal data collection

Never expose another user's profile.

---

# 13. Technical Architecture

AI Agent must first create:

PROJECT_CONSTITUTION.md
AI_DEVELOPMENT_WORKFLOW.md
AGENTS.md
ARCHITECTURE.md
REQUIREMENTS.md
SECURITY_RULES.md
DEPLOYMENT.md
CHANGELOG.md

Then implement the application.

Recommended architecture should be:

- mobile-first web application
- bilingual i18n
- modular frontend
- secure backend API
- relational database
- authentication
- membership/payment layer
- AI analysis service
- deterministic assessment/scoring service
- daily fortune generation service
- image upload/storage service
- audit/logging layer

Do not hard-code business rules into UI components.

---

# 14. Assessment Engine

Question definitions must be stored as structured data.

Example:

question_id
category
difficulty
question
options
correct_answer
scoring_rule
explanation
version

Do not hard-code 40 questions directly into page components.

Assessment scoring must be deterministic and testable.

AI may interpret results, but AI must not arbitrarily change the raw score.

---

# 15. AI Analysis Engine

Separate:

RAW SCORE
→ SCORE ENGINE
→ PROFILE DATA
→ AI INTERPRETATION
→ FINAL REPORT

AI should not directly determine official numerical scores.

For traditional systems:

TRADITIONAL INPUT
→ RULE/INTERPRETATION ENGINE
→ AI NATURAL LANGUAGE GENERATION

This makes results reproducible.

---

# 16. Membership Logic

Implement:

FREE
MEMBER

Server-side access control is mandatory.

Never rely only on frontend hiding.

Example:

if user is not a member:
deny innate analysis endpoint
deny daily advice endpoint
return membership-required response

Membership state must be verified server-side.

---

# 17. Payment

Initial membership:
¥9 RMB.

The payment provider must be abstracted behind a PaymentService interface so that the provider can be changed later.

Do not tightly couple business logic to one payment provider.

Payment states:

- pending
- paid
- failed
- refunded
- expired

---

# 18. Autonomous Agent Development Workflow

The AI Agent must work in this order:

PHASE 1
Read Constitution

PHASE 2
Create/update:

- architecture
- requirements
- security rules

PHASE 3
Create project skeleton

PHASE 4
Implement database schema

PHASE 5
Implement authentication

PHASE 6
Implement Home

PHASE 7
Implement Acquired Profile

PHASE 8
Implement deterministic scoring

PHASE 9
Implement Innate Profile

PHASE 10
Implement membership protection

PHASE 11
Implement Daily Tarot

PHASE 12
Implement Daily Domino

PHASE 13
Implement Daily Advice

PHASE 14
Implement Member Dashboard

PHASE 15
Implement bilingual UI

PHASE 16
Testing

PHASE 17
Security review

PHASE 18
Production build

PHASE 19
Deployment

PHASE 20
Documentation and CHANGELOG

---

# 19. Agent Operating Rules

Before changing architecture:
STOP and explain the proposed change.

Before changing database schema:
STOP and explain migration impact.

Before changing membership rules:
STOP and request confirmation.

Before deleting user data:
STOP and request confirmation.

Before production deployment:
STOP and request human approval.

Before charging real money:
STOP and request human approval.

Before sending external communications:
STOP and request human approval.

The agent may autonomously:

- create files
- edit code
- run tests
- fix test failures
- refactor within approved architecture
- update documentation
- run local builds
- inspect logs
- create migrations
- perform static analysis

---

# 20. Definition of Done

The project is NOT complete merely because the UI renders.

A feature is complete only when:

[ ] implemented
[ ] typed/validated
[ ] unit tested
[ ] integration tested
[ ] error handled
[ ] mobile tested
[ ] bilingual text checked
[ ] security checked
[ ] access control checked
[ ] documentation updated
[ ] CHANGELOG updated
[ ] production build succeeds

---

# 21. Required Human Approval Points

AI Agent may operate autonomously for development, but human approval is mandatory for:

- production deployment
- production database migration
- payment activation
- real-money transaction
- deletion of production data
- privacy policy changes
- legal/compliance changes
- external API credentials
- domain/DNS changes
- irreversible infrastructure changes

---

# 22. Final Product Principle

The platform is not designed to tell users that their destiny is predetermined.

Core philosophy:

"Explore yourself.
Explore traditional culture.
Reflect on your life.
Make your own choices."

Chinese:

"认识自己，探索文化，反思生活，自主选择。"

END OF AI AGENT MASTER TASK
