// "use client";
// import React, { useState } from "react";
// import { Plus, X, Copy, Check } from "lucide-react";
// import { Header } from "@/component";

// export default function GeneralUpdatePage() {
//   /*
//     workedOn: array of { project: string, tasks: { desc: string, hrs: string }[] }
//     inProgress: array of { project: string, tasks: string[] }
//   */
//   const [workedOn, setWorkedOn] = useState<
//     { project: string; tasks: { desc: string; hrs: string }[] }[]
//   >([{ project: "", tasks: [{ desc: "", hrs: "" }] }]);

//   const [inProgress, setInProgress] = useState<
//     { project: string; tasks: string[] }[]
//   >([{ project: "", tasks: [""] }]);

//   const [queries, setQueries] = useState<{ project: string; query: string }[]>([
//     { project: "", query: "" },
//   ]);

//   const [yourName, setYourName] = useState("");
//   const [copied, setCopied] = useState(false);

//   /* ------------------------------- Worked-On handlers ------------------------------- */
//   const addWorkedProject = () =>
//     setWorkedOn([...workedOn, { project: "", tasks: [{ desc: "", hrs: "" }] }]);

//   const removeWorkedProject = (i: number) =>
//     setWorkedOn(workedOn.filter((_, idx) => idx !== i));

//   const updateWorkedProject = (
//     i: number,
//     patch: Partial<{ project: string }>,
//   ) =>
//     setWorkedOn(workedOn.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));

//   const addWorkedTask = (projIdx: number) =>
//     setWorkedOn(
//       workedOn.map((w, idx) =>
//         idx === projIdx
//           ? { ...w, tasks: [...w.tasks, { desc: "", hrs: "" }] }
//           : w,
//       ),
//     );

//   const removeWorkedTask = (projIdx: number, taskIdx: number) =>
//     setWorkedOn(
//       workedOn.map((w, idx) =>
//         idx === projIdx
//           ? { ...w, tasks: w.tasks.filter((_, tIdx) => tIdx !== taskIdx) }
//           : w,
//       ),
//     );

//   const updateWorkedTask = (
//     projIdx: number,
//     taskIdx: number,
//     patch: Partial<{ desc: string; hrs: string }>,
//   ) =>
//     setWorkedOn(
//       workedOn.map((w, idx) =>
//         idx === projIdx
//           ? {
//               ...w,
//               tasks: w.tasks.map((t, tIdx) =>
//                 tIdx === taskIdx ? { ...t, ...patch } : t,
//               ),
//             }
//           : w,
//       ),
//     );

//   /* ------------------------------- In-Progress handlers ------------------------------- */
//   const addInProgressProject = () =>
//     setInProgress([...inProgress, { project: "", tasks: [""] }]);

//   const removeInProgressProject = (i: number) =>
//     setInProgress(inProgress.filter((_, idx) => idx !== i));

//   const updateInProgressProject = (
//     i: number,
//     patch: Partial<{ project: string }>,
//   ) =>
//     setInProgress(
//       inProgress.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
//     );

//   const addInProgressTask = (projIdx: number) =>
//     setInProgress(
//       inProgress.map((p, idx) =>
//         idx === projIdx ? { ...p, tasks: [...p.tasks, ""] } : p,
//       ),
//     );

//   const removeInProgressTask = (projIdx: number, taskIdx: number) =>
//     setInProgress(
//       inProgress.map((p, idx) =>
//         idx === projIdx
//           ? { ...p, tasks: p.tasks.filter((_, i) => i !== taskIdx) }
//           : p,
//       ),
//     );

//   // cleaner removal for in-progress tasks
//   const removeInProgressTaskClean = (projIdx: number, taskIdx: number) =>
//     setInProgress(
//       inProgress.map((p, idx) =>
//         idx === projIdx
//           ? { ...p, tasks: p.tasks.filter((_, i) => i !== taskIdx) }
//           : p,
//       ),
//     );

//   const updateInProgressTask = (
//     projIdx: number,
//     taskIdx: number,
//     value: string,
//   ) =>
//     setInProgress(
//       inProgress.map((p, idx) =>
//         idx === projIdx
//           ? { ...p, tasks: p.tasks.map((t, i) => (i === taskIdx ? value : t)) }
//           : p,
//       ),
//     );

