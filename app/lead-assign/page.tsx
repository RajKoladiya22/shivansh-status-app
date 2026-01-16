"use client";
import React, { useState } from "react";
import { AutocompleteInput, Header } from "@/component";
import { Copy, Check, Send } from "lucide-react";

export default function LeadAssignPage() {
  const [adminName, setAdminName] = useState("Mehul Patel");

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [product, setProduct] = useState("");
  const [cost, setCost] = useState("");
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

  function buildMessage() {
    return (
      `*Lead*\n\n` +
      `*Customer Name:* ${customerName || "—"}\n` +
      `*Mobile Number:* ${mobile || "—"}\n` +
      `*Product:* ${product || "—"}\n` +
      `*Cost:* ${cost || "—"}\n` +
      `*Assigned to:* ${assignedTo || "—"}\n` +
      `*Remark:* ${remark || "—"}\n\n` +
      `*By* - ${adminName}\n`
    );
  }

  function copyToClipboard() {
    const txt = buildMessage();
    navigator.clipboard.writeText(txt);

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
        {/* Header */}
        {/* <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <h1 className="text-xl font-bold text-gray-900">Assign Lead</h1>
          <p className="text-sm text-gray-500 mt-1">Admin: {adminName}</p>
        </div> */}
        <Header teamName="Assign Lead" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: FORM */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-5">
            {/* Admin Name */}
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

            {/* Lead Section */}
            <div className="border-2 border-gray-200 rounded-lg p-4 space-y-4">
              <label className="text-sm font-bold text-gray-900 block mb-2">
                Lead Details
              </label>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product *
                </label>
                <input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="Enter product"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cost
                </label>
                <input
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Cost amount"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Assigned To *
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select team member</option>
                  {TEAM_LIST.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Remark
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add remark"
                  rows={3}
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="bg-white rounded-lg shadow-sm p-5 lg:sticky lg:top-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all text-sm font-bold shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-gray-100 border-2 border-gray-200 rounded-lg p-4 mb-9 min-h-[250px] shadow-inner overflow-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                {buildMessage()}
              </pre>
            </div>
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
