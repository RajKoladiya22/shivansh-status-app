"use client";
import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
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

  function copyToClipboard() {
    const formatTask = (item: string) => {
      const [product, customer, comment, status] = item.split(" - ");

      return [
        product ? `*• Product:* ${product}` : "",
        customer ? `  *Customer:* ${customer}` : "",
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
      learnings.forEach((item) =>
        item.trim() ? (message += `- ${item}\n`) : null
      );
      message += `\n`;
    }

    if (queries.some((i) => i.trim())) {
      message += `*Query:*\n`;
      queries.forEach((item) =>
        item.trim() ? (message += `- ${formatTask(item)}\n`) : null
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
    setExpertQueries(update.expertQueries ? update.expertQueries : {});
    setShowHistory(false);
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

              <TodayLearningSection
                learnings={learnings}
                setLearnings={setLearnings}
              />

              <TaskList
                items={queries}
                setItems={setQueries}
                title="Queries"
                addColor="bg-purple-600"
              />
              <ExpertQuerySection
                items={expertQueries}
                setItems={setExpertQueries}
                experts={EXPERT_LIST}
                historyKey="expertNames"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:sticky lg:top-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Preview</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm font-bold"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Message
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
