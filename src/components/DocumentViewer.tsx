'use client';

import { useState, useEffect } from 'react';
import { DocumentIcon, PhotoIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface DocumentViewerProps {
  ipfsHash: string;
  title: string;
  side: 'left' | 'right';
}

export default function DocumentViewer({ ipfsHash, title, side }: DocumentViewerProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<'pdf' | 'image' | 'unknown'>('unknown');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Construct IPFS gateway URL
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        
        // Try to fetch the document to determine its type
        const response = await fetch(gatewayUrl, { method: 'HEAD' });
        
        if (!response.ok) {
          throw new Error('Document not accessible via IPFS gateway');
        }

        const contentType = response.headers.get('content-type') || '';
        
        // Determine document type based on content type
        if (contentType.includes('application/pdf')) {
          setDocumentType('pdf');
        } else if (contentType.includes('image/')) {
          setDocumentType('image');
        } else {
          // Try to determine by file extension from IPFS hash or content
          setDocumentType('unknown');
        }

        setDocumentUrl(gatewayUrl);
      } catch (err) {
        console.warn(`Failed to load document from IPFS: ${ipfsHash}`, err);
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setIsLoading(false);
      }
    };

    if (ipfsHash) {
      loadDocument();
    }
  }, [ipfsHash]);

  const renderDocumentContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64 sm:h-96 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Loading document...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 sm:h-96 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl">
          <div className="text-center space-y-3 px-4">
            <EyeSlashIcon className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 mx-auto" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                Document not available
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">
                {error}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (!documentUrl) {
      return (
        <div className="flex items-center justify-center h-64 sm:h-96 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl">
          <div className="text-center space-y-3">
            <DocumentIcon className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No document available</p>
          </div>
        </div>
      );
    }

    switch (documentType) {
      case 'pdf':
        return (
          <div className="h-64 sm:h-96 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl overflow-hidden">
            <iframe
              src={`${documentUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0"
              title={`PDF Document - ${title}`}
              loading="lazy"
            />
          </div>
        );

      case 'image':
        return (
          <div className="bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl overflow-hidden">
            <img
              src={documentUrl}
              alt={title}
              className="w-full h-auto max-h-64 sm:max-h-96 object-contain"
              loading="lazy"
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 sm:h-96 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl">
            <div className="text-center space-y-3 px-4">
              <DocumentIcon className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 mx-auto" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Preview not available
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Document type not supported for preview
                </p>
                <div className="mt-3 space-y-2">
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
                  >
                    View Original Document
                  </a>
                  <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                    Hash: {ipfsHash.slice(0, 12)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Document Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          {documentType === 'pdf' ? (
            <DocumentIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
          ) : documentType === 'image' ? (
            <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
          ) : (
            <DocumentIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 flex-shrink-0" />
          )}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-50">
            Document Content
          </h3>
        </div>
        
        {documentUrl && (
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 self-start sm:self-auto"
          >
            Open Full Size
          </a>
        )}
      </div>

      {/* Document Content */}
      {renderDocumentContent()}

      {/* Document Info */}
      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="break-all">IPFS Hash: <span className="font-mono">{ipfsHash}</span></p>
        {documentType !== 'unknown' && (
          <p>Type: <span className="capitalize">{documentType}</span></p>
        )}
      </div>
    </div>
  );
}