"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl py-12 sm:py-24 lg:flex lg:items-center lg:gap-x-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2"
        >
          <div className="mb-8 flex">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-sky-400 ring-1 ring-white/10 hover:ring-white/20">
              New: share your components globally.{" "}
              <Link href="/ui-components" className="font-semibold text-sky-400">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            UI Components Live Builder
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Build, share, and explore beautifully crafted UI components — all in
            one place. Stop reinventing the wheel — start using and sharing 
            components that save time and elevate the quality of your web projects.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/auth/sign-in"
              className="rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-sky-400 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link href="/ui-components" className="text-sm font-semibold leading-6 text-white hover:text-sky-400 transition-colors">
              Explore Library <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 lg:mt-0 lg:w-1/2 flex justify-center"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-sky-500/20 border border-white/10 bg-gray-900/50 backdrop-blur-sm p-2">
            <Image
              src="/UI.gif"
              alt="UI animation"
              className="rounded-xl w-full h-auto object-cover"
              width={800}
              height={600}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent" />
          </div>
        </motion.div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl opacity-30" aria-hidden="true">
        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#0ea5e9] to-[#6366f1]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </div>
  );
};

export default Hero;