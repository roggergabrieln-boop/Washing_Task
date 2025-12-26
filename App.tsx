import React, { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WashingMachine, Settings, Sparkles } from 'lucide-react';
import { BasketItem, ClothingItem, LoadStatus } from './types';
import { DEFAULT_CAPACITY } from './constants';
import ItemSelector from './components/ItemSelector';
import BasketList from './components/BasketList';
import LoadVisualizer from './components/LoadVisualizer';
import { getLaundryAdvice } from './services/geminiService';

function App() {
  const [capacity, setCapacity] = useState<number>(DEFAULT_CAPACITY);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // --- Logic ---
  const handleAddItem = (item: ClothingItem) => {
    const newItem: BasketItem = { ...item, uid: uuidv4() };
    setBasket((prev) => [...prev, newItem]);
    setAiAdvice(null); // Clear old advice when state changes
  };

  const handleRemoveItem = (uid: string) => {
    setBasket((prev) => {
        const index = prev.findIndex(i => i.uid === uid);
        if (index === -1) return prev;
        const newBasket = [...prev];
        newBasket.splice(index, 1);
        return newBasket;
    });
    setAiAdvice(null);
  };

  const handleClearBasket = () => {
    setBasket([]);
    setAiAdvice(null);
  };

  // Calculations
  const stats = useMemo(() => {
    let dryWeight = 0;
    let wetWeight = 0;

    basket.forEach((item) => {
      dryWeight += item.dryWeightKg;
      // Wet weight formula: Dry + (Dry * Absorption)
      wetWeight += item.dryWeightKg * (1 + item.absorptionFactor);
    });

    let status = LoadStatus.OPTIMAL;
    if (dryWeight > capacity) {
      status = LoadStatus.OVERLOAD;
    } else if (dryWeight > capacity * 0.8) {
      status = LoadStatus.HEAVY;
    }

    return { dryWeight, wetWeight, status };
  }, [basket, capacity]);

  const handleGetAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getLaundryAdvice(basket, stats.dryWeight, capacity);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <WashingMachine size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">LavaSmart</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Calculadora de Carga</p>
          </div>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className={`p-2 rounded-full transition-colors ${showConfig ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Config Panel (Collapsible) */}
        {showConfig && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 animate-in slide-in-from-top-4 fade-in duration-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Capacidad de tu lavadora (kg)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="4"
                max="20"
                step="0.5"
                value={capacity}
                onChange={(e) => setCapacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-lg font-bold text-blue-600 min-w-[3rem] text-right">
                {capacity}kg
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Consulta el manual de tu lavadora para saber el peso máximo de ropa seca.
            </p>
          </div>
        )}

        {/* Visualizer */}
        <section>
          <LoadVisualizer
            dryWeight={stats.dryWeight}
            wetWeight={stats.wetWeight}
            capacity={capacity}
            status={stats.status}
          />
          {stats.status === LoadStatus.OVERLOAD && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <span className="font-bold text-lg">⚠️</span>
              <p>¡Cuidado! Has excedido la capacidad nominal. El peso mojado será excesivo y podría dañar la lavadora.</p>
            </div>
          )}
           {stats.status === LoadStatus.HEAVY && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
               Estás cerca del límite. Considera lavar prendas pesadas como jeans por separado.
            </div>
          )}
        </section>

        {/* Item Selector */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Agregar Prendas</h2>
          <ItemSelector onAddItem={handleAddItem} />
        </section>

        {/* Basket List */}
        <section>
          <BasketList items={basket} onRemoveItem={handleRemoveItem} onClear={handleClearBasket} />
        </section>

        {/* AI Advice Section */}
        <section className="pt-2">
           {!aiAdvice ? (
             <button
              onClick={handleGetAdvice}
              disabled={basket.length === 0 || isAiLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isAiLoading ? (
                  <span className="animate-pulse">Analizando...</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analizar Carga con IA
                  </>
                )}
             </button>
           ) : (
             <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl relative">
                <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold">
                  <Sparkles size={16} />
                  <span>Consejo Inteligente</span>
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {aiAdvice}
                </div>
                <button 
                  onClick={() => setAiAdvice(null)} 
                  className="absolute top-2 right-2 text-indigo-300 hover:text-indigo-500"
                >
                  ✕
                </button>
             </div>
           )}
        </section>

      </main>
    </div>
  );
}

export default App;