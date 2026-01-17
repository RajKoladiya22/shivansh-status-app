// "use client";

// import { motion } from "framer-motion";
// import { Mail, Clock } from "lucide-react";
// import Link from "next/link";

// export default function ComingSoon() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-xl w-full text-center"
//       >
//         <div className="flex justify-center mb-6">
//           <div className="p-4 rounded-2xl bg-white/10 backdrop-blur">
//             <Clock className="w-10 h-10 text-blue-400" />
//           </div>
//         </div>

//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           We’re Launching Soon
//         </h1>
//         <p className="text-slate-300 mb-8">
//           Our website is under construction. We’re working hard to bring you
//           something amazing. Stay tuned!
//         </p>

//         <Link
//           href={"/"}
//           className="rounded-xl bg-blue-600 hover:bg-blue-500 transition px-6 py-3 text-sm font-medium"
//         >
//           Home
//         </Link>

//         <p className="text-xs text-slate-400 mt-8">
//           © {new Date().getFullYear()} Shivansh Infosys. All rights reserved.
//         </p>
//       </motion.div>
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import { AutocompleteInput, Header, TaskList } from "@/component";
import { Copy, Check, Send } from "lucide-react";

export default function InternStatusPage() {
  const [internName, setInternName] = useState("");

  const [completed, setCompleted] = useState<string[]>([""]);
  const [inProgress, setInProgress] = useState<string[]>([""]);
  const [queries, setQueries] = useState<string[]>([""]);

  const [copied, setCopied] = useState(false);

  function buildMessage() {
    const today = new Date().toLocaleDateString("en-GB");

    let msg = `Intern Daily Status — ${today}\n`;
    msg += `Submitted by: ${internName || "—"}\n\n`;

    // 1. Completed
    msg += `1. Completed:\n`;
    if (completed.some((c) => c.trim())) {
      completed.forEach((c) => {
        if (c.trim()) msg += `- ${c}\n`;
      });
    } else {
      msg += `- None\n`;
    }
    msg += `\n`;

    // 2. In Progress
    msg += `2. In Progress:\n`;
    if (inProgress.some((i) => i.trim())) {
      inProgress.forEach((i) => {
        if (i.trim()) msg += `- ${i}\n`;
      });
    } else {
      msg += `- None\n`;
    }
    msg += `\n`;

    // 3. Query
    msg += `3. Query:\n`;
    if (queries.some((q) => q.trim())) {
      queries.forEach((q) => {
        if (q.trim()) msg += `- ${q}\n`;
      });
    } else {
      msg += `- None\n`;
    }

    return msg;
  }

  function copyToClipboard() {
    const txt = buildMessage();
    navigator.clipboard.writeText(txt);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const disableCopy = !internName.trim();

    function sendToWhatsApp() {
    const message = encodeURIComponent(buildMessage());
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {/* <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Intern Daily Status
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit your daily progress and learning.
          </p>
        </div> */}
        <Header teamName="Intern" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE: FORM */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-6">
            {/* Intern Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Intern Name *
              </label>
              <AutocompleteInput
                value={internName}
                onChange={setInternName}
                placeholder="Your name"
                historyKey="yourNames"
              />
            </div>

            {/* Completed */}

            <TaskList
              items={completed}
              setItems={setCompleted}
              title="Completed"
              addColor="bg-green-600"
            />

            {/* In Progress */}

            <TaskList
              items={inProgress}
              setItems={setInProgress}
              title="In Progress"
              addColor="bg-blue-600"
            />

            {/* Query */}

            <TaskList
              items={queries}
              setItems={setQueries}
              title="Query"
              addColor="bg-purple-600"
            />
          </div>

          {/* RIGHT SIDE: PREVIEW */}
          <div className="bg-white rounded-lg shadow-sm p-5 h-fit lg:sticky lg:top-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>

              <button
                onClick={copyToClipboard}
                disabled={disableCopy}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all shadow-md ${
                  disableCopy
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

            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-4 mb-9 border-2 border-gray-200 min-h-[280px] shadow-inner overflow-auto">
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
