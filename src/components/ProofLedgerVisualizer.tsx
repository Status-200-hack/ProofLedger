'use client';

import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { proofRegistryAbi, proofRegistryAddress } from "@/lib/abi/proofRegistry";
import { useEffect, useMemo, useRef, useState } from "react";
import { encodeProofId } from "@/lib/proofId";
import { USE_CASES, getUseCaseById } from "@/config/useCases";

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
};

type Props = {
  refreshKey?: number;
};

export default function ProofLedgerVisualizer({ refreshKey }: Props) {
  const { address, isConnected } = useAccount();
  const chainRef = useRef<HTMLDivElement | null>(null);
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
    if (isConnected && isMounted) {
      refetch();
    }
  }, [isConnected, refetch, refreshKey, isMounted]); // Add refreshKey to dependencies

  const allProofs = (data as Proof[]) ?? [];

  const categorizedProofs = useMemo(() => {
    if (!isConnected || !address || !isMounted) return {};
    
    const zero = BigInt(0);
    const userProofs = allProofs
      .map((proof, index) => ({ ...proof, contractId: index }))
      .filter((proof) => proof.owner.toLowerCase() === address.toLowerCase())
      .filter((proof) => !proof.title.includes('[DELETED]')) // Filter out deleted proofs
      .sort((a, b) => Number((a.timestamp ?? zero) - (b.timestamp ?? zero)));

    // Categorize proofs by use case
    const categories: Record<string, CategorizedProof[]> = {};
    
    userProofs.forEach((proof) => {
      // Extract use case from title format: [USE_CASE] [DOCUMENT_TYPE] Title
      const useCaseMatch = proof.title.match(/^\[([^\]]+)\]/);
      const useCaseType = useCaseMatch ? useCaseMatch[1].toLowerCase() : 'general';
      
      // Clean title by removing prefixes including UPDATE markers
      let displayTitle = proof.title.replace(/^\[[^\]]+\]\s*(\[[^\]]+\]\s*)?/, '').trim();
      displayTitle = displayTitle.replace(/\[UPDATE\]/g, '').trim();
      
      // Remove reference information for cleaner display
      displayTitle = displayTitle.replace(/\s*\(ref:\s*\d+\)$/, '').trim();
      
      const categorizedProof: CategorizedProof = {
        ...proof,
        useCaseType,
        displayTitle: displayTitle || 'Untitled proof'
      };

      if (!categories[useCaseType]) {
        categories[useCaseType] = [];
      }
      categories[useCaseType].push(categorizedProof);
    });

    // Helper function to extract version from title
    const extractVersion = (title: string): string | null => {
      // Look for patterns like v1.0, v1.5, v2.0, version 1.0, etc.
      const versionMatch = title.match(/v?(\d+(?:\.\d+)*)/i);
      return versionMatch ? versionMatch[1] : null;
    };

    // Helper function to compare version strings
    const compareVersions = (versionA: string, versionB: string): number => {
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
    };

    // Helper function to detect if a group has version-based documents
    const hasVersionedDocuments = (proofs: CategorizedProof[]): boolean => {
      return proofs.some(proof => {
        const version = extractVersion(proof.displayTitle);
        return version !== null;
      });
    };

    // Helper function to group documents by base title (without version)
    const getBaseTitle = (title: string): string => {
      // Remove version patterns like v1.0, v2.0, version 1.0, etc.
      return title.replace(/\s*v?(\d+(?:\.\d+)*)\s*/gi, '').trim();
    };

    // Sort proofs within each category using smart sorting logic
    Object.keys(categories).forEach(key => {
      const categoryProofs = categories[key];
      
      // Check if this category has versioned documents
      if (hasVersionedDocuments(categoryProofs)) {
        // Group by base title first, then sort by version within each base title group
        const titleGroups: Record<string, CategorizedProof[]> = {};
        
        categoryProofs.forEach(proof => {
          const baseTitle = getBaseTitle(proof.displayTitle);
          if (!titleGroups[baseTitle]) {
            titleGroups[baseTitle] = [];
          }
          titleGroups[baseTitle].push(proof);
        });
        
        // Sort each title group by version, then flatten
        const sortedProofs: CategorizedProof[] = [];
        
        // Sort title groups by the timestamp of their first document (oldest base titles first for blockchain)
        const sortedTitleKeys = Object.keys(titleGroups).sort((a, b) => {
          const aFirstTimestamp = Math.min(...titleGroups[a].map(p => Number(p.timestamp)));
          const bFirstTimestamp = Math.min(...titleGroups[b].map(p => Number(p.timestamp)));
          return aFirstTimestamp - bFirstTimestamp;
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
              // Neither has version, sort by timestamp (oldest first for blockchain)
              return Number(a.timestamp - b.timestamp);
            }
          });
          
          sortedProofs.push(...titleProofs);
        });
        
        categories[key] = sortedProofs;
      } else {
        // No versioned documents - sort by timestamp only (oldest first for blockchain visualization)
        categoryProofs.sort((a, b) => Number(a.timestamp - b.timestamp));
      }
    });

    return categories;
  }, [allProofs, isConnected, address, isMounted]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const px = (x || 0) * 4; // max 4px shift
    const py = (y || 0) * 3;

    if (chainRef.current) {
      chainRef.current.style.setProperty("--pc-parallax-x", `${px}px`);
      chainRef.current.style.setProperty("--pc-parallax-y", `${py}px`);
    }
  };

  const handleMouseLeave = () => {
    if (chainRef.current) {
      chainRef.current.style.setProperty("--pc-parallax-x", "0px");
      chainRef.current.style.setProperty("--pc-parallax-y", "0px");
    }
  };

  if (!proofRegistryAddress) {
    return null;
  }

  const hasAnyProofs = Object.keys(categorizedProofs).length > 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/60 px-4 py-5 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03] sm:px-6 sm:py-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            On-chain visualization
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isConnected
              ? "Each block represents one of your proofs linked on Ethereum."
              : "Connect your wallet to see your proofs as chains of blocks."}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {!isConnected ? (
          <PlaceholderChains />
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading blocks…</p>
          </div>
        ) : !hasAnyProofs ? (
          <EmptyChains />
        ) : (
          Object.entries(categorizedProofs).map(([useCaseType, proofs]) => (
            <UseCaseChain
              key={useCaseType}
              useCaseType={useCaseType}
              proofs={proofs}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          ))
        )}
      </div>
    </section>
  );
}

