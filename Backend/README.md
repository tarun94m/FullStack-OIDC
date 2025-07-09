<<<<<<< HEAD

# 🔐 ConsentKeys Pseudonym Generator

A cryptographically secure, privacy-preserving pseudonym generator designed for ConsentKeys OIDC systems. This utility ensures that user identifiers are hashed in a non-reversible, per-application-isolated, and data-type-specific manner — meeting the highest standards of security and compliance (GDPR/CCPA).

---

## 🚀 Features

- ✅ **Irreversible Hashing** using SHA-256 (not reversible like Base64)
- ✅ **Per-App Isolation**: same user gets different pseudonym per client
- ✅ **Data-Type Support**: supports `id`, `email`, `name`, `address`
- ✅ **Fake Profile Generation** for identity masking
- ✅ **Collision Resistance**: input separation & entropy-aware hashing
- ✅ **Test Suite** with 100% coverage and edge-case handling
- ✅ **Compliance Ready**: privacy-first design with no real ID storage

---

## 📦 Installation

````bash
git clone https://github.com/yourusername/consentkeys-pseudonym-generator.git
cd Backend
npm install


## Installation

```bash
npm install
````

## Usage

```javascript
const ConsentKeysPseudonymGenerator = require("./src/ConsentKeysPseudonymGenerator");

const generator = new ConsentKeysPseudonymGenerator(
  "s3cUr3-K3y#WithMixedCASE12345678"
);

const pseudonym = generator.generatePseudonym(
  "user123",
  "shopping-app",
  "email"
);
console.log(pseudonym); // e.g., ck_123a80bca69416d2

const fakeEmail = generator.generateFakeEmail("user123", "shopping-app");
console.log(fakeEmail); // e.g., ck_fafdb020f9e0004a@consentkeys.local
```

## Running Tests

Run the test suite with:

```bash
npm test
```

## Sample Output

# 🔐 ConsentKeys Pseudonym Generator Test Suite

✅ CONSISTENCY TESTS ............. PASS
✅ APP ISOLATION TESTS .......... PASS
✅ DATA TYPE VARIATIONS ......... PASS
✅ FAKE PROFILE GENERATION ...... PASS
✅ CROSS-APP ISOLATION .......... PASS
✅ PSEUDONYM VERIFICATION ....... PASS
✅ COLLISION RESISTANCE ......... PASS
✅ SECURITY DEMONSTRATION ....... PASS
✅ PERFORMANCE TEST ............. 14ms / 1000 pseudonyms
✅ ERROR HANDLING ............... PASS
🎉 All tests completed!

## Security

Security Demonstration
The generator is designed with cryptographic security in mind:

SHA-256 hash + secret key → irreversible pseudonym

Uses delimiter (::) to prevent collisions (user1+23app ≠ user12+3app)

Not reversible via Base64 or brute-force

Cannot derive userId/clientId from pseudonym

ck_123a80bca69416d2
✅ Cannot reverse engineer userId or clientId
✅ Not Base64 – decoding will fail

## Fake Data Examples

Email: ck_fafdb020f9e0004a@consentkeys.local

Display Name: Jordan Smith

Address:

{
"street": "294 Elm Dr",
"city": "Greenwood",
"state": "IL",
"zip": "39523"
}

## License

MIT License

## Author Details

Name : Tarun Manjunath
Email: tarun2m200@gmail.com

-------------------------------------
-------------------------------------

## Challenge 1
Part 1: Code Review

Code Review: Issues & Explanations

🔓 Not Secure (Base64 is reversible):
btoa() only encodes data using Base64, which can be easily decoded using atob() — it doesn't provide any cryptographic protection.

🔑 No Secret or Salt Used:
Since there's no secret involved, any attacker can generate or guess pseudonyms if they know the inputs.

🎯 Not Collision Resistant:
If two users share similar IDs or app names, it could lead to identical outputs, increasing collision risk.

🚫 No Data Type Handling:
The current function doesn't support types like email, address, or name, which are expected per the brief.

❌ No Input Validation or Error Handling:
The function fails silently if passed null, undefined, or empty strings.

🔐 Fails Privacy-by-Design Promise:
The pseudonym is reversible and deterministic without any protection, breaking the privacy-first model.

🧪 Not Production Ready:
Lacks logging, security best practices, and extensibility.
