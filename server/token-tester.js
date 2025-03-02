// token-tester.js
// Copy this code to a separate file and run it directly with Node.js

const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY3YzRhMWViZDNiNDgxMGUyODMyMTNhMSIsInVzZXJuYW1lIjoidGVzdHVzZXIyIiwiZW1haWwiOiJ0ZXN0MkB0ZXN0LmNvbSJ9LCJpYXQiOjE3NDA5Mzk3NTUsImV4cCI6MTc0MDk0Njk1NX0.ohgu0uAuV_W9-7k4qm68qw63WafbBlpAuQRrYgb3JFo";

// Try different secrets
const secrets = [
  'mysecretsshhhhh',
  'default_secret_key',
  'fallback_secret',
  'your_secret_key_here'
];

// Test each secret
secrets.forEach(secret => {
  console.log(`\nTrying with secret: "${secret}"`);
  try {
    const decoded = jwt.verify(token, secret);
    console.log('SUCCESS! Token verified with payload:', decoded);
  } catch (err) {
    console.log('Failed verification:', err.message);
  }
});

// Also analyze the token structure
const tokenParts = token.split('.');
console.log('\nToken analysis:');
console.log('Header:', Buffer.from(tokenParts[0], 'base64').toString());

try {
  console.log('Payload:', Buffer.from(tokenParts[1], 'base64').toString());
} catch (e) {
  console.log('Error parsing payload');
}

// Check if the token might have been tampered with
console.log('\nToken signature verification:');
const [headerB64, payloadB64, signature] = token.split('.');
console.log('Signature length:', signature.length);