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
          <div className="bg-white rounded-lg shadow-sm p-5 lg:sticky lg:top-6 h-fit relative">
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
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