type UseCaseChainProps = {
  useCaseType: string;
  proofs: CategorizedProof[];
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
};

function UseCaseChain({ useCaseType, proofs, onMouseMove, onMouseLeave }: UseCaseChainProps) {
  const useCase = getUseCaseById(useCaseType) || USE_CASES.real_estate; // fallback
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);

  const scrollContainer = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of visible width
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionIndex: number) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    const targetScroll = sectionIndex * scrollAmount;
    
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setCurrentSection(sectionIndex);
  };

  // Calculate actual number of sections based on container width and content
  const getSectionCount = () => {
    if (!scrollRef.current) return 1;
    
    const container = scrollRef.current;
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    
    // If content fits in one view, only one section
    if (scrollWidth <= containerWidth) return 1;
    
    // Calculate sections based on how much we can scroll
    const maxSections = Math.ceil((scrollWidth - containerWidth) / (containerWidth * 0.75)) + 1;
    return Math.max(1, maxSections);
  };

  const [sectionCount, setSectionCount] = useState(1);

  // Update current section based on scroll position
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateSectionInfo = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;
      
      // Calculate section count
      const newSectionCount = getSectionCount();
      setSectionCount(newSectionCount);
      
      // Calculate current section
      if (newSectionCount === 1) {
        setCurrentSection(0);
      } else {
        const sectionWidth = containerWidth * 0.75;
        const newSection = Math.round(scrollLeft / sectionWidth);
        setCurrentSection(Math.max(0, Math.min(newSection, newSectionCount - 1)));
      }
    };

    const handleScroll = () => {
      updateSectionInfo();
    };

    const handleResize = () => {
      updateSectionInfo();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollContainer('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollContainer('right');
      }
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    container.setAttribute('tabindex', '0');
    
    // Initial calculation
    updateSectionInfo();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [proofs.length]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollContainer('right');
    } else if (isRightSwipe) {
      scrollContainer('left');
    }
  };
  
  return (
    <div className="space-y-2">
      {/* Chain Header */}
      <div className="flex items-center gap-3">
        <span className="text-lg">{useCase.icon}</span>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {useCase.label}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {proofs.length} proof{proofs.length !== 1 ? 's' : ''} in this chain
          </p>
        </div>
      </div>

      {/* Chain Visualization */}
      <div className="relative">
        {/* Scroll Navigation Buttons */}
        {sectionCount > 1 && (
          <>
            <button
              onClick={() => scrollContainer('left')}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 dark:bg-slate-800/95 dark:hover:bg-slate-800 group"
              aria-label="Scroll left"
            >
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-300 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => scrollContainer('right')}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 dark:bg-slate-800/95 dark:hover:bg-slate-800 group"
              aria-label="Scroll right"
            >
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-300 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="scrollbar-hide overflow-x-auto overflow-y-visible pb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg"
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label={`${useCase.label} blockchain visualization`}
        >
          <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="flex min-h-[140px] items-center gap-4 px-12 sm:gap-6"
            style={{ minWidth: 'max-content' }}
          >
            {proofs.map((proof, index) => (
              <BlockItem
                key={proof.contractId}
                proof={proof}
                index={index}
                total={proofs.length}
                useCase={useCase}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        {sectionCount > 1 && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-white/50 px-3 py-2 backdrop-blur-sm dark:bg-slate-800/50">
              {Array.from({ length: sectionCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`scroll-indicator h-2 rounded-full transition-all duration-300 ${
                    currentSection === index
                      ? 'active w-8 bg-gradient-to-r from-indigo-500 to-purple-500'
                      : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500'
                  }`}
                  aria-label={`Go to section ${index + 1}`}
                />
              ))}
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                {currentSection + 1} / {sectionCount}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type BlockItemProps = {
  proof: CategorizedProof;
  index: number;
  total: number;
  useCase: any;
};

function BlockItem({ proof, index, total, useCase }: BlockItemProps) {
  const timestampDate = new Date(Number(proof.timestamp) * 1000);
  const formattedTimestamp = timestampDate.toLocaleString();
  const displayTitle = proof.displayTitle.length > 18 
    ? `${proof.displayTitle.slice(0, 16)}…` 
    : proof.displayTitle;
  const isGenesis = index === 0;
  const blockOffset = index % 2 === 0 ? "-2px" : "2px";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use case-specific styling
  const primaryColor = useCase.metadata.primaryColor;
  const isRealEstate = useCase.id === 'real_estate';
  const isEducation = useCase.id === 'education';
  const isMedical = useCase.id === 'medical';
  const isStartup = useCase.id === 'startup';
  const isGovernment = useCase.id === 'government';

  const getGradientClasses = () => {
    if (isGenesis) {
      if (isRealEstate) return "from-emerald-400/50 via-slate-900 to-slate-950 ring-emerald-300/60";
      if (isEducation) return "from-blue-400/50 via-slate-900 to-slate-950 ring-blue-300/60";
      if (isMedical) return "from-red-400/50 via-slate-900 to-slate-950 ring-red-300/60";
      if (isStartup) return "from-purple-400/50 via-slate-900 to-slate-950 ring-purple-300/60";
      if (isGovernment) return "from-cyan-400/50 via-slate-900 to-slate-950 ring-cyan-300/60";
    } else {
      if (isRealEstate) return "from-emerald-500/40 via-slate-900 to-slate-950 ring-emerald-400/40";
      if (isEducation) return "from-blue-500/40 via-slate-900 to-slate-950 ring-blue-400/40";
      if (isMedical) return "from-red-500/40 via-slate-900 to-slate-950 ring-red-400/40";
      if (isStartup) return "from-purple-500/40 via-slate-900 to-slate-950 ring-purple-400/40";
      if (isGovernment) return "from-cyan-500/40 via-slate-900 to-slate-950 ring-cyan-400/40";
    }
    return "from-indigo-500/40 via-slate-900 to-slate-950 ring-indigo-400/40";
  };

  const getStatusDotColor = () => {
    if (isGenesis) {
      if (isRealEstate) return "bg-emerald-300 shadow-[0_0_0_4px_rgba(16,185,129,0.6)]";
      if (isEducation) return "bg-blue-300 shadow-[0_0_0_4px_rgba(59,130,246,0.6)]";
      if (isMedical) return "bg-red-300 shadow-[0_0_0_4px_rgba(239,68,68,0.6)]";
      if (isStartup) return "bg-purple-300 shadow-[0_0_0_4px_rgba(147,51,234,0.6)]";
      if (isGovernment) return "bg-cyan-300 shadow-[0_0_0_4px_rgba(34,211,238,0.6)]";
    }
    return "bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.35)]";
  };

  return (
    <>
      <Link
        href={`/verify/${encodeProofId(proof.contractId)}`}
        className={`group pc-block relative inline-flex min-w-[130px] flex-col rounded-2xl bg-gradient-to-br px-3 py-3 text-xs shadow-[0_12px_30px_rgba(15,23,42,0.55)] outline-none ring-1 sm:min-w-[150px] ${getGradientClasses()} ${isGenesis ? "ml-1 sm:ml-2" : ""}`}
        style={{
          animationDelay: `${index * 160}ms`,
          ["--pc-block-offset" as any]: blockOffset,
        }}
      >
        {/* Use case watermark */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div 
            className="absolute -right-4 -bottom-6 h-16 w-16 rounded-full border opacity-30 blur-sm"
            style={{ 
              borderColor: `${primaryColor}30`,
              backgroundColor: `${primaryColor}05`
            }}
          />
          <div 
            className="absolute -right-1 -bottom-3 flex h-10 w-10 items-center justify-center rounded-full text-[11px] text-white"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            {useCase.icon}
          </div>
        </div>

        {/* Status dot */}
        <span className={`absolute -top-1 -left-1 h-3 w-3 rounded-full ${getStatusDotColor()}`} />

        <div
          className="relative flex flex-col gap-1 pc-animate-fade-in-up"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <p className="truncate text-[11px] font-semibold text-slate-50">
            {displayTitle} {isGenesis && <span className="text-[9px] opacity-80">· Genesis</span>}
          </p>
          <p className="text-[10px] opacity-80">
            Block #{proof.contractId} ·{" "}
            <span className="font-mono text-[9px] opacity-70">
              {shortenHash(proof.ipfsHash)}
            </span>
          </p>

          <p className="mt-1 line-clamp-2 text-[10px] text-slate-200/80">
            {useCase.label} proof anchored
            <br />
            {isMounted ? formattedTimestamp : 'Loading...'}
          </p>
        </div>
      </Link>

      {/* Connector line, except after last block */}
      {index < total - 1 && (
        <div 
          className="pc-connector hidden h-[2px] w-10 flex-none rounded-full opacity-40 sm:block"
          style={{ backgroundColor: primaryColor }}
        />
      )}
    </>
  );
}

function PlaceholderChains() {
  const sampleUseCases = ['real_estate', 'education', 'medical', 'startup', 'government'];
  
  return (
    <div className="space-y-6">
      {sampleUseCases.slice(0, 3).map((useCaseId, chainIndex) => {
        const useCase = USE_CASES[useCaseId as keyof typeof USE_CASES];
        return (
          <div key={useCaseId} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-lg">{useCase.icon}</span>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 opacity-60">
                  {useCase.label}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Connect wallet to see your {useCase.label.toLowerCase()} proofs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <PlaceholderBlock key={index} index={index} useCase={useCase} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyChains() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-8 text-center">
      <div className="flex items-center gap-3">
        <div className="pc-block h-8 w-8 rounded-2xl border border-dashed border-slate-500/50 bg-slate-900/40" />
        <div className="pc-connector hidden h-[2px] w-10 rounded-full bg-slate-600/40 sm:block" />
        <div className="pc-block hidden h-8 w-8 rounded-2xl border border-dashed border-slate-600/60 bg-slate-900/40 sm:block" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        No blocks yet. Your first proof will create a genesis block in its category chain.
      </p>
    </div>
  );
}

type PlaceholderBlockProps = {
  index: number;
  useCase: any;
};

function PlaceholderBlock({ index, useCase }: PlaceholderBlockProps) {
  return (
    <>
      <div
        className="pc-block relative inline-flex min-w-[110px] flex-col rounded-2xl bg-gradient-to-br from-slate-700/40 via-slate-900 to-slate-950 px-3 py-3 text-xs opacity-60 shadow-[0_10px_24px_rgba(15,23,42,0.5)] sm:min-w-[130px]"
        style={{ animationDelay: `${index * 120}ms` }}
      >
        <div 
          className="absolute -right-4 -bottom-6 h-12 w-12 rounded-full border blur-sm opacity-40"
          style={{ 
            borderColor: `${useCase.metadata.primaryColor}40`,
            backgroundColor: `${useCase.metadata.primaryColor}10`
          }}
        />
        <div className="absolute -right-1 -bottom-3 flex h-8 w-8 items-center justify-center rounded-full text-[10px] opacity-60">
          {useCase.icon}
        </div>
        <p className="text-[11px] font-semibold text-slate-100/80">Block placeholder</p>
        <p className="mt-1 text-[10px] text-slate-400">
          {useCase.label} proofs will appear here
        </p>
      </div>
      {index < 1 && (
        <div 
          className="pc-connector hidden h-[2px] w-8 flex-none rounded-full opacity-40 sm:block"
          style={{ backgroundColor: useCase.metadata.primaryColor }}
        />
      )}
    </>
  );
}

function shortenHash(value: string) {
  if (!value) return "";
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}


