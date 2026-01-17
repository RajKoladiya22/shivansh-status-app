"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Plus, X } from "lucide-react";
import { getFromStorage, Header, saveToHistory } from "@/component";

// ========== STORAGE UTILITIES ==========
const STORAGE_KEYS = {
  products: "si_products",
  projectNames: "si_projectNames",
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

// ========== AUTOCOMPLETE INPUT ==========
function AutocompleteInput({ value, onChange, placeholder, historyKey }: any) {
  const [show, setShow] = useState(false);
  const [history, setHistory] = useState(() => getFromStorage(historyKey));

  useEffect(() => setHistory(getFromStorage(historyKey)), [historyKey]);

  const suggestions = history
    .filter((h) => h.toLowerCase().includes(value.toLowerCase()) && h !== value)
    .slice(0, 5);

  function handleBlur(v: any) {
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
              <span className="truncate">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== BILLING ITEM ==========
function BillingItem({ value, onChange, onRemove, showRemove }: any) {
  const [item, setItem] = useState("");
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    const [i, d, q, r] = value.split(" - ");
    setItem(i || "");
    setDesc(d || "");
    setQty(q );
    setRate(r);
  }, [value]);

  // function pushChange(i = item, d = desc, q = qty, r = rate) {
  //   const total = q * r;
  //   onChange(`${i} - ${d} - ${q} - ${r} - ${total}`);
  // }
  function pushChange(i = item, d = desc, q = qty, r = rate) {
    const qNum = Number(q);
    const rNum = Number(r);
    const total = !isNaN(qNum) && !isNaN(rNum) ? qNum * rNum : "";

    onChange(`${i} - ${d} - ${q} - ${r} - ${total}`);
  }

  return (
    <div className="relative p-4 space-y-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
      {showRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white rounded-full border-2 border-red-300 hover:border-red-500 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Item Name *
          </label>
          <AutocompleteInput
            value={item}
            onChange={(v: any) => {
              setItem(v);
              pushChange(v);
            }}
            placeholder="Enter item name"
            historyKey="products"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Description
          </label>
          <AutocompleteInput
            value={desc}
            onChange={(v: any) => {
              setDesc(v);
              pushChange(item, v);
            }}
            placeholder="Enter description"
            historyKey="projectNames"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Quantity
          </label>
          <input
            type="number"
            value={qty}
            onChange={(e) => {
              const v = e.target.value; // keep as string
              setQty(v);
              pushChange(item, desc, v, rate);
            }}
            className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Rate
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => {
              const v = e.target.value;
              setRate(v);
              pushChange(item, desc, qty, v);
            }}
            className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {Number(qty) > 0 && Number(rate) > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Total:</span> {qty} × ₹{rate} = ₹
            {(Number(qty) * Number(rate)).toFixed(2)} + GST
          </p>
        </div>
      )}
    </div>
  );
}

// ========== BILLING ITEM LIST ==========
function BillingItemList({ items, setItems }: any) {
  return (
    <div className="relative pb-10 pt-2 px-2 border-2 rounded-lg border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm font-bold text-gray-900">Billing Items</label>
      </div>

      <div className="space-y-3">
        {items.map((item: any, idx: any) => (
          <BillingItem
            key={idx}
            value={item}
            onChange={(v: any) =>
              setItems(items.map((x: any, i: any) => (i === idx ? v : x)))
            }
            onRemove={() =>
              setItems(items.filter((_: any, i: any) => i !== idx))
            }
            showRemove={items.length > 1}
          />
        ))}
      </div>

      <button
        onClick={() => setItems([...items, ""])}
        className="absolute bottom-0 right-0 flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md text-sm font-semibold"
      >
        <Plus className="w-4 h-4" />
        Add
      </button>
    </div>
  );
}

// ========== MAIN COMPONENT ==========
export default function BillingDetailsPage() {
  const [companyName, setCompanyName] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [items, setItems] = useState([""]);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [mobile, setMobile] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [copied, setCopied] = useState(false);
  const [tallySerialNo, setTallySerialNo] = useState("");

  function buildMessage() {
    let msg = `*BILLING DETAILS :*\n\n`;

    msg += `*COMPANY NAME:* ${companyName}\n`;
    msg += `*GST NO :* ${gstNo}\n`;
    msg += `*TALLY SERIAL NO :* ${tallySerialNo}\n\n`;

    items.forEach((i, idx) => {
      const [n, d, q, r, t] = i.split(" - ");
      if (!n) return;

      msg += `*${idx + 1}. ITEM NAME :* ${n}\n`;
      msg += `*Add Description:* ${d}\n`;
      msg += `*RATE & QNTY:* ${q} × ${r} = ${t} + GST\n\n`;
    });

    msg += `*OTHER DETAILS :*\n\n`;
    msg += `*EMAIL ID:* ${email}\n`;
    msg += `*CONTACT PERSON:* ${contact}\n`;
    msg += `*MOB. NO. :* ${mobile}\n`;
    msg += `*PAYMENT STATUS :* ${paymentStatus}\n`;

    return msg;
  }

  function copy() {
    navigator.clipboard.writeText(buildMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyToWhatsApp() {
    const message = buildMessage();
    navigator.clipboard.writeText(message);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <Header teamName="Billing" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column - Form */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Company Name *
                </label>
                <AutocompleteInput
                  value={companyName}
                  onChange={setCompanyName}
                  placeholder="Enter company name"
                  historyKey="projectNames"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  GST No
                </label>
                <input
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value)}
                  className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                  placeholder="Enter GST number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tally Serial No
                </label>
                <input
                  value={tallySerialNo}
                  onChange={(e) => setTallySerialNo(e.target.value)}
                  className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                  placeholder="Enter Tally serial number"
                />
              </div>
            </div>

            <BillingItemList items={items} setItems={setItems} />

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Other Details</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email ID
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                  placeholder="Enter email address"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Contact Person
                </label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mobile No.
                </label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                  placeholder="Enter mobile number"
                  type="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                >
                  <option>Pending</option>
                  <option>Done</option>
                  <option>Advance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Preview</h3>
                <button
                  onClick={copy}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-semibold shadow-sm"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 min-h-[400px] overflow-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                  {buildMessage()}
                </pre>
              </div>

              <button
                onClick={copyToWhatsApp}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-sm font-semibold shadow-sm"
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
    </div>
  );
}
