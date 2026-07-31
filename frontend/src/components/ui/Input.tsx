"use client";

import React from "react";

// ── TEXT INPUT COMPONENT ──
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, leftIcon, rightIcon, id, type = "text", ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-label text-slate-700 mb-1.5 font-semibold">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`input ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${
              error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ── TEXTAREA COMPONENT ──
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || React.useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-label text-slate-700 mb-1.5 font-semibold">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`input resize-none ${
            error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ── SELECT COMPONENT ──
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, helperText, leftIcon, id, options, ...props }, ref) => {
    const selectId = id || React.useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-label text-slate-700 mb-1.5 font-semibold">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            className={`input select ${leftIcon ? "pl-10" : ""} ${
              error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// ── CHECKBOX COMPONENT ──
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    return (
      <div className="flex flex-col">
        <label htmlFor={checkboxId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
            {...props}
          />
          <span className="text-xs text-slate-600 font-medium">{label}</span>
        </label>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ── RADIO COMPONENT ──
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const radioId = id || React.useId();
    return (
      <div className="flex flex-col">
        <label htmlFor={radioId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className="w-4 h-4 rounded-full border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
            {...props}
          />
          <span className="text-xs text-slate-600 font-medium">{label}</span>
        </label>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Radio.displayName = "Radio";
