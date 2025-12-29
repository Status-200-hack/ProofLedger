"use client";

import { USE_CASES } from "@/config/useCases";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen px-4 py-10 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/25" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/25" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        {/* Header Section - Matching home page style */}
        <header className="rounded-3xl border border-white/10 bg-white/70 px-6 py-10 shadow-[0_22px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="text-center space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Choose Your Use Case
            </p>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                What type of documents do you need to prove?
              </h1>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                ProofLedger supports multiple regulated industries. Select your use case to get started with 
                industry-specific workflows and terminology.
              </p>
            </div>
          </div>
        </header>

        {/* Use Case Cards Section - Matching home page card style */}
        <section className="rounded-3xl border border-white/10 bg-white/70 px-6 py-8 shadow-lg backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Select Your Industry
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Each use case provides specialized workflows and terminology for your industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* General Use Case - First in grid with special styling */}
            <Link
              href={`/create?type=general`}
              className="group relative rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/90 to-slate-50/80 p-6 shadow-md shadow-indigo-900/10 backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 dark:border-indigo-700/50 dark:bg-gradient-to-br dark:from-indigo-900/30 dark:to-slate-900/70 dark:hover:shadow-indigo-900/50"
            >
              {/* Popular Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-800 z-10">
                ⭐ Popular
              </div>
              
              {/* Icon and Arrow */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-2xl">
                  📄
                </div>
                <ArrowRightIcon className="h-5 w-5 text-indigo-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-300" />
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                General Documents
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Any document requiring proof-of-existence and timestamp verification
              </p>

              {/* Role Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500 dark:text-slate-400">Authority:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Document Creator</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500 dark:text-slate-400">Owner:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Document Owner</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500 dark:text-slate-400">Verifier:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Anyone</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Updates</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Public</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-purple-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Flexible</span>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-2xl bg-indigo-500" />
            </Link>

            {/* Industry-Specific Use Cases */}
            {Object.entries(USE_CASES)
              .filter(([key]) => key !== 'general')
              .map(([key, useCase]) => (
              <Link
                key={key}
                href={`/create?type=${key}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 shadow-md shadow-slate-900/10 backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:shadow-slate-900/50"
              >
                {/* Icon and Arrow */}
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                    style={{ backgroundColor: `${useCase.metadata.primaryColor}20` }}
                  >
                    {useCase.icon}
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  {useCase.label}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {useCase.description}
                </p>

                {/* Role Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Authority:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{useCase.authorityRole}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Owner:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{useCase.ownerRole}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Verifier:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{useCase.verifierRole}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${useCase.allowsUpdates ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {useCase.allowsUpdates ? 'Updates' : 'Immutable'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${useCase.verificationRules.publicAccess ? 'bg-blue-400' : 'bg-purple-400'}`} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {useCase.verificationRules.publicAccess ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{ backgroundColor: useCase.metadata.primaryColor }}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA - Matching home page style */}
        <div className="text-center">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 shadow-md shadow-slate-900/10 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Not sure which use case fits your needs?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Learn more about ProofLedger
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:scale-105 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-600"
              >
                Skip to Create Proof
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}