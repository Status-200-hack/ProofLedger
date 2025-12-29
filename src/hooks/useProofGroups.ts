/**
 * Custom hook for managing proof groups and document versioning
 * 
 * Provides functionality for:
 * - Grouping proofs by document
 * - Managing document versions
 * - Creating updates to existing documents
 * - Tracking version history
 */

import { useState, useEffect, useMemo } from 'react';
import { Proof, ProofGroup, groupProofsByDocument, parseProofTitle } from '@/types/proof';

export interface UseProofGroupsReturn {
  proofGroups: ProofGroup[];
  getGroupById: (groupId: string) => ProofGroup | undefined;
  getVersionsForGroup: (groupId: string) => Proof[];
  getLatestVersion: (groupId: string) => Proof | undefined;
  canUpdate: (groupId: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

export const useProofGroups = (proofs: Proof[]): UseProofGroupsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Group proofs by document
  const proofGroups = useMemo(() => {
    try {
      setError(null);
      return groupProofsByDocument(proofs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to group proofs';
      setError(errorMessage);
      return [];
    }
  }, [proofs]);

  // Get specific group by ID
  const getGroupById = (groupId: string): ProofGroup | undefined => {
    return proofGroups.find(group => group.groupId === groupId);
  };

  // Get all versions for a specific group
  const getVersionsForGroup = (groupId: string): Proof[] => {
    const group = getGroupById(groupId);
    return group ? group.versions : [];
  };

  // Get latest version of a document group
  const getLatestVersion = (groupId: string): Proof | undefined => {
    const group = getGroupById(groupId);
    return group ? group.latestVersion : undefined;
  };

  // Check if a document group can be updated
  const canUpdate = (groupId: string): boolean => {
    const group = getGroupById(groupId);
    if (!group) return false;

    // Check use case configuration for update permissions
    // Government documents are typically immutable
    return group.useCaseType !== 'government';
  };

  return {
    proofGroups,
    getGroupById,
    getVersionsForGroup,
    getLatestVersion,
    canUpdate,
    isLoading,
    error
  };
};

/**
 * Hook for managing document updates and versioning
 */
export interface UseDocumentVersioningReturn {
  createUpdate: (groupId: string, title: string, documentType: string) => {
    groupId: string;
    version: number;
    title: string;
    documentType: string;
  };
  getNextVersion: (groupId: string) => number;
  validateUpdate: (groupId: string) => { canUpdate: boolean; reason?: string };
}

export const useDocumentVersioning = (proofGroups: ProofGroup[]): UseDocumentVersioningReturn => {
  
  const createUpdate = (groupId: string, title: string, documentType: string) => {
    const group = proofGroups.find(g => g.groupId === groupId);
    const nextVersion = group ? group.versions.length + 1 : 1;
    
    return {
      groupId,
      version: nextVersion,
      title,
      documentType
    };
  };

  const getNextVersion = (groupId: string): number => {
    const group = proofGroups.find(g => g.groupId === groupId);
    return group ? group.versions.length + 1 : 1;
  };

  const validateUpdate = (groupId: string): { canUpdate: boolean; reason?: string } => {
    const group = proofGroups.find(g => g.groupId === groupId);
    
    if (!group) {
      return { canUpdate: false, reason: 'Document group not found' };
    }

    if (group.useCaseType === 'government') {
      return { canUpdate: false, reason: 'Government documents are immutable' };
    }

    // Add more validation rules as needed
    return { canUpdate: true };
  };

  return {
    createUpdate,
    getNextVersion,
    validateUpdate
  };
};

/**
 * Hook for proof metadata parsing and management
 */
export interface UseProofMetadataReturn {
  parseTitle: (title: string) => {
    useCaseType: string;
    documentType: string;
    originalTitle: string;
  };
  formatTitle: (useCaseType: string, documentType: string, title: string, version?: number) => string;
  extractGroupInfo: (proof: Proof) => {
    groupId: string;
    version: number;
    isLatest: boolean;
  };
}

export const useProofMetadata = (): UseProofMetadataReturn => {
  
  const parseTitle = (title: string) => {
    return parseProofTitle(title);
  };

  const formatTitle = (useCaseType: string, documentType: string, title: string, version?: number): string => {
    const useCasePrefix = `[${useCaseType.toUpperCase()}]`;
    const documentTypePrefix = `[${documentType}]`;
    const versionSuffix = version && version > 1 ? ` v${version}` : '';
    
    return `${useCasePrefix} ${documentTypePrefix} ${title}${versionSuffix}`.trim();
  };

  const extractGroupInfo = (proof: Proof) => {
    return {
      groupId: proof.groupId || proof.id,
      version: proof.version || 1,
      isLatest: proof.isLatest || false
    };
  };

  return {
    parseTitle,
    formatTitle,
    extractGroupInfo
  };
};