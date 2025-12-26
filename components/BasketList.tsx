import React from 'react';
import { BasketItem } from '../types';
import { Trash2 } from 'lucide-react';

interface BasketListProps {
  items: BasketItem[];
  onRemoveItem: (uid: string) => void;
  onClear: () => void;
}

interface GroupedBasketItem {
  count: number;
  sample: BasketItem;
  uids: string[];
}

const BasketList: React.FC<BasketListProps> = ({ items, onRemoveItem, onClear }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-300">
        Tu lavadora está vacía
      </div>
    );
  }

  // Group by name for cleaner display, but keep track of UIDs for removal
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = { count: 0, sample: item, uids: [] };
    }
    acc[item.name].count++;
    acc[item.name].uids.push(item.uid);
    return acc;
  }, {} as Record<string, GroupedBasketItem>);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-sm font-semibold text-slate-700">En la canasta ({items.length})</h3>
         <button onClick={onClear} className="text-xs text-red-500 hover:text-red-700 underline">
            Vaciar todo
         </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {(Object.entries(groupedItems) as [string, GroupedBasketItem][]).map(([name, data]) => (
          <div key={name} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-slate-100">
             <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {data.count}
                </span>
                <span className="text-sm text-slate-700 font-medium">{name}</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {(data.sample.dryWeightKg * data.count).toFixed(2)} kg
                </span>
                <button
                  onClick={() => onRemoveItem(data.uids[0])} // Remove one instance
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  aria-label={`Eliminar un ${name}`}
                >
                  <Trash2 size={16} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasketList;