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
import { Copy, Check } from "lucide-react";

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
          <div className="bg-white rounded-lg shadow-sm p-5 h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>

              <button
                onClick={copyToClipboard}
                disabled={disableCopy}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all shadow-md ${
                  disableCopy
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:scale-95"
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

            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 min-h-[280px] shadow-inner overflow-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                {buildMessage()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
