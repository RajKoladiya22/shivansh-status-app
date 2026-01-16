"use client";
import React, { useEffect, useState } from "react";
import { AutocompleteInput, Header } from "@/component";
import { Copy, Check, Plus, Send } from "lucide-react";

const QUERY_STORAGE_KEY = "support_queries";

const DEFAULT_QUERIES = [
  "Sales Deem Export Query",
  "Purchase Issue",
  "Ledger Mismatch",
  "GST Filing Issue",
  "Tally Sync Problem",
];

export default function SupportPage() {
  const [adminName, setAdminName] = useState("Mehul Patel");

  const [customerName, setCustomerName] = useState("");
  const [isPrime, setIsPrime] = useState(false);
  const [mobile, setMobile] = useState("");
  const [query, setQuery] = useState("");
  const [newQuery, setNewQuery] = useState("");
  const [queries, setQueries] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [remark, setRemark] = useState("");

  const [copied, setCopied] = useState(false);

  const TEAM_LIST = [
    "Pooja Yadav",
    "Madhavi Mokde",
    "Priya Jain",
    "Harjeet singh",
    "Dhara Bhavsar",
    "Suresh Modi",
    "Litan Das",
    "Hinal Patel",
    "Astha Pandya",
    "Mehul Patel",
  ];

  /* Load Queries */
  useEffect(() => {
    const stored = localStorage.getItem(QUERY_STORAGE_KEY);
    if (stored) {
      setQueries(JSON.parse(stored));
    } else {
      setQueries(DEFAULT_QUERIES);
      localStorage.setItem(QUERY_STORAGE_KEY, JSON.stringify(DEFAULT_QUERIES));
    }
  }, []);

  function addNewQuery() {
    if (!newQuery.trim()) return;
    if (queries.includes(newQuery)) return;

    const updated = [...queries, newQuery];
    setQueries(updated);
    localStorage.setItem(QUERY_STORAGE_KEY, JSON.stringify(updated));
    setQuery(newQuery);
    setNewQuery("");
  }

  function buildMessage() {
    return (
      `*Support*\n\n` +
      `*Customer Name:* ${customerName || "—"}${
        isPrime ? " - Prime Customer" : ""
      }\n` +
      `*Mobile Number:* ${mobile || "—"}\n` +
      `*Query:* ${query || "—"}\n` +
      `*Assigned to:* ${assignedTo || "—"}\n` +
      `*Remark:* ${remark || "—"}\n\n` +
      `*By* - ${adminName}\n`
    );
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(buildMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function sendToWhatsApp() {
    const message = encodeURIComponent(buildMessage());
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Header teamName="Support" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-5">
            {/* Admin */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Admin Name *
              </label>
              <AutocompleteInput
                value={adminName}
                onChange={setAdminName}
                placeholder="Enter admin name"
                historyKey="yourNames"
              />
            </div>

            {/* Support Details */}
            <div className="border-2 border-gray-200 rounded-lg p-4 space-y-4">
              <label className="text-sm font-bold text-gray-900 block mb-2">
                Support Details
              </label>

              {/* Customer */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Customer Name *
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm"
                />

                <label className="flex items-center gap-2 mt-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={isPrime}
                    onChange={(e) => setIsPrime(e.target.checked)}
                  />
                  Prime Customer
                </label>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Mobile Number *
                </label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* Query */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Query *
                </label>
                <select
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select query</option>
                  {queries.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 mt-2">
                  <input
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    placeholder="Add new query"
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={addNewQuery}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Assigned */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Assigned To *
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select team member</option>
                  {TEAM_LIST.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Remark
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative bg-white rounded-lg shadow-sm p-5 lg:sticky lg:top-6 h-fit">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">Preview</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy
                  </>
                )}
              </button>
            </div>

            <pre className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-9 text-sm whitespace-pre-wrap">
              {buildMessage()}
            </pre>
            <button
              onClick={sendToWhatsApp}
              className="absolute bottom-0 right-5 z-50 flex items-center gap-2 
             px-3 py-2 bg-green-700 text-white rounded-full 
             hover:opacity-90 active:scale-95 transition-all 
             text-sm font-bold shadow-lg mb-2"
            >
              <Send />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
