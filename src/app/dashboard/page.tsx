'use client';

import { useAccount } from "wagmi";
import ProofList from "@/components/ProofList";
import ProofLedgerVisualizer from "@/components/ProofLedgerVisualizer";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import components that use wallet state to prevent SSR hydration issues
const DynamicProofList = dynamic(() => import("@/components/ProofList"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl border border-white/10 bg-white/60 p-4 shadow-lg backdrop-blur dark:border-white/5 dark:bg-white/[0.04] sm:p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-slate-200 rounded"></div>
          <div className="h-16 bg-slate-200 rounded"></div>
          <div className="h-16 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  )
});

const DynamicProofLedgerVisualizer = dynamic(() => import("@/components/ProofLedgerVisualizer"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl border border-white/10 bg-white/60 px-4 py-5 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03] sm:px-6 sm:py-6">
      <div className="animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-24 w-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-24 w-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-24 w-32 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  )
});

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Return nothing during SSR
  }

  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Dashboard · My proofs
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                Your document proofs.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base mt-2">
                View and manage your document proofs organized by use case. Each proof is immutable and 
                publicly verifiable on the blockchain.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Create New Proof
            </Link>
          </div>
        </header>

        {/* Blockchain-inspired visual chain */}
        <DynamicProofLedgerVisualizer refreshKey={refreshKey} />

        {!isMounted ? (
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 text-sm shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              Loading dashboard...
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Please wait while we initialize your wallet connection.
            </p>
          </div>
        ) : !isConnected ? (
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 text-sm shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              Connect wallet to view your dashboard.
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Use the wallet button in the top-right corner to connect. Your proofs are tied to your
              wallet address and will appear here once connected.
            </p>
          </div>
        ) : (
          <div className="transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
            <DynamicProofList refreshKey={refreshKey} onRefresh={handleRefresh} />
          </div>
        )}
      </div>
    </div>
  );
}


