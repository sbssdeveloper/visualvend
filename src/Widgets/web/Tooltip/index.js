import React from 'react';

export default function Tooltip({ children, title }) {
  return <span className='position--relative'>
    <span data-tooltip={title}>
      {children}
    </span>
  </span>
}
