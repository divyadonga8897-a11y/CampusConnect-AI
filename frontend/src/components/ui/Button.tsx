import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean; // added compatibility property
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, isLoading, leftIcon, rightIcon, variant, size, fullWidth, ...props }, ref) => {
    const isBtnLoading = loading || isLoading;
    return (
      <button ref={ref} disabled={isBtnLoading || props.disabled} {...props}>
        {isBtnLoading && <span>Loading...</span>}
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
