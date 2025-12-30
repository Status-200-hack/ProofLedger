import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export interface ComparisonParams {
  leftId: string | null;
  rightId: string | null;
  isValid: boolean;
  error: string | null;
}

/**
 * Hook for extracting and validating comparison parameters from URL
 * Handles the /compare?left=[proofId]&right=[proofId] URL structure
 */
export const useComparisonParams = (): ComparisonParams => {
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const leftId = searchParams.get('left');
    const rightId = searchParams.get('right');

    // Validate that both parameters exist
    if (!leftId || !rightId) {
      return {
        leftId,
        rightId,
        isValid: false,
        error: 'Both left and right proof IDs are required'
      };
    }

    // Validate that IDs are numeric (our proof IDs are numbers)
    const leftIdNum = parseInt(leftId, 10);
    const rightIdNum = parseInt(rightId, 10);

    if (isNaN(leftIdNum) || isNaN(rightIdNum)) {
      return {
        leftId,
        rightId,
        isValid: false,
        error: 'Proof IDs must be valid numbers'
      };
    }

    // Validate that IDs are non-negative
    if (leftIdNum < 0 || rightIdNum < 0) {
      return {
        leftId,
        rightId,
        isValid: false,
        error: 'Proof IDs must be non-negative numbers'
      };
    }

    // Validate that we're not comparing the same proof
    if (leftId === rightId) {
      return {
        leftId,
        rightId,
        isValid: false,
        error: 'Cannot compare a proof with itself'
      };
    }

    return {
      leftId,
      rightId,
      isValid: true,
      error: null
    };
  }, [searchParams]);

  return params;
};

/**
 * Utility function to generate comparison URL
 */
export const generateComparisonUrl = (leftId: number | string, rightId: number | string): string => {
  return `/compare?left=${leftId}&right=${rightId}`;
};

/**
 * Utility function to validate proof ID format
 */
export const isValidProofId = (id: string | null): boolean => {
  if (!id) return false;
  const num = parseInt(id, 10);
  return !isNaN(num) && num >= 0;
};