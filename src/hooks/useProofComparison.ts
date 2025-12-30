import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { proofRegistryAbi, proofRegistryAddress } from '@/lib/abi/proofRegistry';
import { getUseCaseById } from '@/config/useCases';

// Types for proof data
type Proof = {
  owner: string;
  ipfsHash: string;
  title: string;
  timestamp: bigint;
};

export interface CategorizedProof {
  contractId: number;
  owner: string;
  ipfsHash: string;
  title: string;
  timestamp: bigint;
  useCaseType: string;
  displayTitle: string;
  documentType: string;
  isUpdate: boolean;
  referenceId: string | null;
  version: string | null;
}

export interface FieldDifference {
  field: string;
  leftValue: string;
  rightValue: string;
  isDifferent: boolean;
}

export interface TrustIndicator {
  type: 'authority' | 'timestamp' | 'reference' | 'blockchain';
  status: 'verified' | 'warning' | 'error';
  message: string;
  leftValue?: string;
  rightValue?: string;
}

export interface ComparisonMetadata {
  sameAuthority: boolean;
  chronologicalOrder: boolean;
  validReference: boolean;
  timeDifference: number;
  leftIsNewer: boolean;
}

export interface ProofComparisonData {
  leftProof: CategorizedProof | null;
  rightProof: CategorizedProof | null;
  differences: FieldDifference[];
  trustIndicators: TrustIndicator[];
  metadata: ComparisonMetadata | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching and comparing two proofs
 */
export const useProofComparison = (leftId: string, rightId: string): ProofComparisonData => {
  // Fetch left proof
  const { 
    data: leftProofData, 
    isLoading: leftLoading, 
    error: leftError 
  } = useReadContract({
    address: proofRegistryAddress as `0x${string}`,
    abi: proofRegistryAbi,
    functionName: 'getProof',
    args: [BigInt(leftId)],
    query: {
      enabled: Boolean(proofRegistryAddress && leftId),
    },
  });

  // Fetch right proof
  const { 
    data: rightProofData, 
    isLoading: rightLoading, 
    error: rightError 
  } = useReadContract({
    address: proofRegistryAddress as `0x${string}`,
    abi: proofRegistryAbi,
    functionName: 'getProof',
    args: [BigInt(rightId)],
    query: {
      enabled: Boolean(proofRegistryAddress && rightId),
    },
  });

  // Process and categorize proofs
  const processedData = useMemo(() => {
    const isLoading = leftLoading || rightLoading;
    const error = leftError?.message || rightError?.message || null;

    if (isLoading || error || !leftProofData || !rightProofData) {
      return {
        leftProof: null,
        rightProof: null,
        differences: [],
        trustIndicators: [],
        metadata: null,
        isLoading,
        error,
      };
    }

    // Process left proof
    const leftProof = categorizeProof(leftProofData as Proof, parseInt(leftId));
    const rightProof = categorizeProof(rightProofData as Proof, parseInt(rightId));

    // Calculate differences
    const differences = calculateDifferences(leftProof, rightProof);

    // Generate trust indicators
    const trustIndicators = generateTrustIndicators(leftProof, rightProof);

    // Calculate metadata
    const metadata = calculateComparisonMetadata(leftProof, rightProof);

    return {
      leftProof,
      rightProof,
      differences,
      trustIndicators,
      metadata,
      isLoading: false,
      error: null,
    };
  }, [leftProofData, rightProofData, leftLoading, rightLoading, leftError, rightError, leftId, rightId]);

  return processedData;
};

/**
 * Categorize a raw proof into a structured format
 */
function categorizeProof(proof: Proof, contractId: number): CategorizedProof {
  // Extract use case and document type from title
  const useCaseMatch = proof.title.match(/^\[([^\]]+)\]/);
  const documentTypeMatch = proof.title.match(/\[([^\]]+)\].*\[([^\]]+)\]/);
  
  const useCaseType = useCaseMatch ? useCaseMatch[1].toLowerCase() : 'general';
  const documentType = documentTypeMatch ? documentTypeMatch[2] : 'Document';
  
  // Check if this is an update
  const isUpdate = proof.title.includes('[UPDATE]');
  
  // Clean title by removing prefixes
  let displayTitle = proof.title.replace(/^\[[^\]]+\]\s*(\[[^\]]+\]\s*)?/, '').trim();
  displayTitle = displayTitle.replace(/\[UPDATE\]/g, '').trim();
  
  // Extract reference ID for updates
  const refMatch = displayTitle.match(/\(ref:\s*(\d+)\)$/);
  const referenceId = refMatch ? refMatch[1] : null;
  if (refMatch) {
    displayTitle = displayTitle.replace(/\s*\(ref:\s*\d+\)$/, '').trim();
  }

  // Extract version from title
  const versionMatch = displayTitle.match(/v?(\d+(?:\.\d+)*)/i);
  const version = versionMatch ? versionMatch[1] : null;
  
  return {
    contractId,
    owner: proof.owner,
    ipfsHash: proof.ipfsHash,
    title: proof.title,
    timestamp: proof.timestamp,
    useCaseType,
    displayTitle: displayTitle || 'Untitled proof',
    documentType,
    isUpdate,
    referenceId,
    version,
  };
}

