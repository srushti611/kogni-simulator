'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calculator, TrendingUp, ShieldCheck, Download, FileText, 
  Layers, ArrowRight, Code2, Server, Database, RefreshCw, CheckCircle2, 
  Sliders, ArrowRightLeft, AlertTriangle, AlertOctagon, Terminal, Play, Pause, RotateCcw, Printer
} from 'lucide-react';

interface MappingPair {
  id: string;
  sourceField: string;
  sourceType: string;
  targetField: string;
  targetType: string;
  transformation: string;
  status: 'valid' | 'warning';
}

interface LogEvent {
  id: string;
  timestamp: string;
  sku: string;
  eventType: 'INVENTORY_SYNC' | 'PRICE_UPDATE' | 'CATALOG_INGEST';
  status: 'SUCCESS' | 'DISCREPANCY' | 'DLQ_ROUTED';
  message: string;
  details?: string;
}

export default function Home() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'roi' | 'frs'>('frs');
  const [activeFrsSection, setActiveFrsSection] = useState<'arch' | 'flows' | 'mapper' | 'errors' | 'payloads'>('arch');

  // Interactive Mapping State
  const [mappings, setMappings] = useState<MappingPair[]>([
    { id: '1', sourceField: 'SAP_MAT_NO', sourceType: 'VARCHAR(18)', targetField: 'masterVariant.sku', targetType: 'String', transformation: 'Trim & Uppercase', status: 'valid' },
    { id: '2', sourceField: 'AVAIL_QTY', sourceType: 'INT', targetField: 'inventory.quantityOnStock', targetType: 'Number', transformation: 'Direct Pass-through', status: 'valid' },
    { id: '3', sourceField: 'LIST_PRICE_INR', sourceType: 'DECIMAL(10,2)', targetField: 'masterVariant.prices[0].value.centAmount', targetType: 'Int64', transformation: 'Multiply x 100 (Cents)', status: 'valid' },
    { id: '4', sourceField: 'PROD_DESC_EN', sourceType: 'TEXT', targetField: 'name.en-IN', targetType: 'LocalizedString', transformation: 'Sanitize HTML', status: 'valid' },
  ]);

  const [selectedSource, setSelectedSource] = useState('TAX_CATEGORY_CODE');
  const [selectedTarget, setSelectedTarget] = useState('taxCategory.id');
  const [selectedTransform, setSelectedTransform] = useState('Lookup UUID');

  const handleAddMapping = () => {
    if (!selectedSource || !selectedTarget) return;
    const newPair: MappingPair = {
      id: Date.now().toString(),
      sourceField: selectedSource,
      sourceType: 'VARCHAR(10)',
      targetField: selectedTarget,
      targetType: 'String / Reference',
      transformation: selectedTransform,
      status: 'valid'
    };
    setMappings([...mappings, newPair]);
  };

  // Live Error Stream State
  const [logs, setLogs] = useState<LogEvent[]>([
    { id: '101', timestamp: '00:14:02.102', sku: 'SKU-99021', eventType: 'INVENTORY_SYNC', status: 'SUCCESS', message: 'Stock update set to 425 units' },
    { id: '102', timestamp: '00:14:03.450', sku: 'SKU-88104', eventType: 'PRICE_UPDATE', status: 'DISCREPANCY', message: 'Currency code missing in SAP payload', details: 'Field CURRENCY_ISO is NULL. Expected INR/USD.' },
    { id: '103', timestamp: '00:14:04.110', sku: 'SKU-88104', eventType: 'PRICE_UPDATE', status: 'DLQ_ROUTED', message: 'Routed to Dead Letter Queue (DLQ-PRICES)', details: 'Retry 3/3 failed. Escalated to Ops.' },
    { id: '104', timestamp: '00:14:05.890', sku: 'SKU-77033', eventType: 'CATALOG_INGEST', status: 'SUCCESS', message: 'Master variant registered successfully' },
  ]);

  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  // Simulated Log Event Stream
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const randomSkus = ['SKU-10203', 'SKU-44091', 'SKU-55102', 'SKU-99812'];
      const randomSku = randomSkus[Math.floor(Math.random() * randomSkus.length)];
      const isError = Math.random() < 0.35;
      
      const newLog: LogEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString().substring(11, 23),
        sku: randomSku,
        eventType: isError ? 'PRICE_UPDATE' : 'INVENTORY_SYNC',
        status: isError ? 'DISCREPANCY' : 'SUCCESS',
        message: isError ? 'Negative stock quantity detected (-5)' : 'Stock level synchronized',
        details: isError ? 'SAP warehouse WH-BLR-01 reported negative ledger count.' : undefined
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 14)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // ROI Simulator States
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
        
        {/* Header Banner */}
        <header className="mb-8 border-b-2 border-[#111111] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-white p-3 border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] flex-shrink-0">
              <Image 
                src="/kognivera-logo.png" 
                alt="KogniVera Logo" 
                width={52} 
                height={52} 
                className="object-contain"
              />
            </div>
            <div>
              <div className="inline-block bg-[#111111] text-white px-3 py-1 text-xs font-black tracking-widest uppercase mb-1">
                KogniVera Enterprise Architecture Practice
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                Enterprise Integration <span className="text-red-600">Blueprint</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {activeTab === 'frs' && (
              <button 
                onClick={() => window.print()}
                className="bg-red-600 hover:bg-[#111111] text-white px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111]"
              >
                <Printer className="w-4 h-4" /> Export Spec PDF
              </button>
            )}

            {/* Main Module Switcher */}
            <div className="flex border-2 border-[#111111] bg-white shadow-[4px_4px_0px_0px_#111111]">
              <button 
                onClick={() => setActiveTab('frs')}
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
                  activeTab === 'frs' 
                    ? 'bg-[#111111] text-white' 
                    : 'bg-white text-[#111111] hover:bg-gray-100'
                }`}
              >
                Module 1: FRS Specification
              </button>
              <button 
                onClick={() => setActiveTab('roi')}
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-colors border-l-2 border-[#111111] ${
                  activeTab === 'roi' 
                    ? 'bg-[#111111] text-white' 
                    : 'bg-white text-[#111111] hover:bg-gray-100'
                }`}
              >
                Module 2: ROI Simulator
              </button>
            </div>
          </div>
        </header>

        {/* MODULE 1: FRS & SYSTEM ARCHITECTURE VIEW */}
        {activeTab === 'frs' && (
          <div className="space-y-8">
            
            {/* Sub-Navigation Tabs */}
            <div className="flex flex-wrap border-b-2 border-[#111111] gap-3 pb-2 print:hidden">
              <button 
                onClick={() => setActiveFrsSection('arch')}
                className={`text-xs font-black uppercase tracking-wider px-4 py-2 border-2 border-[#111111] transition-all ${
                  activeFrsSection === 'arch' 
                    ? 'bg-red-600 text-white shadow-[3px_3px_0px_0px_#111111]' 
                    : 'bg-white text-[#111111] hover:bg-gray-100'
                }`}
              >
                1. Architecture
              </button>
              <button 
                onClick={() => setActiveFrsSection('flows')}
                className={`text-xs font-black uppercase tracking-wider px-4 py-2 border-2 border-[#111111] transition-all ${
                  activeFrsSection === 'flows' 
                    ? 'bg-red-600 text-white shadow-[3px_3px_0px_0px_#111111]' 
                    : 'bg-white text-[#111111] hover:bg-gray-100'
                }`}
              >
                2. Sync Data Flows
              </button>
              <button 
                onClick={() => setActiveFrsSection('mapper')}
                className={`text-xs font-black uppercase tracking-wider px-4 py-2 border-2 border-[#111111] transition-all ${
                  activeFrsSection === 'mapper' 
                    ? 'bg-red-600 text-white shadow-[3px_3px_0px_0px_#111111]' 
                    : 'bg-white text-[#111111] hover:bg-gray-100'
                }`}
              >
                3. Schema Mapper
              </button>
              <button 
                onClick={() => setActiveFrsSection('errors')}
                className={`text-xs font-black uppercase tracking-wider px-4 py-2 border-2 border-[#111111] transition-all ${
                  activeFrsSection === 'errors' 
                    ? 'bg-red-600 text-white shadow-[3px_3px_0px_0px_#111111]' 
                    : 'bg-white text-[#111111] hover:bg-gray-100'
                }`}
              >
                4. Discrepancy & Error Engine
              </button>
              <button 
                onClick={() => setActiveFrsSection('payloads')}
                className={`text-xs font-black uppercase tracking-wider px-4 py-2 border-2 border-[#111111] transition-all ${
                  activeFrsSection === 'payloads' 
                    ? 'bg-red-600 text-white shadow-[3px_3px_0px_0px_#111111]' 
                    : 'bg-white text-[#111111] hover:bg-gray-100'
                }`}
              >
                5. API Contracts
              </button>
            </div>

            {/* SECTION 1: ARCHITECTURE */}
            {activeFrsSection === 'arch' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111]">
                  <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3 mb-4">
                    <span className="text-xs font-black uppercase bg-gray-200 px-2 py-0.5">Source Systems</span>
                    <Server className="w-5 h-5 text-[#111111]" />
                  </div>
                  <h3 className="font-black uppercase text-lg mb-2">Legacy ERP / PIM</h3>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium mb-4">
                    Monolithic SAP S/4HANA & custom SQL databases housing master SKU records.
                  </p>
                  <div className="bg-[#F7F5F0] p-3 border border-[#111111] text-[11px] font-mono space-y-1">
                    <div>• Sync Protocol: SFTP Batch / SOAP</div>
                  </div>
                </div>

                <div className="bg-[#111111] text-white p-6 border-2 border-[#111111] shadow-[6px_6px_0px_0px_#DC2626]">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                    <span className="text-xs font-black uppercase bg-red-600 text-white px-2 py-0.5">Integration Engine</span>
                    <RefreshCw className="w-5 h-5 text-red-500 animate-spin" />
                  </div>
                  <h3 className="font-black uppercase text-lg mb-2 text-white">KogniVera Sync Hub</h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium mb-4">
                    Event-driven middleware tier utilizing message queues & DLQ failover handlers.
                  </p>
                  <div className="bg-[#1A1A1A] p-3 border border-gray-800 text-[11px] font-mono space-y-1 text-gray-300">
                    <div>• Message Queue: Kafka / DLQ</div>
                  </div>
                </div>

                <div className="bg-white p-6 border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111]">
                  <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3 mb-4">
                    <span className="text-xs font-black uppercase bg-gray-200 px-2 py-0.5">Target Platform</span>
                    <Database className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-black uppercase text-lg mb-2">Commercetools APIs</h3>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium mb-4">
                    Headless commerce platform providing REST & GraphQL endpoints.
                  </p>
                  <div className="bg-[#F7F5F0] p-3 border border-[#111111] text-[11px] font-mono space-y-1">
                    <div>• API Architecture: REST & GraphQL</div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: DATA FLOWS */}
            {activeFrsSection === 'flows' && (
              <div className="bg-white p-8 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111]">
                <h3 className="font-black uppercase text-xl border-b-2 border-[#111111] pb-4 mb-6">Functional Requirement Data Flows</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#F7F5F0] border-2 border-[#111111] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="bg-[#111111] text-white text-[10px] font-bold px-2 py-0.5 uppercase">REQ-01</span>
                      <h4 className="font-black text-sm uppercase mt-1">Real-Time Inventory Stock Level Synchronization</h4>
                      <p className="text-xs text-gray-700 font-medium mt-1">Trigger delta update to Commercetools Inventory Items endpoint when stock shifts.</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-red-600 bg-white px-3 py-1.5 border border-[#111111]">SLA: &lt; 2.0s</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: SCHEMA MAPPER */}
            {activeFrsSection === 'mapper' && (
              <div className="space-y-8">
                <div className="bg-white p-6 border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111] print:hidden">
                  <h3 className="font-black uppercase text-sm mb-4 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-red-600" />
                    Configure New Schema Mapping Rule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Source (SAP ERP Field)</label>
                      <select 
                        value={selectedSource} 
                        onChange={(e) => setSelectedSource(e.target.value)}
                        className="w-full bg-[#F7F5F0] border-2 border-[#111111] p-2 text-xs font-bold"
                      >
                        <option value="TAX_CATEGORY_CODE">TAX_CATEGORY_CODE</option>
                        <option value="EAN_BARCODE">EAN_BARCODE</option>
                        <option value="CURRENCY_ISO">CURRENCY_ISO</option>
                        <option value="BRAND_ID">BRAND_ID</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Transformation Logic</label>
                      <select 
                        value={selectedTransform} 
                        onChange={(e) => setSelectedTransform(e.target.value)}
                        className="w-full bg-[#F7F5F0] border-2 border-[#111111] p-2 text-xs font-bold"
                      >
                        <option value="Lookup UUID">Lookup UUID</option>
                        <option value="Direct Pass-through">Direct Pass-through</option>
                        <option value="Sanitize String">Sanitize String</option>
                        <option value="Map Enum Value">Map Enum Value</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">Target (Commercetools Field)</label>
                      <select 
                        value={selectedTarget} 
                        onChange={(e) => setSelectedTarget(e.target.value)}
                        className="w-full bg-[#F7F5F0] border-2 border-[#111111] p-2 text-xs font-bold"
                      >
                        <option value="taxCategory.id">taxCategory.id</option>
                        <option value="masterVariant.key">masterVariant.key</option>
                        <option value="prices[0].value.currencyCode">prices[0].value.currencyCode</option>
                        <option value="categories[0].id">categories[0].id</option>
                      </select>
                    </div>

                    <button 
                      onClick={handleAddMapping}
                      className="bg-red-600 hover:bg-[#111111] text-white p-2.5 text-xs font-black uppercase tracking-wider border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] transition-colors cursor-pointer"
                    >
                      + Add Mapping Rule
                    </button>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] overflow-x-auto">
                  <div className="bg-[#111111] text-white p-4 flex justify-between items-center">
                    <h3 className="font-black uppercase text-sm tracking-wide">Active Enterprise Data Mapping Schema</h3>
                    <span className="text-[10px] font-mono bg-red-600 text-white px-2 py-0.5 uppercase">{mappings.length} Rules Active</span>
                  </div>
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b-2 border-[#111111] bg-[#F7F5F0] font-black uppercase">
                        <th className="p-3 border-r-2 border-[#111111]">Legacy Field</th>
                        <th className="p-3 border-r-2 border-[#111111]">Transformation</th>
                        <th className="p-3 border-r-2 border-[#111111]">Target Field</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-[#111111]">
                      {mappings.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold border-r-2 border-[#111111]">{m.sourceField}</td>
                          <td className="p-3 border-r-2 border-[#111111] text-red-600 font-bold">{m.transformation}</td>
                          <td className="p-3 font-bold border-r-2 border-[#111111] text-emerald-700">{m.targetField}</td>
                          <td className="p-3 text-emerald-600 font-bold">VERIFIED</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 4: DISCREPANCY & ERROR ENGINE */}
            {activeFrsSection === 'errors' && (
              <div className="space-y-8">
                <div className="bg-white p-6 border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111] flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5">Middleware Telemetry</span>
                    <h3 className="font-black uppercase text-xl mt-1 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-red-600" />
                      Live Sync Event Stream & DLQ Monitor
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsStreaming(!isStreaming)}
                    className={`px-4 py-2 text-xs font-black uppercase border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111] flex items-center gap-2 cursor-pointer ${
                      isStreaming ? 'bg-amber-400 text-[#111111]' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isStreaming ? 'Pause Stream' : 'Resume Stream'}
                  </button>
                </div>

                <div className="bg-[#111111] text-white p-6 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#DC2626] font-mono">
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                    {logs.map((log) => (
                      <div key={log.id} className="p-3 border border-gray-800 bg-[#1A1A1A] text-xs flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-[10px]">{log.timestamp}</span>
                          <span className="font-bold text-white bg-gray-800 px-1.5 py-0.5 text-[10px]">{log.sku}</span>
                          <span>{log.message}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/40 px-2 py-0.5">{log.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: PAYLOADS */}
            {activeFrsSection === 'payloads' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#111111] text-white p-6 border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111]">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                    <span className="text-xs font-mono text-gray-400">INPUT: SAP ERP Raw Payload</span>
                    <Code2 className="w-4 h-4 text-red-500" />
                  </div>
                  <pre className="font-mono text-[11px] text-gray-300 leading-relaxed bg-[#1A1A1A] p-4 border border-gray-800 overflow-x-auto">
{`{
  "SAP_MAT_NO": "SKU-99021",
  "WAREHOUSE_ID": "WH-BLR-01",
  "AVAIL_QTY": 450,
  "RESERVED_QTY": 25,
  "LAST_UPDATED": "2026-10-02T00:15:00Z"
}`}
                  </pre>
                </div>

                <div className="bg-[#111111] text-white p-6 border-2 border-[#111111] shadow-[6px_6px_0px_0px_#DC2626]">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                    <span className="text-xs font-mono text-emerald-400">OUTPUT: Commercetools Schema</span>
                    <Code2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <pre className="font-mono text-[11px] text-[#A6E22E] leading-relaxed bg-[#1A1A1A] p-4 border border-gray-800 overflow-x-auto">
{`{
  "sku": "SKU-99021",
  "quantityOnStock": 425,
  "channel": {
    "typeId": "channel",
    "id": "wh-blr-01-uuid"
  },
  "action": "setQuantity"
}`}
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODULE 2: CLIENT ROI SIMULATOR VIEW */}
        {activeTab === 'roi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-8 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-red-600" />
                  Baseline Metrics
                </h2>
                <span className="text-xs font-bold bg-gray-100 px-2.5 py-1 text-gray-700">MODIFIABLE</span>
              </div>

              <div className="space-y-6">
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
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#111111] text-white p-8 border-2 border-[#111111] shadow-[8px_8px_0px_0px_#DC2626] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                  <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    Financial Impact Model
                  </h2>
                  <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 uppercase tracking-widest">Live Engine</span>
                </div>

                <div className="bg-[#1A1A1A] p-6 border border-gray-800 text-center mb-6">
                  <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Estimated Net Annual Benefit</span>
                  <div className="text-4xl md:text-6xl font-black text-red-500 mt-2 tracking-tighter">
                    ${Math.round(totalAnnualBenefit).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#1A1A1A] p-4 border border-gray-800">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Labor Savings</span>
                    <span className="text-2xl font-black text-white mt-1 block">${Math.round(laborSavings).toLocaleString()}</span>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 border border-gray-800">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Recovered GMV</span>
                    <span className="text-2xl font-black text-white mt-1 block">${Math.round(revenueRecovery).toLocaleString()}</span>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 border border-gray-800">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Payback Period</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 block">{paybackMonths} Mo</span>
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
        )}

      </div>
    </main>
  );
}