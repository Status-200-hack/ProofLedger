'use client';

import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import FileUpload from "@/components/FileUpload";
import ProofForm from "@/components/ProofForm";
import { USE_CASES, getUseCaseById, DEFAULT_USE_CASE } from "@/config/useCases";
import Link from "next/link";

function CreateProofContent() {
  const { isConnected } = useAccount();
  const searchParams = useSearchParams();
  const useCaseType = searchParams.get("type") ?? DEFAULT_USE_CASE;
  const mode = searchParams.get("mode");
  const originalId = searchParams.get("originalId");
  const originalTitle = searchParams.get("originalTitle");
  const documentType = searchParams.get("documentType");
  
  const useCase = getUseCaseById(useCaseType);
  const selectedUseCase = useCase ?? USE_CASES[DEFAULT_USE_CASE];
  
  const isUpdateMode = mode === 'update' && originalId;

  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
        {/* Use Case Context Header */}
        <div className="rounded-2xl border border-white/10 bg-white/70 p-4 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedUseCase.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {selectedUseCase.label} {isUpdateMode ? '- Update Document' : ''}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isUpdateMode 
                    ? `Creating an updated version of "${originalTitle}"`
                    : selectedUseCase.description
                  }
                </p>
              </div>
            </div>
            <Link
              href="/onboarding"
              className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Change use case
            </Link>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-medium text-slate-500 dark:text-slate-400">Authority:</span>
              <p className="text-slate-700 dark:text-slate-300">{selectedUseCase.authorityRole}</p>
            </div>
            <div>
              <span className="font-medium text-slate-500 dark:text-slate-400">Owner:</span>
              <p className="text-slate-700 dark:text-slate-300">{selectedUseCase.ownerRole}</p>
            </div>
            <div>
              <span className="font-medium text-slate-500 dark:text-slate-400">Verifier:</span>
              <p className="text-slate-700 dark:text-slate-300">{selectedUseCase.verifierRole}</p>
            </div>
          </div>

          {/* Update Mode Info */}
          {isUpdateMode && (
            <div className="mt-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Document Update Mode
                </p>
              </div>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                This will create a new immutable version that references the original document. 
                The original proof (ID: {originalId}) will remain unchanged on the blockchain.
              </p>
            </div>
          )}
        </div>

        <header className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {isUpdateMode ? `Update ${selectedUseCase.label}` : selectedUseCase.metadata.terminology.upload} · Ethereum Sepolia
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {isUpdateMode ? `Update ${selectedUseCase.label}` : selectedUseCase.metadata.terminology.upload} on Ethereum.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {isUpdateMode
              ? `Create an updated version of your ${selectedUseCase.label.toLowerCase()} document. The new version will be linked to the original while maintaining complete blockchain history.`
              : `Upload your ${selectedUseCase.label.toLowerCase()} document, pin it to IPFS, and register its CID on Ethereum Sepolia for an immutable, timestamped proof of existence.`
            }
          </p>
        </header>

        {!isConnected ? (
          <div className="rounded-3xl border border-white/10 bg-white/70 p-6 text-sm shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              Connect wallet to create a proof.
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Use the wallet button in the top-right corner to connect. Once connected, you can upload
              a file, pin it to IPFS, and anchor its CID on-chain.
            </p>
          </div>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
            <div className="transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
              <FileUpload />
            </div>
            <div className="space-y-6 transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
              <ProofForm 
                useCase={selectedUseCase}
                isUpdateMode={!!isUpdateMode}
                originalId={originalId || undefined}
                originalTitle={originalTitle || undefined}
                preselectedDocumentType={documentType || undefined}
              />
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                <p className="mb-2 font-semibold text-slate-900 dark:text-slate-50">
                  {isUpdateMode ? 'Update Flow' : 'Creation Flow'}: Upload → Get CID → Anchor on Ethereum
                </p>
                <ol className="space-y-2">
                  <li>
                    <span className="font-semibold">1.</span> Upload your {isUpdateMode ? 'updated ' : ''}{selectedUseCase.label.toLowerCase()} document in the IPFS card to pin it
                    and obtain a CID.
                  </li>
                  <li>
                    <span className="font-semibold">2.</span> Paste the CID into the proof form with a
                    descriptive title.
                  </li>
                  <li>
                    <span className="font-semibold">3.</span> Click &quot;{isUpdateMode ? 'Create Update' : selectedUseCase.metadata.terminology.upload}&quot; to store the
                    CID and metadata on Ethereum Sepolia.
                  </li>
                  {isUpdateMode && (
                    <li className="text-blue-600 dark:text-blue-400">
                      <span className="font-semibold">Note:</span> This creates a new immutable proof that references the original document.
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function CreateProofPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateProofContent />
    </Suspense>
  );
}


