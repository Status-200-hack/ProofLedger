'use client';

import { CategorizedProof } from "@/hooks/useProofComparison";
import DocumentViewer from "./DocumentViewer";

interface DocumentComparisonProps {
  leftProof: CategorizedProof;
  rightProof: CategorizedProof;
  leftLabel: string;
  rightLabel: string;
}

export default function DocumentComparison({ 
  leftProof, 
  rightProof, 
  leftLabel, 
  rightLabel 
}: DocumentComparisonProps) {
  const hashesAreDifferent = leftProof.ipfsHash !== rightProof.ipfsHash;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/70 p-4 sm:p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
      {/* Section Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Document Content Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Side-by-side view of the actual document contents stored on IPFS
            </p>
          </div>
          
          {/* Content Difference Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium self-start sm:self-auto ${
            hashesAreDifferent 
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
          }`}>
            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
              hashesAreDifferent ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            <span className="whitespace-nowrap">
              {hashesAreDifferent ? 'Different Content' : 'Identical Content'}
            </span>
          </div>
        </div>
      </div>

      {/* Document Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Document */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500 flex-shrink-0"></div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
              <span className="hidden sm:inline">{leftLabel} - {leftProof.displayTitle}</span>
              <span className="sm:hidden">{leftLabel}</span>
            </h3>
          </div>
          
          <DocumentViewer
            ipfsHash={leftProof.ipfsHash}
            title={leftProof.displayTitle}
            side="left"
          />
        </div>

        {/* Right Document */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500 flex-shrink-0"></div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
              <span className="hidden sm:inline">{rightLabel} - {rightProof.displayTitle}</span>
              <span className="sm:hidden">{rightLabel}</span>
            </h3>
          </div>
          
          <DocumentViewer
            ipfsHash={rightProof.ipfsHash}
            title={rightProof.displayTitle}
            side="right"
          />
        </div>
      </div>

      {/* Comparison Notes */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <p className="font-medium mb-1">Document Comparison Features:</p>
            <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Documents are fetched directly from IPFS using their content hashes</li>
              <li>• Different IPFS hashes indicate different document contents</li>
              <li>• PDF documents are displayed with embedded viewer</li>
              <li>• Images (PNG, JPG, GIF) are displayed with full preview</li>
              <li>• Click "Open Full Size" to view documents in new tabs</li>
              <li>• Content difference indicator shows if documents are identical or different</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}