import React from 'react';
import { ClothingItem } from '../types';
import { CLOTHING_PRESETS } from '../constants';
import * as Icons from 'lucide-react';

interface ItemSelectorProps {
  onAddItem: (item: ClothingItem) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ onAddItem }) => {
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {CLOTHING_PRESETS.map((item) => {
        // Dynamic icon rendering
        // @ts-ignore
        const IconComponent = Icons[item.icon] || Icons.HelpCircle;

        return (
          <button
            key={item.id}
            onClick={() => onAddItem(item)}
            className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all active:scale-95 shadow-sm"
          >
            <div className="p-2 mb-2 rounded-full bg-slate-100 text-blue-600">
              <IconComponent size={20} />
            </div>
            <span className="text-xs font-medium text-slate-700">{item.name}</span>
            <span className="text-[10px] text-slate-400">{item.dryWeightKg} kg</span>
          </button>
        );
      })}
    </div>
  );
};

export default ItemSelector;