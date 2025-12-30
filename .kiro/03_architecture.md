# Architecture Overview: ProofLedger

## System Architecture

### Frontend Layer (Next.js)
**Purpose**: User interface and Web3 integration
- React components for file upload and proof management
- Wallet connection handling (MetaMask, WalletConnect)
- IPFS client integration for file operations
- Responsive design for mobile and desktop

**Why this layer exists**: Abstracts blockchain complexity, provides familiar web experience

### API Layer (Next.js API Routes)
**Purpose**: Backend logic and external service integration
- IPFS pinning service integration (Pinata)
- File processing and hash generation
- Proof verification endpoints
- Error handling and validation

**Why this layer exists**: Handles server-side operations, manages external API keys securely

### Smart Contract Layer (Ethereum)
**Purpose**: Immutable proof registry
- Stores IPFS CIDs with timestamps
- Emits events for proof creation
- Provides public verification functions
- Gas-optimized for minimal costs

**Why this layer exists**: Provides trustless, permanent record keeping

### Storage Layer (IPFS)
**Purpose**: Decentralized content storage
- Stores actual file content
- Content-addressed storage (CID-based)
- Distributed across network nodes
- Pinning services ensure availability

**Why this layer exists**: Blockchain storage is too expensive for files

## Data Flow Diagram

```
User Upload Flow:
[User] → [Web App] → [IPFS] → [Smart Contract] → [Blockchain]
   ↓         ↓         ↓           ↓              ↓
 File    Generate   Store      Record CID    Immutable
Input    Hash      Content    + Timestamp     Proof

Verification Flow:
[Anyone] → [Web App] → [Smart Contract] → [IPFS] → [Display]
    ↓          ↓            ↓              ↓         ↓
  Proof     Query        Get CID +      Fetch    Show File
   ID      Contract     Timestamp     Content   + Metadata
```

## Component Interactions

1. **Frontend ↔ Wallet**: Authentication and transaction signing
2. **Frontend ↔ API**: File upload and processing
3. **API ↔ IPFS**: Content storage and retrieval
4. **Frontend ↔ Smart Contract**: Proof creation and verification
5. **Smart Contract ↔ Blockchain**: Permanent record storage

## Scalability Considerations

- **IPFS**: Handles large files without blockchain bloat
- **Smart Contract**: Minimal storage keeps gas costs low
- **API Layer**: Can cache frequently accessed proofs
- **Frontend**: Static generation for fast loading