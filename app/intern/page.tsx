"use client";

import { motion } from "framer-motion";
import { Mail, Clock } from "lucide-react";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur">
            <Clock className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          We’re Launching Soon
        </h1>
        <p className="text-slate-300 mb-8">
          Our website is under construction. We’re working hard to bring you
          something amazing. Stay tuned!
        </p>

        <Link href={'/'} className="rounded-xl bg-blue-600 hover:bg-blue-500 transition px-6 py-3 text-sm font-medium">
            Home
          </Link>
{/* 
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 w-full sm:w-auto">
            <Mail className="w-5 h-5 text-blue-400" />
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-sm placeholder:text-slate-400 w-full"
            />
          </div>
          <button className="rounded-xl bg-blue-600 hover:bg-blue-500 transition px-6 py-3 text-sm font-medium">
            Notify Me
          </button>
        </div> */}

        <p className="text-xs text-slate-400 mt-8">
          © {new Date().getFullYear()} Shivansh Infosys. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
