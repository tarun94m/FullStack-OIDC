# OIDC-FSD-Challenge

## Challenge 1
Part 1: Code Review

Code Review: Issues & Explanations

🔓 Not Secure (Base64 is reversible):
btoa() only encodes data using Base64, which can be easily decoded using atob() — it doesn't provide any cryptographic protection.

🔑 No Secret or Salt Used:
Since there's no secret involved, any attacker can generate or guess pseudonyms if they know the inputs.

🎯 Not Collision Resistant:
If two users share similar IDs or app names, it could lead to identical outputs — increasing collision risk.

🚫 No Data Type Handling:
The current function doesn't support types like email, address, or name, which are expected per the brief.

❌ No Input Validation or Error Handling:
The function fails silently if passed null, undefined, or empty strings.

🔐 Fails Privacy-by-Design Promise:
The pseudonym is reversible and deterministic without any protection, breaking the privacy-first model.

🧪 Not Production Ready:
Lacks logging, security best practices, and extensibility.
