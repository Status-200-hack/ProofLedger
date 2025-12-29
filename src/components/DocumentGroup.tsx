/**
 * DocumentGroup component for displaying grouped proofs with version history
 * 
 * Features:
 * - Shows document group with all versions
 * - Displays version timeline
 * - Allows creating new versions (updates)
 * - Shows use case context and metadata
 */

'use client';

import { useState } from 'react';
import { ProofGroup, Proof } from '@/types/proof';
import { USE_CASES, getUseCaseById } from '@/config/useCases';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DocumentGroupProps {
  group: ProofGroup;
  onCreateUpdate?: (groupId: string) => void;
}

export default function DocumentGroup({ group, onCreateUpdate }: DocumentGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const useCase = getUseCaseById(group.useCaseType);
  const canUpdate = useCase?.allowsUpdates && group.useCaseType !== 'government';

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffMs = now - (timestamp * 1000);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
      {/* Group Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Use Case Icon */}
            <div className="flex-shrink-0">
              <span className="text-2xl">{useCase?.icon || '📄'}</span>
            </div>
            
            {/* Group Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {group.title}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {group.versions.length} version{group.versions.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="text-xs">{useCase?.icon}</span>
                  {useCase?.label || 'General'}
                </span>
                <span>•</span>
                <span>{group.documentType}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  Updated {formatTimeAgo(group.updatedAt)}
                </span>
              </div>
              
              {/* Latest Version Info */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Latest: Version {group.latestVersion.version || group.versions.length}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {formatDate(group.latestVersion.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {canUpdate && (
                      <button
                        onClick={() => onCreateUpdate?.(group.groupId)}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:opacity-90"
                        style={{ backgroundColor: useCase?.metadata.primaryColor || '#6366f1' }}
                      >
                        <PlusIcon className="h-3 w-3" />
                        Update
                      </button>
                    )}
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronDownIcon className="h-3 w-3" />
                          Hide History
                        </>
                      ) : (
                        <>
                          <ChevronRightIcon className="h-3 w-3" />
                          View History
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version History */}
      {isExpanded && (
        <div className="border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="p-6">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Version History
            </h4>
            
            <div className="space-y-3">
              {group.versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                    version.isLatest 
                      ? 'bg-indigo-50/50 border border-indigo-200/50 dark:bg-indigo-900/20 dark:border-indigo-700/50'
                      : 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Version Number */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    version.isLatest
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                  }`}>
                    v{version.version || index + 1}
                  </div>
                  
                  {/* Version Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                        {version.title.replace(/^\[[^\]]+\]\s*(\[[^\]]+\]\s*)?/, '')}
                      </p>
                      {version.isLatest && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {formatDate(version.timestamp)} • {version.owner.slice(0, 6)}...{version.owner.slice(-4)}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/verify/${version.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Verify
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}