# Role & Permission Model: Blockchain-Aligned Access Control

## Design Philosophy

ProofLedger's role-based permission model aligns with blockchain principles: **immutable history with controlled evolution**. Only authorized entities can append new document versions while preserving full history and maintaining trustless verification.

## Core Permission Principles

### Immutable Foundation
- **No deletion**: Documents and proofs cannot be removed
- **No editing**: Original documents remain unchanged
- **Append-only updates**: New versions link to previous versions
- **Full history**: Complete audit trail always available

### Controlled Evolution
- **Authority-based updates**: Only designated roles can append
- **Version linking**: Updates reference original document group
- **Permission inheritance**: New versions inherit access controls
- **Audit trails**: All changes tracked with timestamps and signatures

## Role Definitions

### 1. Authority Role
**Definition**: Entities authorized to create and append document proofs
**Capabilities**:
- Upload initial documents
- Append new versions to existing document groups
- Set access permissions for document owners
- Validate and endorse documents from other authorities

**Examples by Use Case**:
- **Real Estate**: RERA officials, registered builders, property authorities
- **Academic**: Universities, accredited institutions, research bodies
- **Medical**: Licensed hospitals, certified practitioners, health authorities
- **Startup**: Legal firms, founders, authorized representatives
- **Government**: Procurement departments, authorized officials

**Blockchain Implementation**:
```solidity
mapping(address => bool) public authorities;
mapping(bytes32 => address) public documentAuthority;

modifier onlyAuthority(bytes32 documentGroup) {
    require(authorities[msg.sender] || 
            documentAuthority[documentGroup] == msg.sender,
            "Not authorized");
    _;
}
```

### 2. Owner Role
**Definition**: Entities who receive and control access to documents
**Capabilities**:
- View all versions of owned documents
- Share verification links with third parties
- Control privacy settings (where applicable)
- Transfer ownership (with authority approval)

**Examples by Use Case**:
- **Real Estate**: Property buyers, current owners
- **Academic**: Students, graduates, researchers
- **Medical**: Patients (with privacy controls)
- **Startup**: Investors, shareholders, stakeholders
- **Government**: Citizens, bidders, contractors

**Access Control**:
- Automatic ownership assignment upon document creation
- Privacy controls for sensitive content
- Sharing permissions for verification purposes
- Transfer capabilities with proper authorization

### 3. Verifier Role
**Definition**: Entities who can verify document authenticity and access metadata
**Capabilities**:
- Verify document proofs against blockchain
- Access public metadata and verification status
- View document history and version chains
- Generate verification reports

**Examples by Use Case**:
- **Real Estate**: Banks, legal teams, potential buyers
- **Academic**: Employers, other institutions, professional bodies
- **Medical**: Insurance companies, other healthcare providers
- **Startup**: Due diligence teams, regulators, auditors
- **Government**: Citizens, oversight bodies, audit departments

**Verification Access**:
- No wallet required for basic verification
- Public access to proof metadata
- Timestamped verification logs
- Cross-reference capabilities

### 4. Observer Role
**Definition**: General public with read-only verification access
**Capabilities**:
- Verify document existence and timing
- Access public metadata (non-sensitive)
- View verification status and history
- Generate basic verification reports

**Public Access Features**:
- No authentication required
- Blockchain-based verification
- Transparency for accountability
- Trust-minimized validation

## Permission Matrix

| Action | Authority | Owner | Verifier | Observer |
|--------|-----------|-------|----------|----------|
| Upload Initial Document | ✅ | ❌ | ❌ | ❌ |
| Append New Version | ✅ | ❌ | ❌ | ❌ |
| View Full Content | ✅ | ✅ | 🔒* | ❌ |
| Access Metadata | ✅ | ✅ | ✅ | ✅ |
| Verify Authenticity | ✅ | ✅ | ✅ | ✅ |
| Share Verification Link | ✅ | ✅ | ✅ | ❌ |
| Transfer Ownership | ✅ | 🔒** | ❌ | ❌ |
| Set Privacy Controls | ✅ | ✅ | ❌ | ❌ |

*🔒 = With permission from owner
**🔒 = With authority approval

## Update Implementation: Append-Only Architecture

### Critical Terminology
**Never say "edit"** - all changes are **"appends"** or **"new versions"**

### Version Linking Structure
```solidity
struct DocumentGroup {
    bytes32 groupId;           // Unique identifier for document series
    bytes32[] versionHashes;   // Array of all version IPFS hashes
    uint256[] timestamps;      // Corresponding timestamps
    address authority;         // Who can append to this group
    address owner;            // Who owns/controls the document
}
```

### Append Process
1. **Authority creates new proof** with same groupId
2. **New version links** to existing document group
3. **Previous versions remain** immutable and accessible
4. **Full history preserved** with timestamps and signatures
5. **Verification works** for any version in the chain

## Security Model

### Authority Management
**Decentralized Authority**: No single admin can control all documents
**Role-Based Access**: Authorities limited to their domain of expertise
**Multi-Signature Support**: Critical updates require multiple signatures
**Authority Revocation**: Compromised authorities can be disabled

### Permission Enforcement
**Smart Contract Level**: Core permissions enforced on-chain
**Application Level**: UI/UX respects but doesn't enforce permissions
**Cryptographic Proof**: All actions signed and verifiable
**Audit Trail**: Complete history of all permission changes

### Privacy Protection
**Content Separation**: Sensitive content stored off-chain
**Access Control**: IPFS gateways respect permission settings
**Metadata Filtering**: Public verification shows only necessary data
**Owner Control**: Document owners control sharing permissions

## Regulatory Compliance

### Audit Requirements
**Immutable Records**: All document versions permanently preserved
**Authority Tracking**: Clear chain of custody for all updates
**Timestamp Integrity**: Blockchain-verified timing for all actions
**Access Logging**: Complete audit trail of all access attempts

### Data Protection
**Privacy by Design**: Sensitive data never stored on public blockchain
**Right to Privacy**: Owners control access to personal information
**Regulatory Compliance**: Model adapts to jurisdiction-specific requirements
**Cross-Border Recognition**: Universal verification standards

## Implementation Benefits

### For Authorities
**Clear Responsibility**: Defined scope of authority and accountability
**Audit Protection**: Immutable record of all authorized actions
**Efficiency**: Streamlined processes for document management
**Compliance**: Built-in regulatory compliance features

### For Owners
**True Ownership**: Cryptographic control over document access
**Privacy Control**: Granular permissions for sensitive content
**Verification Power**: Ability to prove ownership and authenticity
**Transfer Rights**: Secure ownership transfer capabilities

### For Verifiers
**Trustless Verification**: No need to trust document issuer
**Complete History**: Access to full document evolution
**Independent Validation**: Blockchain-based proof verification
**Audit Capabilities**: Comprehensive verification reporting

### For Observers
**Transparency**: Public accountability for regulated processes
**Trust Minimization**: Verify without trusting intermediaries
**Accessibility**: No technical barriers to basic verification
**Democratic Oversight**: Public access to accountability information

This role and permission model ensures that ProofLedger maintains blockchain principles while providing practical, regulated document management that serves real-world business needs.