'use client';

import { CategorizedProof, FieldDifference } from "@/hooks/useProofComparison";
import { getUseCaseById } from "@/config/useCases";
import { ClockIcon, HashtagIcon, UserIcon, DocumentTextIcon, TagIcon } from "@heroicons/react/24/outline";

interface ProofComparisonCardProps {
  proof: CategorizedProof;
  differences: FieldDifference[];
  side: 'left' | 'right';
  label: string;
}

export default function ProofComparisonCard({ proof, differences, side, label }: ProofComparisonCardProps) {
  const useCase = getUseCaseById(proof.useCaseType);
  
  // Helper function to check if a field is different
  const isDifferent = (fieldName: string): boolean => {
    return differences.some(diff => diff.field === fieldName && diff.isDifferent);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/70 p-4 sm:p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl">{useCase?.icon || '📄'}</span>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
              {label}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Proof ID: {proof.contractId}
            </p>
          </div>
        </div>
        
        {proof.isUpdate && (
          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 self-start sm:self-auto">
            UPDATE
          </span>
        )}
      </div>

      {/* Proof Details */}
      <div className="space-y-3 sm:space-y-4">
        {/* Document Title */}
        <div className={`rounded-2xl p-3 sm:p-4 transition-colors ${
          isDifferent('displayTitle') 
            ? 'bg-amber-50/80 border border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-700/50' 
            : 'bg-slate-50/80 border border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50'
        }`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Document Title
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 break-words">
                {proof.displayTitle}
              </p>
            </div>
          </div>
        </div>

        {/* IPFS Hash */}
        <div className={`rounded-2xl p-3 sm:p-4 transition-colors ${
          isDifferent('ipfsHash') 
            ? 'bg-amber-50/80 border border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-700/50' 
            : 'bg-slate-50/80 border border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50'
        }`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <HashtagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                IPFS Hash / CID
              </p>
              <p className="text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-50 break-all">
                {proof.ipfsHash}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className={`rounded-2xl p-3 sm:p-4 transition-colors ${
          isDifferent('timestamp') 
            ? 'bg-amber-50/80 border border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-700/50' 
            : 'bg-slate-50/80 border border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50'
        }`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Timestamp
              </p>
              <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-50">
                {new Date(Number(proof.timestamp) * 1000).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Block: {Number(proof.timestamp)}
              </p>
            </div>
          </div>
        </div>

        {/* Owner/Authority */}
        <div className={`rounded-2xl p-3 sm:p-4 transition-colors ${
          isDifferent('owner') 
            ? 'bg-amber-50/80 border border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-700/50' 
            : 'bg-slate-50/80 border border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50'
        }`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Authority / Owner
              </p>
              <p className="text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-50 break-all">
                {proof.owner}
              </p>
            </div>
          </div>
        </div>

        {/* Document Type & Use Case */}
        <div className="grid grid-cols-1 gap-3">
          <div className={`rounded-2xl p-3 sm:p-4 transition-colors ${
            isDifferent('documentType') 
              ? 'bg-amber-50/80 border border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-700/50' 
              : 'bg-slate-50/80 border border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50'
          }`}>
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Document Type
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {proof.documentType}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-3 sm:p-4 transition-colors ${
            isDifferent('useCaseType') 
              ? 'bg-amber-50/80 border border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-700/50' 
              : 'bg-slate-50/80 border border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50'
          }`}>
            <div className="flex items-center gap-2">
              <div 
                className="h-4 w-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: useCase?.metadata.primaryColor || '#64748b' }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Use Case
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {useCase?.label || 'General'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Version Information */}
        {proof.version && (
          <div className={`rounded-2xl p-4 transition-colors ${
            isDifferent('version') 
              ? 'bg-amber-50/80 border border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-700/50' 
              : 'bg-slate-50/80 border border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Version:
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                v{proof.version}
              </span>
            </div>
          </div>
        )}

        {/* Reference Information */}
        {proof.referenceId && (
          <div className="rounded-2xl p-4 bg-blue-50/80 border border-blue-200/50 dark:bg-blue-900/20 dark:border-blue-700/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                References Proof ID:
              </span>
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                {proof.referenceId}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}