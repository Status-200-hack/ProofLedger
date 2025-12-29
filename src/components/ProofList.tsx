'use client';

import { useEffect, useMemo, useState, useCallback } from "react";
import { useReadContract, useAccount } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import Link from "next/link";
import { encodeProofId } from "@/lib/proofId";
import { getUseCaseById } from "@/config/useCases";
import { PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type Proof = {
  owner: string;
  ipfsHash: string;
  title: string;
  timestamp: bigint;
};

type CategorizedProof = Proof & { 
  contractId: number; 
  useCaseType: string;
  displayTitle: string;
  documentType: string;
  isUpdate?: boolean;
  referenceId?: string | null;
};

type Props = {
  refreshKey: number;
  onRefresh?: () => void;
};

export default function ProofList({ refreshKey, onRefresh }: Props) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const { data, isLoading, refetch } = useReadContract({
    address: proofRegistryAddress as `0x${string}`,
    abi: proofRegistryAbi,
    functionName: "getProofs",
    query: {
      enabled: Boolean(proofRegistryAddress) && isMounted,
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      refetch();
    }
  }, [refreshKey, refetch, isMounted]);

  const allProofs = (data as Proof[]) ?? [];
  
  // Helper function to extract version from title
  const extractVersion = useCallback((title: string): string | null => {
    // Look for patterns like v1.0, v1.5, v2.0, version 1.0, etc.
    const versionMatch = title.match(/v?(\d+(?:\.\d+)*)/i);
    return versionMatch ? versionMatch[1] : null;
  }, []);

  // Helper function to detect if a group has version-based documents
  const hasVersionedDocuments = useCallback((proofs: CategorizedProof[]): boolean => {
    return proofs.some(proof => {
      const version = extractVersion(proof.displayTitle);
      return version !== null || proof.isUpdate;
    });
  }, [extractVersion]);

  // Helper function to group documents by base title (without version)
  const getBaseTitle = useCallback((title: string): string => {
    // Remove version patterns like v1.0, v2.0, version 1.0, etc.
    return title.replace(/\s*v?(\d+(?:\.\d+)*)\s*/gi, '').trim();
  }, []);
  const compareVersions = useCallback((versionA: string, versionB: string): number => {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);
    
    const maxLength = Math.max(partsA.length, partsB.length);
    
    for (let i = 0; i < maxLength; i++) {
      const partA = partsA[i] || 0;
      const partB = partsB[i] || 0;
      
      if (partA < partB) return -1;
      if (partA > partB) return 1;
    }
    
    return 0;
  }, []);
  
  // Filter and categorize proofs
  const categorizedProofs = useMemo(() => {
    if (!isConnected || !address || !isMounted) {
      return [];
    }
    
    return allProofs
      .map((proof, index) => {
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
        
        const categorizedProof: CategorizedProof = {
          ...proof,
          contractId: index,
          useCaseType,
          documentType,
          displayTitle: displayTitle || 'Untitled proof',
          isUpdate,
          referenceId
        };
        
        return categorizedProof;
      })
      .filter((proof) => proof.owner.toLowerCase() === address.toLowerCase());
  }, [allProofs, isConnected, address, isMounted]);

  const handleUpdate = (proof: CategorizedProof) => {
    // Navigate to create page with update context
    const updateParams = new URLSearchParams({
      type: proof.useCaseType,
      mode: 'update',
      originalId: proof.contractId.toString(),
      originalTitle: proof.displayTitle,
      documentType: proof.documentType
    });
    
    router.push(`/create?${updateParams.toString()}`);
  };

  const groupedProofs = useMemo(() => {
    const groups: Record<string, CategorizedProof[]> = {};
    
    categorizedProofs.forEach(proof => {
      if (!groups[proof.useCaseType]) {
        groups[proof.useCaseType] = [];
      }
      groups[proof.useCaseType].push(proof);
    });

    // Sort proofs within each group using smart sorting logic
    Object.keys(groups).forEach(key => {
      const groupProofs = groups[key];
      
      // Check if this group has versioned documents or updates
      if (hasVersionedDocuments(groupProofs)) {
        // Group by base title first, then sort by version within each base title group
        const titleGroups: Record<string, CategorizedProof[]> = {};
        
        groupProofs.forEach(proof => {
          const baseTitle = getBaseTitle(proof.displayTitle);
          if (!titleGroups[baseTitle]) {
            titleGroups[baseTitle] = [];
          }
          titleGroups[baseTitle].push(proof);
        });
        
        // Sort each title group by version, then flatten
        const sortedProofs: CategorizedProof[] = [];
        
        // Sort title groups by the timestamp of their first document (newest base titles first)
        const sortedTitleKeys = Object.keys(titleGroups).sort((a, b) => {
          const aFirstTimestamp = Math.max(...titleGroups[a].map(p => Number(p.timestamp)));
          const bFirstTimestamp = Math.max(...titleGroups[b].map(p => Number(p.timestamp)));
          return bFirstTimestamp - aFirstTimestamp;
        });
        
        sortedTitleKeys.forEach(baseTitle => {
          const titleProofs = titleGroups[baseTitle];
          
          // Sort within each title group by version
          titleProofs.sort((a, b) => {
            const versionA = extractVersion(a.displayTitle);
            const versionB = extractVersion(b.displayTitle);
            
            if (versionA && versionB) {
              // Both have versions, compare them numerically
              return compareVersions(versionA, versionB);
            } else if (versionA && !versionB) {
              // A has version, B doesn't - A comes first
              return -1;
            } else if (!versionA && versionB) {
              // B has version, A doesn't - B comes first
              return 1;
            } else {
              // Neither has version, sort by timestamp (newest first)
              return Number(b.timestamp - a.timestamp);
            }
          });
          
          sortedProofs.push(...titleProofs);
        });
        
        groups[key] = sortedProofs;
      } else {
        // No versioned documents - sort by timestamp only (newest first)
        groupProofs.sort((a, b) => Number(b.timestamp - a.timestamp));
      }
    });

    return groups;
  }, [categorizedProofs, extractVersion, compareVersions, hasVersionedDocuments, getBaseTitle]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/60 p-4 shadow-lg backdrop-blur dark:border-white/5 dark:bg-white/[0.04] sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">My Proofs</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
            {isConnected ? "Your on-chain submissions organized by category" : "Connect wallet to view your proofs"}
          </p>
        </div>
        {isConnected && (
          <span className="self-start rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200 sm:self-auto">
            {categorizedProofs.length} {categorizedProofs.length === 1 ? "proof" : "proofs"}
          </span>
        )}
      </div>

      {!proofRegistryAddress ? (
        <p className="text-sm text-red-500">
          Set NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS to read on-chain data.
        </p>
      ) : !isConnected ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Connect your wallet to view your proofs.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
      ) : categorizedProofs.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No proofs found for your wallet. Submit your first one!
        </p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedProofs).map(([useCaseType, proofs]) => {
            const useCase = getUseCaseById(useCaseType);
            if (!useCase) return null;

            return (
              <div key={useCaseType} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-lg">{useCase.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {useCase.label}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {proofs.length} proof{proofs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Proofs in this category */}
                <div className="space-y-2">
                  {proofs.map((proof) => (
                    <div
                      key={proof.contractId}
                      className="rounded-2xl border border-zinc-200/70 bg-white/90 px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                              {proof.displayTitle}
                            </p>
                            <span 
                              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                              style={{ 
                                backgroundColor: `${useCase.metadata.primaryColor}20`,
                                color: useCase.metadata.primaryColor
                              }}
                            >
                              {proof.documentType}
                            </span>
                            {proof.isUpdate && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                UPDATE
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 break-all text-[11px] text-zinc-500 dark:text-zinc-400">
                            {proof.ipfsHash}
                          </p>
                          {proof.isUpdate && proof.referenceId && (
                            <p className="mt-0.5 text-[11px] text-blue-600 dark:text-blue-400">
                              References original proof ID: {proof.referenceId}
                            </p>
                          )}
                          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 sm:text-xs">
                            {isMounted ? new Date(Number(proof.timestamp) * 1000).toLocaleString() : 'Loading...'}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <Link
                            href={`/verify/${encodeProofId(proof.contractId)}`}
                            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                            title="View proof"
                          >
                            <EyeIcon className="h-3 w-3" />
                            View
                          </Link>

                          {useCase.allowsUpdates && (
                            <button
                              onClick={() => handleUpdate(proof)}
                              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-colors"
                              title="Update document"
                            >
                              <PencilIcon className="h-3 w-3" />
                              Update
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function shorten(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

