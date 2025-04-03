import React from 'react';

export default function Button({
  size = '',
  variant = '',
  isOutline = false,
  color = 'white',
  children,
  btnClasses = '',
  icon = null,
  rounded = false,
  ...rest
}) {
  return (
    <button
      {...rest}
      className={` btn--${size} bg--${variant} ${isOutline
          ? `border-full--${variant} bg--transparent text--${variant}`
          : `text--${color}`
        } ${rounded ? `radius--full` : `radius--sm`} ${btnClasses}`}
    >
      <span className="d--flex">{icon && icon}</span> {children}
    </button>
  );
}
