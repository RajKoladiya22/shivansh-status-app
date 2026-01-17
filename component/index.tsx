// component/index.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X, Search, Copy, Check, Clock, ChevronDown } from "lucide-react";

/*
  Refactored single-file React component with destructured subcomponents.
  - Tailwind CSS for styling (keeps same look & feel)
  - Accessible listbox/autocomplete behavior for product picker & history
  - Component decomposition: Header, HistoryPanel, ProductSearchSelect,
    AutocompleteInput, TaskItem, TaskList, Preview
  - Validation: Copy button disabled until required fields present
  - LocalStorage helpers encapsulated
*/

/* ----------------------------- Utilities ----------------------------- */
export const STORAGE_KEYS: Record<string, string> = {
  products: "si_products",
  tlNames: "si_tlNames",
  projectNames: "si_projectNames",
  yourNames: "si_yourNames",
  statusUpdates: "si_statusUpdates",
};

export const DEFAULT_PRODUCTS = [
  "GST Reconciliation",
  "RTGS Reconciliation",
  "Invoice Management",
  "Expense Tracker",
  "Payroll System",
  "Inventory Management",
  "CRM Dashboard",
  "Analytics Platform",
  "Report Generator",
  "Data Migration Tool",
];

export function safeParse<T = any>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getFromStorage(key: keyof typeof STORAGE_KEYS) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    if (!raw) return key === "products" ? [...DEFAULT_PRODUCTS] : [];
    return safeParse(raw, key === "products" ? [...DEFAULT_PRODUCTS] : []);
  } catch {
    return key === "products" ? [...DEFAULT_PRODUCTS] : [];
  }
}

export function setToStorage(key: keyof typeof STORAGE_KEYS, value: any) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (e) {
    // fail silently
    // optionally: console.error(e)
  }
}

export function saveToHistory(key: keyof typeof STORAGE_KEYS, value: string) {
  if (!value || !value.trim()) return;
  const current = getFromStorage(key);
  if (!current.includes(value)) {
    const updated = [value, ...current].slice(0, 10);
    setToStorage(key, updated);
  }
}

export function saveStatusUpdate(payload: any) {
  const newUpdate = { ...payload, date: new Date().toISOString() };
  const current = getFromStorage("statusUpdates");
  const updated = [newUpdate, ...current].slice(0, 50);
  setToStorage("statusUpdates", updated);
}

export function getRecentUpdates(days = 7) {
  const updates = getFromStorage("statusUpdates");
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return updates.filter((u: any) => new Date(u.date) >= cutoff);
}

/* ----------------------------- Subcomponents ----------------------------- */