/**
 * Calculate differences between two proofs
 */
function calculateDifferences(leftProof: CategorizedProof, rightProof: CategorizedProof): FieldDifference[] {
  const fields = [
    { field: 'displayTitle', leftValue: leftProof.displayTitle, rightValue: rightProof.displayTitle },
    { field: 'ipfsHash', leftValue: leftProof.ipfsHash, rightValue: rightProof.ipfsHash },
    { field: 'owner', leftValue: leftProof.owner, rightValue: rightProof.owner },
    { field: 'documentType', leftValue: leftProof.documentType, rightValue: rightProof.documentType },
    { field: 'useCaseType', leftValue: leftProof.useCaseType, rightValue: rightProof.useCaseType },
    { field: 'version', leftValue: leftProof.version || 'N/A', rightValue: rightProof.version || 'N/A' },
    { 
      field: 'timestamp', 
      leftValue: new Date(Number(leftProof.timestamp) * 1000).toLocaleString(),
      rightValue: new Date(Number(rightProof.timestamp) * 1000).toLocaleString()
    },
  ];

  return fields.map(({ field, leftValue, rightValue }) => ({
    field,
    leftValue,
    rightValue,
    isDifferent: leftValue !== rightValue,
  }));
}

/**
 * Generate trust indicators for the comparison
 */
function generateTrustIndicators(leftProof: CategorizedProof, rightProof: CategorizedProof): TrustIndicator[] {
  const indicators: TrustIndicator[] = [];

  // Authority verification
  const sameAuthority = leftProof.owner.toLowerCase() === rightProof.owner.toLowerCase();
  indicators.push({
    type: 'authority',
    status: sameAuthority ? 'verified' : 'warning',
    message: sameAuthority 
      ? 'Same authority for both proofs' 
      : 'Different authorities - verify legitimacy',
    leftValue: leftProof.owner,
    rightValue: rightProof.owner,
  });

  // Timestamp validation
  const leftTime = Number(leftProof.timestamp);
  const rightTime = Number(rightProof.timestamp);
  const chronologicalOrder = leftTime !== rightTime;
  
  indicators.push({
    type: 'timestamp',
    status: chronologicalOrder ? 'verified' : 'warning',
    message: chronologicalOrder 
      ? `Time difference: ${Math.abs(rightTime - leftTime)} seconds`
      : 'Identical timestamps - unusual for different proofs',
    leftValue: new Date(leftTime * 1000).toLocaleString(),
    rightValue: new Date(rightTime * 1000).toLocaleString(),
  });

  // Reference validation
  const hasReference = leftProof.referenceId || rightProof.referenceId;
  if (hasReference) {
    const validReference = 
      (leftProof.referenceId === rightProof.contractId.toString()) ||
      (rightProof.referenceId === leftProof.contractId.toString());
    
    indicators.push({
      type: 'reference',
      status: validReference ? 'verified' : 'error',
      message: validReference 
        ? 'Valid reference relationship detected'
        : 'Reference relationship could not be verified',
      leftValue: leftProof.referenceId || 'None',
      rightValue: rightProof.referenceId || 'None',
    });
  }

  // Blockchain verification (always verified since we fetched from blockchain)
  indicators.push({
    type: 'blockchain',
    status: 'verified',
    message: 'Both proofs verified on Ethereum blockchain',
  });

  return indicators;
}

/**
 * Calculate comparison metadata
 */
function calculateComparisonMetadata(leftProof: CategorizedProof, rightProof: CategorizedProof): ComparisonMetadata {
  const leftTime = Number(leftProof.timestamp);
  const rightTime = Number(rightProof.timestamp);
  
  return {
    sameAuthority: leftProof.owner.toLowerCase() === rightProof.owner.toLowerCase(),
    chronologicalOrder: leftTime !== rightTime,
    validReference: Boolean(
      (leftProof.referenceId === rightProof.contractId.toString()) ||
      (rightProof.referenceId === leftProof.contractId.toString())
    ),
    timeDifference: Math.abs(rightTime - leftTime),
    leftIsNewer: leftTime > rightTime,
  };
}