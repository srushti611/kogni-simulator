'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, ShieldCheck, ArrowRight, CheckCircle2, Download, FileText, Layers } from 'lucide-react';

export default function Home() {
  const [annualRevenue, setAnnualRevenue] = useState<number>(15000000);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(10000);
  const [aov, setAov] = useState<number>(120);
  const [frictionLevel, setFrictionLevel] = useState<number>(3);
  const [showProposal, setShowProposal] = useState<boolean>(false);

  // Financial Engine Calculations
  const annualGMV = monthlyOrders * aov * 12;
  const manualProcessCost = monthlyOrders * 4.50 * 12;
  const automatedProcessCost = monthlyOrders * 0.65 * 12;
  const laborSavings = manualProcessCost - automatedProcessCost;
  const recoveryRate = 0.01 + (frictionLevel * 0.005); 
  const revenueRecovery = annualGMV * recoveryRate;
  const totalAnnualBenefit = laborSavings + revenueRecovery;
  const estimatedImplementationCost = Math.round(annualRevenue * 0.018); 
  const paybackMonths = ((estimatedImplementationCost / totalAnnualBenefit) * 12).toFixed(1);

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#111111] p-6 md:p-12 font-sans selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Header Banner */}
        <header className="mb-12 border-b-2 border-[#111111] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <div className="inline-block bg-[#111111] text-white px-3 py-1 text-xs font-black tracking-widest uppercase mb-3">
              KogniVera Pre-Sales Practice
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              ROI & Digital <br />
              <span className="text-red-600 underline decoration-4 underline-offset-8">Transformation</span>
            </h1>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <button 
              onClick={() => setShowProposal(!showProposal)}
              className="bg-[#111111] hover:bg-red-600 text-white px-6 py-3 rounded-none text-xs font-black tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              {showProposal ? "Close Proposal" : "Executive Proposal"}
            </button>
          </div>
        </header>

        {/* High-Contrast Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form (Span 5) */}
          <div className="lg:col-span-5 bg-white p-8 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Calculator className="w-5 h-5 text-red-600" />
                Baseline Metrics
              </h2>
              <span className="text-xs font-bold bg-gray-100 px-2.5 py-1 text-gray-700">MODIFIABLE</span>
            </div>

            <div className="space-y-6">
              {/* Annual Revenue */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Annual Enterprise Revenue: <span className="text-red-600 font-black">${annualRevenue.toLocaleString()}</span>
                </label>
                <input 
                  type="range" 
                  min="1000000" 
                  max="100000000" 
                  step="1000000"
                  value={annualRevenue} 
                  onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-gray-200 rounded-none"
                />
              </div>

              {/* Monthly Orders */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Monthly Order Volume: <span className="text-red-600 font-black">{monthlyOrders.toLocaleString()} orders</span>
                </label>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={monthlyOrders} 
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-gray-200 rounded-none"
                />
              </div>

              {/* AOV */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Average Order Value (AOV): <span className="text-red-600 font-black">${aov}</span>
                </label>
                <input 
                  type="range" 
                  min="30" 
                  max="500" 
                  step="5"
                  value={aov} 
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-gray-200 rounded-none"
                />
              </div>

              {/* Friction Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Legacy System Friction Score (1-5): <span className="text-red-600 font-black">{frictionLevel} / 5</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1"
                  value={frictionLevel} 
                  onChange={(e) => setFrictionLevel(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-gray-200 rounded-none"
                />
                <p className="text-[11px] text-gray-500 mt-1 uppercase font-medium">1 = Minimal sync errors, 5 = Severe data silos</p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Results Dashboard (Span 7) */}
          <div className="lg:col-span-7 bg-[#111111] text-white p-8 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#DC2626] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Financial Impact Model
                </h2>
                <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 uppercase tracking-widest">Live Engine</span>
              </div>

              {/* Big Metric Callout */}
              <div className="bg-[#1A1A1A] p-6 border border-gray-800 text-center mb-6">
                <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Estimated Net Annual Benefit</span>
                <div className="text-4xl md:text-6xl font-black text-red-500 mt-2 tracking-tighter">
                  ${Math.round(totalAnnualBenefit).toLocaleString()}
                </div>
                <p className="text-xs text-gray-400 mt-2">Combined operational labor savings & recovered inventory GMV</p>
              </div>

              {/* 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1A1A1A] p-4 border border-gray-800">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Labor Savings</span>
                  <span className="text-2xl font-black text-white mt-1 block">${Math.round(laborSavings).toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500">API Automation</span>
                </div>
                <div className="bg-[#1A1A1A] p-4 border border-gray-800">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Recovered GMV</span>
                  <span className="text-2xl font-black text-white mt-1 block">${Math.round(revenueRecovery).toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500">Stockout Prevention</span>
                </div>
                <div className="bg-[#1A1A1A] p-4 border border-gray-800">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Payback Period</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">{paybackMonths} Mo</span>
                  <span className="text-[10px] text-gray-500">Capital Velocity</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> KogniVera Enterprise Architecture
              </span>
              <span className="font-bold text-white uppercase tracking-wider">v2.0 Redux</span>
            </div>
          </div>

        </div>

        {/* Executive Proposal View Panel */}
        {showProposal && (
          <div className="mt-12 bg-white p-8 md:p-12 border-2 border-[#111111] shadow-[12px_12px_0px_0px_#111111] animate-fadeIn">
            <div className="border-b-2 border-[#111111] pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest bg-red-600 text-white px-2 py-1 font-bold">Client Deliverable</span>
                <h3 className="text-3xl font-black uppercase tracking-tight mt-2">Executive Transformation Summary</h3>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-[#111111] hover:bg-red-600 text-white px-6 py-3 text-xs font-black tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Report PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-[#111111]">
              <div className="space-y-4">
                <h4 className="font-black uppercase text-base border-l-4 border-red-600 pl-3">Identified Operational Bottlenecks</h4>
                <p className="leading-relaxed font-medium">
                  Based on current enterprise metrics of <strong>${annualRevenue.toLocaleString()}</strong> in annual revenue and <strong>{monthlyOrders.toLocaleString()}</strong> monthly orders, manual data reconciliation between legacy ERP platforms and headless endpoints is creating critical friction.
                </p>
                <p className="leading-relaxed font-medium">
                  With a friction score rated at <strong>{frictionLevel}/5</strong>, the organization suffers from stockout inaccuracies during traffic spikes, suppressing conversion rates.
                </p>
              </div>

              <div className="space-y-4 bg-[#F7F5F0] p-6 border-2 border-[#111111]">
                <h4 className="font-black uppercase text-base border-l-4 border-red-600 pl-3">Projected Financial Impact</h4>
                <ul className="space-y-3 font-medium">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span><strong>Net Annual Benefit:</strong> ${Math.round(totalAnnualBenefit).toLocaleString()}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span><strong>Estimated Investment:</strong> ${estimatedImplementationCost.toLocaleString()}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span><strong>Capital Payback Period:</strong> {paybackMonths} Months</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}