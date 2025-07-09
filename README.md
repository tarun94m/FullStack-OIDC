# OIDC-FSD-Challenge

## Challenge 1
Part 1: Code Review

Code Review: Issues & Explanations

Not Secure (Base64 is reversible):
btoa() only encodes data using Base64, which can be easily decoded using atob() — it doesn't provide any cryptographic protection.

No Secret or Salt Used:
Since there's no secret involved, any attacker can generate or guess pseudonyms if they know the inputs.

Not Collision Resistant:
If two users share similar IDs or app names, it could lead to identical outputs — increasing collision risk.

No Data Type Handling:
The current function doesn't support types like email, address, or name, which are expected per the brief.

No Input Validation or Error Handling:
The function fails silently if passed null, undefined, or empty strings.

Fails Privacy-by-Design Promise:
The pseudonym is reversible and deterministic without any protection, breaking the privacy-first model.

Not Production Ready:
Lacks logging, security best practices, and extensibility.

----------------------------------------------------

## Challenge 2
Database Design Challenge

1. ER Diagram (Visual) - Format: PNG
   Used dbdiagram.io for ER Diagram

   ![ConsentKeys-ERD](https://github.com/user-attachments/assets/906b6726-c5aa-4480-8287-0ffa37ca34d5)


2. Written Explanation

Privacy Engineering Approach
The schema implements zero-PII storage by using SHA256 hashes for all user identifiers (user_hash) and storing only cryptographically secure pseudonyms. The pseudonym_mappings table ensures consistency through deterministic generation while maintaining app isolation via client-specific salts. IP addresses and user agents are also hashed for audit compliance without storing identifiable information.

OIDC Compliance
The design supports complete OAuth2/OIDC flows through dedicated tables for each stage: user_sessions manage authorization requests, authorization_codes handle the code exchange, and access_tokens store bearer tokens. The consent_records table tracks granular scope permissions with timestamps and revocation capabilities, ensuring GDPR compliance.

Technical Decisions
Performance optimization uses strategic indexing for high-frequency operations like pseudonym lookups and token validation. The algorithm_version field in pseudonym_mappings enables seamless migration to new pseudonym algorithms. JSON fields store flexible scope configurations while maintaining query efficiency through specialized indexes.

Edge Cases
The schema handles client app deletion through cascading relationships and audit trails. Consent revocation updates both the consent status and related tokens. The system_settings table stores encrypted configuration for algorithm parameters. Automatic cleanup processes use TTL-based indexes on expires_at fields. The audit system provides complete compliance tracking with configurable retention periods, enabling both security monitoring and regulatory reporting without compromising user privacy.

Security Considerations for Production:

Encryption at Rest: All hash values and sensitive configuration should be encrypted using AES-256
Rate Limiting: Implement database-level rate limiting on pseudonym generation to prevent enumeration attacks
Audit Retention: Automated cleanup of expired records while maintaining compliance-required audit trails

## Challenge 3

OIDC Login Feature - Initial Team Meeting Agenda

Subject: Alignment Meeting - New OIDC Login Feature Development

Hi team,

Looking forward to collaborating on the new OIDC login feature! Ahead of our first sync, I’d like to align on a few key areas so we can hit the ground running:

Key Items to Clarify:

User Experience & Flow

1. What specific user journey are we targeting? (First-time registration vs. returning users)
2. How should pseudonym generation be presented to users? (Transparent vs. behind-the-scenes)
3. What consent screens and privacy explanations are needed?

Technical Scope

1. Which OIDC flows should we prioritize? (Authorization code, implicit, hybrid)
2. What client applications need immediate support?
3. Are there specific compliance requirements (GDPR, CCPA) driving this feature?

Privacy & Security Requirements

1. What level of pseudonym isolation is required between apps?
2. How do we handle user data requests or deletions?
3. What audit logging is needed for compliance?

Success Metrics

1. How do we measure privacy protection effectiveness?
2. What performance benchmarks are expected?
3. What user adoption metrics matter most?

Dependencies & Constraints

1. Are there existing systems we must integrate with?
2. What's our target timeline and resource allocation?
3. Any regulatory deadlines we need to meet?

Goal: Establish shared understanding of requirements before technical design begins.

Let me know if you'd like anything added to the agenda.  
Excited to build something privacy-first and scalable together.

Best,  
Tarun Manjunath
