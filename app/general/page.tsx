"use client";
import React, { useState } from "react";
import { Plus, X, Copy, Check, Send } from "lucide-react";
import { Header } from "@/component";

export default function GeneralUpdatePage() {
  const [tlName, setTlName] = useState("");
  const [projectName, setProjectName] = useState("");

  const [workedOn, setWorkedOn] = useState([{ task: "", hrs: "" }]);
  const [inProgress, setInProgress] = useState([""]);
  const [queries, setQueries] = useState([""]);

  const [yourName, setYourName] = useState("");
  const [copied, setCopied] = useState(false);

  /* ------------------------------- Handlers ------------------------------- */
  const addWorked = () => setWorkedOn([...workedOn, { task: "", hrs: "" }]);

  const removeWorked = (i: number) =>
    setWorkedOn(workedOn.filter((_, idx) => idx !== i));

  const updateWorked = (i: number, patch: any) =>
    setWorkedOn(workedOn.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));

  const addInProgress = () => setInProgress([...inProgress, ""]);
  const removeInProgress = (i: number) =>
    setInProgress(inProgress.filter((_, idx) => idx !== i));

  const updateInProgress = (i: number, value: string) =>
    setInProgress(inProgress.map((x, idx) => (idx === i ? value : x)));

  const addQuery = () => setQueries([...queries, ""]);
  const removeQuery = (i: number) =>
    setQueries(queries.filter((_, idx) => idx !== i));

  const updateQuery = (i: number, value: string) =>
    setQueries(queries.map((x, idx) => (idx === i ? value : x)));

  /* ------------------------------- Preview ------------------------------- */

  function buildMessage() {
    const today = new Date().toLocaleDateString("en-GB");

    // let msg = `Here is the update of ${
    //   projectName || "Project"
    // } as on ${today}\n\n`;
    let msg = `Here is the ${yourName}'s ${today} update.\n\n`;

    if (projectName) {
      msg += `*Project:* ${projectName}\n\n`;
    } else msg += ``;

    // Worked-On
    if (workedOn.some((w) => w.task.trim())) {
      msg += `*Worked-On:*\n`;
      workedOn.forEach((w) => {
        if (w.task.trim()) {
          msg += `- ${w.task}${w.hrs ? ` [${w.hrs} hrs]` : ""}\n`;
        }
      });
    } else msg += ``;
    msg += `\n`;

    // In Progress
    if (inProgress.some((p) => p.trim())) {
      msg += `*In-Progress Task:*\n`;
      inProgress.forEach((p) => {
        if (p.trim()) msg += `- ${p}\n`;
      });
    } else msg += ``;
    msg += `\n`;

    // Queries
    if (queries.some((q) => q.trim())) {
      msg += `*Query:*\n`;
      queries.forEach((q) => {
        if (q.trim()) msg += `- ${q}\n`;
      });
    } else msg += ``;
    msg += `\n`;

    msg += `Thank You,\n${yourName || "—"}`;

    return msg;
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(buildMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function sendToWhatsApp() {
    const message = encodeURIComponent(buildMessage());
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  }

  /* ------------------------------- UI ------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <Header teamName="Write" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: FORM */}
          <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            {/* TL Name */}
            {/* <div>
              <label className="text-sm font-semibold text-gray-800">
                TL Name:
              </label>
              <input
                value={tlName}
                onChange={(e) => setTlName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div> */}
            {/* Your Name */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Your Name:
              </label>
              <input
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="Name"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Project Name */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Project Name:
              </label>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="New Project"
              />
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
                    className="flex flex-wrap gap-3 items-center p-3 border border-gray-400 rounded-lg bg-gray-50"
                  >
                    <input
                      value={w.task}
                      onChange={(e) =>
                        updateWorked(i, { task: e.target.value })
                      }
                      placeholder="Task"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      value={w.hrs}
                      onChange={(e) => updateWorked(i, { hrs: e.target.value })}
                      placeholder="hrs"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {/* <button
                      onClick={addWorked}
                      className="text-green-600 border border-green-300 rounded p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {workedOn.length > 1 && (
                      <button
                        onClick={() => removeWorked(i)}
                        className="text-red-600 border border-red-300 rounded p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )} */}
                    {/* Show Add button only on last row */}
                    {i === workedOn.length - 1 && (
                      <button
                        onClick={addWorked}
                        className="text-green-600 border border-green-300 rounded p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}

                    {/* Remove button (if more than one row) */}
                    {workedOn.length > 1 && (
                      <button
                        onClick={() => removeWorked(i)}
                        className="text-red-600 border border-red-300 rounded p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
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
                    className="flex gap-3 items-center p-3 border border-gray-400 rounded-lg bg-gray-50"
                  >
                    <input
                      value={p}
                      onChange={(e) => updateInProgress(i, e.target.value)}
                      placeholder="Task"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    {/* <button
                      onClick={addInProgress}
                      className="text-green-600 border border-green-300 rounded p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {inProgress.length > 1 && (
                      <button
                        onClick={() => removeInProgress(i)}
                        className="text-red-600 border border-red-300 rounded p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )} */}

                    {i === inProgress.length - 1 && (
                      <button
                        onClick={addInProgress}
                        className="text-green-600 border border-green-300 rounded p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}

                    {/* Remove button (if more than one row) */}
                    {inProgress.length > 1 && (
                      <button
                        onClick={() => removeInProgress(i)}
                        className="text-red-600 border border-red-300 rounded p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
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
                    className="flex gap-3 items-center p-3 border border-gray-400 rounded-lg bg-gray-50"
                  >
                    <input
                      value={q}
                      onChange={(e) => updateQuery(i, e.target.value)}
                      placeholder="Enter query"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    {/* <button
                      onClick={addQuery}
                      className="text-green-600 border border-green-300 rounded p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {queries.length > 1 && (
                      <button
                        onClick={() => removeQuery(i)}
                        className="text-red-600 border border-red-300 rounded p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )} */}

                    {i === queries.length - 1 && (
                      <button
                        onClick={addQuery}
                        className="text-green-600 border border-green-300 rounded p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}

                    {/* Remove button (if more than one row) */}
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

            <div className="border border-gray-400 p-4 rounded-lg bg-gray-50 min-h-[300px] mb-9">
              <pre className="whitespace-pre-wrap text-sm ">
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
    </div>
  );
}