//   /* ------------------------------- Queries (unchanged) ------------------------------- */
//   const addQuery = () => setQueries([...queries, { project: "", query: "" }]);

//   const removeQuery = (i: number) =>
//     setQueries(queries.filter((_, idx) => idx !== i));

//   const updateQuery = (
//     i: number,
//     patch: Partial<{ project: string; query: string }>,
//   ) =>
//     setQueries(queries.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

//   /* ------------------------------- Preview ------------------------------- */
//   // function buildMessage() {
//   //   const today = new Date().toLocaleDateString("en-GB");

//   //   let msg = `Here is the ${yourName}'s ${today} update.\n\n`;

//   //   /* ---------------- Worked-On ---------------- */
//   //   const hasWorked = workedOn.some((w) =>
//   //     (w.project || "").trim() || w.tasks.some((t) => (t.desc || "").trim()),
//   //   );

//   //   if (hasWorked) {
//   //     msg += `*Worked-On:*\n`;
//   //     workedOn.forEach((w) => {
//   //       const projectLabel = w.project ? `*[${w.project}]* ` : "";
//   //       w.tasks.forEach((t) => {
//   //         if ((t.desc || "").trim()) {
//   //           msg += `- ${projectLabel}${t.desc}${t.hrs ? ` (${t.hrs} hrs)` : ""}\n`;
//   //         }
//   //       });
//   //     });
//   //     msg += `\n`;
//   //   }

//   //   /* ---------------- In-Progress ---------------- */
//   //   const hasInProgress = inProgress.some((p) =>
//   //     (p.project || "").trim() || p.tasks.some((t) => (t || "").trim()),
//   //   );

//   //   if (hasInProgress) {
//   //     msg += `*-------------------------*\n`;
//   //     msg += `*In-Progress Task:*\n`;
//   //     inProgress.forEach((p) => {
//   //       const projectLabel = p.project ? `*[${p.project}]* ` : "";
//   //       p.tasks.forEach((t) => {
//   //         if ((t || "").trim()) {
//   //           msg += `- ${projectLabel}${t}\n`;
//   //         }
//   //       });
//   //     });
//   //     msg += `\n`;
//   //   }

//   //   /* ---------------- Queries ---------------- */
//   //   if (
//   //     queries.some((q) => (q.project || "").trim() || (q.query || "").trim())
//   //   ) {
//   //     msg += `*-------------------------*\n`;
//   //     msg += `*Query:*\n`;
//   //     queries.forEach((q) => {
//   //       if ((q.project || "").trim() || (q.query || "").trim()) {
//   //         msg += `- ${q.project ? `*[${q.project}]*` : ""} ${q.query || ""}\n`;
//   //       }
//   //     });
//   //     msg += `\n`;
//   //   }

//   //   msg += `Thank You,\n${yourName || ""}`;

//   //   return msg;
//   // }

//   function buildMessage() {
//     const today = new Date().toLocaleDateString("en-GB");

//     let msg = `Here is the ${yourName}'s ${today} update.\n\n`;

//     /* ===================== Worked-On ===================== */
//     const hasWorked = workedOn.some(
//       (w) =>
//         (w.project || "").trim() || w.tasks.some((t) => (t.desc || "").trim()),
//     );

//     if (hasWorked) {
//       msg += `*Worked-On:*\n`;

//       workedOn.forEach((w) => {
//         if (!w.project && w.tasks.every((t) => !t.desc.trim())) return;

//         if (w.project) {
//           msg += `- *[${w.project || ""}]*\n`;
//         }

//         w.tasks.forEach((t) => {
//           if ((t.desc || "").trim()) {
//             msg += `   - ${t.desc}${t.hrs ? ` (${t.hrs} hrs)` : ""}\n`;
//           }
//         });

//         msg += `\n`;
//       });
//     }

//     /* ===================== In-Progress ===================== */
//     const hasInProgress = inProgress.some(
//       (p) => (p.project || "").trim() || p.tasks.some((t) => (t || "").trim()),
//     );

//     if (hasInProgress) {
//       msg += `*-------------------------*\n`;
//       msg += `*In-Progress Task:*\n`;

