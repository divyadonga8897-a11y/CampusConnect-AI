import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return <div onClick={onClick}>{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default Card;
