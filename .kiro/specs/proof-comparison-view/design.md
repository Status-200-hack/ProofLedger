# Design Document: Proof Comparison View

## Overview

The Proof Comparison View provides a premium, audit-grade interface for side-by-side document proof comparison. This feature enables users to verify document version relationships, validate update authenticity, and maintain compliance audit trails in regulated industries.

## 🧩 STEP 1 — Purpose & Flow Definition

### Problem Statement

In regulated industries, document version control and audit trails are critical for compliance. Users need to:
- Verify that document updates are legitimate and authorized
- Maintain clear audit trails showing document evolution
- Validate the integrity of version relationships on the blockchain
- Present professional comparison views for regulatory review

### Why Version Comparison Matters

1. **Trust Verification**: Ensures updates come from authorized sources
2. **Immutability Proof**: Demonstrates blockchain-backed version integrity  
3. **Audit Compliance**: Provides clear trails for regulatory requirements
4. **Fraud Prevention**: Detects unauthorized or suspicious document changes
5. **Transparency**: Enables public verification of document evolution

### User Journey Flow

```
Dashboard → View Document Versions → Select Two Versions → Compare Side-by-Side → Export/Share Results
```

**Detailed Flow:**
1. User views dashboard with categorized proofs
2. User identifies document with multiple versions (v1.0, v2.0, etc.)
3. User clicks "Compare Versions" action button
4. System presents version selection interface
5. User selects two versions for comparison
6. System navigates to `/compare?left=proofId1&right=proofId2`
7. User reviews side-by-side comparison with trust indicators
8. User can share URL or return to dashboard

## 🧩 STEP 2 — Comparison Model & UI Design

### Data Model for Comparison

```typescript
interface ProofComparison {
  leftProof: {
    id: number;
    title: string;
    ipfsHash: string;
    timestamp: number;
    owner: string;
    useCaseType: string;
    documentType: string;
    version: string | null;
    isUpdate: boolean;
    referenceId: string | null;
  };
  rightProof: {
    // Same structure as leftProof
  };
  comparisonMetadata: {
    sameAuthority: boolean;
    chronologicalOrder: boolean;
    validReference: boolean;
    timeDifference: number;
  };
}
```

### Fields to Compare

| Field | Purpose | Difference Handling |
|-------|---------|-------------------|
| **Document Title** | Content identification | Highlight text differences |
| **IPFS CID** | Content integrity verification | Show full hash comparison |
| **Timestamp** | Chronological verification | Display time difference |
| **Owner/Authority** | Authorization verification | Highlight authority changes |
| **Version Label** | Version identification | Clear v1.0 → v2.0 labeling |
| **Document Type** | Classification consistency | Flag type changes |
| **Reference ID** | Update relationship | Validate reference chain |

### Premium UI Design Specifications

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    Comparison Header                         │
│  [Genesis v1.0] ←→ [Updated v2.0]    [Back to Dashboard]   │
├─────────────────────┬───────────────────────────────────────┤
│                     │                                       │
│    Left Proof       │         Right Proof                   │
│                     │                                       │
│  📄 Document Title  │    📄 Document Title                  │
│  🔗 IPFS Hash      │    🔗 IPFS Hash                       │
│  ⏰ Timestamp      │    ⏰ Timestamp                       │
│  👤 Authority      │    👤 Authority                       │
│  🏷️ Document Type  │    🏷️ Document Type                   │
│                     │                                       │
│  [Trust Indicators] │    [Trust Indicators]                 │
│                     │                                       │
└─────────────────────┴───────────────────────────────────────┘
```

#### Visual Design Principles

1. **Enterprise Aesthetics**: Clean, professional design suitable for audit contexts
2. **Subtle Highlighting**: Differences shown with gentle background colors, not flashy animations
3. **Clear Typography**: Consistent font hierarchy with excellent readability
4. **Balanced Layout**: Equal space allocation for both proofs
5. **Trust Indicators**: Discrete icons and colors indicating verification status
6. **Responsive Design**: Adapts gracefully to different screen sizes

#### Color Scheme for Differences
- **Identical Fields**: Default text color
- **Different Fields**: Soft amber background (#FEF3C7) with darker text
- **Trust Indicators**: Green for verified, amber for caution, red for issues
- **Version Labels**: Distinct but harmonious colors for left/right identification

### Why This UI Fits Blockchain Audit Context

1. **Professional Credibility**: Enterprise-grade design builds trust with auditors
2. **Clear Information Hierarchy**: Critical verification data is prominently displayed
3. **Immutability Emphasis**: Blockchain timestamps and hashes are highlighted
4. **Audit Trail Clarity**: Version relationships and references are clearly shown
5. **Regulatory Compliance**: Design supports formal documentation requirements

## 🧩 STEP 3 — Implementation Plan & Demo

### Page Routing Structure

**Route**: `/compare?left=[proofId]&right=[proofId]`

**URL Examples**:
- `/compare?left=5&right=8` - Compare proof ID 5 with proof ID 8
- `/compare?left=12&right=15` - Compare proof ID 12 with proof ID 15

### Component Architecture

```typescript
// Page Component
ComparisonPage
├── ComparisonHeader (breadcrumbs, version labels)
├── ComparisonContainer
│   ├── ProofComparisonCard (left proof)
│   ├── ComparisonDivider (visual separator)
│   └── ProofComparisonCard (right proof)
├── TrustIndicatorPanel
└── ComparisonActions (share, export, back)

