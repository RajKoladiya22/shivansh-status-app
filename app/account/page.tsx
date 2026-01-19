// //app/account/page.tsx

// "use client";
// import React, { useState, useEffect } from "react";
// import { Plus, X, Copy, Check, Clock, ChevronDown } from "lucide-react";

// // In-memory storage (no localStorage/sessionStorage as per requirements)
// type InMemoryStorageType = {
//   salesWork: string[];
//   tallyFeatures: string[];
//   products: string[];
//   experts: string[];
//   followUpStatus: string[];
//   statusUpdates: any[]; // stored updates
// };

// const inMemoryStorage: InMemoryStorageType = {
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
//   statusUpdates: [],
// };

// const getFromStorage = (key: keyof InMemoryStorageType) => {
//   return inMemoryStorage[key] || [];
// };

// const setToStorage = (key: keyof InMemoryStorageType, value: any) => {
//   inMemoryStorage[key] = value;
// };

// const saveStatusUpdate = (update:any) => {
//   const newUpdate = { ...update, date: new Date().toISOString() };
//   const current = getFromStorage("statusUpdates");
//   const updated = [newUpdate, ...current].slice(0, 50);
//   setToStorage("statusUpdates", updated);
// };

// const getRecentUpdates = () => {
//   const updates = getFromStorage("statusUpdates");
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//   return updates.filter((u:any) => new Date(u.date) >= sevenDaysAgo);
// };

// // Select Dropdown Component
// const SelectDropdown = ({ options, value, onChange, placeholder }:any) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white text-left flex items-center justify-between"
//       >
//         <span className={value ? "text-black" : "text-gray-400"}>
//           {value || placeholder}
//         </span>
//         <ChevronDown
//           className={`w-4 h-4 text-gray-400 transition-transform ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {isOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-10"
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
//             {options.map((option:any, idx:any) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   onChange(option);
//                   setIsOpen(false);
//                 }}
//                 className="text-black w-full px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm border-b border-gray-100 last:border-0"
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // Sales Entry Input Component
// const SalesEntryInput = ({ value, onChange, onRemove, showRemove }:any) => {
//   const [work, setWork] = useState("");
//   const [entries, setEntries] = useState("");
//   const [remarks, setRemarks] = useState("");

//   useEffect(() => {
//     const parts = value.split(" | ");
//     if (parts.length >= 3) {
//       setWork(parts[0] || "");
//       setEntries(parts[1] || "");
//       setRemarks(parts[2] || "");
//     }
//   }, [value]);

//   const updateValue = (w:any, e:any, r:any) => {
//     const result = `${w} | ${e} | ${r}`;
//     onChange(result);
//   };

//   return (
//     <div className="relative space-y-2 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
//       {showRemove && (
//         <button
//           onClick={onRemove}
//           className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all border-2 border-red-300 hover:border-red-500"
//           title="Remove item"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <div>
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//             Work Type *
//           </label>
//           <SelectDropdown
//             options={getFromStorage("salesWork")}
//             value={work}
//             onChange={(w:any) => {
//               setWork(w);
//               updateValue(w, entries, remarks);
//             }}
//             placeholder="Select work type"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//             No. of Entries *
//           </label>
//           <input
//             type="number"
//             value={entries}
//             onChange={(e:any) => {
//               setEntries(e.target.value);
//               updateValue(work, e.target.value, remarks);
//             }}
//             placeholder="Enter number"
//             className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//           Remarks
//         </label>
//         <input
//           type="text"
//           value={remarks}
//           onChange={(e:any) => {
//             setRemarks(e.target.value);
//             updateValue(work, entries, e.target.value);
//           }}
//           placeholder="Add remarks (e.g., Manual, Automated)"
//           className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
//         />
//       </div>
//     </div>
//   );
// };

// // Payment Follow-up Input Component
// const PaymentFollowUpInput = ({ value, onChange, onRemove, showRemove }:any) => {
//   const [customer, setCustomer] = useState("");
//   const [feature, setFeature] = useState("");
//   const [status, setStatus] = useState("");
//   const [remarks, setRemarks] = useState("");

