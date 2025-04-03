import React from 'react';

const Switch = ({ placeholder, label, error, id,controlValue, handleFunction,...rest }, ref) => {
  const text = error || label || '';
  return (
    <div className="d--flex flex--column">
      {text && (
        <label
          className={`label--control font--sm font--500 m-b--xs  ${error ? 'text--secondary' : 'text--black'
            }`}
        >
          {text}
        </label>
      )}

      <span className="custom-checkbox d--flex">
        <input
          {...rest}
          id={id}
          type="checkbox"
          ref={ref}
          placeholder={placeholder}
          checked={controlValue}
          onChange={ (event) => handleFunction(event)}
        />
        <label htmlFor={id}>{label}</label>
      </span>
    </div>
  );
};

export default React.forwardRef(Switch);
