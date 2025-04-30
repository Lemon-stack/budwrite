"use client";

import type React from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type TimelineItem = {
  title: string;
  content: React.ReactNode;
};

type TimelineProps = {
  data: TimelineItem[];
};

export function Timeline({ data }: TimelineProps) {
  return (
    <div className="w-full">
      {data.map((item, idx) => (
        <TimelineItem key={idx} item={item} index={idx} data={data} />
      ))}
    </div>
  );
}

function TimelineItem({
  item,
  index,
  data,
}: {
  item: TimelineItem;
  index: number;
  data: TimelineItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative pl-8 mb-12 last:mb-0"
    >
      {index < data.length - 1 && (
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-100 -translate-x-1/2" />
      )}
      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
        <div className="h-3 w-3 rounded-full bg-purple-500" />
      </div>
      <div className="pt-1">{item.content}</div>
    </motion.div>
  );
}
