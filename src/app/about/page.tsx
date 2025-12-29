'use client';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        {/* Header Section */}
        <header className="rounded-3xl border border-white/10 bg-white/70 px-6 py-10 shadow-[0_22px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              About ProofLedger
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                Multi-industry document proof platform.
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                ProofLedger is a comprehensive blockchain-based platform that provides immutable proof-of-existence 
                for regulated documents across multiple industries. From real estate contracts to academic transcripts, 
                we make document verification transparent, secure, and industry-specific.
              </p>
            </div>
          </div>
        </header>

        {/* What is ProofLedger Section */}
        <section className="rounded-3xl border border-white/10 bg-white/70 px-6 py-8 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              What is ProofLedger?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              A specialized platform for regulated document verification with industry-specific workflows.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Industry-Specific Approach
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Unlike generic proof-of-existence tools, ProofLedger understands the unique requirements 
                  of different industries. Each use case comes with specialized terminology, document types, 
                  role definitions, and verification rules tailored to regulatory needs.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Version-Aware Document Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  ProofLedger supports document evolution through blockchain-compliant updates. Create new 
                  versions that reference originals while maintaining complete audit trails. Perfect for 
                  contracts, certifications, and legal documents that evolve over time.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Blockchain-Native Security
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Built on Ethereum for maximum security and transparency. Documents are stored on IPFS 
                  while only cryptographic hashes and metadata live on-chain, ensuring privacy while 
                  providing immutable proof of existence and ownership.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Public Verification
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Anyone can verify document authenticity without needing accounts or special access. 
                  Share verification links that work independently of our platform, ensuring long-term 
                  accessibility and trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Industries Section */}
        <section className="rounded-3xl border border-white/10 bg-white/70 px-6 py-8 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Supported Industries
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Each industry has unique document workflows, roles, and verification requirements.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
                  <span className="text-lg">🏗️</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Real Estate / RERA</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Property documents, ownership certificates, RERA compliance records, and construction permits.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/20">
                  <span className="text-lg">🎓</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">University & Academic</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Degrees, transcripts, certifications, and academic records with institutional verification.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/20">
                  <span className="text-lg">🏥</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Medical Records</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Patient records, treatment records, medical certifications, and healthcare compliance documents.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/20">
                  <span className="text-lg">🚀</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Startup Legal</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Cap tables, legal agreements, investor documents, and corporate governance records.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-500/20">
                  <span className="text-lg">🏛️</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Government Tenders</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tender documents, bid submissions, compliance certificates, and public procurement records.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-500/20">
                  <span className="text-lg">📄</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">General Documents</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Any document requiring proof-of-existence with basic timestamp and ownership verification.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="rounded-3xl border border-white/10 bg-white/70 px-6 py-8 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              How ProofLedger Works
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              A simple three-step process that works across all supported industries.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20">
                <span className="text-2xl font-semibold text-indigo-600 dark:text-indigo-300">1</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Choose Your Industry
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select your use case to get industry-specific document types, roles, and workflows 
                tailored to your regulatory requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-300">2</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Upload & Anchor
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload your document to IPFS and register its cryptographic hash on Ethereum Sepolia 
                with industry-specific metadata and version tracking.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                <span className="text-2xl font-semibold text-blue-600 dark:text-blue-300">3</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Share & Verify
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share verification links that anyone can use to independently confirm document 
                authenticity, ownership, and timestamp without needing special access.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="rounded-3xl border border-white/10 bg-white/70 px-6 py-8 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Why Choose ProofLedger?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Built specifically for regulated industries with enterprise-grade security and compliance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/20">
                <span className="text-lg">🔒</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Immutable Records
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Blockchain-based timestamps that cannot be altered, deleted, or backdated.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
                <span className="text-lg">🏭</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Industry-Specific
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Tailored workflows, terminology, and compliance features for each industry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20">
                <span className="text-lg">📝</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Version Control
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Smart document versioning with complete audit trails and reference tracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/20">
                <span className="text-lg">🌐</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Public Verification
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Independent verification that works without accounts or platform dependency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


