/**
 * Role-based authorization hook for ProofLedger
 * 
 * Provides role checking functionality for document management:
 * - Authority role: Can create and update documents
 * - Owner role: Can view and share documents
 * - Verifier role: Can verify document authenticity
 * 
 * Note: This is UI-level role enforcement for hackathon demo.
 * In production, role enforcement would move on-chain.
 */

import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { UseCaseConfig } from '@/config/useCases';

// Mock authority addresses for demo purposes
// In production, these would come from smart contract or decentralized registry
const MOCK_AUTHORITIES: Record<string, string[]> = {
  real_estate: [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A', // Mock RERA authority
    '0x8ba1f109551bD432803012645Hac136c30C85bcf', // Mock builder
  ],
  education: [
    '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5', // Mock university
    '0x388C818CA8B9251b393131C08a736A67ccB19297', // Mock institution
  ],
  medical: [
    '0x1234567890123456789012345678901234567890', // Mock hospital
    '0x0987654321098765432109876543210987654321', // Mock practitioner
  ],
  startup: [
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Mock legal team
    '0xfedcbafedcbafedcbafedcbafedcbafedcbafedcba', // Mock founder
  ],
  government: [
    '0x1111111111111111111111111111111111111111', // Mock procurement authority
    '0x2222222222222222222222222222222222222222', // Mock government official
  ],
};

export interface RoleAuthReturn {
  isAuthority: boolean;
  isOwner: boolean;
  canUpdate: boolean;
  canCreate: boolean;
  userRole: 'authority' | 'owner' | 'verifier' | 'observer' | null;
  authorityAddresses: string[];
}

export const useRoleAuth = (
  useCase: UseCaseConfig,
  documentOwner?: string
): RoleAuthReturn => {
  const { address, isConnected } = useAccount();

  const roleAuth = useMemo(() => {
    if (!isConnected || !address) {
      return {
        isAuthority: false,
        isOwner: false,
        canUpdate: false,
        canCreate: false,
        userRole: null,
        authorityAddresses: [],
      };
    }

    const authorityAddresses = MOCK_AUTHORITIES[useCase.id] || [];
    const isAuthority = authorityAddresses.includes(address);
    const isOwner = documentOwner ? address.toLowerCase() === documentOwner.toLowerCase() : false;

    // Determine user role
    let userRole: 'authority' | 'owner' | 'verifier' | 'observer' | null = null;
    if (isAuthority) {
      userRole = 'authority';
    } else if (isOwner) {
      userRole = 'owner';
    } else if (isConnected) {
      userRole = 'verifier'; // Connected users can verify
    } else {
      userRole = 'observer'; // Public can observe
    }

    // Permission logic
    const canCreate = isAuthority; // Only authorities can create documents
    const canUpdate = isAuthority && useCase.allowsUpdates; // Only authorities can update, if use case allows

    return {
      isAuthority,
      isOwner,
      canUpdate,
      canCreate,
      userRole,
      authorityAddresses,
    };
  }, [address, isConnected, useCase, documentOwner]);

  return roleAuth;
};

/**
 * Hook for managing authority addresses (for demo purposes)
 */
export const useAuthorityManagement = () => {
  const addMockAuthority = (useCaseId: string, address: string) => {
    if (!MOCK_AUTHORITIES[useCaseId]) {
      MOCK_AUTHORITIES[useCaseId] = [];
    }
    if (!MOCK_AUTHORITIES[useCaseId].includes(address)) {
      MOCK_AUTHORITIES[useCaseId].push(address);
    }
  };

  const removeMockAuthority = (useCaseId: string, address: string) => {
    if (MOCK_AUTHORITIES[useCaseId]) {
      MOCK_AUTHORITIES[useCaseId] = MOCK_AUTHORITIES[useCaseId].filter(
        addr => addr !== address
      );
    }
  };

  const getMockAuthorities = (useCaseId: string): string[] => {
    return MOCK_AUTHORITIES[useCaseId] || [];
  };

  const isCurrentUserAuthority = (useCaseId: string, userAddress?: string): boolean => {
    if (!userAddress) return false;
    return MOCK_AUTHORITIES[useCaseId]?.includes(userAddress) || false;
  };

  return {
    addMockAuthority,
    removeMockAuthority,
    getMockAuthorities,
    isCurrentUserAuthority,
    allAuthorities: MOCK_AUTHORITIES,
  };
};

/**
 * Demo utility to make current user an authority for testing
 */
export const useDemoAuthority = () => {
  const { address } = useAccount();
  const { addMockAuthority } = useAuthorityManagement();

  const makeCurrentUserAuthority = (useCaseId: string) => {
    if (address) {
      addMockAuthority(useCaseId, address);
      console.log(`Demo: Made ${address} an authority for ${useCaseId}`);
    }
  };

  return { makeCurrentUserAuthority };
};