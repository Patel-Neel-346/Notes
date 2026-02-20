# Complete Cryptographic Guide: Standards, Formats, and Implementation

## 🎯 Core Question: Do All Algorithms Need a Random Source?

**Short Answer: YES** - All cryptographic key generation requires a secure random source.

| Algorithm Type | Needs Random? | Why? | |## 🔧 Understanding Go vs Node.js Differences

### Why Go Requires Manual PEM Wrapping

```go
// Go: Low-level, explicit control
rsaPrivPKCS8 := x509.MarshalPKCS8PrivateKey(rsaKey)
// ↑ Returns: []byte (raw ASN.1 binary data)
// You must add PEM wrapper manually:
rsaPrivPEM8 := &pem.Block{
    Type:  "PRIVATE KEY",  // This becomes "-----BEGIN PRIVATE KEY-----"
    Bytes: rsaPrivPKCS8,   // Raw key data
}
pem.EncodeToMemory(rsaPrivPEM8)  // Adds -----BEGIN/END----- wrapper
```

```js
// Node.js: High-level, automatic formatting
const { privateKey } = generateKeyPairSync('rsa', {
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'  // ← Automatically adds PEM wrapper
    }
});
// Result: Complete PEM string with -----BEGIN/END-----
```

### Memory Safety: Reusing Keys is Fine

```go
rsaKey, _ := rsa.GenerateKey(rand.Reader, 2048)

// ✅ SAFE: These create independent copies
pkcs1Bytes := x509.MarshalPKCS1PrivateKey(rsaKey)    // Copy 1
pkcs8Bytes := x509.MarshalPKCS8PrivateKey(rsaKey)    // Copy 2  
pubBytes := x509.MarshalPKIXPublicKey(&rsaKey.PublicKey)  // Copy 3

// Each byte slice is independent - no shared references
// Like taking multiple photos of the same key
```

---|---|---| | **RSA** | ✅ Yes | Generate prime numbers p, q | | **ECDSA** | ✅ Yes | Generate private key scalar | | **HMAC** | ✅ Yes | Generate shared secret key | | **AES** | ✅ Yes | Generate symmetric key | | **Diffie-Hellman** | ✅ Yes | Generate private exponent |

### Random Sources by Platform

- **Go**: `crypto/rand.Reader` (uses OS entropy)
- **Node.js**: `crypto.randomBytes()` (uses OS entropy)
- **Browser**: `crypto.getRandomValues()` (uses OS entropy)
- **System**: `/dev/urandom` (Linux/macOS), `CryptGenRandom` (Windows)

---

## 🧠 The Big Picture: Why These Standards Exist

### The Problem

- Everyone was creating keys and certificates differently
- No interoperability between systems
- Security vulnerabilities from improper implementations

### The Solution: Standards

