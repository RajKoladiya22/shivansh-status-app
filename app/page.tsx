"use client";

import Link from "next/link";
import { Users, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

const TEAMS = [
  {
    title: "Account Team",
    description:
      "Daily accounting operations, sales & purchase entries, payment follow-ups, and reporting.",
    href: "/account",
    icon: Briefcase,
    gradient: "from-blue-600 to-blue-700",
  },
  {
    title: "TDL & Tally Support Team",
    description:
      "TDL development, Tally Prime support, customer issues, configurations, and expert queries.",
    href: "/support",
    icon: Users,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    title: "Intern Team",
    description:
      "Daily learning updates, assigned tasks, progress tracking, and mentor feedback.",
    href: "/intern",
    icon: GraduationCap,
    gradient: "from-green-600 to-green-700",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shivansh Infosys
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Select your team to create and manage daily status updates
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAMS.map((team) => {
            const Icon = team.icon;

            return (
              <Link
                key={team.title}
                href={team.href}
                className="group bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="p-5 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${team.gradient} flex items-center justify-center text-white shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h2 className="mt-4 text-lg font-bold text-gray-900">
                    {team.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 flex-1">
                    {team.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    Open Dashboard
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-500">
          Shivansh Infosys © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
