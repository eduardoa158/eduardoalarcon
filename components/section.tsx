"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AnimatedSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