- **X.509**: Universal certificate format
- **PKCS**: Private Key Cryptography Standards (numbered #1-#15)
- **RFC**: Internet standards for protocols

---

## 📚 Essential Cryptographic Standards

### X.509 Family

|Standard|Purpose|Example|
|---|---|---|
|**X.509**|Certificate structure|SSL/TLS certificates|
|**PKIX**|Public Key Infrastructure using X.509|Certificate authorities|
|**SPKI**|SubjectPublicKeyInfo (part of X.509)|Public key encoding|

### PKCS Family (The Important Ones)

|Standard|Purpose|Used For|
|---|---|---|
|**PKCS#1**|RSA Cryptography Standard|RSA keys only|
|**PKCS#8**|Private Key Info Standard|All key types (RSA, ECDSA, etc.)|
|**PKCS#10**|Certificate Request Standard|CSR files|
|**PKCS#12**|Personal Information Exchange|.p12/.pfx files|

---

## 🔐 Key Formats Explained

### Private Key Formats

```
PKCS#1 (RSA Only):
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----

PKCS#8 (Universal):
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----

PKCS#8 Encrypted:
-----BEGIN ENCRYPTED PRIVATE KEY-----
...
-----END ENCRYPTED PRIVATE KEY-----
```

### Public Key Format

```
SPKI (Standard for all):
-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----
```

### Certificate Format

```
X.509:
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```

---

## 🛠️ Go's `crypto/x509` Package Explained

### What is x509?

The `crypto/x509` package in Go handles:

- **Certificate parsing and generation**
- **Key format conversions** (PKCS#1 ↔ PKCS#8 ↔ SPKI)
- **Certificate validation** (chain of trust)
- **ASN.1 encoding/decoding** (the binary format behind PEM)

### Key Functions in x509

```go
// Private Key Parsing
x509.ParsePKCS1PrivateKey(data)    // RSA only
x509.ParsePKCS8PrivateKey(data)    // Any algorithm
x509.ParseECPrivateKey(data)       // ECDSA only

// Private Key Encoding
x509.MarshalPKCS1PrivateKey(key)   // RSA → PKCS#1
x509.MarshalPKCS8PrivateKey(key)   // Any → PKCS#8

// Public Key Handling
x509.MarshalPKIXPublicKey(pub)     // Any → SPKI
x509.ParsePKIXPublicKey(data)      // SPKI → Any

// Certificate Operations
x509.ParseCertificate(data)        // Parse X.509 cert
x509.CreateCertificate(...)        // Generate X.509 cert
```

### Why x509 for Non-Certificate Tasks?

Even when not dealing with certificates, x509 is used because:

- It's the **standard library** for key format conversions
- It handles **ASN.1 encoding** (the binary format)
- It provides **interoperability** with other systems
- **TLS libraries expect x509-formatted keys**

---

## 🚀 Complete Implementation Examples

### Go: Generate All Key Types

```go
package main

import (
    "crypto/ecdsa"
    "crypto/elliptic"
    "crypto/rand"
    "crypto/rsa"
    "crypto/x509"
    "encoding/pem"
    "os"
)

func main() {
    // RSA Key Generation
    rsaKey, err := rsa.GenerateKey(rand.Reader, 2048)
    if err != nil {
        panic(err)
    }
    
    // Export RSA Private Key (PKCS#1)
    rsaPrivPKCS1 := x509.MarshalPKCS1PrivateKey(rsaKey)
    rsaPrivPEM := &pem.Block{
        Type:  "RSA PRIVATE KEY",
        Bytes: rsaPrivPKCS1,
    }
    os.WriteFile("rsa_private_pkcs1.pem", pem.EncodeToMemory(rsaPrivPEM), 0644)
    
    // Export RSA Private Key (PKCS#8)
    rsaPrivPKCS8, _ := x509.MarshalPKCS8PrivateKey(rsaKey)
    rsaPrivPEM8 := &pem.Block{
        Type:  "PRIVATE KEY",
        Bytes: rsaPrivPKCS8,
    }
    os.WriteFile("rsa_private_pkcs8.pem", pem.EncodeToMemory(rsaPrivPEM8), 0644)
    
    // Export RSA Public Key (SPKI)
    rsaPubSPKI, _ := x509.MarshalPKIXPublicKey(&rsaKey.PublicKey)
    rsaPubPEM := &pem.Block{
        Type:  "PUBLIC KEY",
        Bytes: rsaPubSPKI,
    }
    os.WriteFile("rsa_public.pem", pem.EncodeToMemory(rsaPubPEM), 0644)
    
    // ECDSA Key Generation
    ecdsaKey, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
    
    // Export ECDSA Private Key (PKCS#8 only)
    ecdsaPrivPKCS8, _ := x509.MarshalPKCS8PrivateKey(ecdsaKey)
    ecdsaPrivPEM := &pem.Block{
        Type:  "PRIVATE KEY",
        Bytes: ecdsaPrivPKCS8,
    }
    os.WriteFile("ecdsa_private.pem", pem.EncodeToMemory(ecdsaPrivPEM), 0644)
    
    // Export ECDSA Public Key (SPKI)
    ecdsaPubSPKI, _ := x509.MarshalPKIXPublicKey(&ecdsaKey.PublicKey)
    ecdsaPubPEM := &pem.Block{
        Type:  "PUBLIC KEY",
        Bytes: ecdsaPubSPKI,
    }
    os.WriteFile("ecdsa_public.pem", pem.EncodeToMemory(ecdsaPubPEM), 0644)
}
```

### Node.js: Generate All Key Types

```js
const { generateKeyPairSync } = require('crypto');
const fs = require('fs');

// RSA Keys
const { privateKey: rsaPriv, publicKey: rsaPub } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',    // SPKI format
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1',   // PKCS#1 format (RSA only)
        format: 'pem'
    }
});

fs.writeFileSync('rsa_private_pkcs1.pem', rsaPriv);
fs.writeFileSync('rsa_public.pem', rsaPub);

// RSA Keys in PKCS#8
const { privateKey: rsaPriv8 } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }  // PKCS#8
});

fs.writeFileSync('rsa_private_pkcs8.pem', rsaPriv8);

// ECDSA Keys (PKCS#8 only)
const { privateKey: ecPriv, publicKey: ecPub } = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',  // P-256 curve
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }  // PKCS#8 only for ECDSA
});

fs.writeFileSync('ecdsa_private.pem', ecPriv);
fs.writeFileSync('ecdsa_public.pem', ecPub);
```

---

## 🔄 Format Conversion Matrix

|From Format|To Format|Go Method|Node.js Method|
|---|---|---|---|
|PKCS#1 → PKCS#8|RSA Private|`x509.MarshalPKCS8PrivateKey()`|Re-generate with `type: 'pkcs8'`|
|PKCS#8 → PKCS#1|RSA Private|`x509.MarshalPKCS1PrivateKey()`|Re-generate with `type: 'pkcs1'`|
|Private → Public|Any|`x509.MarshalPKIXPublicKey()`|`publicKeyEncoding: {type: 'spki'}`|
|PEM → DER|Any|Remove `pem.Encode()`|`format: 'der'`|

---

## 🌐 Real-World Usage Scenarios

### TLS/SSL Certificates

```go
// Create a certificate template
template := x509.Certificate{
    SerialNumber: big.NewInt(1),
    Subject: pkix.Name{
        Organization:  []string{"My Company"},
        Country:       []string{"US"},
        Province:      []string{"CA"},
        Locality:      []string{"San Francisco"},
        StreetAddress: []string{""},
        PostalCode:    []string{""},
    },
    NotBefore:    time.Now(),
    NotAfter:     time.Now().Add(365 * 24 * time.Hour),
    SubjectKeyId: []byte{1, 2, 3, 4, 6},
    ExtKeyUsage:  []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth, x509.ExtKeyUsageServerAuth},
    KeyUsage:     x509.KeyUsageDigitalSignature,
}

// Create certificate
certDER, err := x509.CreateCertificate(rand.Reader, &template, &template, &rsaKey.PublicKey, rsaKey)
```

### JWT with Different Algorithms (Detailed Walkthrough)

````go
import (
    "github.com/golang-jwt/jwt/v5"  // Popular Go JWT library
    "crypto/rsa"                     // For RSA key handling
    "crypto/ecdsa"                   // For ECDSA key handling
)

// === RS256: RSA + SHA256 ===
func signJWT_RS256(rsaPrivateKey *rsa.PrivateKey) string {
    // ↑ rsaPrivateKey: Must be *rsa.PrivateKey type (not interface{})
    
    token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
        // ↑ jwt.NewWithClaims(): Creates new JWT token structure
        // ↑ jwt.SigningMethodRS256: Use RSA private key + SHA256 hash
        // ↑ jwt.MapClaims: Simple map[string]interface{} for claims
        
        "sub": "user123",                    // Subject: who the token is about
        "iss": "my-app",                     // Issuer: who created the token
        "aud": "api-server",                 // Audience: who should accept it
        "exp": time.Now().Add(time.Hour).Unix(),  // Expiration: 1 hour from now
        "iat": time.Now().Unix(),            // Issued at: current time
        // ↑ These are standard JWT claims (registered in RFC 7519)
    })
    // ↑ Token is not signed yet - just a structure in memory
    
    tokenString, err := token.SignedString(rsaPrivateKey)
    // ↑ token.SignedString(): Actually signs the JWT
    // ↑ Creates header.payload.signature format
    // ↑ Uses RSA private key to create signature over header+payload
    // ↑ Returns: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOi..." format
    
    if err != nil {
        panic(err)  // Handle signing failure
    }
    return tokenString  // Ready-to-use JWT string
}

