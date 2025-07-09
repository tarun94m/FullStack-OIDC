const crypto = require("crypto");

class ConsentKeysPseudonymGenerator {
  constructor(secretKey) {
    this.validateSecretKey(secretKey);
    this.secretKey = secretKey;
    this.PREFIX = "ck_";
    this.PSEUDONYM_LENGTH = 16; // 16 hex chars = 64 bits of entropy

    // Pre-defined pools for fake data generation
    this.fakeNames = [
      "Taylor Johnson",
      "Jordan Smith",
      "Alex Davis",
      "Morgan Brown",
      "Casey Wilson",
      "Riley Martinez",
      "Avery Garcia",
      "Quinn Anderson",
    ];

    this.fakeCities = [
      "Franklin",
      "Madison",
      "Springfield",
      "Georgetown",
      "Clinton",
      "Riverside",
      "Fairview",
      "Greenwood",
      "Hillcrest",
      "Oakwood",
    ];

    this.fakeStates = [
      "NY",
      "CA",
      "TX",
      "FL",
      "IL",
      "PA",
      "OH",
      "GA",
      "NC",
      "MI",
    ];

    this.fakeStreets = [
      "Oak Ave",
      "Pine St",
      "Main St",
      "Elm Dr",
      "Cedar Ln",
      "Maple Ave",
      "Park St",
      "First St",
      "Second Ave",
      "Third St",
    ];
  }

  /**
   * Validates the secret key meets security requirements
   */
  validateSecretKey(secretKey) {
    if (!secretKey || typeof secretKey !== "string") {
      throw new Error("Secret key must be a non-empty string");
    }

    if (secretKey.length < 32) {
      throw new Error("Secret key must be at least 32 characters for security");
    }

    // Check for common weak patterns
    if (
      secretKey === secretKey.toLowerCase() ||
      secretKey === secretKey.toUpperCase() ||
      /^(.)\1+$/.test(secretKey)
    ) {
      throw new Error(
        "Secret key appears to be weak - use a strong, random key"
      );
    }
  }

  /**
   * Validates input parameters
   */
  validateInputs(userId, clientId) {
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      throw new Error("userId is required and must be a non-empty string");
    }

    if (!clientId || typeof clientId !== "string" || clientId.trim() === "") {
      throw new Error("clientId is required and must be a non-empty string");
    }

    // Additional security validations
    if (userId.length > 255 || clientId.length > 255) {
      throw new Error("userId and clientId must be less than 255 characters");
    }

    // Prevent injection attacks
    if (userId.includes("\0") || clientId.includes("\0")) {
      throw new Error("userId and clientId cannot contain null bytes");
    }
  }

  /**
   * Generates a cryptographically secure pseudonym
   *
   * @param {string} userId - User identifier (never stored or logged)
   * @param {string} clientId - Client application identifier
   * @param {string} dataType - Type of data (id, email, name, address)
   * @returns {string} Secure pseudonym with ck_ prefix
   */
  generatePseudonym(userId, clientId, dataType = "id") {
    this.validateInputs(userId, clientId);

    // Validate dataType
    const validTypes = ["id", "email", "name", "address"];
    if (!validTypes.includes(dataType)) {
      throw new Error(
        `Invalid dataType. Must be one of: ${validTypes.join(", ")}`
      );
    }

    try {
      // Create unique input with proper separation
      // Using delimiters to prevent collision attacks
      const input = `${userId}::${clientId}::${dataType}::${this.secretKey}`;

      // Use SHA-256 for cryptographic security
      const hash = crypto
        .createHash("sha256")
        .update(input, "utf8")
        .digest("hex");

      // Take first 16 characters for the pseudonym (64 bits of entropy)
      const pseudonym = hash.substring(0, this.PSEUDONYM_LENGTH);

      return `${this.PREFIX}${pseudonym}`;
    } catch (error) {
      throw new Error(`Failed to generate pseudonym: ${error.message}`);
    }
  }

  /**
   * Generates a deterministic fake email for a user/app combination
   */
  generateFakeEmail(userId, clientId) {
    const pseudonym = this.generatePseudonym(userId, clientId, "email");
    return `${pseudonym}@consentkeys.local`;
  }

  /**
   * Generates a deterministic fake display name
   */
  generateFakeDisplayName(userId, clientId) {
    const pseudonym = this.generatePseudonym(userId, clientId, "name");

    // Use pseudonym to seed deterministic selection
    const hash = crypto.createHash("sha256").update(pseudonym).digest("hex");
    const index = parseInt(hash.substring(0, 8), 16) % this.fakeNames.length;

    return this.fakeNames[index];
  }

  /**
   * Generates a deterministic fake address
   */
  generateFakeAddress(userId, clientId) {
    const pseudonym = this.generatePseudonym(userId, clientId, "address");

    // Use different parts of hash for different address components
    const hash = crypto.createHash("sha256").update(pseudonym).digest("hex");

    const streetNumber = (parseInt(hash.substring(0, 8), 16) % 999) + 1;
    const streetIndex =
      parseInt(hash.substring(8, 16), 16) % this.fakeStreets.length;
    const cityIndex =
      parseInt(hash.substring(16, 24), 16) % this.fakeCities.length;
    const stateIndex =
      parseInt(hash.substring(24, 32), 16) % this.fakeStates.length;
    const zipCode = String(
      parseInt(hash.substring(32, 40), 16) % 99999
    ).padStart(5, "0");

    return {
      street: `${streetNumber} ${this.fakeStreets[streetIndex]}`,
      city: this.fakeCities[cityIndex],
      state: this.fakeStates[stateIndex],
      zip: zipCode,
    };
  }

  /**
   * Verifies if a string is a valid ConsentKeys pseudonym
   */
  verifyPseudonym(pseudonym) {
    if (!pseudonym || typeof pseudonym !== "string") {
      return false;
    }

    // Check format: ck_ prefix + 16 hex characters
    const pattern = new RegExp(
      `^${this.PREFIX}[a-f0-9]{${this.PSEUDONYM_LENGTH}}$`
    );
    return pattern.test(pseudonym);
  }

  /**
   * Securely clears sensitive data from memory (best effort)
   */
  destroy() {
    // Overwrite secret key in memory
    if (this.secretKey) {
      this.secretKey = "0".repeat(this.secretKey.length);
      delete this.secretKey;
    }
  }
}

module.exports = ConsentKeysPseudonymGenerator;
