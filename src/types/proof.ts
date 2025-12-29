/**
 * Proof type definitions for ProofLedger platform
 * 
 * Supports document grouping for versioning:
 * - Each document has a groupId for version management
 * - Updates create new proofs with same groupId
 * - Maintains immutable blockchain records with append-only updates
 */

export interface Proof {
  id: string;
  title: string;
  ipfsHash: string;
  owner: string;
  timestamp: number;
  groupId?: string;
  version?: number;
  isLatest?: boolean;
}

export interface ProofGroup {
  groupId: string;
  title: string;
  useCaseType: string;
  documentType: string;
  versions: Proof[];
  latestVersion: Proof;
  createdAt: number;
  updatedAt: number;
  owner: string;
}

export interface ProofMetadata {
  useCaseType: string;
  documentType: string;
  originalTitle: string;
  groupId?: string;
  version?: number;
}

/**
 * Utility functions for proof management
 */
export const parseProofTitle = (title: string): ProofMetadata => {
  // Parse title format: [USE_CASE] [DOCUMENT_TYPE] Original Title
  const useCaseMatch = title.match(/^\[([^\]]+)\]/);
  const documentTypeMatch = title.match(/\[([^\]]+)\].*\[([^\]]+)\]/);
  
  const useCaseType = useCaseMatch ? useCaseMatch[1].toLowerCase() : 'general';
  const documentType = documentTypeMatch ? documentTypeMatch[2] : 'Document';
  
  // Extract original title by removing prefixes
  const originalTitle = title.replace(/^\[[^\]]+\]\s*(\[[^\]]+\]\s*)?/, '').trim();
  
  return {
    useCaseType,
    documentType,
    originalTitle
  };
};

export const generateGroupId = (): string => {
  // Generate a UUID for document grouping
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const createProofTitle = (
  useCaseType: string,
  documentType: string,
  originalTitle: string,
  version?: number
): string => {
  const useCasePrefix = `[${useCaseType.toUpperCase()}]`;
  const documentTypePrefix = `[${documentType}]`;
  const versionSuffix = version && version > 1 ? ` v${version}` : '';
  
  return `${useCasePrefix} ${documentTypePrefix} ${originalTitle}${versionSuffix}`.trim();
};

export const groupProofsByDocument = (proofs: Proof[]): ProofGroup[] => {
  const groups = new Map<string, ProofGroup>();
  
  proofs.forEach(proof => {
    const groupId = proof.groupId || proof.id; // Use proof ID as fallback for ungrouped proofs
    const metadata = parseProofTitle(proof.title);
    
    if (!groups.has(groupId)) {
      groups.set(groupId, {
        groupId,
        title: metadata.originalTitle,
        useCaseType: metadata.useCaseType,
        documentType: metadata.documentType,
        versions: [],
        latestVersion: proof,
        createdAt: proof.timestamp,
        updatedAt: proof.timestamp,
        owner: proof.owner
      });
    }
    
    const group = groups.get(groupId)!;
    group.versions.push(proof);
    
    // Update latest version if this proof is newer
    if (proof.timestamp > group.latestVersion.timestamp) {
      group.latestVersion = proof;
      group.updatedAt = proof.timestamp;
    }
  });
  
  // Sort versions within each group by timestamp
  groups.forEach(group => {
    group.versions.sort((a, b) => a.timestamp - b.timestamp);
    group.versions.forEach((version, index) => {
      version.version = index + 1;
      version.isLatest = version.id === group.latestVersion.id;
    });
  });
  
  return Array.from(groups.values()).sort((a, b) => b.updatedAt - a.updatedAt);
};

export const getProofsByGroup = (proofs: Proof[], groupId: string): Proof[] => {
  return proofs
    .filter(proof => proof.groupId === groupId)
    .sort((a, b) => a.timestamp - b.timestamp);
};

export const isUpdateAllowed = (useCaseType: string): boolean => {
  // This would typically check against use case configuration
  // For now, we'll allow updates for most use cases except government
  return useCaseType !== 'government';
};