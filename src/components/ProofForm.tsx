'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useWriteContract, useSwitchChain } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import { sepolia } from "wagmi/chains";
import { useWaitForTransactionReceipt } from "wagmi";
import { UseCaseConfig } from "@/config/useCases";

type Props = {
  useCase: UseCaseConfig;
  onSubmitted?: () => void;
  isUpdateMode?: boolean;
  originalId?: string;
  originalTitle?: string;
  preselectedDocumentType?: string;
};

export default function ProofForm({ 
  useCase, 
  onSubmitted, 
  isUpdateMode = false, 
  originalId, 
  originalTitle, 
  preselectedDocumentType 
}: Props) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [title, setTitle] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState(
    preselectedDocumentType || useCase.documentTypes[0] || ""
  );
  const [error, setError] = useState<string | null>(null);
  const contractAddress = useMemo(() => proofRegistryAddress, []);

  const {
    writeContractAsync,
    data: txHash,
    isPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess) {
      onSubmitted?.();
    }
  }, [isSuccess, onSubmitted]);

  // Update selected document type when use case changes or preselected type is provided
  useEffect(() => {
    if (preselectedDocumentType) {
      setSelectedDocumentType(preselectedDocumentType);
    } else {
      setSelectedDocumentType(useCase.documentTypes[0] || "");
    }
  }, [useCase, preselectedDocumentType]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isConnected) {
      setError("Connect a wallet to submit a proof.");
      return;
    }

    if (!contractAddress) {
      setError("Contract address missing. Set NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS.");
      return;
    }

    // Auto-switch to Sepolia if on wrong network
    if (chainId && chainId !== sepolia.id) {
      try {
        await switchChain({ chainId: sepolia.id });
        setError("Switching to Sepolia network... Please try again.");
        return;
      } catch (switchErr: unknown) {
        const switchMessage = switchErr instanceof Error ? switchErr.message : "Failed to switch network";
        setError(`Please switch to Sepolia network manually. ${switchMessage}`);
        return;
      }
    }

    try {
      // Create use case-aware proof title with metadata
      const useCasePrefix = `[${useCase.id.toUpperCase()}]`;
      const documentTypePrefix = selectedDocumentType ? `[${selectedDocumentType}]` : "";
      
      let enhancedTitle;
      if (isUpdateMode && originalId) {
        // For updates, include reference to original and update indicator
        enhancedTitle = `${useCasePrefix} ${documentTypePrefix} [UPDATE] ${title} (ref: ${originalId})`.trim();
      } else {
        enhancedTitle = `${useCasePrefix} ${documentTypePrefix} ${title}`.trim();
      }

      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: proofRegistryAbi,
        functionName: "createProof",
        args: [enhancedTitle, ipfsHash],
      });
      setTitle("");
      setIpfsHash("");
      onSubmitted?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit";
      setError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/60 p-6 shadow-lg backdrop-blur dark:border-white/5 dark:bg-white/[0.04]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: useCase.metadata.primaryColor }}>
            {isUpdateMode ? `Update ${useCase.metadata.terminology.upload}` : useCase.metadata.terminology.upload}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isUpdateMode 
              ? `Create an updated version of your ${useCase.label.toLowerCase()} on Sepolia.`
              : `Anchor ${useCase.label.toLowerCase()} on Sepolia.`
            }
          </p>
        </div>
        <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
          Network: Sepolia
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Document Type Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Document Type
          </label>
          <select
            value={selectedDocumentType}
            onChange={(e) => setSelectedDocumentType(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
            required
          >
            {useCase.documentTypes.map((docType) => (
              <option key={docType} value={docType}>
                {docType}
              </option>
            ))}
          </select>
        </div>

        {/* Title Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Document Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
            placeholder={
              isUpdateMode 
                ? `Updated ${selectedDocumentType} v2.0` 
                : `e.g. ${selectedDocumentType} v1.0`
            }
            required
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Will be stored as: [{useCase.id.toUpperCase()}] [{selectedDocumentType}] {isUpdateMode ? '[UPDATE] ' : ''}{title} {isUpdateMode && originalId ? `(ref: ${originalId})` : ''}
          </p>
        </div>

        {/* IPFS Hash Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            IPFS hash / CID
          </label>
          <input
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40"
            placeholder="IPFS CID or sha256"
            required
          />
        </div>
      </div>

      {/* Use Case Features */}
      <div className="mt-4 rounded-xl bg-slate-50/50 p-3 dark:bg-slate-900/50">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          {useCase.label} Features:
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${useCase.allowsUpdates ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
            <div className={`h-1.5 w-1.5 rounded-full ${useCase.allowsUpdates ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {useCase.allowsUpdates ? 'Updates allowed' : 'Immutable'}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${useCase.verificationRules.publicAccess ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'}`}>
            <div className={`h-1.5 w-1.5 rounded-full ${useCase.verificationRules.publicAccess ? 'bg-blue-400' : 'bg-purple-400'}`} />
            {useCase.verificationRules.publicAccess ? 'Public verification' : 'Private access'}
          </span>
        </div>
      </div>

      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
      {isSuccess ? (
        <p className="mt-2 text-sm text-green-600">Proof stored on-chain.</p>
      ) : null}
      {isConfirming ? (
        <p className="mt-2 text-sm text-indigo-600">Waiting for confirmations…</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || isConfirming || isSwitching}
        className="mt-4 inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: useCase.metadata.primaryColor }}
      >
        {isSwitching 
          ? "Switching network..." 
          : isPending || isConfirming 
            ? "Submitting..." 
            : isUpdateMode 
              ? "Create Update" 
              : useCase.metadata.terminology.upload
        }
      </button>
    </form>
  );
}

