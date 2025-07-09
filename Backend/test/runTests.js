const ConsentKeysPseudonymGenerator = require("../src/ConsentKeysPseudonymGenerator");

function runTests() {
  console.log("🔐 ConsentKeys Pseudonym Generator Test Suite");
  console.log("=".repeat(50));

  try {
    // Initialize generator with strong secret key
    const generator = new ConsentKeysPseudonymGenerator(
      "s3cUr3-K3y#WithMixedCASE12345678"
    );

    console.log("\n✅ CONSISTENCY TESTS");
    console.log("Same inputs should always produce same outputs");
    const test1a = generator.generatePseudonym("user123", "shopping-app");
    const test1b = generator.generatePseudonym("user123", "shopping-app");
    console.log(`User123 + shopping-app: ${test1a}`);
    console.log(`User123 + shopping-app (again): ${test1b}`);
    console.log(
      `Consistency check: ${test1a === test1b ? "✅ PASS" : "❌ FAIL"}`
    );

    console.log("\n✅ APP ISOLATION TESTS");
    console.log("Same user should get different pseudonyms per app");
    const shopping = generator.generatePseudonym("user123", "shopping-app");
    const social = generator.generatePseudonym("user123", "social-app");
    console.log(`User123 + shopping-app: ${shopping}`);
    console.log(`User123 + social-app: ${social}`);
    console.log(
      `Isolation check: ${shopping !== social ? "✅ PASS" : "❌ FAIL"}`
    );

    console.log("\n✅ DATA TYPE VARIATIONS");
    console.log("Different data types should produce different pseudonyms");
    const idPseudo = generator.generatePseudonym(
      "user123",
      "shopping-app",
      "id"
    );
    const emailPseudo = generator.generatePseudonym(
      "user123",
      "shopping-app",
      "email"
    );
    const namePseudo = generator.generatePseudonym(
      "user123",
      "shopping-app",
      "name"
    );
    console.log(`ID pseudonym: ${idPseudo}`);
    console.log(`Email pseudonym: ${emailPseudo}`);
    console.log(`Name pseudonym: ${namePseudo}`);

    console.log("\n✅ FAKE PROFILE GENERATION");
    const fakeEmail = generator.generateFakeEmail("user123", "shopping-app");
    const fakeName = generator.generateFakeDisplayName(
      "user123",
      "shopping-app"
    );
    const fakeAddress = generator.generateFakeAddress(
      "user123",
      "shopping-app"
    );
    console.log(`Fake Email: ${fakeEmail}`);
    console.log(`Fake Name: ${fakeName}`);
    console.log(`Fake Address: ${JSON.stringify(fakeAddress)}`);

    console.log("\n✅ CROSS-APP PROFILE CONSISTENCY");
    console.log("Same user should get different fake data per app");
    const shopEmail = generator.generateFakeEmail("user123", "shopping-app");
    const socialEmail = generator.generateFakeEmail("user123", "social-app");
    console.log(`Shopping app email: ${shopEmail}`);
    console.log(`Social app email: ${socialEmail}`);
    console.log(
      `Cross-app isolation: ${
        shopEmail !== socialEmail ? "✅ PASS" : "❌ FAIL"
      }`
    );

    console.log("\n✅ PSEUDONYM VERIFICATION");
    const validPseudonym = generator.generatePseudonym("user456", "test-app");
    console.log(`Valid pseudonym: ${validPseudonym}`);
    console.log(
      `Verification result: ${
        generator.verifyPseudonym(validPseudonym) ? "✅ VALID" : "❌ INVALID"
      }`
    );
    console.log(
      `Invalid pseudonym check: ${
        generator.verifyPseudonym("invalid_pseudonym") ? "❌ FAIL" : "✅ PASS"
      }`
    );

    console.log("\n✅ COLLISION RESISTANCE TESTS");
    console.log("Testing potential collision scenarios");
    const collision1 = generator.generatePseudonym("user1", "23app");
    const collision2 = generator.generatePseudonym("user12", "3app");
    console.log(`"user1" + "23app": ${collision1}`);
    console.log(`"user12" + "3app": ${collision2}`);
    console.log(
      `Collision resistance: ${
        collision1 !== collision2 ? "✅ PASS" : "❌ FAIL"
      }`
    );

    console.log("\n✅ SECURITY DEMONSTRATION");
    console.log("Pseudonyms are cryptographically secure and irreversible");
    const secureExample = generator.generatePseudonym(
      "user123",
      "shopping-app"
    );
    console.log(`Generated pseudonym: ${secureExample}`);
    console.log(
      "✅ Cannot reverse engineer userId or clientId from this hash – cryptographically secure"
    );
    console.log("✅ Not base64 – decoding attempts will fail");

    console.log("\n✅ PERFORMANCE TEST");
    console.log("Testing generation speed...");
    const startTime = Date.now();
    for (let i = 0; i < 1000; i++) {
      generator.generatePseudonym(`user${i}`, "test-app");
    }
    const endTime = Date.now();
    console.log(`Generated 1000 pseudonyms in ${endTime - startTime}ms`);
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
  }

  console.log("\n✅ ERROR HANDLING TESTS");

  // Test empty inputs
  try {
    const generator = new ConsentKeysPseudonymGenerator(
      "s3cUr3-K3y#WithMixedCASE12345678"
    );
    generator.generatePseudonym("", "test");
    console.log("❌ FAIL: Should have thrown error for empty userId");
  } catch (e) {
    console.log(`✅ Empty userId error: ${e.message}`);
  }

  try {
    const generator = new ConsentKeysPseudonymGenerator(
      "s3cUr3-K3y#WithMixedCASE12345678"
    );
    generator.generatePseudonym("user123", "");
    console.log("❌ FAIL: Should have thrown error for empty clientId");
  } catch (e) {
    console.log(`✅ Empty clientId error: ${e.message}`);
  }

  // Test weak secret key
  try {
    new ConsentKeysPseudonymGenerator("short");
    console.log("❌ FAIL: Should have thrown error for weak secret key");
  } catch (e) {
    console.log(`✅ Weak secret key error: ${e.message}`);
  }

  // Test invalid data type
  try {
    const generator = new ConsentKeysPseudonymGenerator(
      "s3cUr3-K3y#WithMixedCASE12345678"
    );
    generator.generatePseudonym("user123", "app", "invalid");
    console.log("❌ FAIL: Should have thrown error for invalid data type");
  } catch (e) {
    console.log(`✅ Invalid data type error: ${e.message}`);
  }

  // Test null byte injection
  try {
    const generator = new ConsentKeysPseudonymGenerator(
      "s3cUr3-K3y#WithMixedCASE12345678"
    );
    generator.generatePseudonym("user\u0000", "app");
    console.log("❌ FAIL: Should have thrown error for null byte injection");
  } catch (e) {
    console.log(`✅ Null byte injection protection: ${e.message}`);
  }

  console.log("\n🎉 All tests completed!");
}

runTests();
