/**
 * Use Case Configuration for ProofLedger Platform
 * 
 * This configuration-driven approach enables multiple regulated document use cases
 * without branching logic throughout the application. Each use case defines:
 * - Role definitions and permissions
 * - Document types and workflows
 * - Verification rules and access controls
 * - UI customization and terminology
 */

export interface UseCaseConfig {
  id: string;
  label: string;
  description: string;
  icon: string;
  authorityRole: string;
  ownerRole: string;
  verifierRole: string;
  allowsUpdates: boolean;
  documentTypes: string[];
  workflowSteps: string[];
  verificationRules: {
    publicAccess: boolean;
    requiresWallet: boolean;
    allowsSharing: boolean;
  };
  metadata: {
    primaryColor: string;
    terminology: {
      upload: string;
      verify: string;
      authority: string;
    };
  };
}

export const USE_CASES: Record<string, UseCaseConfig> = {
  real_estate: {
    id: "real_estate",
    label: "Real Estate / RERA",
    description: "Property documents, compliance certificates, ownership transfers",
    icon: "🏗️",
    authorityRole: "Builder / RERA Authority",
    ownerRole: "Property Owner",
    verifierRole: "Buyer / Bank / Legal Team",
    allowsUpdates: true,
    documentTypes: [
      "Property Deed",
      "RERA Approval",
      "Compliance Certificate",
      "Ownership Transfer",
      "Mortgage Document"
    ],
    workflowSteps: [
      "Initial Registration",
      "RERA Validation",
      "Ownership Transfer",
      "Compliance Update"
    ],
    verificationRules: {
      publicAccess: true,
      requiresWallet: false,
      allowsSharing: true
    },
    metadata: {
      primaryColor: "#059669", // emerald-600
      terminology: {
        upload: "Register Property",
        verify: "Verify Ownership",
        authority: "RERA Authority"
      }
    }
  },

  education: {
    id: "education",
    label: "University & Academic Records",
    description: "Degrees, transcripts, research papers, certifications",
    icon: "🎓",
    authorityRole: "University / Institution",
    ownerRole: "Student / Graduate",
    verifierRole: "Employer / Institution",
    allowsUpdates: true,
    documentTypes: [
      "Degree Certificate",
      "Academic Transcript",
      "Research Paper",
      "Professional Certification",
      "Course Completion"
    ],
    workflowSteps: [
      "Document Issuance",
      "Institutional Validation",
      "Student Access",
      "Employer Verification"
    ],
    verificationRules: {
      publicAccess: true,
      requiresWallet: false,
      allowsSharing: true
    },
    metadata: {
      primaryColor: "#2563eb", // blue-600
      terminology: {
        upload: "Issue Credential",
        verify: "Verify Qualification",
        authority: "Educational Institution"
      }
    }
  },

  medical: {
    id: "medical",
    label: "Medical Records & Certifications",
    description: "Test results, prescriptions, treatment records, certifications",
    icon: "🏥",
    authorityRole: "Hospital / Licensed Practitioner",
    ownerRole: "Patient",
    verifierRole: "Healthcare Provider / Insurance",
    allowsUpdates: true,
    documentTypes: [
      "Medical Test Result",
      "Prescription Record",
      "Treatment History",
      "Medical Certificate",
      "Insurance Claim"
    ],
    workflowSteps: [
      "Medical Record Creation",
      "Practitioner Validation",
      "Patient Access Control",
      "Insurance Verification"
    ],
    verificationRules: {
      publicAccess: false,
      requiresWallet: true,
      allowsSharing: false
    },
    metadata: {
      primaryColor: "#dc2626", // red-600
      terminology: {
        upload: "Create Medical Record",
        verify: "Verify Medical History",
        authority: "Healthcare Provider"
      }
    }
  },

  startup: {
    id: "startup",
    label: "Startup Legal & Cap Table",
    description: "Incorporation papers, investment agreements, equity documents",
    icon: "🚀",
    authorityRole: "Founder / Legal Team",
    ownerRole: "Company / Shareholders",
    verifierRole: "Investor / Regulator",
    allowsUpdates: true,
    documentTypes: [
      "Incorporation Document",
      "Investment Agreement",
      "Cap Table Update",
      "Board Resolution",
      "Equity Transfer"
    ],
    workflowSteps: [
      "Document Creation",
      "Legal Validation",
      "Shareholder Notification",
      "Regulatory Compliance"
    ],
    verificationRules: {
      publicAccess: false,
      requiresWallet: true,
      allowsSharing: true
    },
    metadata: {
      primaryColor: "#7c3aed", // violet-600
      terminology: {
        upload: "File Legal Document",
        verify: "Verify Corporate Record",
        authority: "Legal Authority"
      }
    }
  },

  government: {
    id: "government",
    label: "Government Tenders & Procurement",
    description: "Tender notices, bids, awards, contracts, deliverables",
    icon: "🏛️",
    authorityRole: "Government Authority",
    ownerRole: "Government Department",
    verifierRole: "Bidder / Public",
    allowsUpdates: false, // Government tenders are immutable once published
    documentTypes: [
      "Tender Notice",
      "Bid Submission",
      "Evaluation Report",
      "Award Notification",
      "Contract Document"
    ],
    workflowSteps: [
      "Tender Publication",
      "Bid Collection",
      "Evaluation Process",
      "Award Announcement"
    ],
    verificationRules: {
      publicAccess: true,
      requiresWallet: false,
      allowsSharing: true
    },
    metadata: {
      primaryColor: "#0891b2", // cyan-600
      terminology: {
        upload: "Publish Tender",
        verify: "Verify Tender Process",
        authority: "Procurement Authority"
      }
    }
  }
};

/**
 * Utility functions for use case management
 */
export const getUseCaseById = (id: string): UseCaseConfig | undefined => {
  return USE_CASES[id];
};

export const getAllUseCases = (): UseCaseConfig[] => {
  return Object.values(USE_CASES);
};

export const getUseCasesByPublicAccess = (publicAccess: boolean): UseCaseConfig[] => {
  return getAllUseCases().filter(useCase => 
    useCase.verificationRules.publicAccess === publicAccess
  );
};

export const getUseCasesByUpdateCapability = (allowsUpdates: boolean): UseCaseConfig[] => {
  return getAllUseCases().filter(useCase => 
    useCase.allowsUpdates === allowsUpdates
  );
};

/**
 * Type definitions for use case selection and management
 */
export type UseCaseId = keyof typeof USE_CASES;

export interface UseCaseSelection {
  useCaseId: UseCaseId;
  userRole: 'authority' | 'owner' | 'verifier' | 'observer';
}

/**
 * Default use case for fallback scenarios
 */
export const DEFAULT_USE_CASE: UseCaseId = 'real_estate';

/**
 * Platform configuration that applies across all use cases
 */
export const PLATFORM_CONFIG = {
  name: "ProofLedger",
  description: "Universal infrastructure for regulated document proof",
  supportedNetworks: ["sepolia", "mainnet"],
  maxFileSize: "10MB",
  supportedFileTypes: [".pdf", ".doc", ".docx", ".jpg", ".png", ".txt"],
  defaultGasLimit: 500000,
  ipfsGateway: "https://gateway.pinata.cloud/ipfs/",
  blockExplorer: "https://sepolia.etherscan.io"
};