//   useEffect(() => {
//     const parts = value.split(" | ");
//     if (parts.length >= 4) {
//       setCustomer(parts[0] || "");
//       setFeature(parts[1] || "");
//       setStatus(parts[2] || "");
//       setRemarks(parts[3] || "");
//     }
//   }, [value]);

//   const updateValue = (c:any, f:any, s:any, r:any) => {
//     const result = `${c} | ${f} | ${s} | ${r}`;
//     onChange(result);
//   };

//   return (
//     <div className="relative space-y-2 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
//       {showRemove && (
//         <button
//           onClick={onRemove}
//           className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all border-2 border-red-300 hover:border-red-500"
//           title="Remove item"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <div>
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//             Customer Name *
//           </label>
//           <input
//             type="text"
//             value={customer}
//             onChange={(e:any) => {
//               setCustomer(e.target.value);
//               updateValue(e.target.value, feature, status, remarks);
//             }}
//             placeholder="Enter customer name"
//             className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//             Tally Features *
//           </label>
//           <SelectDropdown
//             options={getFromStorage("tallyFeatures")}
//             value={feature}
//             onChange={(f:any) => {
//               setFeature(f);
//               updateValue(customer, f, status, remarks);
//             }}
//             placeholder="Select feature"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <div>
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//             Status *
//           </label>
//           <SelectDropdown
//             options={getFromStorage("followUpStatus")}
//             value={status}
//             onChange={(s:any) => {
//               setStatus(s);
//               updateValue(customer, feature, s, remarks);
//             }}
//             placeholder="Select status"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//             Remarks
//           </label>
//           <input
//             type="text"
//             value={remarks}
//             onChange={(e:any) => {
//               setRemarks(e.target.value);
//               updateValue(customer, feature, status, e.target.value);
//             }}
//             placeholder="Add remarks"
//             className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Learning Input Component
// const LearningInput = ({ value, onChange, onRemove, showRemove }:any) => {
//   const [product, setProduct] = useState(value || "");

//   useEffect(() => {
//     setProduct(value || "");
//   }, [value]);

//   const updateValue = (p:any) => {
//     setProduct(p);
//     onChange(p);
//   };

//   return (
//     <div className="relative space-y-2 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
//       {showRemove && (
//         <button
//           onClick={onRemove}
//           className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all border-2 border-red-300 hover:border-red-500"
//           title="Remove item"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       )}

//       <div>
//         <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//           Product *
//         </label>
//         <SelectDropdown
//           options={getFromStorage("products")}
//           value={product}
//           onChange={updateValue}
//           placeholder="Select product"
//         />
//       </div>
//     </div>
//   );
// };

// // Query Input Component
// const QueryInput = ({ value, onChange, onRemove, showRemove }:any) => {
//   const [expert, setExpert] = useState("");
//   const [remarks, setRemarks] = useState("");

//   useEffect(() => {
//     const parts = value.split(" | ");
//     if (parts.length >= 2) {
//       setExpert(parts[0] || "");
//       setRemarks(parts[1] || "");
//     }
//   }, [value]);

//   const updateValue = (e:any, r:any) => {
//     const result = `${e} | ${r}`;
//     onChange(result);
//   };

//   return (
//     <div className="relative space-y-2 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
//       {showRemove && (
//         <button
//           onClick={onRemove}
//           className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all border-2 border-red-300 hover:border-red-500"
//           title="Remove item"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <div>
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//             Expert Name *
//           </label>
//           <SelectDropdown
//             options={getFromStorage("experts")}
//             value={expert}
//             onChange={(e:any) => {
//               setExpert(e);
//               updateValue(e, remarks);
//             }}
//             placeholder="Select expert"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//             Query/Remarks *
//           </label>
//           <input
//             type="text"
//             value={remarks}
//             onChange={(e:any) => {
//               setRemarks(e.target.value);
//               updateValue(expert, e.target.value);
//             }}
//             placeholder="Describe your query"
//             className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Component
// export default function AccountTeamStatus() {
//   const [salesEntries, setSalesEntries] = useState([""]);
//   const [paymentFollowUps, setPaymentFollowUps] = useState([""]);
//   const [learnings, setLearnings] = useState([""]);
//   const [queries, setQueries] = useState([""]);
//   const [yourName, setYourName] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [showHistory, setShowHistory] = useState(false);

