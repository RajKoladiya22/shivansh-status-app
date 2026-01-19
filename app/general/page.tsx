"use client";
import React, { useState } from "react";
import { Plus, X, Copy, Check, Send } from "lucide-react";
import { Header } from "@/component";

export default function GeneralUpdatePage() {
  const [workedOn, setWorkedOn] = useState<
    { project: string; task: string; hrs: string }[]
  >([{ project: "", task: "", hrs: "" }]);

  const [inProgress, setInProgress] = useState<
    { project: string; task: string }[]
  >([{ project: "", task: "" }]);

  const [queries, setQueries] = useState<{ project: string; query: string }[]>([
    { project: "", query: "" },
  ]);

  const [yourName, setYourName] = useState("");
  const [copied, setCopied] = useState(false);

  /* ------------------------------- Handlers ------------------------------- */
  const addWorked = () =>
    setWorkedOn([...workedOn, { project: "", task: "", hrs: "" }]);

  const removeWorked = (i: number) =>
    setWorkedOn(workedOn.filter((_, idx) => idx !== i));

  const updateWorked = (
    i: number,
    patch: Partial<{ project: string; task: string; hrs: string }>,
  ) =>
    setWorkedOn(workedOn.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));

  const addInProgress = () =>
    setInProgress([...inProgress, { project: "", task: "" }]);

  const removeInProgress = (i: number) =>
    setInProgress(inProgress.filter((_, idx) => idx !== i));

  const updateInProgress = (
    i: number,
    patch: Partial<{ project: string; task: string }>,
  ) =>
    setInProgress(
      inProgress.map((x, idx) => (idx === i ? { ...x, ...patch } : x)),
    );

  const addQuery = () => setQueries([...queries, { project: "", query: "" }]);

  const removeQuery = (i: number) =>
    setQueries(queries.filter((_, idx) => idx !== i));

  const updateQuery = (
    i: number,
    patch: Partial<{ project: string; query: string }>,
  ) =>
    setQueries(queries.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  /* ------------------------------- Preview ------------------------------- */

  function buildMessage() {
    const today = new Date().toLocaleDateString("en-GB");

    let msg = `Here is the ${yourName}'s ${today} update.\n\n`;

    /* ---------------- Worked-On ---------------- */
    if (
      workedOn.some((w) => (w.project || "").trim() || (w.task || "").trim())
    ) {
      msg += `*Worked-On:*\n`;
      workedOn.forEach((w) => {
        if ((w.project || "").trim() || (w.task || "").trim()) {
          msg += `- ${w.project ? `*[${w.project || ""}]*` : ""}  ${w.task}${
            w.hrs ? ` (${w.hrs} hrs)` : ""
          }\n`;
        }
      });
      msg += `\n`;
    }

    /* ---------------- In-Progress ---------------- */
    if (
      inProgress.some((p) => (p.project || "").trim() || (p.task || "").trim())
    ) {
      msg += `*In-Progress Task:*\n`;
      inProgress.forEach((p) => {
        if ((p.project || "").trim() || (p.task || "").trim()) {
          msg += `- ${p.project ? `*[${p.project || ""}]*` : ""} ${p.task || ""}\n`;
        }
      });
      msg += `\n`;
    }

    /* ---------------- Queries ---------------- */
    if (
      queries.some((q) => (q.project || "").trim() || (q.query || "").trim())
    ) {
      msg += `*Query:*\n`;
      queries.forEach((q) => {
        if ((q.project || "").trim() || (q.query || "").trim()) {
          msg += `- ${q.project ? `*[${q.project || ""}]*` : ""} ${q.query || ""}\n`;
        }
      });
      msg += `\n`;
    }

    msg += `Thank You,\n${yourName || ""}`;

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

            {/* Worked On */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Worked-On:
              </label>
              <div className="space-y-3 mt-2">
                {workedOn.map((w, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap gap-3 p-3 border border-gray-400 rounded-lg bg-gray-50"
                  >
                    <input
                      value={w.project}
                      onChange={(e) =>
                        updateWorked(i, { project: e.target.value })
                      }
                      placeholder="Project Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />

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

                    {i === workedOn.length - 1 && (
                      <button
                        onClick={addWorked}
                        className="text-green-600 border border-green-300 rounded p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}

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
                    className="flex flex-wrap gap-3 p-3 border border-gray-400 rounded-lg bg-gray-50"
                  >
                    <input
                      value={p.project}
                      onChange={(e) =>
                        updateInProgress(i, { project: e.target.value })
                      }
                      placeholder="Project Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    <input
                      value={p.task}
                      onChange={(e) =>
                        updateInProgress(i, { task: e.target.value })
                      }
                      placeholder="Task"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    {i === inProgress.length - 1 && (
                      <button
                        onClick={addInProgress}
                        className="text-green-600 border border-green-300 rounded p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}

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
                    className="flex flex-wrap gap-3 p-3 border border-gray-400 rounded-lg bg-gray-50"
                  >
                    <input
                      value={q.project}
                      onChange={(e) =>
                        updateQuery(i, { project: e.target.value })
                      }
                      placeholder="Project Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />

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
                className="absolute bottom-1 right-5 z-50 flex items-center gap-2 
             px-3 py-2 bg-green-700 text-white rounded-full 
             hover:opacity-90 active:scale-95 transition-all 
             text-sm font-bold shadow-lg"
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
