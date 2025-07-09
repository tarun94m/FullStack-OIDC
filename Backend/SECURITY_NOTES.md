# Security Notes for ConsentKeys Pseudonym Generator

## Overview

This document outlines important security considerations for using the ConsentKeys Pseudonym Generator.

## Secret Key Management

- The secret key used for HMAC must be kept confidential and stored securely.
- Do not hardcode the secret key in source code repositories.
- Use environment variables or secure vaults to manage secret keys.

## Pseudonym Generation

- The pseudonym is generated using HMAC with SHA-256, which is a cryptographically secure method.
- The pseudonym is irreversible, meaning the original consent key cannot be derived from the pseudonym.
- Ensure the secret key is sufficiently random and of adequate length (e.g., 256 bits).

## Usage Recommendations

- Rotate secret keys periodically to limit exposure in case of compromise.
- Validate input consent keys to prevent injection attacks or malformed data.
- Use secure channels (e.g., HTTPS) when transmitting consent keys or pseudonyms.

## Limitations

- The security of the pseudonym depends entirely on the secrecy of the secret key.
- If the secret key is leaked, pseudonyms can be reproduced and privacy compromised.

## Additional Security Measures

- Consider implementing access controls around the pseudonym generator service.
- Monitor and audit usage to detect unauthorized access or anomalies.

## Disclaimer

This tool is provided as-is. Users are responsible for implementing appropriate security measures in their environment.
