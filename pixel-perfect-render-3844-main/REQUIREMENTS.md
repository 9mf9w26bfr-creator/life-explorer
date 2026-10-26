# REQUIREMENTS.md

# Personal Life Explorer — Functional Requirements

## 1. Product Goal

Create a mobile-first bilingual/multilingual personal exploration and entertainment platform.

The product combines:

- self-assessment
- traditional culture
- entertainment interpretation
- AI-generated reflection
- daily personalized entertainment advice

The product must not present metaphysical interpretation as scientific fact.

---

# 2. Language Requirements

## REQ-LANG-001

The application must automatically select the initial interface language from the customer's phone/browser language environment.

## REQ-LANG-002

Language priority:

1. saved user preference
2. account preference
3. device/browser locale
4. application default

## REQ-LANG-003

At minimum support:

- Simplified Chinese
- Traditional Chinese
- English

The architecture must allow additional languages.

## REQ-LANG-004

If a regional locale is unsupported, fall back to its language family.

Example:

- en-AU → English
- zh-SG → Simplified Chinese where configured

## REQ-LANG-005

If no supported language exists, use English.

## REQ-LANG-006

All UI strings must use translation keys.

## REQ-LANG-007

AI-generated reports must use the user's active locale.

## REQ-LANG-008

Provide a manual language switcher so automatic detection can be overridden.

---

# 3. Navigation

Exactly five primary bottom-navigation items:

1. Home
2. Innate Profile
3. Acquired Profile
4. Daily Advice
5. Membership

---

# 4. Home Requirements

Home must be accessible without membership.

Knowledge sections:

### Traditional Chinese Culture

- Five Elements
- Yin-Yang
- Heavenly Stems
- Earthly Branches
- Chinese Zodiac
- Tai Chi
- Feng Shui
- 24 Solar Terms

### Western/Popular Systems

- Zodiac
- Astrology
- Lucky numbers
- Lucky colours

### Entertainment

- Tarot
- Electronic Domino
- Palmistry
- Physiognomy

### Self-Assessment

- IQ-style
- EQ
- Communication
- Wellbeing

Every section must display its category:

- Evidence-based
- Traditional/Cultural
- Entertainment

---

# 5. Acquired Profile Requirements

FREE.

## REQ-ACQ-001

User must be able to complete 40 questions.

## REQ-ACQ-002

IQ/Cognitive = 10 questions.

Topics:

- patterns
- logic
- numerical reasoning
- verbal reasoning
- spatial reasoning
- sequences
- deduction
- memory
- problem solving
- abstraction

Difficulty:
Easy → Medium → Hard → Very Hard.

## REQ-ACQ-003

EQ = 10 questions.

## REQ-ACQ-004

Communication = 10 questions.

## REQ-ACQ-005

Wellbeing = 10 questions.

## REQ-ACQ-006

All results are FREE.

## REQ-ACQ-007

The system must clearly state that the IQ-style test is not an officially administered standardized IQ test.

## REQ-ACQ-008

Wellbeing is a screening/reflection tool and not a medical or psychiatric diagnosis.

## REQ-ACQ-009

Raw answers and official scores must be stored separately.

## REQ-ACQ-010

Users cannot manipulate the official score by requesting AI to change it.

---

# 6. Innate Profile Requirements

MEMBERSHIP FEATURE.

## REQ-INNATE-001

User can create a draft.

## REQ-INNATE-002

Required/conditional data:

- name or preferred name
- date of birth
- birth time where available
- birth place where required
- country
- preferences

## REQ-INNATE-003

Traditional interpretation may include:

- Five Elements
- Chinese Zodiac
- Heavenly Stems
- Earthly Branches
- Yin-Yang
- astrology
- lucky numbers
- lucky colours

## REQ-INNATE-004

Optional image uploads:

- left palm
- right palm
- face

## REQ-INNATE-005

Image interpretation must be labelled traditional/entertainment interpretation.

## REQ-INNATE-006

Free users can view the feature introduction but complete personal analysis requires membership.

## REQ-INNATE-007

After confirmation and submission, the profile becomes locked.

## REQ-INNATE-008

Future edits create a new version.

---

# 7. Membership Requirements

Initial plan:

### FREE

- ¥0

### MEMBER

- ¥9 RMB

Member unlocks:

- Innate Profile
- personal traditional analysis
- Daily Tarot
- Daily Domino
- Daily Advice
- full personal dashboard

## REQ-MEMBER-001

Membership authorization must be checked server-side.

## REQ-MEMBER-002

Frontend-only hiding is insufficient.

## REQ-MEMBER-003

Payment status must be verified before protected content is released.

---

# 8. Daily Advice Requirements

MEMBERS ONLY.

## REQ-DAILY-001

One official daily record per user per calendar day.

## REQ-DAILY-002

Daily advice uses:

- date
- user profile
- acquired profile
- traditional data
- Tarot
- Domino
- locale

## REQ-DAILY-003

Daily categories:

- clothing
- food
- home
- movement
- work
- study
- relationships
- social
- financial behaviour

## REQ-DAILY-004

Advice must not make medical treatment claims.

## REQ-DAILY-005

Advice must not guarantee financial profit.

## REQ-DAILY-006

Advice must not claim deterministic future events.

---

# 9. Tarot Requirements

## REQ-TAROT-001

Generate one official Tarot result per user/day.

## REQ-TAROT-002

Once generated, the daily result is locked.

## REQ-TAROT-003

No unlimited redraw.

## REQ-TAROT-004

Store:

- date
- card
- orientation if applicable
- interpretation
- generation metadata

## REQ-TAROT-005

Tarot is labelled entertainment/traditional interpretation.

---

# 10. Electronic Domino Requirements

## REQ-DOMINO-001

Generate one official Domino result per user/day.

## REQ-DOMINO-002

Store:

- date
- values
- generation metadata
- interpretation

## REQ-DOMINO-003

No unlimited redraw.

## REQ-DOMINO-004

Clearly label as entertainment/traditional interpretation.

---

# 11. Combined Analysis Requirements

Reports should include:

1. Cognitive Profile
2. Learning Profile
3. EQ Profile
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

Do not output deterministic:

- lifespan
- death date
- disease diagnosis
- guaranteed wealth
- guaranteed marriage
- guaranteed career success
- guaranteed future events

Longevity content must be lifestyle reflection only.

---

# 12. AI Requirements

## REQ-AI-001

AI interprets structured data.

## REQ-AI-002

AI cannot modify official assessment scores.

## REQ-AI-003

AI must identify source type:

- evidence-based
- traditional/cultural
- entertainment

## REQ-AI-004

AI must produce output in the user's active locale.

## REQ-AI-005

AI output must pass validation before display.

## REQ-AI-006

AI provider must be replaceable.

---

# 13. Privacy Requirements

Protect:

- birth data
- birth location
- images
- wellbeing responses
- assessment results
- account information
- payment information

Users must have an account deletion/data deletion path.

Private images must never be public by default.

---

# 14. Error Handling

The system must gracefully handle:

- invalid answers
- incomplete assessment
- failed payment
- expired membership
- AI timeout
- AI failure
- duplicate daily generation
- image upload failure
- unsupported locale
- authentication failure
- network failure

---

# 15. Accessibility

The UI should support:

- readable typography
- keyboard navigation where applicable
- accessible labels
- adequate contrast
- screen-reader-friendly controls
- touch-friendly buttons

---

# 16. Definition of Done

A requirement is complete only when:

- implemented
- tested
- secured
- localized
- documented
- included in production build