//       inProgress.forEach((p) => {
//         if (!p.project && p.tasks.every((t) => !t.trim())) return;

//         if (p.project) {
//           msg += `- *[${p.project || ""}]*\n`;
//         }

//         p.tasks.forEach((t) => {
//           if ((t || "").trim()) {
//             msg += `   - ${t}\n`;
//           }
//         });

//         msg += `\n`;
//       });
//     }

//     /* ===================== Query ===================== */
//     const hasQueries = queries.some(
//       (q) => (q.project || "").trim() || (q.query || "").trim(),
//     );

//     if (hasQueries) {
//       msg += `*-------------------------*\n`;
//       msg += `*Query:*\n`;

//       queries.forEach((q) => {
//         if (!q.project && !(q.query || "").trim()) return;

//         if (q.project) {
//           msg += `- *[${q.project || ""}]*\n`;
//         }

//         if ((q.query || "").trim()) {
//           msg += `   - ${q.query}\n`;
//         }

//         msg += `\n`;
//       });
//     }

//     msg += `Thank You,\n${yourName || ""}`;

//     return msg;
//   }

//   const copyMessage = () => {
//     navigator.clipboard.writeText(buildMessage());
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   function sendToWhatsApp() {
//     const message = encodeURIComponent(buildMessage());
//     const url = `https://wa.me/?text=${message}`;
//     window.open(url, "_blank");
//   }

//   /* ------------------------------- UI ------------------------------- */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
//       <div className="max-w-5xl mx-auto">
//         <Header teamName="Write" />
//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* LEFT: FORM */}
//           <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
//             {/* Your Name */}
//             <div>
//               <label className="text-sm font-semibold text-gray-800">
//                 Your Name:
//               </label>
//               <input
//                 value={yourName}
//                 onChange={(e) => setYourName(e.target.value)}
//                 placeholder="Name"
//                 className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>

//             {/* Worked On */}
//             <div>
//               <label className="text-sm font-semibold text-gray-800">
//                 Worked-On:
//               </label>
//               <div className="space-y-3 mt-2">
//                 {workedOn.map((w, i) => (
//                   <div
//                     key={i}
//                     className="p-3 border border-gray-400 rounded-lg bg-gray-50 space-y-3"
//                   >
//                     <div className="flex gap-3 items-center">
//                       <input
//                         value={w.project}
//                         onChange={(e) =>
//                           updateWorkedProject(i, { project: e.target.value })
//                         }
//                         placeholder="Project Name"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                       />

//                       {workedOn.length > 1 && (
//                         <button
//                           onClick={() => removeWorkedProject(i)}
//                           className="text-red-600 border border-red-300 rounded p-1"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       )}

//                       {i === workedOn.length - 1 && (
//                         <button
//                           onClick={addWorkedProject}
//                           className="text-green-600 border border-green-300 rounded p-1"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>

//                     {/* tasks within project */}
//                     <div className="space-y-2">
//                       {w.tasks.map((t, ti) => (
//                         <div
//                           key={ti}
//                           className="flex flex-wrap gap-3 items-center"
//                         >
//                           <input
//                             value={t.desc}
//                             onChange={(e) =>
//                               updateWorkedTask(i, ti, { desc: e.target.value })
//                             }
//                             placeholder="Task"
//                             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//                           />

//                           <input
//                             type="number"
//                             value={t.hrs}
//                             onChange={(e) =>
//                               updateWorkedTask(i, ti, { hrs: e.target.value })
//                             }
//                             placeholder="hrs"
//                             className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
//                           />

//                           {w.tasks.length > 1 && (
//                             <button
//                               onClick={() => removeWorkedTask(i, ti)}
//                               className="text-red-600 border border-red-300 rounded p-1"
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           )}

//                           {ti === w.tasks.length - 1 && (
//                             <button
//                               onClick={() => addWorkedTask(i)}
//                               className="text-green-600 border border-green-300 rounded p-1"
//                             >
//                               <Plus className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* In Progress */}
//             <div>
//               <label className="text-sm font-semibold text-gray-800">
//                 In-Progress:
//               </label>