//   const addItem = (setter:any) => {
//     setter((prev:any) => [...prev, ""]);
//   };

//   const removeItem = (setter:any, index:any) => {
//     setter((prev:any) => prev.filter((_:any, i:any) => i !== index));
//   };

//   const updateItem = (setter:any, index:any, value:any) => {
//     setter((prev:any) => prev.map((item:any, i:any) => (i === index ? value : item)));
//   };

//   const generateMessage = () => {
//     const today = new Date().toLocaleDateString("en-GB");

//     let message = `Account Team *${yourName}'s* Daily Status - ${today}\n\n`;

//     if (salesEntries.some((item) => item.trim())) {
//       message += `*1. Sales, Purchase, Ledger Entry:*\n`;
//       salesEntries.forEach((item) => {
//         if (item.trim()) {
//           const [work, entries, remarks] = item.split(" | ");
//           message += `   - *Work:* _${work}_\n`;
//           message += `     *No. of Entries:* _${entries}_\n`;
//           if (remarks && remarks.trim()) {
//             message += `     *Remarks:* _${remarks}_\n`;
//           }
//           message += `\n`
//         }
//       });
//       message += "\n";
//     }

//     if (paymentFollowUps.some((item) => item.trim())) {
//       message += `*2. Payment Follow-up:*\n`;
//       paymentFollowUps.forEach((item) => {
//         if (item.trim()) {
//           const [customer, feature, status, remarks] = item.split(" | ");
//           message += `   - *Customer:* _${customer}_\n`;
//           message += `     *Tally Feature:* _${feature}_\n`;
//           message += `     *Status:* _${status}_\n`;
//           if (remarks && remarks.trim()) {
//             message += `     *Remarks:* _${remarks}_\n`;
//           }
//           message += `\n`
//         }
//       });
//       message += "\n";
//     }

//     if (learnings.some((item) => item.trim())) {
//       message += `*3. My Today Learning:*\n`;
//       learnings.forEach((item) => {
//         if (item.trim()) {
//           message += `   - ${item}\n`;
//         }
//       });
//       message += "\n";
//     }

//     if (queries.some((item) => item.trim())) {
//       message += `*4. Any Query from Expert:*\n`;
//       queries.forEach((item) => {
//         if (item.trim()) {
//           const [expert, remarks] = item.split(" | ");
//           message += `   - *Expert:* _${expert}_\n`;
//           message += `     *Query:* _${remarks}_\n`;
//         }
//       });
//       message += "\n";
//     }

//     message += `Submitted by: ${yourName}`;

//     return message;
//   };

//   const copyToClipboard = () => {
//     const message = generateMessage();
//     navigator.clipboard.writeText(message);

//     saveStatusUpdate({
//       yourName,
//       salesEntries: salesEntries.filter((i) => i.trim()),
//       paymentFollowUps: paymentFollowUps.filter((i) => i.trim()),
//       learnings: learnings.filter((i) => i.trim()),
//       queries: queries.filter((i) => i.trim()),
//     });

//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const loadFromHistory = (update:any) => {
//     setYourName(update.yourName || "");
//     setSalesEntries(update.salesEntries?.length ? update.salesEntries : [""]);
//     setPaymentFollowUps(
//       update.paymentFollowUps?.length ? update.paymentFollowUps : [""]
//     );
//     setLearnings(update.learnings?.length ? update.learnings : [""]);
//     setQueries(update.queries?.length ? update.queries : [""]);
//     setShowHistory(false);
//   };

