# User Flows: ProofLedger

## Design Principle: Asymmetric Access

**Creation requires wallet** (proves ownership and pays gas)
**Verification requires nothing** (maximizes accessibility)

## Flow 1: Creating a Proof (Wallet Required)

### Prerequisites
- User has MetaMask or compatible wallet
- Wallet has small amount of ETH for gas

### Steps
1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve connection in wallet popup
   - See wallet address displayed

2. **Upload Content**
   - Drag and drop file or click to browse
   - See file preview and hash generation
   - Add optional title and description

3. **Create Proof**
   - Click "Create Proof" button
   - Wallet prompts for transaction approval
   - See transaction progress indicator

4. **Proof Created**
   - Receive unique proof ID
   - Get shareable verification link
   - View proof in personal dashboard

## Flow 2: Verifying a Proof (No Wallet Needed)

### Prerequisites
- User has proof ID or verification link
- Any web browser

### Steps
1. **Access Verification**
   - Visit verification link OR
   - Enter proof ID on verify page

2. **View Proof Details**
   - See file content (if accessible)
   - View creation timestamp
   - See blockchain transaction hash

3. **Verify Authenticity**
   - Check timestamp against blockchain
   - Verify file hash matches IPFS content
   - See "Verified ✓" status

## Flow 3: Managing Proofs (Wallet Required)

### Dashboard Access
1. Connect wallet
2. View all proofs created by this address
3. See proof status and verification links

### Proof Management
- Copy verification links
- View proof details
- Check verification status
- Access original files

## Edge Cases Handled

### Wallet Not Connected
- Show clear "Connect Wallet" prompts
- Explain why wallet is needed for creation
- Provide guest access for verification

### Transaction Failures
- Show clear error messages
- Suggest gas price adjustments
- Allow retry without re-uploading

### File Access Issues
- Handle IPFS gateway timeouts
- Show alternative access methods
- Maintain proof validity even if file temporarily unavailable

## UX Decisions

**Progressive Disclosure**: Show simple interface first, reveal complexity only when needed

**Clear Status Indicators**: Always show what's happening during blockchain operations

**Fallback Options**: Multiple IPFS gateways, alternative verification methods

**Mobile-First**: All flows work on mobile devices