/* Header with brand and history toggle */
export function Header({
  hasHistory,
  showHistory,
  onToggleHistory,
  teamName,
}: {
  hasHistory?: boolean;
  showHistory?: boolean;
  onToggleHistory?: () => void;
  teamName: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="logo" className="h-10 w-auto" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">
                SHIVANSH INFOSYS
              </h1>
              <p className="text-xs text-gray-500">{teamName} — Daily Status</p>
            </div>
          </a>
        </div>

        {hasHistory && (
          <button
            aria-expanded={showHistory}
            onClick={onToggleHistory}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          >
            <Clock className="w-4 h-4" />
            <span className="text-black">History</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showHistory ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}

/* History panel */
export function HistoryPanel({
  updates,
  onLoad,
}: {
  updates: any[];
  onLoad: (u: any) => void;
}) {
  if (!updates.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 mb-4">
      <h3 className="font-bold text-base text-gray-900 mb-3">
        Recent Updates (Last 7 Days)
      </h3>
      <div className="space-y-2 max-h-80 overflow-auto">
        {updates.map((update: any, idx: number) => (
          <button
            key={idx}
            onClick={() => onLoad(update)}
            className="w-full text-left p-3 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {update.projectName || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(update.date).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="text-xs bg-blue-500 text-white px-2.5 py-1 rounded-md">
                Load
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ProductSearchSelect: accessible combobox-like picker */
export function ProductSearchSelect({
  onSelect,
  initialValue = "",
}: {
  onSelect: (p: string) => void;
  initialValue?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(initialValue);
  const [products, setProducts] = useState<string[]>(() =>
    getFromStorage("products")
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setSelected(initialValue), [initialValue]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter((p) =>
      p.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  function handleSelect(p: string) {
    setSelected(p);
    setSearch("");
    setIsOpen(false);
    onSelect(p);
    inputRef.current?.blur();
  }

  function handleAddNew() {
    const candidate = search.trim();
    if (!candidate) return;
    if (!products.includes(candidate)) {
      const updated = [candidate, ...products].slice(0, 50);
      setProducts(updated);
      setToStorage("products", updated);
    }
    handleSelect(candidate);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length === 0) handleAddNew();
      else handleSelect(filtered[0]);
    }
    if (e.key === "Escape") setIsOpen(false);
  }

  return (
    <div className="relative">
      <label className="sr-only">Product</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          value={isOpen ? search : selected}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search or add product..."
          className="text-black w-full px-3 py-2.5 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {filtered.length > 0 ? (
              filtered.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(p)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors text-sm border-b border-gray-100 last:border-0"
                >
                  {p}
                </button>
              ))
            ) : search.trim() ? (
              <button
                onClick={handleAddNew}
                className="w-full px-4 py-3 text-left hover:bg-green-50 text-green-600 font-semibold"
              >
                ✓ Add "{search}"
              </button>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                Type to search or add product...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* AutocompleteInput with lightweight history suggestions */
export function AutocompleteInput({
  value,
  onChange,
  placeholder,
  historyKey,
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  historyKey: keyof typeof STORAGE_KEYS;
}) {
  const [show, setShow] = useState(false);
  const [history, setHistory] = useState<string[]>(() =>
    getFromStorage(historyKey)
  );

  useEffect(() => setHistory(getFromStorage(historyKey)), [historyKey]);

  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    return history
      .filter(
        (h) => h.toLowerCase().includes(value.toLowerCase()) && h !== value
      )
      .slice(0, 5);
  }, [value, history]);

  function handleBlur(v: string) {
    setTimeout(() => setShow(false), 150);
    if (v.trim()) {
      saveToHistory(historyKey, v.trim());
      setHistory(getFromStorage(historyKey));
    }
  }

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShow(true);
        }}
        onFocus={() => setShow(true)}
        onBlur={(e) => handleBlur(e.target.value)}
        placeholder={placeholder}
        className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
      />

      {show && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-40 overflow-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                onChange(s);
                setShow(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors text-sm flex items-center gap-2 border-b border-gray-100"
            >
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="truncate">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DynamicStatusSelect({
  value,
  onChange,
  statuses = [],
  allowAdd = true,
  placeholder = "Select status",
}: {
  value: string;
  onChange: (v: string) => void;
  statuses: string[];
  allowAdd?: boolean;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState<string[]>(statuses);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setList(statuses);
  }, [statuses]);

  const filtered = list.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const addNewStatus = () => {
    const v = search.trim();
    if (!v) return;
    if (!list.includes(v)) {
      const updated = [v, ...list];
      setList(updated);
      onChange(v);
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="relative w-full">
      {/* Trigger Input */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg 
                   bg-white flex items-center justify-between text-left
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="absolute z-20 mt-1 w-full bg-white border-2 border-gray-200 
                          rounded-lg shadow-xl max-h-60 overflow-auto"
          >
            {/* Search Bar */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search status..."
              className="w-full px-3 py-2 border-b border-gray-100 text-sm outline-none"
            />

            {/* List */}
            {filtered.length > 0 ? (
              filtered.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onChange(s);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 
                             border-b border-gray-100 last:border-0"
                >
                  {s}
                </button>
              ))
            ) : allowAdd && search.trim() ? (
              <button
                onClick={addNewStatus}
                className="w-full px-4 py-3 text-left text-green-600 font-semibold hover:bg-green-50"
              >
                <Plus className="inline w-4 h-4 mr-1" />
                Add “{search}”
              </button>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                No status found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------
   TaskItem — UPDATED with optional DynamicStatusSelect
--------------------------------------------- */

export function TaskItem({
  value,
  onChange,
  onRemove,
  showRemove,
  enableStatus = false, // NEW
  statusList = [], // NEW
}: {
  value: string;
  onChange: (s: string) => void;
  onRemove: () => void;
  showRemove: boolean;
  enableStatus?: boolean; // NEW
  statusList?: string[]; // NEW
}) {
  const [product, setProduct] = useState("");
  const [customer, setCustomer] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(""); // NEW FIELD

  /* Parse existing value including optional status */
  useEffect(() => {
    const parts = value?.split(" - ") || [];

    setProduct(parts[0] || "");
    setCustomer(parts[1] || "");
    setComment(parts[2] || "");
    setStatus(parts[3] || ""); // status (if exists)
  }, [value]);

  /* Build final value string */
  function pushChange(p: string, c: string, com: string, st: string) {
    let composed = `${p} - ${c} - ${com}`;
    if (enableStatus) composed += ` - ${st || ""}`;
    onChange(composed);
  }

  return (
    <div className="relative space-y-2 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
      {/* Remove Button */}
      {showRemove && (
        <button
          onClick={onRemove}
          title="Remove"
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center
                     text-red-500 hover:text-white hover:bg-red-500 rounded-full 
                     border-2 border-red-300 hover:border-red-500 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Product + Customer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Product */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Product *
          </label>
          <ProductSearchSelect
            onSelect={(p) => {
              setProduct(p);
              pushChange(p, customer, comment, status);
            }}
            initialValue={product}
          />
        </div>

        {/* Customer */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Customer *
          </label>
          <input
            type="text"
            value={customer}
            onChange={(e) => {
              setCustomer(e.target.value);
              pushChange(product, e.target.value, comment, status);
            }}
            placeholder="Customer name"
            className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       outline-none transition-all text-sm bg-white"
          />
        </div>
      </div>

      {/* Status Selector (OPTIONAL) */}
      {enableStatus && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Status
          </label>

          <DynamicStatusSelect
            value={status}
            onChange={(v) => {
              setStatus(v);
              pushChange(product, customer, comment, v);
            }}
            statuses={statusList}
            placeholder="Select status"
          />
        </div>
      )}

      {/* Comment */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Comment
        </label>
        <input
          type="text"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            pushChange(product, customer, e.target.value, status);
          }}
          placeholder="Add comment or details"
          className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-all text-sm bg-white"
        />
      </div>
    </div>
  );
}

/* TaskList wrapper to manage an array of task strings */
export function TaskList({
  items,
  setItems,
  title,
  addColor,
  enableStatus = false,
  statusList = [],
}: {
  items: string[];
  setItems: (s: string[]) => void;
  title: string;
  addColor?: string;
  enableStatus?: boolean;
  statusList?: string[];
}) {
  function addItem() {
    setItems([...items, ""]);
  }
  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }
  function updateItem(idx: number, val: string) {
    setItems(items.map((it, i) => (i === idx ? val : it)));
  }

  return (
    <div className="relative pb-10 pt-2 px-2 border rounded-lg border-2 border-gray-200">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm font-bold text-gray-900">{title}</label>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <TaskItem
            key={idx}
            value={item}
            onChange={(v) => updateItem(idx, v)}
            onRemove={() => removeItem(idx)}
            showRemove={items.length > 1}
            enableStatus={enableStatus}
            statusList={statusList}
          />
        ))}
      </div>

      <button
        onClick={addItem}
        className={`absolute bottom-0 right-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-white transition-all shadow-md text-sm font-semibold ${
          addColor ?? "bg-blue-600"
        }`}
      >
        <Plus className="w-4 h-4" />
        Add
      </button>
    </div>
  );
}

/* ---------------------------------------------
   Single Learning Input Component
--------------------------------------------- */
export function LearningInput({
  value,
  onChange,
  onRemove,
  showRemove,
}: {
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  const [product, setProduct] = useState("");

  useEffect(() => {
    setProduct(value || "");
  }, [value]);

  const updateValue = (v: string) => {
    setProduct(v);
    onChange(v);
  };

  return (
    <div className="relative p-4 space-y-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
      {showRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center 
                     text-red-500 hover:text-white hover:bg-red-500 rounded-full 
                     border-2 border-red-300 hover:border-red-500 transition-all"
          title="Remove learning"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          What did you learn today? *
        </label>
        <input
          type="text"
          value={product}
          onChange={(e) => updateValue(e.target.value)}
          placeholder="Example: Learned advanced ledger setup"
          className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-all text-sm text-black bg-white"
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Entire Today Learning Section
--------------------------------------------- */
export default function TodayLearningSection({
  learnings,
  setLearnings,
}: {
  learnings: string[];
  setLearnings: (v: string[]) => void;
}) {
  function addItem() {
    setLearnings([...learnings, ""]);
  }

  function removeItem(index: number) {
    setLearnings(learnings.filter((_, i) => i !== index));
  }

  function updateItem(index: number, value: string) {
    setLearnings(learnings.map((item, i) => (i === index ? value : item)));
  }
  return (
    <div className="relative pb-10 pt-2 px-2 border rounded-lg border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm font-bold text-gray-900">
          My Today Learning
        </label>
      </div>

      {/* Dynamic Learning Inputs */}
      <div className="space-y-3">
        {learnings.map((item, idx) => (
          <LearningInput
            key={idx}
            value={item}
            onChange={(val) => updateItem(idx, val)}
            onRemove={() => removeItem(idx)}
            showRemove={learnings.length > 1}
          />
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={addItem}
        className="absolute bottom-0 right-0 flex items-center gap-1.5 px-3 py-2
                 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg
                 hover:from-green-700 hover:to-green-800 active:scale-95
                 transition-all shadow-md text-sm font-semibold"
      >
        <Plus className="w-4 h-4" />
        Add
      </button>
    </div>
  );
}

/* Preview component */
export function Preview({
  tlName,
  projectName,
  yourName,
  workedOn,
  inProgress,
  learnings,
  queries,
  expertQueries,
  teamName,
}: any) {
  function formatTask(item: string) {
    const [product, customer, comment, status] = item.split(" - ");

    return [
      product ? `• Product: ${product}` : "",
      customer ? `  Customer: ${customer}` : "",
      status ? `  Status: ${status}` : "",
      comment ? `  Comment: ${comment}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function generateMessage() {
    const today = new Date().toLocaleDateString("en-GB");
    let message = `${teamName} Team ${yourName}'s Daily Status of ${projectName} ${today}\n\n`;

    if (workedOn.some((i: any) => i.trim())) {
      message += `Worked-On:\n`;
      workedOn.forEach((item: string) => {
        if (item.trim()) message += `${formatTask(item)}\n\n`;
      });
    }

    if (inProgress.some((i: string) => i.trim())) {
      message += `In-Progress Task:\n`;
      inProgress.forEach((item: string) => {
        if (item.trim()) message += `${formatTask(item)}\n\n`;
      });
    }

    if (learnings.some((i: string) => i.trim())) {
      message += `My Today Learning:\n`;
      learnings.forEach((item: string) => {
        if (item.trim()) message += `- ${item}\n`;
      });
      message += "\n";
    }

    if (queries.some((i: string) => i.trim())) {
      message += `Query:\n`;
      queries.forEach((item: string) => {
        if (item.trim()) message += `${formatTask(item)}\n\n`;
      });
      message += "\n";
    }

        if (expertQueries.some((q:any) => q.expert.trim() || q.query.trim())) {
      message += `Any Query from Expert:\n`;
      expertQueries.forEach((q:any) => {
        if (q.expert.trim() || q.query.trim()) {
          message += `- Expert: ${q.expert || "—"}\n`;
          message += `  Query: ${q.query || "—"}\n\n`;
        }
      });
    } else {
      message += `\n`;
    }

    message += `Submitted by: ${yourName}`;
    return message;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-4 mb-9 border-2 border-gray-200 min-h-[300px] sm:min-h-[450px] shadow-inner overflow-auto">
      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
        {generateMessage()}
      </pre>
    </div>
  );
}