//   const historyUpdates = getRecentUpdates();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 mb-4">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//               {/* <div className="brand-logo">
//                 <div className="flex items-center gap-2">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
//                     <span className="text-white font-bold text-base sm:text-xl">
//                       SI
//                     </span>
//                   </div>
//                   <div className="site-logo-text">
//                     <h2 className="flex items-center text-lg font-bold leading-none">
//                       <span className="text-red-600">SHIVANSH</span>
//                       <span className="ml-1 text-gray-900">INFOSYS</span>
//                     </h2>
//                     <p className="mt-0.5 text-[12px] text-gray-500">
//                       Account Team Daily Status
//                     </p>
//                   </div>
//                 </div>
//               </div> */}
//                             <div className="brand-logo">
//                 <a href="/" className="flex items-center gap-2">
//                   <img
//                     src="/logo-icon.svg"
//                     alt="Shivansh Infosys Logo"
//                     className="h-10 w-auto dark:hidden"
//                   />
//                   <img
//                     src="/logo-icon.svg"
//                     alt="Shivansh Infosys Logo"
//                     className="h-10 w-auto hidden dark:block"
//                   />

//                   <div className="flex">
//                     <div className="site-logo-text ">
//                       <h2 className="flex items-center text-lg font-bold leading-none">
//                         <span className="text-red-600 dark:text-red-500">
//                           SHIVANSH
//                         </span>
//                         <span className="ml-1 text-gray-900 dark:text-gray-900">
//                           INFOSYS
//                         </span>
//                       </h2>

//                       <p className="mt-0.5 text-[12px] text-gray-500 dark:text-gray-400 flex items-center">
//                         <span className="whitespace-nowrap">
//                           Account Team
//                         </span>
//                         <span className="mx-1">-</span>
//                         <span className="whitespace-nowrap">Daily Status</span>
//                       </p>
//                     </div>
//                   </div>
//                 </a>
//               </div>
//             </div>
//             {historyUpdates.length > 0 && (
//               <button
//                 onClick={() => setShowHistory(!showHistory)}
//                 className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-all flex-shrink-0 font-medium"
//               >
//                 <Clock className="w-4 h-4 text-black" />
//                 <span className="text-black">History</span>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform text-black ${
//                     showHistory ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* History Panel */}
//         {showHistory && historyUpdates.length > 0 && (
//           <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 mb-4">
//             <h3 className="font-bold text-base text-gray-900 mb-3">
//               Recent Updates (Last 7 Days)
//             </h3>
//             <div className="space-y-2 max-h-80 overflow-auto">
//               {historyUpdates.map((update:any, idx:any) => (
//                 <button
//                   key={idx}
//                   onClick={() => loadFromHistory(update)}
//                   className="w-full text-left p-3 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 active:from-blue-100 active:to-blue-200 rounded-lg transition-all border-2 border-gray-200 hover:border-blue-300"
//                 >
//                   <div className="flex items-start justify-between gap-2">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-gray-900 truncate">
//                         {update.yourName}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {new Date(update.date).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                     </div>
//                     <span className="text-xs bg-blue-500 text-white px-2.5 py-1 rounded-md flex-shrink-0 font-medium">
//                       Load
//                     </span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
//           {/* Input Form */}
//           <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
//             <h2 className="text-lg font-bold text-gray-900 mb-4">
//               Create Status Update
//             </h2>

//             <div className="space-y-4">
//               {/* Your Name */}
//               <div>
//                 <label className="block text-sm font-bold text-gray-900 mb-1.5">
//                   Your Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={yourName}
//                   onChange={(e:any) => setYourName(e.target.value)}
//                   placeholder="Enter your name"
//                   className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
//                 />
//               </div>

