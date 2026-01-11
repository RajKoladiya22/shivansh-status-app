"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Search, Copy, Check, Clock, ChevronDown } from "lucide-react";

// Storage helpers (using localStorage for persistence)
const STORAGE_KEYS = {
  products: "si_products",
  tlNames: "si_tlNames",
  projectNames: "si_projectNames",
  yourNames: "si_yourNames",
  statusUpdates: "si_statusUpdates",
};

const DEFAULT_PRODUCTS = [
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

const getFromStorage = (key: any) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    if (data) return JSON.parse(data);
    if (key === "products") return DEFAULT_PRODUCTS;
    return [];
  } catch {
    if (key === "products") return DEFAULT_PRODUCTS;
    return [];
  }
};

const setToStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

const saveToHistory = (key: string, value: string) => {
  if (!value || !value.trim()) return;
  const current = getFromStorage(key);
  if (!current.includes(value)) {
    const updated = [value, ...current].slice(0, 10);
    setToStorage(key, updated);
  }
};

const saveStatusUpdate = (update: any) => {
  const newUpdate = { ...update, date: new Date().toISOString() };
  const current = getFromStorage("statusUpdates");
  const updated = [newUpdate, ...current].slice(0, 50);
  setToStorage("statusUpdates", updated);
};

const getRecentUpdates = () => {
  const updates = getFromStorage("statusUpdates");
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return updates.filter((u) => new Date(u.date) >= sevenDaysAgo);
};

const addProduct = (product: any) => {
  const current = getFromStorage("products");
  if (!current.includes(product)) {
    const updated = [...current, product];
    setToStorage("products", updated);
  }
};

const ProductSearchSelect = ({ onSelect, initialValue = "" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(initialValue);
  const [products, setProducts] = useState(getFromStorage("products"));

  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  const filteredProducts = products.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (product: any) => {
    setSelected(product);
    setSearch("");
    setIsOpen(false);
    onSelect(product);
  };

  const handleAddNew = () => {
    if (search.trim() && !products.includes(search.trim())) {
      addProduct(search.trim());
      setProducts(getFromStorage("products"));
      handleSelect(search.trim());
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      if (filteredProducts.length === 0) {
        handleAddNew();
      } else {
        handleSelect(filteredProducts[0]);
      }
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : selected}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search or add product..."
          className="text-black w-full px-3 py-2.5 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none text-black" />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: any, idx: any) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(product)}
                  className="text-black w-full px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm border-b border-gray-100 last:border-0"
                >
                  {product}
                </button>
              ))
            ) : search.trim() ? (
              <button
                onClick={handleAddNew}
                className="w-full px-4 py-3 text-left hover:bg-green-50 active:bg-green-100 transition-colors text-sm text-green-600 font-semibold"
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
};

