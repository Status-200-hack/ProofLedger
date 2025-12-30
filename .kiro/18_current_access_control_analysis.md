# Current Access Control Analysis

## Overview

This document analyzes the access control approach currently implemented in ProofLedger as of the current state, without proposing future improvements.

## Current Access Control Architecture

### Smart Contract Level (On-Chain)

**Who can create proofs:**
- Anyone with a connected wallet and ETH for gas fees
- No on-chain restrictions or role validation
- The smart contract's `createProof` function is public and permissionless

**What "authority" means in current implementation:**
- Authority is a UI-level concept only
- Defined by hardcoded address lists in `MOCK_AUTHORITIES` object
- No on-chain enforcement or validation
- Authorities are mock addresses for demonstration purposes

**On-chain enforcement:**
- None. The smart contract has no access control mechanisms
- All proofs are stored with `msg.sender` as the owner
- No role-based restrictions at the blockchain level

### UI Level (Client-Side)

**Who is currently allowed to create proofs:**
- UI shows creation forms to all connected users
- Role-based UI elements are displayed based on `useRoleAuth` hook
- Mock authority addresses get enhanced UI features
- No actual enforcement - users can bypass UI restrictions

**Who is currently allowed to append/update documents:**
- UI-level restriction to "authority" addresses only
- Updates create new proof entries that reference original proofs
- No on-chain validation of update permissions
- Update functionality depends on use case configuration (`allowsUpdates`)

**Current role definitions:**
- **Authority**: Hardcoded addresses in `MOCK_AUTHORITIES` object
- **Owner**: Address that created the original proof (`msg.sender`)
- **Verifier**: Any connected wallet address
- **Observer**: Public users (can view but not interact)

## Trust Assumptions

The current model makes several trust assumptions:

1. **UI Compliance**: Users will use the official UI and not interact directly with smart contracts
2. **Mock Authority Validity**: Hardcoded authority addresses represent legitimate entities
3. **Client-Side Security**: Role enforcement through JavaScript cannot be bypassed
4. **Network Assumptions**: All interactions happen on Sepolia testnet

## Current Behavior vs Intended Design

**Current Reality:**
- Permissionless proof creation at smart contract level
- UI-only role restrictions that can be bypassed
- Mock authority system for demonstration
- No on-chain access control whatsoever

**UI Presentation:**
- Shows role-based interfaces
- Displays authority/owner/verifier status
- Provides use case-specific workflows
- Creates illusion of enforced permissions

## Technical Implementation Details

**Smart Contract (`ProofRegistry.sol`):**
```solidity
function createProof(string calldata title, string calldata ipfsHash) 
    external returns (uint256 id)
```
- No access modifiers beyond `external`
- No role validation
- Stores `msg.sender` as proof owner

**Role Authentication (`useRoleAuth.ts`):**
- Client-side hook for role determination
- Hardcoded authority addresses per use case
- Returns permission flags based on address matching
- No cryptographic proof of authority

**Proof Creation (`ProofForm.tsx`):**
- Adds use case metadata to proof titles
- Creates update references through title formatting
- No server-side or on-chain validation
- Relies entirely on UI-level restrictions

## Security Implications

**Current Vulnerabilities:**
- Anyone can create proofs by calling smart contract directly
- Authority status cannot be verified on-chain
- Update relationships exist only in title metadata
- No prevention of unauthorized document updates

**Data Integrity:**
- IPFS hashes provide content integrity
- Blockchain provides timestamp integrity
- No authority or permission integrity

## Conclusion

The current access control approach is a UI-layer demonstration system with no on-chain enforcement. While it provides a functional user experience for showcasing role-based workflows, it offers no actual security or access restrictions at the blockchain level. The system currently operates as a permissionless proof-of-existence registry with cosmetic role-based UI elements.