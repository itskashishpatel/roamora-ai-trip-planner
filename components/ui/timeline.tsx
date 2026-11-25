
"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
}

export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [progress, setProgress] = useState(0);

  // Measure the actual timeline content, including responsive changes.
  useEffect(() => {
    const element = contentRef.current;

    if (!element) return;

    const updateHeight = () => {
      setHeight(element.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [data]);

  // Track page scrolling for the timeline progress animation.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });

  const heightTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, height],
  );

  const opacityTransform = useTransform(
    scrollYProgress,
    [0, 0.08],
    [0, 1],
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#dce6d8] bg-[#f8faf6] px-4 py-6 text-center">
        <p className="text-sm font-medium text-[#47654e]">
          No activities planned for this day yet.
        </p>
        <p className="mt-1 text-xs text-[#829084]">
          Your itinerary details will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-transparent font-sans"
    >
      <div
        ref={contentRef}
        className="relative mx-auto w-full"
      >
        {data.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="relative grid grid-cols-[112px_minmax(0,1fr)] gap-3 pb-5 last:pb-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-5 md:grid-cols-[155px_minmax(0,1fr)]"
          >
            {/* Timeline marker and time label */}
            <div className="relative flex items-start">
              <div className="sticky top-24 flex items-center gap-2.5">
                <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#cbdac7] bg-white shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-[#477452]" />
                </div>

                <div className="min-w-0 pt-0.5">
                  <p className="wrap-break-word text-xs font-bold leading-5 text-[#315640] sm:text-sm">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#9aa69a]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity content */}
            <div className="min-w-0">
              {item.content}
            </div>
          </div>
        ))}

        {/* Timeline background rail */}
        <div
          className="pointer-events-none absolute bottom-0 left-2.25 top-0 w-px bg-[#dce6d8]"
          aria-hidden="true"
        />

        {/* Animated forest-green progress rail */}
        <motion.div
          className="pointer-events-none absolute left-2.25 top-0 w-0.5 origin-top rounded-full bg-[#477452]"
          style={{
            height: heightTransform,
            opacity: opacityTransform,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
