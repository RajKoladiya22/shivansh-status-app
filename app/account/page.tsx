//app/account/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Copy, Check, Clock, ChevronDown } from "lucide-react";

// In-memory storage (no localStorage/sessionStorage as per requirements)
const inMemoryStorage = {
  salesWork: ["Sales", "Purchase", "Ledger Entry"],
  tallyFeatures: [
    "Payment Entry",
    "Receipt Entry",
    "Journal Entry",
    "Contra Entry",
    "Bank Reconciliation",
    "GST Filing",
    "TDS Entry",
    "Invoice Creation",
    "Voucher Entry",
    "Stock Journal",
  ],
  products: [
    "Tally Prime",
    "GST Reconciliation",
    "Invoice Management",
    "Payroll System",
    "Inventory Management",
    "TDS Returns",
    "Financial Reports",
    "E-Way Bill",
    "E-Invoice",
  ],
  experts: ["Das Bhai", "Rahul Sir", "Priya Ma'am", "Amit Sir", "Neha Ma'am"],
  followUpStatus: [
    "Pending",
    "Received Partial",
    "Committed",
    "Overdue",
    "Received Full",
    "Follow-up Required",
  ],
  statusUpdates: [],
};

const getFromStorage = (key) => {
  return inMemoryStorage[key] || [];
};

const setToStorage = (key, value) => {
  inMemoryStorage[key] = value;
};

const saveStatusUpdate = (update) => {
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


// Select Dropdown Component
const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white text-left flex items-center justify-between"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="text-black w-full px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm border-b border-gray-100 last:border-0"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Sales Entry Input Component
const SalesEntryInput = ({ value, onChange, onRemove, showRemove }) => {
  const [work, setWork] = useState("");
  const [entries, setEntries] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const parts = value.split(" | ");
    if (parts.length >= 3) {
      setWork(parts[0] || "");
      setEntries(parts[1] || "");
      setRemarks(parts[2] || "");
    }
  }, [value]);

  const updateValue = (w, e, r) => {
    const result = `${w} | ${e} | ${r}`;
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
            Work Type *
          </label>
          <SelectDropdown
            options={getFromStorage("salesWork")}
            value={work}
            onChange={(w) => {
              setWork(w);
              updateValue(w, entries, remarks);
            }}
            placeholder="Select work type"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            No. of Entries *
          </label>
          <input
            type="number"
            value={entries}
            onChange={(e) => {
              setEntries(e.target.value);
              updateValue(work, e.target.value, remarks);
            }}
            placeholder="Enter number"
            className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Remarks
        </label>
        <input
          type="text"
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
            updateValue(work, entries, e.target.value);
          }}
          placeholder="Add remarks (e.g., Manual, Automated)"
          className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
        />
      </div>
    </div>
  );
};

// Payment Follow-up Input Component
const PaymentFollowUpInput = ({ value, onChange, onRemove, showRemove }) => {
  const [customer, setCustomer] = useState("");
  const [feature, setFeature] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const parts = value.split(" | ");
    if (parts.length >= 4) {
      setCustomer(parts[0] || "");
      setFeature(parts[1] || "");
      setStatus(parts[2] || "");
      setRemarks(parts[3] || "");
    }
  }, [value]);

  const updateValue = (c, f, s, r) => {
    const result = `${c} | ${f} | ${s} | ${r}`;
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
            Customer Name *
          </label>
          <input
            type="text"
            value={customer}
            onChange={(e) => {
              setCustomer(e.target.value);
              updateValue(e.target.value, feature, status, remarks);
            }}
            placeholder="Enter customer name"
            className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Tally Features *
          </label>
          <SelectDropdown
            options={getFromStorage("tallyFeatures")}
            value={feature}
            onChange={(f) => {
              setFeature(f);
              updateValue(customer, f, status, remarks);
            }}
            placeholder="Select feature"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Status *
          </label>
          <SelectDropdown
            options={getFromStorage("followUpStatus")}
            value={status}
            onChange={(s) => {
              setStatus(s);
              updateValue(customer, feature, s, remarks);
            }}
            placeholder="Select status"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Remarks
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              updateValue(customer, feature, status, e.target.value);
            }}
            placeholder="Add remarks"
            className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
          />
        </div>
      </div>
    </div>
  );
};

