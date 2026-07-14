import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderColor?: string;
  textColor?: string;
  bgColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  children: React.ReactNode;
}

export default function Button({
  borderColor,
  textColor,
  bgColor,
  hoverBgColor,
  hoverTextColor,
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  // Define custom styles mapping props to the CSS custom properties defined in globals.css
  const customStyles = {
    ...(borderColor && { '--btn-border-color': borderColor }),
    ...(textColor && { '--btn-text-color': textColor }),
    ...(bgColor && { '--btn-bg-color': bgColor }),
    ...(hoverBgColor && { '--btn-hover-bg-color': hoverBgColor }),
    ...(hoverTextColor && { '--btn-hover-text-color': hoverTextColor }),
    ...style,
  } as React.CSSProperties;

  return (
    <button
      className={`btn-outline ${className}`}
      style={customStyles}
      {...props}
    >
      {children}
    </button>
  );
}
