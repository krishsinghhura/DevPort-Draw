"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * DevPortDrawLoader
 *
 * A polished, accessible loader with the name badge "DevPort Draw".
 * - Works fullscreen or inline
 * - Optional progress (0-100)
 * - Optional message
 * - Subtle glow + shimmer animation
 * - Dark/light aware (Tailwind)
 */

export type DevPortDrawLoaderProps = {
  fullscreen?: boolean;
  message?: string;
  progress?: number;
  compact?: boolean;
  className?: string;
};

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const shimmer: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      repeat: Infinity,
      repeatType: "loop" as const,
      duration: 1.6,
      ease: "linear" as const,
    },
  },
};

const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" as const },
  },
};

function ClientTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;
  return <span aria-hidden className="tabular-nums">{time}</span>;
}

export default function DevPortDrawLoader({
  fullscreen = true,
  message,
  progress,
  compact = false,
  className,
}: DevPortDrawLoaderProps) {
  const isDeterminate = typeof progress === "number" && !Number.isNaN(progress);
  const clamped = isDeterminate ? Math.max(0, Math.min(100, progress as number)) : undefined;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "relative w-full select-none",
        fullscreen
          ? "fixed inset-0 grid place-items-center bg-gradient-to-b from-background to-muted/40"
          : "grid place-items-center",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border backdrop-blur-sm shadow-xl",
          "border-border/60 bg-card/60 p-6 sm:p-8",
          compact ? "max-w-md" : "max-w-xl"
        )}
      >
        {/* Glow ring */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl"
          style={{
            background:
              "radial-gradient(1200px 1200px at 50% -20%, hsl(var(--primary)/0.15), transparent)",
            filter: "blur(10px)",
          }}
          variants={pulse}
          animate="animate"
        />

        {/* Brand Row */}
        <div className={cn("flex items-center gap-3 sm:gap-4")}> 
          <div className="relative grid h-12 w-12 place-items-center sm:h-14 sm:w-14">
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: "hsl(var(--primary))" }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, hsl(var(--primary)) 0%, transparent 60%, hsl(var(--primary)) 100%)",
                filter: "blur(6px)",
                opacity: 0.6,
              }}
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
            />
            <Sparkles className="relative h-5 w-5 sm:h-6 sm:w-6 opacity-90" />
          </div>

          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Loading</div>

            {/* Title with shimmer */}
            <div className="relative">
              <h1
                className={cn(
                  "font-semibold leading-tight",
                  compact ? "text-2xl" : "text-3xl sm:text-4xl"
                )}
              >
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  DevPort Draw
                </span>
              </h1>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px"
                initial="initial"
                animate="animate"
                variants={shimmer}
              >
                <span className="block h-full w-2/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              </motion.span>
            </div>

            {message ? (
              <p className={cn("mt-2 text-sm text-muted-foreground", compact ? "line-clamp-2" : "")}>{message}</p>
            ) : null}
          </div>
        </div>

        {/* Progress */}
        <div className={cn("mt-6 sm:mt-8")}> 
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <AnimatePresence initial={false}>
              {isDeterminate ? (
                <motion.div
                  key="bar"
                  className="h-full rounded-full"
                  style={{ backgroundColor: "hsl(var(--primary))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${clamped}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              ) : (
                <motion.div
                  key="indeterminate"
                  className="absolute inset-0"
                  initial={false}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, hsl(var(--primary)/.15) 35%, hsl(var(--primary)/.35) 50%, hsl(var(--primary)/.15) 65%, transparent 100%)",
                  }}
                />
              )}
            </AnimatePresence>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="sr-only">{isDeterminate ? `Progress: ${clamped}%` : "Loading…"}</span>
            <span aria-hidden>{isDeterminate ? `${clamped}%` : "Please wait"}</span>
            <ClientTime />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Usage:
 *
 * <DevPortDrawLoader />
 * <DevPortDrawLoader fullscreen={false} message="Connecting to server…" />
 * <DevPortDrawLoader progress={42} message="Uploading assets" />
 * <DevPortDrawLoader compact />
 */