"use client";
import { Plus, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { getFromStorage, setToStorage, saveToHistory } from "@/component";

/* ----------------------------------------------------
   Reusable Expert Query Component
---------------------------------------------------- */

export default function ExpertQuerySection({
  items,
  setItems,
  experts = [],
  historyKey = "expertNames",
}: {
  items: { expert: string; query: string }[];
  setItems: (items: { expert: string; query: string }[]) => void;
  experts?: string[];
  historyKey?: "expertNames";
}) {
  function addItem() {
    setItems([...items, { expert: "", query: "" }]);
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, patch: Partial<{ expert: string; query: string }>) {
    setItems(items.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  }

  return (
    <div className="relative pb-12 pt-2 px-3 border rounded-xl border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-gray-900">Any Query from Expert</label>

        <button
          onClick={addItem}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <ExpertQueryRow
            key={idx}
            index={idx}
            item={item}
            experts={experts}
            historyKey={historyKey}
            onChange={(patch) => updateItem(idx, patch)}
            onRemove={() => removeItem(idx)}
            showRemove={items.length > 1}
          />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   Row Component
---------------------------------------------------- */

function ExpertQueryRow({
  item,
  index,
  experts,
  onChange,
  onRemove,
  showRemove,
  historyKey,
}: {
  item: { expert: string; query: string };
  index: number;
  experts: string[];
  historyKey: string;
  onChange: (patch: Partial<{ expert: string; query: string }>) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  return (
    <div className="relative p-4 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm">
      {showRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full 
                     border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Expert Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Expert Name *</label>
          <ExpertSelectInput
            value={item.expert}
            onChange={(val) => onChange({ expert: val })}
            options={experts}
            historyKey={historyKey}
          />
        </div>

        {/* Query/Remarks */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Query/Remarks *</label>
          <input
            value={item.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Describe your query"
            className="w-full px-3 py-2.5 border-2 border-gray-300 text-sm rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   Expert Autocomplete Dropdown
---------------------------------------------------- */

function ExpertSelectInput({
  value,
  onChange,
  options,
  historyKey,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  historyKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getFromStorage(historyKey));
  }, [historyKey]);

  const combinedList = useMemo(() => {
    const all = Array.from(new Set([...history, ...options]));
    if (!search) return all;
    return all.filter((x) => x.toLowerCase().includes(search.toLowerCase()));
  }, [history, options, search]);

  function selectExpert(name: string) {
    onChange(name);
    saveToHistory(historyKey, name);
    setHistory(getFromStorage(historyKey));
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 border-2 border-gray-300 
                   rounded-lg bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || "Select expert"}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            <input
              type="text"
              placeholder="Search expert..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border-b border-gray-100 text-sm outline-none"
            />

            {combinedList.length > 0 ? (
              combinedList.map((name, idx) => (
                <button
                  key={idx}
                  onClick={() => selectExpert(name)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 border-b border-gray-100 last:border-0"
                >
                  {name}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-gray-400 text-sm">
                No expert found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