//               {/* Section 1: Sales, Purchase, Ledger Entry */}
//               <div>
//                 <div className="flex items-center justify-between mb-2.5">
//                   <label className="text-sm font-bold text-gray-900">
//                     1. Sales, Purchase, Ledger Entry
//                   </label>
//                   <button
//                     onClick={() => addItem(setSalesEntries)}
//                     className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all shadow-md text-sm font-semibold"
//                   >
//                     <Plus className="w-4 h-4" />
//                     {/* Add Entry */}
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   {salesEntries.map((item, idx) => (
//                     <SalesEntryInput
//                       key={idx}
//                       value={item}
//                       onChange={(val:any)  => updateItem(setSalesEntries, idx, val)}
//                       onRemove={() => removeItem(setSalesEntries, idx)}
//                       showRemove={salesEntries.length > 1}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Section 2: Payment Follow-up */}
//               <div>
//                 <div className="flex items-center justify-between mb-2.5">
//                   <label className="text-sm font-bold text-gray-900">
//                     2. Payment Follow-up
//                   </label>
//                   <button
//                     onClick={() => addItem(setPaymentFollowUps)}
//                     className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-md text-sm font-semibold"
//                   >
//                     <Plus className="w-4 h-4" />
//                     {/* Add Follow-up */}
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   {paymentFollowUps.map((item, idx) => (
//                     <PaymentFollowUpInput
//                       key={idx}
//                       value={item}
//                       onChange={(val:any)  =>
//                         updateItem(setPaymentFollowUps, idx, val)
//                       }
//                       onRemove={() => removeItem(setPaymentFollowUps, idx)}
//                       showRemove={paymentFollowUps.length > 1}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Section 3: My Today Learning */}
//               <div>
//                 <div className="flex items-center justify-between mb-2.5">
//                   <label className="text-sm font-bold text-gray-900">
//                     3. My Today Learning
//                   </label>
//                   <button
//                     onClick={() => addItem(setLearnings)}
//                     className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all shadow-md text-sm font-semibold"
//                   >
//                     <Plus className="w-4 h-4" />
//                     {/* Add Learning */}
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   {learnings.map((item, idx) => (
//                     <LearningInput
//                       key={idx}
//                       value={item}
//                       onChange={(val:any) => updateItem(setLearnings, idx, val)}
//                       onRemove={() => removeItem(setLearnings, idx)}
//                       showRemove={learnings.length > 1}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Section 4: Any Query from Expert */}
//               <div>
//                 <div className="flex items-center justify-between mb-2.5">
//                   <label className="text-sm font-bold text-gray-900">
//                     4. Any Query from Expert
//                   </label>
//                   <button
//                     onClick={() => addItem(setQueries)}
//                     className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition-all shadow-md text-sm font-semibold"
//                   >
//                     <Plus className="w-4 h-4" />
//                     {/* Add Query */}
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   {queries.map((item, idx) => (
//                     <QueryInput
//                       key={idx}
//                       value={item}
//                       onChange={(val:any) => updateItem(setQueries, idx, val)}
//                       onRemove={() => removeItem(setQueries, idx)}
//                       showRemove={queries.length > 1}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Preview */}
//           <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:sticky lg:top-6 h-fit">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-bold text-gray-900">Preview</h2>
//               <button
//                 onClick={copyToClipboard}
//                 disabled={!yourName}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-
//                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//               >
//                 {copied ? (
//                   <>
//                     <Check className="w-5 h-5" />
//                     Copied!
//                   </>
//                 ) : (
//                   <>
//                     <Copy className="w-5 h-5" />
//                     Copy Status
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 p-4">
//               <div className="text-sm text-gray-800 whitespace-pre-line font-mono max-h-[500px] overflow-auto">
//                 {yourName ? (
//                   generateMessage()
//                 ) : (
//                   <div className="text-gray-400 italic">
//                     Enter your name above to see the preview...
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4 text-xs text-gray-500 space-y-1">
//               <p className="flex items-center gap-2">
//                 <Check className="w-4 h-4 text-green-500" />
//                 Status will be copied to clipboard and saved in history
//               </p>
//               <p>
//                 <span className="font-semibold">Note:</span> All data is stored
//                 in memory and will be lost on page refresh
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-4 text-center text-xs text-gray-500">
//           <p>Shivansh Infosys © {new Date().getFullYear()}</p>
//           <p className="mt-1">Account Team Daily Status Tracker</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useMemo, useState } from "react";
import TodayLearningSection, {
  AutocompleteInput,
  Header,
  HistoryPanel,
  TaskList,
  // TodayLearningSection,
  getRecentUpdates,
  saveStatusUpdate,
  saveToHistory,
} from "@/component";
import { Copy, Check, Plus, X, Send } from "lucide-react";
import ExpertQuerySection from "@/component/ExpertQuerySection";

/**
 * Account Status Page
 *
 * Uses the existing shared components (AutocompleteInput, Header, HistoryPanel,
 * TaskList, TodayLearningSection) and adds a small SalesEntrySection
 * to match the screenshot layout and the expected preview/copy format.
 *
 * File: app/account/page.tsx
 */

/* ----------------------------- Types ----------------------------- */
type SalesEntry = {
  workType: string;
  entries: string;
  remarks: string;
};

const EXPERT_LIST = [
  "Mehul Patel",
  "Suresh Modi",
  "Litan Das",
  "Harjeet singh",
  "Pooja Yadav",
  "Madhavi Mokde",
  "Dhara Bhavsar",
  "Priya Jain",
  "Hinal Patel",
  "Astha Pandya",
];

export default function AccountStatusPage() {
  /* Global form state */
  const [yourName, setYourName] = useState("");
  const [tlName, setTlName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [expertQueries, setExpertQueries] = useState([
    { expert: "", query: "" },
  ]);

  /* Sections */
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([
    { workType: "", entries: "", remarks: "" },
  ]);

  /* Payment follow-ups use TaskList format: "Product - Customer - Comment - Status"
     We'll map fields as:
     Product  -> Tally Feature
     Customer -> Customer Name
     Comment  -> Remarks
     Status   -> Status (enabled)
  */
  const [paymentFollowUps, setPaymentFollowUps] = useState<string[]>([
    "", // default single blank row
  ]);

  const [learnings, setLearnings] = useState<string[]>([""]);
  const [queries, setQueries] = useState<string[]>([""]);

  /* UI state */
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const historyUpdates = useMemo(() => getRecentUpdates(), []);

  /* ----------------------------- SalesEntrySection helpers ----------------------------- */
  function addSalesEntry() {
    setSalesEntries((s) => [...s, { workType: "", entries: "", remarks: "" }]);
  }
  function removeSalesEntry(idx: number) {
    setSalesEntries((s) => s.filter((_, i) => i !== idx));
  }
  function updateSalesEntry(idx: number, patch: Partial<SalesEntry>) {
    setSalesEntries((s) =>
      s.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
  }

  /* ----------------------------- Copy / Save ----------------------------- */
  function formatSalesEntry(e: SalesEntry) {
    const lines: string[] = [];
    if (e.workType?.trim()) lines.push(`- *Work:* ${e.workType}`);
    if (e.entries?.trim()) lines.push(`- *No. of Entries:* ${e.entries}`);
    if (e.remarks?.trim()) lines.push(`- *Remarks:* ${e.remarks}`);
    return lines.join("\n");
  }

  function formatTaskString(item: string) {
    // TaskItem stores "Product - Customer - Comment - Status"
    const [product, customer, contact, comment, status] = (item || "").split(
      " - ",
    );
    const lines: string[] = [];
    if (product) lines.push(`• *Product:* ${product}`);
    if (customer) lines.push(`    *Customer:* ${customer}`);
    if (contact) lines.push(`    *Contact:* ${contact}`);
    if (status) lines.push(`    *Status:* ${status}`);
    if (comment) lines.push(`    *Comment:* ${comment}`);
    return lines.join("\n");
  }

  function formatQuery(item: string) {
    // Query stored as "Expert - (maybe)Customer - Query - Status" but typically "Expert -  - Query"
    const [expert, , query] = (item || "").split(" - ");
    const lines: string[] = [];
    if (expert) lines.push(`- *Product:* ${expert}`);
    if (query) lines.push(`- *Query:* ${query}`);
    else lines.push(`- *Query:* pending`);
    return lines.join("\n");
  }

  function buildMessage() {
    const today = new Date().toLocaleDateString("en-GB");
    let msg = `Account Team:  *${
      yourName ? yourName + "'s" : "_"
    }* Daily Status - ${today}\n\n`;

    // 1. Sales, Purchase, Ledger Entry
    if (
      salesEntries.some(
        (s) => s.workType?.trim() || s.entries?.trim() || s.remarks?.trim(),
      )
    ) {
      msg += `1. Sales, Purchase, Ledger Entry:\n`;
      salesEntries.forEach((e) => {
        if (e.workType?.trim() || e.entries?.trim() || e.remarks?.trim()) {
          msg += `${formatSalesEntry(e)}\n\n`;
        }
      });
    } else {
      msg += ``;
    }

    // 2. Payment Follow-up
    if (paymentFollowUps.some((i) => i.trim())) {
      msg += `2. Payment Follow-up:\n`;
      paymentFollowUps.forEach((p) => {
        // console.log(p);

        if (p.trim()) {
          msg += `${formatTaskString(p)}\n\n`;
        }
      });
    } else {
      msg += ``;
    }

    // 3. My Today Learning
    if (learnings.some((l) => l.trim())) {
      msg += `3. My Today Learning:\n`;
      learnings.forEach((l) => {
        if (l.trim()) msg += `- ${l}\n`;
      });
      msg += `\n`;
    } else {
      msg += ``;
    }

    // 4. Any Query
    // if (queries.some((q) => q.trim())) {
    //   msg += `4. Any Query:\n`;
    //   queries.forEach((q) => {
    //     console.log(queries);

    //     if (q.trim()) msg += `${formatQuery(q)}\n\n`;
    //   });
    // } else {
    //   msg += ``;
    // }

    // 4. Any Query
    if (queries.some((i) => i.trim())) {
      msg += `4. Any Query:\n`;
      queries.forEach((p) => {
        // console.log(p);

        if (p.trim()) {
          msg += `${formatTaskString(p)}\n\n`;
        }
      });
    } else {
      msg += ``;
    }

    // 5. Any Query from Expert

    if (expertQueries.some((q) => q.expert.trim() || q.query.trim())) {
      msg += `5. Any Query from Expert:\n`;
      expertQueries.forEach((q) => {
        if (q.expert.trim() || q.query.trim()) {
          msg += `- *Expert:* _${q.expert || "—"}_\n`;
          msg += `  *Query:* _${q.query || "—"}_\n\n`;
        }
      });
    } else {
      msg += ``;
    }

    msg += `Submitted by: ${yourName || "—"}`;
    return msg;
  }

  function copyToClipboard() {
    const message = buildMessage();
    navigator.clipboard.writeText(message);

    // Save structured payload to history for later load
    saveStatusUpdate({
      tlName,
      projectName,
      yourName,
      salesEntries,
      paymentFollowUps: paymentFollowUps.filter(Boolean),
      learnings: learnings.filter(Boolean),
      queries: queries.filter(Boolean),
    });

    // Save quick single fields to history lists
    saveToHistory("tlNames", tlName);
    saveToHistory("projectNames", projectName);
    saveToHistory("yourNames", yourName);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* ----------------------------- History Load ----------------------------- */
  function loadFromHistory(update: any) {
    setTlName(update.tlName || "");
    setProjectName(update.projectName || "");
    setYourName(update.yourName || "");
    if (Array.isArray(update.salesEntries) && update.salesEntries.length) {
      setSalesEntries(update.salesEntries);
    } else {
      setSalesEntries([{ workType: "Sales", entries: "", remarks: "" }]);
    }
    if (
      Array.isArray(update.paymentFollowUps) &&
      update.paymentFollowUps.length
    ) {
      setPaymentFollowUps(update.paymentFollowUps);
    } else {
      setPaymentFollowUps([""]);
    }
    setLearnings(update.learnings?.length ? update.learnings : [""]);
    setQueries(update.queries?.length ? update.queries : [""]);
    setShowHistory(false);
  }

  /* ----------------------------- Derived values ----------------------------- */
  const isCopyDisabled = !yourName.trim();

  function sendToWhatsApp() {
    const message = encodeURIComponent(buildMessage());
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  }

  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <Header
          hasHistory={historyUpdates.length > 0}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory((s) => !s)}
          teamName="Account Team"
        />

        {showHistory && historyUpdates.length > 0 && (
          <HistoryPanel updates={historyUpdates} onLoad={loadFromHistory} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: FORM */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-5">
            {/* Your Name, TL, Project */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"> */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Your Name *
              </label>
              <AutocompleteInput
                value={yourName}
                onChange={setYourName}
                placeholder="Enter your name"
                historyKey="yourNames"
              />
            </div>

            {/* <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">TL Name</label>
                <AutocompleteInput
                  value={tlName}
                  onChange={setTlName}
                  placeholder="Team lead name"
                  historyKey="tlNames"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Project</label>
                <AutocompleteInput
                  value={projectName}
                  onChange={setProjectName}
                  placeholder="Project name"
                  historyKey="projectNames"
                />
              </div> */}
            {/* </div> */}

            {/* Section 1: Sales Entries */}
            <div className="border-2 border-gray-200 rounded-lg p-4 relative pb-10 pt-2 px-2">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-900">
                  Sales, Purchase, Ledger Entry
                </label>
              </div>

              <div className="space-y-3">
                {salesEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Work Type *
                          </label>
                          <select
                            value={entry.workType}
                            onChange={(e) =>
                              updateSalesEntry(idx, {
                                workType: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg bg-white outline-none"
                          >
                            <option value="">Select</option>
                            <option value="Sales">Sales</option>
                            <option value="Purchase">Purchase</option>
                            <option value="Ledger Entry">Ledger Entry</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            No. of Entries
                          </label>
                          <input
                            type="number"
                            value={entry.entries}
                            onChange={(e) =>
                              updateSalesEntry(idx, { entries: e.target.value })
                            }
                            placeholder="0"
                            className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg bg-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Remarks
                          </label>
                          <input
                            type="text"
                            value={entry.remarks}
                            onChange={(e) =>
                              updateSalesEntry(idx, { remarks: e.target.value })
                            }
                            placeholder="Remarks"
                            className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg bg-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {salesEntries.length > 1 && (
                          <button
                            onClick={() => removeSalesEntry(idx)}
                            title="Remove"
                            className="ml-3 text-red-500 hover:bg-red-50 border-2 border-red-200 w-7 h-7 flex items-center justify-center rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addSalesEntry}
                className="absolute flex items-center gap-1.5 bottom-0 right-0 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* Section 2: Payment Follow-up (TaskList with status enabled) */}
            {/* <div className="border-2 border-gray-200 rounded-lg p-4"> */}
            {/* <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-900">2. Payment Follow-up</label>
                <div className="text-sm text-gray-500">Use the add button to create rows</div>
              </div> */}

            <TaskList
              items={paymentFollowUps}
              setItems={setPaymentFollowUps}
              title="Payment Follow-ups"
              addColor="bg-orange-500"
              enableStatus={true}
              statusList={["Pending", "Done", "Waiting"]}
            />
            {/* </div> */}

            {/* Section 3: Today Learning */}
            {/* <div className="border-2 border-gray-200 rounded-lg p-4">
              <label className="text-sm font-bold text-gray-900 mb-3 block">3. My Today Learning</label> */}
            <TodayLearningSection
              learnings={learnings}
              setLearnings={setLearnings}
            />
            {/* </div> */}

            {/* Section 4: Query from Expert */}
            {/* <div className="border-2 border-gray-200 rounded-lg p-4">
              <label className="text-sm font-bold text-gray-900 mb-3 block">4. Any Query from Expert</label> */}

            <TaskList
              items={queries}
              setItems={setQueries}
              title="Queries"
              addColor="bg-purple-600"
              enableStatus={false}
            />
            {/* </div> */}

            <ExpertQuerySection
              items={expertQueries}
              setItems={setExpertQueries}
              experts={EXPERT_LIST}
              historyKey="expertNames"
            />
          </div>

          {/* RIGHT: Preview + Copy */}
          <div className="bg-white rounded-lg shadow-sm p-5 lg:sticky lg:top-6 h-fit relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>
              <button
                onClick={copyToClipboard}
                disabled={isCopyDisabled}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all shadow-lg ${
                  isCopyDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Status
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-4 mb-9 border-2 border-gray-200 min-h-[320px] max-h-[520px] overflow-auto">
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </button>

            {/* <p className="text-xs mt-3 text-gray-500">
              ✓ Status will be copied to clipboard and saved in history. <br />
              Note: All data is stored in memory/localStorage and may be lost on
              page refresh.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