//               <div className="space-y-3 mt-2">
//                 {inProgress.map((p, i) => (
//                   <div
//                     key={i}
//                     className="p-3 border border-gray-400 rounded-lg bg-gray-50 space-y-3"
//                   >
//                     <div className="flex gap-3 items-center">
//                       <input
//                         value={p.project}
//                         onChange={(e) =>
//                           updateInProgressProject(i, {
//                             project: e.target.value,
//                           })
//                         }
//                         placeholder="Project Name"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                       />

//                       {inProgress.length > 1 && (
//                         <button
//                           onClick={() => removeInProgressProject(i)}
//                           className="text-red-600 border border-red-300 rounded p-1"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       )}

//                       {i === inProgress.length - 1 && (
//                         <button
//                           onClick={addInProgressProject}
//                           className="text-green-600 border border-green-300 rounded p-1"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>

//                     {/* tasks within in-progress project */}
//                     <div className="space-y-2">
//                       {p.tasks.map((t, ti) => (
//                         <div key={ti} className="flex gap-3 items-center">
//                           <input
//                             value={t}
//                             onChange={(e) =>
//                               updateInProgressTask(i, ti, e.target.value)
//                             }
//                             placeholder="Task"
//                             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//                           />

//                           {p.tasks.length > 1 && (
//                             <button
//                               onClick={() => removeInProgressTaskClean(i, ti)}
//                               className="text-red-600 border border-red-300 rounded p-1"
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           )}

//                           {ti === p.tasks.length - 1 && (
//                             <button
//                               onClick={() => addInProgressTask(i)}
//                               className="text-green-600 border border-green-300 rounded p-1"
//                             >
//                               <Plus className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Query */}
//             <div>
//               <label className="text-sm font-semibold text-gray-800">
//                 Query:
//               </label>

//               <div className="space-y-3 mt-2">
//                 {queries.map((q, i) => (
//                   <div
//                     key={i}
//                     className="flex flex-wrap gap-3 p-3 border border-gray-400 rounded-lg bg-gray-50"
//                   >
//                     <input
//                       value={q.project}
//                       onChange={(e) =>
//                         updateQuery(i, { project: e.target.value })
//                       }
//                       placeholder="Project Name"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                     />

//                     <input
//                       value={q.query}
//                       onChange={(e) =>
//                         updateQuery(i, { query: e.target.value })
//                       }
//                       placeholder="Enter query"
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//                     />

//                     {i === queries.length - 1 && (
//                       <button
//                         onClick={addQuery}
//                         className="text-green-600 border border-green-300 rounded p-1"
//                       >
//                         <Plus className="w-4 h-4" />
//                       </button>
//                     )}

//                     {queries.length > 1 && (
//                       <button
//                         onClick={() => removeQuery(i)}
//                         className="text-red-600 border border-red-300 rounded p-1"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: PREVIEW */}
//           <div className="bg-white shadow-md rounded-xl p-6 h-fit relative">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-lg">Preview</h2>

//               <button
//                 onClick={copyMessage}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//               >
//                 {copied ? (
//                   <>
//                     <Check className="w-4 h-4" /> Copied!
//                   </>
//                 ) : (
//                   <>
//                     <Copy className="w-4 h-4" /> Copy
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="border border-gray-400 p-4 rounded-lg bg-gray-50 min-h-[300px] mb-6">
//               <pre className="whitespace-pre-wrap text-sm ">
//                 {buildMessage()}
//               </pre>

//               <button
//                 onClick={sendToWhatsApp}
//                 className="absolute bottom-1 right-5 z-50 flex items-center gap-2 px-3 py-2 bg-green-700 text-white rounded-full hover:opacity-90 active:scale-95 transition-all text-sm font-bold shadow-lg"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
//                 </svg>
//                 WhatsApp
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Copy, Check, History, ChevronDown } from "lucide-react";
import { Header } from "@/component";

interface WorkedOnTask {
  desc: string;
  hrs: string;
}

interface WorkedOnProject {
  project: string;
  tasks: WorkedOnTask[];
}

interface InProgressProject {
  project: string;
  tasks: string[];
}

interface Query {
  project: string;
  query: string;
}

interface DailyStatus {
  date: string;
  yourName: string;
  workedOn: WorkedOnProject[];
  inProgress: InProgressProject[];
  queries: Query[];
}