// Supporting Components
ProofComparisonCard
├── ProofMetadata (title, type, version)
├── ProofDetails (CID, timestamp, owner)
├── TrustBadges (verification indicators)
└── DifferenceHighlighter (visual diff markers)
```

### Data Flow and Logic

#### UI-Only Logic
- Visual difference highlighting
- Responsive layout adjustments
- Loading state management
- Error message display

#### Derived Logic
- Proof data fetching from blockchain
- Difference calculation between proofs
- Trust indicator computation
- Chronological validation
- Reference relationship verification

### Custom Hooks

```typescript
// Data fetching and comparison logic
useProofComparison(leftId: string, rightId: string)
├── Fetches both proofs from blockchain
├── Calculates differences and relationships
├── Validates trust indicators
└── Returns comparison data and loading states

// URL parameter management
useComparisonParams()
├── Extracts proof IDs from URL
├── Validates ID format and existence
└── Handles navigation and error states
```

### 30-Second Demo Script (Updated)

> **"Let me show you ProofLedger's enhanced Proof Comparison View - now with actual document content comparison.**
> 
> **[0-10s]** Here on my dashboard, I have multiple versions of a property deed. I'll click 'Compare' to enter selection mode, then select two versions to compare.
> 
> **[10-20s]** The system shows me a professional comparison with three layers: metadata comparison at the top, trust indicators showing blockchain verification, and now - the actual document content side-by-side below.
> 
> **[20-30s]** You can see the PDF documents displayed directly from IPFS, or images if they're PNG/JPG files. Different IPFS hashes mean different content - this gives you both metadata verification AND visual content comparison. Perfect for regulatory audits where you need to see exactly what changed between versions."

### Implementation Phases

#### Phase 1: Core Comparison Logic
- Create comparison page route
- Implement proof fetching hooks
- Build basic side-by-side layout

#### Phase 2: Premium UI Polish
- Add enterprise-grade styling
- Implement difference highlighting
- Create trust indicator system

#### Phase 3: Integration & Testing
- Connect to dashboard navigation
- Add URL sharing capabilities
- Test with various proof combinations

### Success Metrics

1. **User Engagement**: Time spent on comparison view
2. **Feature Adoption**: Percentage of users utilizing comparison
3. **Trust Building**: User feedback on audit confidence
4. **Technical Performance**: Page load times and error rates

## Architecture

The Proof Comparison View integrates seamlessly with the existing ProofLedger architecture:

- **Frontend**: React components with TypeScript
- **Blockchain Integration**: Uses existing wagmi hooks for proof fetching
- **Styling**: Extends current Tailwind CSS design system
- **Routing**: Next.js app router with query parameters
- **State Management**: React hooks for local comparison state

## Components and Interfaces

### Core Components

1. **ComparisonPage**: Main page component handling routing and layout
2. **ProofComparisonCard**: Reusable card for displaying individual proof data
3. **DifferenceHighlighter**: Utility component for visual difference indication
4. **TrustIndicatorPanel**: Displays verification and relationship status
5. **ComparisonHeader**: Navigation and version labeling

### Data Interfaces

```typescript
interface ComparisonViewProps {
  leftProofId: string;
  rightProofId: string;
}

interface ProofComparisonData {
  proof: CategorizedProof;
  trustIndicators: TrustIndicator[];
  differences: FieldDifference[];
}

interface TrustIndicator {
  type: 'authority' | 'timestamp' | 'reference' | 'blockchain';
  status: 'verified' | 'warning' | 'error';
  message: string;
}
```

## Error Handling

The system handles various error conditions gracefully:

- **Invalid Proof IDs**: Clear error messages with navigation back to dashboard
- **Network Issues**: Loading states and retry mechanisms
- **Permission Errors**: Appropriate access denied messages
- **Missing References**: Indicators when proof relationships cannot be verified

## Testing Strategy

### Unit Tests
- Proof comparison logic validation
- Difference calculation accuracy
- Trust indicator computation
- URL parameter parsing

### Integration Tests
- End-to-end comparison flow
- Dashboard to comparison navigation
- Blockchain data fetching
- Error condition handling

### Property-Based Tests
- Comparison consistency across different proof pairs
- Trust indicator reliability
- UI responsiveness across screen sizes