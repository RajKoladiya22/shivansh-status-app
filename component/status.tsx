//component/status.tsx

"use client";
import React, { useState} from "react";
import { HistoryPanel, PageHeader, PreviewPanel, SectionHeader } from "./layout";
import { createStorageHelper, getRecentUpdates, saveStatusUpdate } from "./StorageHelper";
// import {createStorageHelper} from "./StorageHelper"

// ============================================================================
// TYPES
// ============================================================================

type SectionKey = string;

export type SectionType = "input" | "list";

export interface BaseSection {
  key: SectionKey;
  label: string;
  type: SectionType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
}

export interface InputSection extends BaseSection {
  type: "input";
  defaultValue?: string;
}

export interface ListSection extends BaseSection {
  type: "list";
  addLabel: string;
  buttonColor?: "blue" | "orange" | "green" | "purple";
  component: React.ComponentType<ListItemComponentProps>;
  componentProps?: Record<string, unknown>;
  defaultValue?: string[];
}

export type Section = InputSection | ListSection;

export interface ListItemComponentProps {
  value: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export type SectionsData = Record<SectionKey, any>;

export interface BaseStatusUpdateProps {
  storagePrefix: string;
  pageTitle: string;
  pageSubtitle?: string;
  sections: Section[];
  generateMessage: (data: SectionsData) => string;
  validateBeforeCopy: (data: SectionsData) => boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BaseStatusUpdate = ({
  storagePrefix,
  pageTitle,
  pageSubtitle,
  sections,
  generateMessage,
  validateBeforeCopy,
}: BaseStatusUpdateProps) => {
  const storage = createStorageHelper(storagePrefix);

  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [sectionsData, setSectionsData] = useState<SectionsData>(() => {
    const initial: SectionsData = {};
    sections.forEach((section) => {
      initial[section.key] =
        section.defaultValue ?? (section.type === "list" ? [""] : "");
    });
    return initial;
  });

  const addItem = (key: SectionKey) => {
    setSectionsData((prev) => ({
      ...prev,
      [key]: [...(prev[key] as string[]), ""],
    }));
  };

  const removeItem = (key: SectionKey, index: number) => {
    setSectionsData((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((_, i) => i !== index),
    }));
  };

  const updateItem = (key: SectionKey, index: number, value: string) => {
    setSectionsData((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const copyToClipboard = () => {
    if (!validateBeforeCopy(sectionsData)) return;

    const message = generateMessage(sectionsData);
    navigator.clipboard.writeText(message);

    const updateData: Record<string, unknown> = {};

    Object.keys(sectionsData).forEach((key) => {
      const value = sectionsData[key];
      updateData[key] = Array.isArray(value)
        ? value.filter((i) => i.trim())
        : value;
    });

    saveStatusUpdate(storage, updateData);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadFromHistory = (update: Record<string, any>) => {
    const newData: SectionsData = {};

    sections.forEach((section) => {
      const value = update[section.key];

      if (value !== undefined) {
        newData[section.key] =
          section.type === "list"
            ? value.length
              ? value
              : [""]
            : value;
      } else {
        newData[section.key] =
          section.defaultValue ?? (section.type === "list" ? [""] : "");
      }
    });

    setSectionsData(newData);
    setShowHistory(false);
  };

  const historyUpdates = getRecentUpdates(storage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory(!showHistory)}
          hasHistory={historyUpdates.length > 0}
        />

        {showHistory && (
          <HistoryPanel
            updates={historyUpdates}
            onLoadUpdate={loadFromHistory}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Create Update
            </h2>

            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.key}>
                  {section.type === "input" && (
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1.5">
                        {section.label} {section.required && "*"}
                      </label>
                      <input
                        type="text"
                        value={sectionsData[section.key] as string}
                        onChange={(e) =>
                          setSectionsData((prev) => ({
                            ...prev,
                            [section.key]: e.target.value,
                          }))
                        }
                        placeholder={section.placeholder}
                        className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                      />
                    </div>
                  )}

                  {section.type === "list" && (
                    <>
                      <SectionHeader
                        title={section.label}
                        onAdd={() => addItem(section.key)}
                        addLabel={section.addLabel}
                        buttonColor={section.buttonColor}
                      />
                      <div className="space-y-3">
                        {(sectionsData[section.key] as string[]).map(
                          (item, idx) => {
                            const Component = section.component;
                            return (
                              <Component
                                key={idx}
                                value={item}
                                onChange={(val) =>
                                  updateItem(section.key, idx, val)
                                }
                                onRemove={() =>
                                  removeItem(section.key, idx)
                                }
                                showRemove={
                                  (sectionsData[section.key] as string[])
                                    .length > 1
                                }
                                {...section.componentProps}
                              />
                            );
                          }
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <PreviewPanel
            message={generateMessage(sectionsData)}
            onCopy={copyToClipboard}
            copied={copied}
            canCopy={validateBeforeCopy(sectionsData)}
          />
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Shivansh Infosys © {new Date().getFullYear()}</p>
          <p className="mt-1">{pageSubtitle}</p>
        </div>
      </div>
    </div>
  );
};
