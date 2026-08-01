"use client";
import React from "react";

// ── TEXT INPUT ──
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, id, type = "text", ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div>
        {label && <label htmlFor={inputId}>{label}</label>}
        <div>
          {leftIcon && <span>{leftIcon}</span>}
          <input ref={ref} id={inputId} type={type} {...props} />
          {rightIcon && <span>{rightIcon}</span>}
        </div>
        {error && <p>{error}</p>}
        {!error && helperText && <p>{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ── SELECT ──
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, ...props }, ref) => {
    const selectId = id || React.useId();
    return (
      <div>
        {label && <label htmlFor={selectId}>{label}</label>}
        <select ref={ref} id={selectId} {...props}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p>{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// ── TEXTAREA ──
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    return (
      <div>
        {label && <label htmlFor={textareaId}>{label}</label>}
        <textarea ref={ref} id={textareaId} {...props} />
        {error && <p>{error}</p>}
        {!error && helperText && <p>{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ── CHECKBOX ──
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    return (
      <div>
        <label htmlFor={checkboxId}>
          <input ref={ref} id={checkboxId} type="checkbox" {...props} />
          <span>{label}</span>
        </label>
        {error && <p>{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ── RADIO ──
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, id, ...props }, ref) => {
    const radioId = id || React.useId();
    return (
      <div>
        <label htmlFor={radioId}>
          <input ref={ref} id={radioId} type="radio" {...props} />
          <span>{label}</span>
        </label>
        {error && <p>{error}</p>}
      </div>
    );
  }
);
Radio.displayName = "Radio";