const AutocompleteInput = ({
  value,
  onChange,
  placeholder,
  historyKey,
}: any) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState(getFromStorage(historyKey));

  const filteredHistory = history.filter(
    (h:any) => h.toLowerCase().includes(value.toLowerCase()) && h !== value
  );

  const handleSelect = (suggestion: any) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleBlur = (val: any) => {
    setTimeout(() => setShowSuggestions(false), 200);
    if (val.trim()) {
      saveToHistory(historyKey, val.trim());
      setHistory(getFromStorage(historyKey));
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={(e) => handleBlur(e.target.value)}
        placeholder={placeholder}
        className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
      />
      {showSuggestions && filteredHistory.length > 0 && value && (
        <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-40 overflow-auto">
          {filteredHistory.slice(0, 5).map((suggestion: any, idx: any) => (
            <button
              key={idx}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm flex items-center gap-2 border-b border-gray-100 last:border-0"
            >
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate text-black">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TaskInput = ({ value, onChange, onRemove, showRemove }: any) => {
  const [product, setProduct] = useState("");
  const [customer, setCustomer] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const parts = value.split(" - ");
    if (parts.length >= 3) {
      setProduct(parts[0] || "");
      setCustomer(parts[1] || "");
      setComment(parts.slice(2).join(" - ") || "");
    }
  }, []);

  const updateValue = (p: any, c: any, com: any) => {
    const result = `${p} - ${c} - ${com}`;
    onChange(result);
  };

  return (
    <div className="relative space-y-2 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
      {showRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all border-2 border-red-300 hover:border-red-500"
          title="Remove item"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Product *
          </label>
          <ProductSearchSelect
            onSelect={(p: any) => {
              setProduct(p);
              updateValue(p, customer, comment);
            }}
            initialValue={product}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Customer *
          </label>
          <input
            type="text"
            value={customer}
            onChange={(e) => {
              setCustomer(e.target.value);
              updateValue(product, e.target.value, comment);
            }}
            placeholder="Customer name"
            className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Comment
        </label>
        <input
          type="text"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            updateValue(product, customer, e.target.value);
          }}
          placeholder="Add comment or details"
          className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
        />
      </div>
    </div>
  );
};

export default function StatusUpdateCreator() {
  const [tlName, setTlName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [workedOn, setWorkedOn] = useState([""]);
  const [inProgress, setInProgress] = useState([""]);
  const [queries, setQueries] = useState([""]);
  const [yourName, setYourName] = useState("");
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  interface IArraySetter {
    (setter: React.Dispatch<React.SetStateAction<string[]>>): void;
  }

  const addItem: IArraySetter = (setter) => {
    setter((prev) => [...prev, ""]);
  };

  const removeItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const generateMessage = () => {
    const today = new Date().toLocaleDateString("en-GB");

    let message = `Hi ${tlName},\nHere is the update of ${projectName} as on ${today}\n\n`;

    if (workedOn.some((item) => item.trim())) {
      message += `Worked-On:\n`;
      workedOn.forEach((item) => {
        if (item.trim()) message += `- ${item}\n`;
      });
      message += "\n";
    }

    if (inProgress.some((item) => item.trim())) {
      message += `In-Progress Task:\n`;
      inProgress.forEach((item) => {
        if (item.trim()) message += `- ${item}\n`;
      });
      message += "\n";
    }

    if (queries.some((item) => item.trim())) {
      message += `Query:\n`;
      queries.forEach((item) => {
        if (item.trim()) message += `- ${item}\n`;
      });
      message += "\n";
    }

    message += `Thank You,\n\n${yourName}`;

    return message;
  };

  const copyToClipboard = () => {
    const message = generateMessage();
    navigator.clipboard.writeText(message);

    saveStatusUpdate({
      tlName,
      projectName,
      yourName,
      workedOn: workedOn.filter((i) => i.trim()),
      inProgress: inProgress.filter((i) => i.trim()),
      queries: queries.filter((i) => i.trim()),
    });

    saveToHistory("tlNames", tlName);
    saveToHistory("projectNames", projectName);
    saveToHistory("yourNames", yourName);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadFromHistory = (update: any) => {
    setTlName(update.tlName || "");
    setProjectName(update.projectName || "");
    setYourName(update.yourName || "");
    setWorkedOn(update.workedOn?.length ? update.workedOn : [""]);
    setInProgress(update.inProgress?.length ? update.inProgress : [""]);
    setQueries(update.queries?.length ? update.queries : [""]);
    setShowHistory(false);
  };

  const historyUpdates = getRecentUpdates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-base sm:text-xl">
                  SI
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  Shivansh Infosys
                </h1>
                <p className="text-xs text-gray-600">Daily Status Update</p>
              </div> */}

              <div className="brand-logo">
                <a href="/" className="flex items-center gap-2">
                  <img
                    src="/logo-icon.svg"
                    alt="Shivansh Infosys Logo"
                    className="h-10 w-auto dark:hidden"
                  />
                  <img
                    src="/logo-icon.svg"
                    alt="Shivansh Infosys Logo"
                    className="h-10 w-auto hidden dark:block"
                  />

                  <div className="flex">
                    <div className="site-logo-text ">
                      <h2 className="flex items-center text-lg font-bold leading-none">
                        <span className="text-red-600 dark:text-red-500">
                          SHIVANSH
                        </span>
                        <span className="ml-1 text-gray-900 dark:text-gray-900">
                          INFOSYS
                        </span>
                      </h2>

                      <p className="mt-0.5 text-[12px] text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="whitespace-nowrap">
                          Quick Response
                        </span>
                        <span className="mx-1">-</span>
                        <span className="whitespace-nowrap">Quick Support</span>
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            {historyUpdates.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-all flex-shrink-0 font-medium"
              >
                <Clock className="w-4 h-4 text-black" />
                <span className="text-black">History</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform text-black ${
                    showHistory ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* History Panel */}
        {showHistory && historyUpdates.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 mb-4">
            <h3 className="font-bold text-base text-gray-900 mb-3">
              Recent Updates (Last 7 Days)
            </h3>
            <div className="space-y-2 max-h-80 overflow-auto">
              {historyUpdates.map((update: any, idx: any) => (
                <button
                  key={idx}
                  onClick={() => loadFromHistory(update)}
                  className="w-full text-left p-3 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 active:from-blue-100 active:to-blue-200 rounded-lg transition-all border-2 border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {update.projectName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(update.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-500 text-white px-2.5 py-1 rounded-md flex-shrink-0 font-medium">
                      Load
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Create Update
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  TL Name *
                </label>
                <AutocompleteInput
                  value={tlName}
                  onChange={setTlName}
                  placeholder="Enter team leader name"
                  historyKey="tlNames"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  Project Name *
                </label>
                <AutocompleteInput
                  value={projectName}
                  onChange={setProjectName}
                  placeholder="Enter project name"
                  historyKey="projectNames"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900">
                    Worked-On
                  </label>
                  <button
                    onClick={() => addItem(setWorkedOn)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all shadow-md text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </div>
                <div className="space-y-3">
                  {workedOn.map((item, idx) => (
                    <TaskInput
                      key={idx}
                      value={item}
                      onChange={(val: any) => updateItem(setWorkedOn, idx, val)}
                      onRemove={() => removeItem(setWorkedOn, idx)}
                      showRemove={workedOn.length > 1}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900">
                    In-Progress Tasks
                  </label>
                  <button
                    onClick={() => addItem(setInProgress)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-md text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </div>
                <div className="space-y-3">
                  {inProgress.map((item, idx) => (
                    <TaskInput
                      key={idx}
                      value={item}
                      onChange={(val: any) =>
                        updateItem(setInProgress, idx, val)
                      }
                      onRemove={() => removeItem(setInProgress, idx)}
                      showRemove={inProgress.length > 1}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900">
                    Queries
                  </label>
                  <button
                    onClick={() => addItem(setQueries)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition-all shadow-md text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Query
                  </button>
                </div>
                <div className="space-y-3">
                  {queries.map((item, idx) => (
                    <TaskInput
                      key={idx}
                      value={item}
                      onChange={(val: any) => updateItem(setQueries, idx, val)}
                      onRemove={() => removeItem(setQueries, idx)}
                      showRemove={queries.length > 1}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  Your Name *
                </label>
                <AutocompleteInput
                  value={yourName}
                  onChange={setYourName}
                  placeholder="Enter your name"
                  historyKey="yourNames"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:sticky lg:top-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>
              <button
                onClick={copyToClipboard}
                // disabled={!tlName || !projectName || !yourName}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm font-bold"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Message
                  </>
                )}
              </button>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 min-h-[300px] sm:min-h-[450px] shadow-inner overflow-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                {generateMessage()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