// === ES256: ECDSA + SHA256 ===
func signJWT_ES256(ecdsaPrivateKey *ecdsa.PrivateKey) string {
    // ↑ ecdsaPrivateKey: Must be *ecdsa.PrivateKey type
    
    token := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.MapClaims{
        // ↑ jwt.SigningMethodES256: Use ECDSA private key + SHA256 hash
        // ↑ Same claim structure as RS256 - algorithm is in header
        
        "sub": "user123",
        "iss": "my-app", 
        "exp": time.Now().Add(time.Hour).Unix(),
    })
    
    tokenString, _ := token.SignedString(ecdsaPrivateKey)
    // ↑ Same signing process, different algorithm
    // ↑ ECDSA signatures are non-deterministic (different each time)
    // ↑ RSA signatures are deterministic (same input = same signature)
    
    return tokenString
}

// === HS256: HMAC + SHA256 ===
func signJWT_HS256(secretKey []byte) string {
    // ↑ secretKey: Shared secret (symmetric key)
    // ↑ []byte: Raw bytes, not a structured key type
    
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        // ↑ jwt.SigningMethodHS256: Use HMAC-SHA256 with shared secret
        // ↑ No public/private key - both signer and verifier need same secret
        
        "sub": "user123",
        "exp": time.Now().Add(time.Hour).Unix(),
    })
    
    tokenString, _ := token.SignedString(secretKey)
    // ↑ HMAC uses same secret for signing and verification
    // ↑ Faster than RSA/ECDSA but requires shared secret management
    // ↑ Good for microservices within same trust boundary
    
    return tokenString
}

