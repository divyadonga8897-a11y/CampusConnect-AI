import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, leftIcon, rightIcon, variant, size, ...props }, ref) => (
    <button ref={ref} disabled={loading || props.disabled} {...props}>
      {loading && <span>Loading...</span>}
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
);
Button.displayName = "Button";
export default Button;
