"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showShortcut?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  showShortcut = true,
  placeholder = "Search...",
  className = "",
  ...props
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Shortcut key binder: '/' or 'cmd+k' triggers focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        // Prevent default browser search behavior or input `/` character
        if (document.activeElement !== inputRef.current) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input pl-10 pr-12.5 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-xs rounded-xl"
        {...props}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {hasValue && onClear && (
          <button
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer select-none transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {showShortcut && !hasValue && (
          <kbd className="hidden sm:inline-flex items-center h-5 select-none rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[9px] font-bold text-slate-400 leading-none shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