export default function GeneralUpdatePage() {
  const [workedOn, setWorkedOn] = useState<WorkedOnProject[]>([
    { project: "", tasks: [{ desc: "", hrs: "" }] },
  ]);

  const [inProgress, setInProgress] = useState<InProgressProject[]>([
    { project: "", tasks: [""] },
  ]);

  const [queries, setQueries] = useState<Query[]>([
    { project: "", query: "" },
  ]);

  const [yourName, setYourName] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<DailyStatus[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showProjectSuggestions, setShowProjectSuggestions] = useState<{
    [key: string]: boolean;
  }>({});

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("statusHistory");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  // Get unique names from history
  const getNameSuggestions = (): string[] => {
    const names = history
      .map((h) => h.yourName)
      .filter((name) => name && name.trim());
    return Array.from(new Set(names));
  };

  // Get unique project names from history
  const getProjectSuggestions = (): string[] => {
    const projects = new Set<string>();
    
    history.forEach((h) => {
      h.workedOn.forEach((w) => {
        if (w.project && w.project.trim()) projects.add(w.project);
      });
      h.inProgress.forEach((p) => {
        if (p.project && p.project.trim()) projects.add(p.project);
      });
      h.queries.forEach((q) => {
        if (q.project && q.project.trim()) projects.add(q.project);
      });
    });

    return Array.from(projects);
  };

  // Save current status to history
  const saveToHistory = () => {
    const today = new Date().toISOString().split("T")[0];
    
    const newEntry: DailyStatus = {
      date: today,
      yourName,
      workedOn: JSON.parse(JSON.stringify(workedOn)),
      inProgress: JSON.parse(JSON.stringify(inProgress)),
      queries: JSON.parse(JSON.stringify(queries)),
    };

    // Remove entry for today if it exists, then add new one
    const updatedHistory = history.filter((h) => h.date !== today);
    updatedHistory.unshift(newEntry);

    // Keep only last 7 days
    const last7Days = updatedHistory.slice(0, 7);
    
    setHistory(last7Days);
    localStorage.setItem("statusHistory", JSON.stringify(last7Days));
  };

  // Load a status from history
  const loadFromHistory = (entry: DailyStatus) => {
    setYourName(entry.yourName);
    setWorkedOn(JSON.parse(JSON.stringify(entry.workedOn)));
    setInProgress(JSON.parse(JSON.stringify(entry.inProgress)));
    setQueries(JSON.parse(JSON.stringify(entry.queries)));
    setShowHistory(false);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today";
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  /* ------------------------------- Worked-On handlers ------------------------------- */
  const addWorkedProject = () =>
    setWorkedOn([...workedOn, { project: "", tasks: [{ desc: "", hrs: "" }] }]);

  const removeWorkedProject = (i: number) =>
    setWorkedOn(workedOn.filter((_, idx) => idx !== i));

  const updateWorkedProject = (
    i: number,
    patch: Partial<{ project: string }>,
  ) =>
    setWorkedOn(workedOn.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));

  const addWorkedTask = (projIdx: number) =>
    setWorkedOn(
      workedOn.map((w, idx) =>
        idx === projIdx
          ? { ...w, tasks: [...w.tasks, { desc: "", hrs: "" }] }
          : w,
      ),
    );

  const removeWorkedTask = (projIdx: number, taskIdx: number) =>
    setWorkedOn(
      workedOn.map((w, idx) =>
        idx === projIdx
          ? { ...w, tasks: w.tasks.filter((_, tIdx) => tIdx !== taskIdx) }
          : w,
      ),
    );

  const updateWorkedTask = (
    projIdx: number,
    taskIdx: number,
    patch: Partial<{ desc: string; hrs: string }>,
  ) =>
    setWorkedOn(
      workedOn.map((w, idx) =>
        idx === projIdx
          ? {
              ...w,
              tasks: w.tasks.map((t, tIdx) =>
                tIdx === taskIdx ? { ...t, ...patch } : t,
              ),
            }
          : w,
      ),
    );

  /* ------------------------------- In-Progress handlers ------------------------------- */
  const addInProgressProject = () =>
    setInProgress([...inProgress, { project: "", tasks: [""] }]);

  const removeInProgressProject = (i: number) =>
    setInProgress(inProgress.filter((_, idx) => idx !== i));

  const updateInProgressProject = (
    i: number,
    patch: Partial<{ project: string }>,
  ) =>
    setInProgress(
      inProgress.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    );

  const addInProgressTask = (projIdx: number) =>
    setInProgress(
      inProgress.map((p, idx) =>
        idx === projIdx ? { ...p, tasks: [...p.tasks, ""] } : p,
      ),
    );

  const removeInProgressTask = (projIdx: number, taskIdx: number) =>
    setInProgress(
      inProgress.map((p, idx) =>
        idx === projIdx
          ? { ...p, tasks: p.tasks.filter((_, i) => i !== taskIdx) }
          : p,
      ),
    );

  const updateInProgressTask = (
    projIdx: number,
    taskIdx: number,
    value: string,
  ) =>
    setInProgress(
      inProgress.map((p, idx) =>
        idx === projIdx
          ? { ...p, tasks: p.tasks.map((t, i) => (i === taskIdx ? value : t)) }
          : p,
      ),
    );

  /* ------------------------------- Queries handlers ------------------------------- */
  const addQuery = () => setQueries([...queries, { project: "", query: "" }]);

  const removeQuery = (i: number) =>
    setQueries(queries.filter((_, idx) => idx !== i));

  const updateQuery = (
    i: number,
    patch: Partial<{ project: string; query: string }>,
  ) =>
    setQueries(queries.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  /* ------------------------------- Build Message ------------------------------- */
  function buildMessage() {
    const today = new Date().toLocaleDateString("en-GB");

    let msg = `Here is the ${yourName}'s ${today} update.\n\n`;

    const hasWorked = workedOn.some(
      (w) =>
        (w.project || "").trim() || w.tasks.some((t) => (t.desc || "").trim()),
    );

    if (hasWorked) {
      msg += `*Worked-On:*\n`;

      workedOn.forEach((w) => {
        if (!w.project && w.tasks.every((t) => !t.desc.trim())) return;

        if (w.project) {
          msg += `- *[${w.project || ""}]*\n`;
        }

        w.tasks.forEach((t) => {
          if ((t.desc || "").trim()) {
            msg += `   - ${t.desc}${t.hrs ? ` (${t.hrs} hrs)` : ""}\n`;
          }
        });

        msg += `\n`;
      });
    }

    const hasInProgress = inProgress.some(
      (p) => (p.project || "").trim() || p.tasks.some((t) => (t || "").trim()),
    );

    if (hasInProgress) {
      msg += `*-------------------------*\n`;
      msg += `*In-Progress Task:*\n`;

      inProgress.forEach((p) => {
        if (!p.project && p.tasks.every((t) => !t.trim())) return;

        if (p.project) {
          msg += `- *[${p.project || ""}]*\n`;
        }

        p.tasks.forEach((t) => {
          if ((t || "").trim()) {
            msg += `   - ${t}\n`;
          }
        });

        msg += `\n`;
      });
    }

    const hasQueries = queries.some(
      (q) => (q.project || "").trim() || (q.query || "").trim(),
    );

    if (hasQueries) {
      msg += `*-------------------------*\n`;
      msg += `*Query:*\n`;

      queries.forEach((q) => {
        if (!q.project && !(q.query || "").trim()) return;

        if (q.project) {
          msg += `- *[${q.project || ""}]*\n`;
        }

        if ((q.query || "").trim()) {
          msg += `   - ${q.query}\n`;
        }

        msg += `\n`;
      });
    }

    msg += `Thank You,\n${yourName || ""}`;

    return msg;
  }

  const copyMessage = () => {
    saveToHistory();
    navigator.clipboard.writeText(buildMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function sendToWhatsApp() {
    // Save to history before sending
    saveToHistory();
    
    const message = encodeURIComponent(buildMessage());
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  }

  /* ------------------------------- UI ------------------------------- */
  const nameSuggestions = getNameSuggestions();
  const projectSuggestions = getProjectSuggestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <Header teamName="Write" />
        
        {/* History Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50"
          >
            <History className="w-4 h-4" />
            History ({history.length})
          </button>
        </div>

        {/* History Dropdown */}
        {showHistory && history.length > 0 && (
          <div className="mb-6 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <h3 className="font-semibold mb-3">Last 7 Days</h3>
            <div className="space-y-2">
              {history.map((entry, idx) => (
                <button
                  key={idx}
                  onClick={() => loadFromHistory(entry)}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{entry.yourName || "Unnamed"}</div>
                    <div className="text-sm text-gray-500">{formatDate(entry.date)}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: FORM */}
          <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            {/* Your Name with Suggestions */}
            <div className="relative">
              <label className="text-sm font-semibold text-gray-800">
                Your Name:
              </label>
              <input
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                onFocus={() => setShowNameSuggestions(true)}
                onBlur={() => setTimeout(() => setShowNameSuggestions(false), 200)}
                placeholder="Name"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              {showNameSuggestions && nameSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {nameSuggestions.map((name, idx) => (
                    <button
                      key={idx}
                      onMouseDown={() => {
                        setYourName(name);
                        setShowNameSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Worked On */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Worked-On:
              </label>
              <div className="space-y-3 mt-2">
                {workedOn.map((w, i) => (
                  <div
                    key={i}
                    className="p-3 border border-gray-400 rounded-lg bg-gray-50 space-y-3"
                  >
                    <div className="flex gap-3 items-center relative">
                      <div className="flex-1 relative">
                        <input
                          value={w.project}
                          onChange={(e) =>
                            updateWorkedProject(i, { project: e.target.value })
                          }
                          onFocus={() =>
                            setShowProjectSuggestions({
                              ...showProjectSuggestions,
                              [`worked-${i}`]: true,
                            })
                          }
                          onBlur={() =>
                            setTimeout(
                              () =>
                                setShowProjectSuggestions({
                                  ...showProjectSuggestions,
                                  [`worked-${i}`]: false,
                                }),
                              200,
                            )
                          }
                          placeholder="Project Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        {showProjectSuggestions[`worked-${i}`] &&
                          projectSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {projectSuggestions.map((proj, idx) => (
                                <button
                                  key={idx}
                                  onMouseDown={() => {
                                    updateWorkedProject(i, { project: proj });
                                    setShowProjectSuggestions({
                                      ...showProjectSuggestions,
                                      [`worked-${i}`]: false,
                                    });
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                >
                                  {proj}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      {workedOn.length > 1 && (
                        <button
                          onClick={() => removeWorkedProject(i)}
                          className="text-red-600 border border-red-300 rounded p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {i === workedOn.length - 1 && (
                        <button
                          onClick={addWorkedProject}
                          className="text-green-600 border border-green-300 rounded p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* tasks within project */}
                    <div className="space-y-2">
                      {w.tasks.map((t, ti) => (
                        <div
                          key={ti}
                          className="flex flex-wrap gap-3 items-center"
                        >
                          <input
                            value={t.desc}
                            onChange={(e) =>
                              updateWorkedTask(i, ti, { desc: e.target.value })
                            }
                            placeholder="Task"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          />

                          <input
                            type="number"
                            value={t.hrs}
                            onChange={(e) =>
                              updateWorkedTask(i, ti, { hrs: e.target.value })
                            }
                            placeholder="hrs"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                          />

                          {w.tasks.length > 1 && (
                            <button
                              onClick={() => removeWorkedTask(i, ti)}
                              className="text-red-600 border border-red-300 rounded p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {ti === w.tasks.length - 1 && (
                            <button
                              onClick={() => addWorkedTask(i)}
                              className="text-green-600 border border-green-300 rounded p-1"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                In-Progress:
              </label>

              <div className="space-y-3 mt-2">
                {inProgress.map((p, i) => (
                  <div
                    key={i}
                    className="p-3 border border-gray-400 rounded-lg bg-gray-50 space-y-3"
                  >
                    <div className="flex gap-3 items-center relative">
                      <div className="flex-1 relative">
                        <input
                          value={p.project}
                          onChange={(e) =>
                            updateInProgressProject(i, {
                              project: e.target.value,
                            })
                          }
                          onFocus={() =>
                            setShowProjectSuggestions({
                              ...showProjectSuggestions,
                              [`progress-${i}`]: true,
                            })
                          }
                          onBlur={() =>
                            setTimeout(
                              () =>
                                setShowProjectSuggestions({
                                  ...showProjectSuggestions,
                                  [`progress-${i}`]: false,
                                }),
                              200,
                            )
                          }
                          placeholder="Project Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        {showProjectSuggestions[`progress-${i}`] &&
                          projectSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {projectSuggestions.map((proj, idx) => (
                                <button
                                  key={idx}
                                  onMouseDown={() => {
                                    updateInProgressProject(i, {
                                      project: proj,
                                    });
                                    setShowProjectSuggestions({
                                      ...showProjectSuggestions,
                                      [`progress-${i}`]: false,
                                    });
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                >
                                  {proj}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      {inProgress.length > 1 && (
                        <button
                          onClick={() => removeInProgressProject(i)}
                          className="text-red-600 border border-red-300 rounded p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {i === inProgress.length - 1 && (
                        <button
                          onClick={addInProgressProject}
                          className="text-green-600 border border-green-300 rounded p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* tasks within in-progress project */}
                    <div className="space-y-2">
                      {p.tasks.map((t, ti) => (
                        <div key={ti} className="flex gap-3 items-center">
                          <input
                            value={t}
                            onChange={(e) =>
                              updateInProgressTask(i, ti, e.target.value)
                            }
                            placeholder="Task"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          />

                          {p.tasks.length > 1 && (
                            <button
                              onClick={() => removeInProgressTask(i, ti)}
                              className="text-red-600 border border-red-300 rounded p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {ti === p.tasks.length - 1 && (
                            <button
                              onClick={() => addInProgressTask(i)}
                              className="text-green-600 border border-green-300 rounded p-1"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Query */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Query:
              </label>

              <div className="space-y-3 mt-2">
                {queries.map((q, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap gap-3 p-3 border border-gray-400 rounded-lg bg-gray-50"
                  >
                    <div className="w-full relative">
                      <input
                        value={q.project}
                        onChange={(e) =>
                          updateQuery(i, { project: e.target.value })
                        }
                        onFocus={() =>
                          setShowProjectSuggestions({
                            ...showProjectSuggestions,
                            [`query-${i}`]: true,
                          })
                        }
                        onBlur={() =>
                          setTimeout(
                            () =>
                              setShowProjectSuggestions({
                                ...showProjectSuggestions,
                                [`query-${i}`]: false,
                              }),
                            200,
                          )
                        }
                        placeholder="Project Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {showProjectSuggestions[`query-${i}`] &&
                        projectSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                            {projectSuggestions.map((proj, idx) => (
                              <button
                                key={idx}
                                onMouseDown={() => {
                                  updateQuery(i, { project: proj });
                                  setShowProjectSuggestions({
                                    ...showProjectSuggestions,
                                    [`query-${i}`]: false,
                                  });
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                              >
                                {proj}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>

                    <input
                      value={q.query}
                      onChange={(e) =>
                        updateQuery(i, { query: e.target.value })
                      }
                      placeholder="Enter query"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    {i === queries.length - 1 && (
                      <button
                        onClick={addQuery}
                        className="text-green-600 border border-green-300 rounded p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}

                    {queries.length > 1 && (
                      <button
                        onClick={() => removeQuery(i)}
                        className="text-red-600 border border-red-300 rounded p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Save to History Button */}
            {/* <div className="pt-4">
              <button
                onClick={saveToHistory}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <History className="w-4 h-4" />
                Save to History
              </button>
            </div> */}
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="bg-white shadow-md rounded-xl p-6 h-fit relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Preview</h2>

              <button
                onClick={copyMessage}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
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

            <div className="border border-gray-400 p-4 rounded-lg bg-gray-50 min-h-[300px] mb-6">
              <pre className="whitespace-pre-wrap text-sm ">
                {buildMessage()}
              </pre>

              <button
                onClick={sendToWhatsApp}
                className="absolute bottom-1 right-5 z-50 flex items-center gap-2 px-3 py-2 bg-green-700 text-white rounded-full hover:opacity-90 active:scale-95 transition-all text-sm font-bold shadow-lg"
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