// === JWT VERIFICATION EXAMPLES ===
func verifyJWT_RS256(tokenString string, rsaPublicKey *rsa.PublicKey) (*jwt.Token, error) {
    // ↑ Verification needs PUBLIC key (not private)
    // ↑ Anyone can verify RS256 tokens if they have public key
    
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // ↑ jwt.Parse(): Decodes and verifies JWT
        // ↑ Callback function: Returns key for verification
        
        if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
            // ↑ Verify algorithm matches expectation (prevent algorithm confusion)
            // ↑ Attacker could change alg header to "none" or "HS256"
            
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        
        return rsaPublicKey, nil  // Return RSA public key for verification
        // ↑ Library uses this key to verify signature
    })
    
    return token, err  // Returns parsed token + verification result
}

func verifyJWT_HS256(tokenString string, secretKey []byte) (*jwt.Token, error) {
    // ↑ HMAC verification uses same secret as signing
    // ↑ Symmetric: signer and verifier must share secret
    
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            // ↑ Ensure HMAC algorithm (not RSA/ECDSA)
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        
        return secretKey, nil  // Same secret used for signing
    })
    
    return token, err
}
``` (RSA + SHA256)
token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
tokenString, _ := token.SignedString(rsaPrivateKey)

// ES256 (ECDSA + SHA256)
token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
tokenString, _ := token.SignedString(ecdsaPrivateKey)

// HS256 (HMAC + SHA256)
token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
tokenString, _ := token.SignedString([]byte("secret"))
````

---

## 💡 Key Takeaways for Your Notes

### Remember These Rules:

1. **All crypto needs randomness** - never skip `rand.Reader`
2. **PKCS#1 = RSA only**, **PKCS#8 = universal**
3. **SPKI = public keys**, always the same format
4. **x509 package = format converter + certificate handler**
5. **PEM = text wrapper around binary ASN.1 data**

### When to Use What:

- **PKCS#1**: Only when you specifically need RSA-only format
- **PKCS#8**: Default choice for private keys (works everywhere)
- **SPKI**: Always for public keys (only choice)
- **x509**: When you need certificates OR format conversion

### Compatibility:

- **Go ↔ Node.js**: Use PKCS#8 + SPKI for maximum compatibility
- **Go ↔ OpenSSL**: All formats work
- **JWT libraries**: Prefer PKCS#8 private keys, SPKI public keys

---

## 🔧 Debugging Tips

### Check Key Format:

```bash
# Identify key type
openssl rsa -in key.pem -text -noout     # PKCS#1 RSA
openssl pkey -in key.pem -text -noout    # PKCS#8 any type
openssl x509 -in cert.pem -text -noout   # X.509 certificate
```

### Convert Between Formats:

```bash
# PKCS#1 → PKCS#8
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in rsa_pkcs1.pem -out rsa_pkcs8.pem

# PKCS#8 → PKCS#1 (RSA only)
openssl rsa -in rsa_pkcs8.pem -out rsa_pkcs1.pem

# Extract public key
openssl pkey -in private.pem -pubout -out public.pem
```

### Common Errors:

- `"could not parse private key"` → Wrong format (PKCS#1 vs PKCS#8)
- `"algorithm not supported"` → Using PKCS#1 for non-RSA key
- `"invalid key"` → Missing random source during generation