// Learning Input Component
const LearningInput = ({ value, onChange, onRemove, showRemove }) => {
  const [product, setProduct] = useState(value || "");

  useEffect(() => {
    setProduct(value || "");
  }, [value]);

  const updateValue = (p) => {
    setProduct(p);
    onChange(p);
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

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Product *
        </label>
        <SelectDropdown
          options={getFromStorage("products")}
          value={product}
          onChange={updateValue}
          placeholder="Select product"
        />
      </div>
    </div>
  );
};

// Query Input Component
const QueryInput = ({ value, onChange, onRemove, showRemove }) => {
  const [expert, setExpert] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const parts = value.split(" | ");
    if (parts.length >= 2) {
      setExpert(parts[0] || "");
      setRemarks(parts[1] || "");
    }
  }, [value]);

  const updateValue = (e, r) => {
    const result = `${e} | ${r}`;
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
            Expert Name *
          </label>
          <SelectDropdown
            options={getFromStorage("experts")}
            value={expert}
            onChange={(e) => {
              setExpert(e);
              updateValue(e, remarks);
            }}
            placeholder="Select expert"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Query/Remarks *
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              updateValue(expert, e.target.value);
            }}
            placeholder="Describe your query"
            className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
          />
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function AccountTeamStatus() {
  const [salesEntries, setSalesEntries] = useState([""]);
  const [paymentFollowUps, setPaymentFollowUps] = useState([""]);
  const [learnings, setLearnings] = useState([""]);
  const [queries, setQueries] = useState([""]);
  const [yourName, setYourName] = useState("");
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addItem = (setter) => {
    setter((prev) => [...prev, ""]);
  };

  const removeItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (setter, index, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const generateMessage = () => {
    const today = new Date().toLocaleDateString("en-GB");

    let message = `Account Team *${yourName}'s* Daily Status - ${today}\n\n`;

    if (salesEntries.some((item) => item.trim())) {
      message += `*1. Sales, Purchase, Ledger Entry:*\n`;
      salesEntries.forEach((item) => {
        if (item.trim()) {
          const [work, entries, remarks] = item.split(" | ");
          message += `   - *Work:* _${work}_\n`;
          message += `     *No. of Entries:* _${entries}_\n`;
          if (remarks && remarks.trim()) {
            message += `     *Remarks:* _${remarks}_\n`;
          }
          message += `\n`
        }
      });
      message += "\n";
    }

    if (paymentFollowUps.some((item) => item.trim())) {
      message += `*2. Payment Follow-up:*\n`;
      paymentFollowUps.forEach((item) => {
        if (item.trim()) {
          const [customer, feature, status, remarks] = item.split(" | ");
          message += `   - *Customer:* _${customer}_\n`;
          message += `     *Tally Feature:* _${feature}_\n`;
          message += `     *Status:* _${status}_\n`;
          if (remarks && remarks.trim()) {
            message += `     *Remarks:* _${remarks}_\n`;
          }
          message += `\n`
        }
      });
      message += "\n";
    }

    if (learnings.some((item) => item.trim())) {
      message += `*3. My Today Learning:*\n`;
      learnings.forEach((item) => {
        if (item.trim()) {
          message += `   - ${item}\n`;
        }
      });
      message += "\n";
    }

    if (queries.some((item) => item.trim())) {
      message += `*4. Any Query from Expert:*\n`;
      queries.forEach((item) => {
        if (item.trim()) {
          const [expert, remarks] = item.split(" | ");
          message += `   - *Expert:* _${expert}_\n`;
          message += `     *Query:* _${remarks}_\n`;
        }
      });
      message += "\n";
    }

    message += `Submitted by: ${yourName}`;

    return message;
  };

  const copyToClipboard = () => {
    const message = generateMessage();
    navigator.clipboard.writeText(message);

    saveStatusUpdate({
      yourName,
      salesEntries: salesEntries.filter((i) => i.trim()),
      paymentFollowUps: paymentFollowUps.filter((i) => i.trim()),
      learnings: learnings.filter((i) => i.trim()),
      queries: queries.filter((i) => i.trim()),
    });

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadFromHistory = (update) => {
    setYourName(update.yourName || "");
    setSalesEntries(update.salesEntries?.length ? update.salesEntries : [""]);
    setPaymentFollowUps(
      update.paymentFollowUps?.length ? update.paymentFollowUps : [""]
    );
    setLearnings(update.learnings?.length ? update.learnings : [""]);
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
              {/* <div className="brand-logo">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-base sm:text-xl">
                      SI
                    </span>
                  </div>
                  <div className="site-logo-text">
                    <h2 className="flex items-center text-lg font-bold leading-none">
                      <span className="text-red-600">SHIVANSH</span>
                      <span className="ml-1 text-gray-900">INFOSYS</span>
                    </h2>
                    <p className="mt-0.5 text-[12px] text-gray-500">
                      Account Team Daily Status
                    </p>
                  </div>
                </div>
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
                          Account Team 
                        </span>
                        <span className="mx-1">-</span>
                        <span className="whitespace-nowrap">Daily Status</span>
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
              {historyUpdates.map((update, idx) => (
                <button
                  key={idx}
                  onClick={() => loadFromHistory(update)}
                  className="w-full text-left p-3 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 active:from-blue-100 active:to-blue-200 rounded-lg transition-all border-2 border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {update.yourName}
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
              Create Status Update
            </h2>

            <div className="space-y-4">
              {/* Your Name */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                />
              </div>

              {/* Section 1: Sales, Purchase, Ledger Entry */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900">
                    1. Sales, Purchase, Ledger Entry
                  </label>
                  <button
                    onClick={() => addItem(setSalesEntries)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all shadow-md text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Entry
                  </button>
                </div>
                <div className="space-y-3">
                  {salesEntries.map((item, idx) => (
                    <SalesEntryInput
                      key={idx}
                      value={item}
                      onChange={(val) => updateItem(setSalesEntries, idx, val)}
                      onRemove={() => removeItem(setSalesEntries, idx)}
                      showRemove={salesEntries.length > 1}
                    />
                  ))}
                </div>
              </div>

              {/* Section 2: Payment Follow-up */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900">
                    2. Payment Follow-up
                  </label>
                  <button
                    onClick={() => addItem(setPaymentFollowUps)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-md text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Follow-up
                  </button>
                </div>
                <div className="space-y-3">
                  {paymentFollowUps.map((item, idx) => (
                    <PaymentFollowUpInput
                      key={idx}
                      value={item}
                      onChange={(val) =>
                        updateItem(setPaymentFollowUps, idx, val)
                      }
                      onRemove={() => removeItem(setPaymentFollowUps, idx)}
                      showRemove={paymentFollowUps.length > 1}
                    />
                  ))}
                </div>
              </div>

              {/* Section 3: My Today Learning */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900">
                    3. My Today Learning
                  </label>
                  <button
                    onClick={() => addItem(setLearnings)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all shadow-md text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Learning
                  </button>
                </div>
                <div className="space-y-3">
                  {learnings.map((item, idx) => (
                    <LearningInput
                      key={idx}
                      value={item}
                      onChange={(val) => updateItem(setLearnings, idx, val)}
                      onRemove={() => removeItem(setLearnings, idx)}
                      showRemove={learnings.length > 1}
                    />
                  ))}
                </div>
              </div>

              {/* Section 4: Any Query from Expert */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900">
                    4. Any Query from Expert
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
                    <QueryInput
                      key={idx}
                      value={item}
                      onChange={(val) => updateItem(setQueries, idx, val)}
                      onRemove={() => removeItem(setQueries, idx)}
                      showRemove={queries.length > 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:sticky lg:top-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>
              <button
                onClick={copyToClipboard}
                disabled={!yourName}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-
                              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Status
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 p-4">
              <div className="text-sm text-gray-800 whitespace-pre-line font-mono max-h-[500px] overflow-auto">
                {yourName ? (
                  generateMessage()
                ) : (
                  <div className="text-gray-400 italic">
                    Enter your name above to see the preview...
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Status will be copied to clipboard and saved in history
              </p>
              <p>
                <span className="font-semibold">Note:</span> All data is stored
                in memory and will be lost on page refresh
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Shivansh Infosys © {new Date().getFullYear()}</p>
          <p className="mt-1">Account Team Daily Status Tracker</p>
        </div>
      </div>
    </div>
  );
}









// "use client";

// import React from "react";
// import {
//   BaseStatusUpdate,
//   Section,
//   ListItemComponentProps,
// } from "@/component/status";
// import { SelectDropdown } from "@/component/UI";

// /* -------------------------------------------------------------------------- */
// /* In-Memory Data (UNCHANGED BEHAVIOR)                                         */
// /* -------------------------------------------------------------------------- */

// const DATA = {
//   salesWork: ["Sales", "Purchase", "Ledger Entry"],
//   tallyFeatures: [
//     "Payment Entry",
//     "Receipt Entry",
//     "Journal Entry",
//     "Contra Entry",
//     "Bank Reconciliation",
//     "GST Filing",
//     "TDS Entry",
//     "Invoice Creation",
//     "Voucher Entry",
//     "Stock Journal",
//   ],
//   products: [
//     "Tally Prime",
//     "GST Reconciliation",
//     "Invoice Management",
//     "Payroll System",
//     "Inventory Management",
//     "TDS Returns",
//     "Financial Reports",
//     "E-Way Bill",
//     "E-Invoice",
//   ],
//   experts: ["Das Bhai", "Rahul Sir", "Priya Ma'am", "Amit Sir", "Neha Ma'am"],
//   followUpStatus: [
//     "Pending",
//     "Received Partial",
//     "Committed",
//     "Overdue",
//     "Received Full",
//     "Follow-up Required",
//   ],
// };

// /* -------------------------------------------------------------------------- */
// /* LIST ITEM COMPONENTS (SAME UI, REUSED)                                      */
// /* -------------------------------------------------------------------------- */

// const SalesEntryInput = ({
//   value,
//   onChange,
//   onRemove,
//   showRemove,
// }: ListItemComponentProps) => {
//   const [work = "", entries = "", remarks = ""] = value.split(" | ");

//   const update = (w: string, e: string, r: string) =>
//     onChange(`${w} | ${e} | ${r}`);

//   return (
//     <div className="relative p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200">
//       {showRemove && (
//         <button
//           onClick={onRemove}
//           className="absolute top-2 right-2 text-red-500"
//         >
//           ✕
//         </button>
//       )}

//       <div className="grid sm:grid-cols-2 gap-3">
//         <SelectDropdown
//           options={DATA.salesWork}
//           value={work}
//           onChange={(v) => update(v, entries, remarks)}
//           placeholder="Work Type"
//         />
//         <input
//           type="number"
//           value={entries}
//           onChange={(e) => update(work, e.target.value, remarks)}
//           placeholder="No. of Entries"
//           className="input"
//         />
//       </div>

//       <input
//         value={remarks}
//         onChange={(e) => update(work, entries, e.target.value)}
//         placeholder="Remarks"
//         className="input mt-2"
//       />
//     </div>
//   );
// };

// const PaymentFollowUpInput = ({
//   value,
//   onChange,
//   onRemove,
//   showRemove,
// }: ListItemComponentProps) => {
//   const [customer = "", feature = "", status = "", remarks = ""] =
//     value.split(" | ");

//   const update = (c: string, f: string, s: string, r: string) =>
//     onChange(`${c} | ${f} | ${s} | ${r}`);

//   return (
//     <div className="relative p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200">
//       {showRemove && (
//         <button
//           onClick={onRemove}
//           className="absolute top-2 right-2 text-red-500"
//         >
//           ✕
//         </button>
//       )}

//       <input
//         value={customer}
//         onChange={(e) => update(e.target.value, feature, status, remarks)}
//         placeholder="Customer Name"
//         className="input mb-2 text-black"
//       />

//       <div className="grid sm:grid-cols-2 gap-3">
//         <SelectDropdown
//           options={DATA.tallyFeatures}
//           value={feature}
//           onChange={(v) => update(customer, v, status, remarks)}
//           placeholder="Tally Feature"
//         />
//         <SelectDropdown
//           options={DATA.followUpStatus}
//           value={status}
//           onChange={(v) => update(customer, feature, v, remarks)}
//           placeholder="Status"
//         />
//       </div>

//       <input
//         value={remarks}
//         onChange={(e) => update(customer, feature, status, e.target.value)}
//         placeholder="Remarks"
//         className="input mt-2"
//       />
//     </div>
//   );
// };

// const SimpleSelectInput = ({
//   value,
//   onChange,
//   onRemove,
//   showRemove,
//   options,
// }: ListItemComponentProps & { options: string[] }) => (
//   <div className="relative p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200">
//     {showRemove && (
//       <button onClick={onRemove} className="absolute top-2 right-2 text-red-500">
//         ✕
//       </button>
//     )}
//     <SelectDropdown
//       options={options}
//       value={value}
//       onChange={onChange}
//       placeholder="Select"
//     />
//   </div>
// );

// /* -------------------------------------------------------------------------- */
// /* SECTIONS CONFIG (DRIVES ENTIRE PAGE)                                        */
// /* -------------------------------------------------------------------------- */

// const sections: Section[] = [
//   {
//     key: "yourName",
//     label: "Your Name",
//     type: "input",
//     required: true,
//     placeholder: "Enter your name",
//   },
//   {
//     key: "salesEntries",
//     label: "1. Sales, Purchase, Ledger Entry",
//     type: "list",
//     addLabel: "Add Entry",
//     component: SalesEntryInput,
//     defaultValue: [""],
//   },
//   {
//     key: "paymentFollowUps",
//     label: "2. Payment Follow-up",
//     type: "list",
//     addLabel: "Add Follow-up",
//     buttonColor: "orange",
//     component: PaymentFollowUpInput,
//     defaultValue: [""],
//   },
//   {
//     key: "learnings",
//     label: "3. My Today Learning",
//     type: "list",
//     addLabel: "Add Learning",
//     buttonColor: "green",
//     component: (props) => (
//       <SimpleSelectInput {...props} options={DATA.products} />
//     ),
//     defaultValue: [""],
//   },
//   {
//     key: "queries",
//     label: "4. Any Query from Expert",
//     type: "list",
//     addLabel: "Add Query",
//     buttonColor: "purple",
//     component: (props) => (
//       <SimpleSelectInput {...props} options={DATA.experts} />
//     ),
//     defaultValue: [""],
//   },
// ];

// /* -------------------------------------------------------------------------- */
// /* MESSAGE GENERATOR (UNCHANGED OUTPUT)                                        */
// /* -------------------------------------------------------------------------- */

// const generateMessage = (data: Record<string, any>) => {
//   const today = new Date().toLocaleDateString("en-GB");

//   let msg = `Account Team ${data.yourName}'s Daily Status - ${today}\n\n`;

//   // 1. Sales, Purchase, Ledger Entry
//   if (data.salesEntries?.some((i: string) => i.trim())) {
//     msg += `\n1. Sales, Purchase, Ledger Entry:\n`;
//     data.salesEntries.forEach((item: string) => {
//       if (!item.trim()) return;

//       const [work, entries, remarks] = item.split(" | ");
//       msg += `   - Work: ${work}\n`;
//       msg += `     No. of Entries: ${entries}\n`;
//       if (remarks?.trim()) {
//         msg += `     Remarks: ${remarks}\n\n`;
//       }
//     });
//     msg += `\n`;
//   }

//   // 2. Payment Follow-up
//   if (data.paymentFollowUps?.some((i: string) => i.trim())) {
//     msg += `\n2. Payment Follow-up:\n`;
//     data.paymentFollowUps.forEach((item: string) => {
//       if (!item.trim()) return;

//       const [customer, feature, status, remarks] = item.split(" | ");
//       msg += `   - Customer: ${customer}\n`;
//       msg += `     Tally Feature: ${feature}\n`;
//       msg += `     Status: ${status}\n`;
//       if (remarks?.trim()) {
//         msg += `     Remarks: ${remarks}\n\n`;
//       }
//     });
//     msg += `\n`;
//   }

//   // 3. My Today Learning
//   if (data.learnings?.some((i: string) => i.trim())) {
//     msg += `\n3. My Today Learning:\n`;
//     data.learnings.forEach((item: string) => {
//       if (item.trim()) {
//         msg += `   - ${item}\n`;
//       }
//     });
//     msg += `\n`;
//   }

//   // 4. Any Query from Expert
//   if (data.queries?.some((i: string) => i.trim())) {
//     msg += `\n4. Any Query from Expert:\n`;
//     data.queries.forEach((item: string) => {
//       if (!item.trim()) return;

//       const [expert, query] = item.split(" | ");
//       msg += `   - Expert: ${expert}\n`;
//       msg += `     Query: ${query}\n`;
//     });
//     msg += `\n`;
//   }

//   msg += `Submitted by: ${data.yourName}`;

//   return msg;
// };


// /* -------------------------------------------------------------------------- */
// /* PAGE EXPORT                                                                 */
// /* -------------------------------------------------------------------------- */

// export default function AccountPage() {
//   return (
//     <BaseStatusUpdate
//       storagePrefix="account"
//       pageTitle="Account Team"
//       pageSubtitle="Daily Status Update"
//       sections={sections}
//       generateMessage={generateMessage}
//       validateBeforeCopy={(d) => Boolean(d.yourName)}
//     />
//   );
// }
