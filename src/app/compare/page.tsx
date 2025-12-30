'use client';

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useComparisonParams } from "@/hooks/useComparisonParams";
import { useProofComparison } from "@/hooks/useProofComparison";
import ProofComparisonCard from "@/components/ProofComparisonCard";
import TrustIndicatorPanel from "@/components/TrustIndicatorPanel";
import DocumentComparison from "@/components/DocumentComparison";

function CompareContent() {
  const { leftId, rightId, isValid, error } = useComparisonParams();
  const comparisonData = useProofComparison(leftId || '0', rightId || '0');

  // Handle invalid parameters
  if (!isValid || error) {
    return (
      <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
          <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                Invalid Comparison Request
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {error || 'Please provide valid proof IDs to compare.'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                The URL should be in the format:
                <code className="block mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                  /compare?left=[proofId]&right=[proofId]
                </code>
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (comparisonData.isLoading) {
    return (
      <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
          <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Loading proof comparison...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (comparisonData.error) {
    return (
      <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
          <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                Error Loading Comparison
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {comparisonData.error}
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { leftProof, rightProof, differences, trustIndicators, metadata } = comparisonData;

  if (!leftProof || !rightProof) {
    return (
      <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
        <div className="text-center">
          <p>Unable to load proof data</p>
        </div>
      </div>
    );
  }

  // Determine version labels
  const leftLabel = leftProof.version ? `v${leftProof.version}` : leftProof.isUpdate ? 'Update' : 'Genesis';
  const rightLabel = rightProof.version ? `v${rightProof.version}` : rightProof.isUpdate ? 'Update' : 'Genesis';

  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
        {/* Comparison Header */}
        <header className="rounded-3xl border border-white/10 bg-white/70 px-4 py-4 sm:px-6 sm:py-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Proof Comparison
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Side-by-side document analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                  {leftLabel}
                </span>
                <span className="text-slate-400 text-xs">↔</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/80 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-200">
                  {rightLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Trust Indicators Panel */}
        <TrustIndicatorPanel 
          trustIndicators={trustIndicators}
          metadata={metadata}
        />

        {/* Comparison Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <ProofComparisonCard
            proof={leftProof}
            differences={differences}
            side="left"
            label={leftLabel}
          />
          
          <ProofComparisonCard
            proof={rightProof}
            differences={differences}
            side="right"
            label={rightLabel}
          />
        </div>

        {/* Document Content Comparison */}
        <DocumentComparison
          leftProof={leftProof}
          rightProof={rightProof}
          leftLabel={leftLabel}
          rightLabel={rightLabel}
        />
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading comparison...</p>
        </div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}