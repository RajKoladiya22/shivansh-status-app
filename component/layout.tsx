//component/layout.tsx

"use client";
import { ReactNode } from "react";
import { Plus, X, Copy, Check, Clock, ChevronDown } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showHistory: boolean;
  hasHistory: boolean;
  onToggleHistory: () => void;
}

export interface HistoryUpdate {
  date: string;
  yourName?: string;
  projectName?: string;
  [key: string]: unknown;
}

export interface HistoryPanelProps {
  updates: HistoryUpdate[];
  onLoadUpdate: (update: HistoryUpdate) => void;
}

type ButtonColor = "blue" | "orange" | "green" | "purple";

export interface SectionHeaderProps {
  title: string;
  addLabel: string;
  buttonColor?: ButtonColor;
  onAdd: () => void;
}

export interface ItemCardProps {
  children: ReactNode;
  showRemove?: boolean;
  onRemove?: () => void;
}

export interface PreviewPanelProps {
  message?: string;
  copied: boolean;
  canCopy?: boolean;
  onCopy: () => void;
}

// ============================================================================
// SHARED LAYOUT COMPONENTS
// ============================================================================

export const PageHeader = ({
  title,
  subtitle,
  showHistory,
  onToggleHistory,
  hasHistory,
}: PageHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="brand-logo">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-base sm:text-xl">
                  SI
                </span>
              </div>
              <div className="site-logo-text">
                <h2 className="flex items-center text-lg font-bold leading-none">
                  <span className="text-red-600">SHIVANSH</span>
                  <span className="ml-1 text-gray-900">INFOSYS</span>
                </h2>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {hasHistory && (
          <button
            onClick={onToggleHistory}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-all flex-shrink-0 font-medium"
          >
            <Clock className="w-4 h-4 text-black" />
            <span className="text-black">History</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform text-black ${
                showHistory ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export const HistoryPanel = ({
  updates,
  onLoadUpdate,
}: HistoryPanelProps) => {
  if (!updates || updates.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 mb-4">
      <h3 className="font-bold text-base text-gray-900 mb-3">
        Recent Updates (Last 7 Days)
      </h3>

      <div className="space-y-2 max-h-80 overflow-auto">
        {updates.map((update, idx) => (
          <button
            key={idx}
            onClick={() => onLoadUpdate(update)}
            className="w-full text-left p-3 bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 active:from-blue-100 active:to-blue-200 rounded-lg transition-all border-2 border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {update.yourName || update.projectName || "Update"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(update.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="text-xs bg-blue-500 text-white px-2.5 py-1 rounded-md flex-shrink-0 font-medium">
                Load
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const SectionHeader = ({
  title,
  onAdd,
  addLabel,
  buttonColor = "blue",
}: SectionHeaderProps) => {
  const colorClasses: Record<ButtonColor, string> = {
    blue: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    orange:
      "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    green:
      "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
    purple:
      "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
  };

  return (
    <div className="flex items-center justify-between mb-2.5">
      <label className="text-sm font-bold text-gray-900">{title}</label>
      <button
        onClick={onAdd}
        className={`flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r ${
          colorClasses[buttonColor]
        } text-white rounded-lg active:scale-95 transition-all shadow-md text-sm font-semibold`}
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
};

export const ItemCard = ({
  children,
  onRemove,
  showRemove,
}: ItemCardProps) => {
  return (
    <div className="relative space-y-2 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
      {showRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all border-2 border-red-300 hover:border-red-500"
          title="Remove item"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {children}
    </div>
  );
};

export const PreviewPanel = ({
  message,
  onCopy,
  copied,
  canCopy = true,
}: PreviewPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:sticky lg:top-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Preview</h2>
        <button
          onClick={onCopy}
          disabled={!canCopy}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm font-bold"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Message
            </>
          )}
        </button>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 p-4">
        <div className="text-sm text-gray-800 whitespace-pre-line font-mono max-h-[500px] overflow-auto">
          {message || (
            <div className="text-gray-400 italic">
              Fill in the details to see the preview...
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Message will be copied to clipboard and saved in history
        </p>
        <p>
          <span className="font-semibold">Note:</span> All data is stored in
          memory and will be lost on page refresh
        </p>
      </div>
    </div>
  );
};
