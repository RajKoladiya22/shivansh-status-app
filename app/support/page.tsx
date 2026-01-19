"use client";
import { useMemo, useState } from "react";
import { Copy, Check, Send } from "lucide-react";
import TodayLearningSection, {
  AutocompleteInput,
  getRecentUpdates,
  Header,
  HistoryPanel,
  Preview,
  saveStatusUpdate,
  saveToHistory,
  TaskList,
} from "@/component";
import ExpertQuerySection from "@/component/ExpertQuerySection";

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

/* ----------------------------- Main Page ----------------------------- */
export default function StatusUpdateCreator() {
  const [tlName, setTlName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [workedOn, setWorkedOn] = useState<string[]>([""]);
  const [inProgress, setInProgress] = useState<string[]>([""]);
  const [learnings, setLearnings] = useState<string[]>([""]);
  const [queries, setQueries] = useState<string[]>([""]);
  const [yourName, setYourName] = useState("");
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expertQueries, setExpertQueries] = useState([
    { expert: "", query: "" },
  ]);

  const historyUpdates = useMemo(() => getRecentUpdates(), []);
  function parseTask(item: string) {
    const parts = item.split(" - ");

    return {
      product: parts[0] || "",
      customer: parts[1] || "",
      contact: parts.length >= 4 ? parts[2] : "",
      comment: parts.length >= 4 ? parts[3] : parts[2] || "",
      status: parts.length === 5 ? parts[4] : parts[3] || "",
    };
  }

  function buildMessage() {
    const formatTask = (item: string) => {
      const { product, customer, contact, comment, status } = parseTask(item);

      return [
        product ? `• *Product:* ${product}` : "",
        customer ? `  *Customer:* ${customer}` : "",
        contact ? `  *Contact:* ${contact}` : "",
        status ? `  *Status:* ${status}` : "",
        comment ? `  *Comment:* ${comment}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    };

    const today = new Date().toLocaleDateString("en-GB");
    let message = `Support Team *${yourName}'s* Daily Status of ${projectName} ${today}\n\n`;

    if (workedOn.some((i) => i.trim())) {
      message += `*Worked-On:*\n`;
      workedOn.forEach((item) => {
        if (item.trim()) message += `${formatTask(item)}\n\n`;
      });
    }

    if (inProgress.some((i) => i.trim())) {
      message += `*In-Progress Task:*\n`;
      inProgress.forEach((item) => {
        if (item.trim()) message += `${formatTask(item)}\n\n`;
      });
    }

    if (learnings.some((i) => i.trim())) {
      message += `*My Today Learning:*\n`;
      learnings.forEach((item) => {
        if (item.trim()) message += `- ${item}\n`;
      });
      message += `\n`;
    }

    if (queries.some((i) => i.trim())) {
      message += `*Query:*\n`;
      queries.forEach((item) => {
        if (item.trim()) message += `- ${formatTask(item)}\n`;
      });
      message += `\n`;
    }

    if (expertQueries.some((q) => q.expert.trim() || q.query.trim())) {
      message += `Any Query from Expert:\n`;
      expertQueries.forEach((q) => {
        if (q.expert.trim() || q.query.trim()) {
          message += `- *Expert:* _${q.expert || "—"}_\n`;
          message += `  *Query:* _${q.query || "—"}_\n\n`;
        }
      });
    }

    message += `*Submitted by:* ${yourName}`;

    return message;
  }

  function copyToClipboard() {
    const formatTask = (item: string) => {
      const [product, customer, contact, comment, status] = item.split(" - ");

      return [
        product ? `• *Product:* ${product}` : "",
        customer ? `  *Customer:* ${customer}` : "",
        contact ? `  *Contact:* ${contact}` : "",
        status ? `  *Status:* ${status}` : "",
        comment ? `  *Comment:* ${comment}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    };

    const today = new Date().toLocaleDateString("en-GB");
    let message = `Account Team *${yourName}'s* Daily Status of ${projectName} ${today}\n\n`;

    if (workedOn.some((i) => i.trim())) {
      message += `*Worked-On:*\n`;
      workedOn.forEach((item) => {
        // console.log(item);
        
        if (item.trim()) message += `${formatTask(item)}\n\n`;
      });
    }

    if (inProgress.some((i) => i.trim())) {
      message += `\n*In-Progress Task:*\n`;
      inProgress.forEach((item) => {
        if (item.trim()) message += `${formatTask(item)}\n\n`;
      });
    }

    if (queries.some((i) => i.trim())) {
      message += `\n*Query:*\n`;
      queries.forEach((item) =>
        item.trim() ? (message += `- ${formatTask(item)}\n`) : null,
      );
      message += `\n`;
    }
    if (expertQueries.some((q) => q.expert.trim() || q.query.trim())) {
      message += `Any Query from Expert:\n`;
      expertQueries.forEach((q) => {
        if (q.expert.trim() || q.query.trim()) {
          message += `- *Expert:* _${q.expert || "—"}_\n`;
          message += `  *Query:* _${q.query || "—"}_\n\n`;
        }
      });
    } else {
      message += `\n`;
    }

    if (learnings.some((i) => i.trim())) {
      message += `\n*My Today Learning:*\n`;
      learnings.forEach((item) =>
        item.trim() ? (message += `- ${item}\n`) : null,
      );
      message += `\n`;
    }
    message += `*Submitted by:* ${yourName}`;

    navigator.clipboard.writeText(message);

    saveStatusUpdate({
      tlName,
      projectName,
      yourName,
      workedOn: workedOn.filter(Boolean),
      inProgress: inProgress.filter(Boolean),
      queries: queries.filter(Boolean),
      expertQueries,
    });

    saveToHistory("tlNames", tlName);
    saveToHistory("projectNames", projectName);
    saveToHistory("yourNames", yourName);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function loadFromHistory(update: any) {
    setTlName(update.tlName || "");
    setProjectName(update.projectName || "");
    setYourName(update.yourName || "");
    setWorkedOn(update.workedOn?.length ? update.workedOn : [""]);
    setInProgress(update.inProgress?.length ? update.inProgress : [""]);
    setQueries(update.queries?.length ? update.queries : [""]);
    setExpertQueries(
      Array.isArray(update.expertQueries)
        ? update.expertQueries
        : [{ expert: "", query: "" }],
    );

    setShowHistory(false);
  }

  function sendToWhatsApp() {
    const message = encodeURIComponent(buildMessage());
    const url = `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <Header
          hasHistory={historyUpdates.length > 0}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory((s) => !s)}
          teamName="Support Team"
        />

        {showHistory && historyUpdates.length > 0 && (
          <HistoryPanel updates={historyUpdates} onLoad={loadFromHistory} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Create Update
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  Your Name *
                </label>
                <AutocompleteInput
                  value={yourName}
                  onChange={setYourName}
                  placeholder="Enter your name"
                  historyKey="yourNames"
                />
              </div>

              <TaskList
                items={workedOn}
                setItems={setWorkedOn}
                title="Worked-On"
                enableStatus={true}
                statusList={["Pending", "Done"]}
                addColor="bg-blue-600"
              />
              <TaskList
                items={inProgress}
                setItems={setInProgress}
                title="In-Progress Tasks"
                addColor="bg-orange-500"
              />

              <TaskList
                items={queries}
                setItems={setQueries}
                title="Queries"
                addColor="bg-purple-600"
              />
              <TodayLearningSection
                learnings={learnings}
                setLearnings={setLearnings}
              />
              <ExpertQuerySection
                items={expertQueries}
                setItems={setExpertQueries}
                experts={EXPERT_LIST}
                historyKey="expertNames"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:sticky lg:top-6 h-fit relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm font-bold"
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

            <Preview
              tlName={tlName}
              projectName={projectName}
              yourName={yourName}
              workedOn={workedOn}
              inProgress={inProgress}
              learnings={learnings}
              queries={queries}
              expertQueries={expertQueries}
              teamName="Support"
            />
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
          </div>
        </div>
      </div>
    </div>
  );
}


// Account Team *'s* Daily Status of  19/01/2026

// *Worked-On:*
// • *Product:* GST Reconciliation
//   *Customer:* Raju
//   *Contact:* 9913423994
//   *Status:* Pending
//   *Comment:* comment ... ...


// *In-Progress Task:*
// • *Product:* RTGS Reconciliation
//   *Customer:* Raj Asodariya
//   *Contact:* 1234567890
//   *Comment:* no comment yet


// *Submitted by:* 