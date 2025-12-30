'use client';

import { TrustIndicator, ComparisonMetadata } from "@/hooks/useProofComparison";
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  LinkIcon,
  CubeIcon
} from "@heroicons/react/24/outline";

interface TrustIndicatorPanelProps {
  trustIndicators: TrustIndicator[];
  metadata: ComparisonMetadata | null;
}

export default function TrustIndicatorPanel({ trustIndicators, metadata }: TrustIndicatorPanelProps) {
  const getStatusIcon = (status: TrustIndicator['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: TrustIndicator['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-50/80 border-emerald-200/50 dark:bg-emerald-900/20 dark:border-emerald-700/50';
      case 'warning':
        return 'bg-amber-50/80 border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-700/50';
      case 'error':
        return 'bg-red-50/80 border-red-200/50 dark:bg-red-900/20 dark:border-red-700/50';
      default:
        return 'bg-slate-50/80 border-slate-200/50 dark:bg-slate-900/50 dark:border-slate-700/50';
    }
  };

  const getTypeIcon = (type: TrustIndicator['type']) => {
    switch (type) {
      case 'authority':
        return <ShieldCheckIcon className="h-4 w-4" />;
      case 'timestamp':
        return <ClockIcon className="h-4 w-4" />;
      case 'reference':
        return <LinkIcon className="h-4 w-4" />;
      case 'blockchain':
        return <CubeIcon className="h-4 w-4" />;
      default:
        return <CheckCircleIcon className="h-4 w-4" />;
    }
  };

  const formatTimeDifference = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/70 p-4 sm:p-6 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
          Trust & Verification Status
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Blockchain-verified indicators for document authenticity
        </p>
      </div>

      {/* Trust Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {trustIndicators.map((indicator, index) => (
          <div
            key={index}
            className={`rounded-2xl p-3 sm:p-4 border transition-colors ${getStatusColor(indicator.status)}`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {getStatusIcon(indicator.status)}
                {getTypeIcon(indicator.type)}
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 capitalize">
                    {indicator.type} Verification
                  </h3>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-2">
                  {indicator.message}
                </p>

                {/* Show comparison values if available */}
                {indicator.leftValue && indicator.rightValue && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Left:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                        {indicator.leftValue.length > 15 
                          ? `${indicator.leftValue.slice(0, 15)}...` 
                          : indicator.leftValue
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Right:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                        {indicator.rightValue.length > 15 
                          ? `${indicator.rightValue.slice(0, 15)}...` 
                          : indicator.rightValue
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Metadata Summary */}
      {metadata && (
        <div className="rounded-2xl bg-slate-50/80 border border-slate-200/50 p-3 sm:p-4 dark:bg-slate-900/50 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Comparison Summary
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                metadata.sameAuthority ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                {metadata.sameAuthority ? 'Same Authority' : 'Different Authority'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                metadata.chronologicalOrder ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                {metadata.chronologicalOrder ? 'Chronological' : 'Same Time'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                metadata.validReference ? 'bg-emerald-400' : 'bg-slate-400'
              }`} />
              <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                {metadata.validReference ? 'Valid Reference' : 'No Reference'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                {formatTimeDifference(metadata.timeDifference)} apart
              </span>
            </div>
          </div>

          {metadata.timeDifference > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {metadata.leftIsNewer ? 'Left proof is newer' : 'Right proof is newer'} by{' '}
                {formatTimeDifference(metadata.timeDifference)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}