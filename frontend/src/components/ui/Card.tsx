import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: string; // added variant prop
  hoverEffect?: boolean; // added compatibility prop
  border?: boolean; // added compatibility prop
}

export function Card({ children, onClick }: CardProps) {
  return <div onClick={onClick}>{children}</div>;
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div>{children}</div>;
}

export default Card;
