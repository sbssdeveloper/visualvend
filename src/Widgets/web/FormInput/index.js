import React from "react";

const FormInput = ({ placeholder, label, error, paddingLeft = "md", paddingRight = "md", extraClasses = "", height = "36", icon = null, labelIcon = null, ...rest }, ref) => {
  const text = label || "";
  return (
    <div className="w--full  d--flex flex--column position--relative">
      {icon && icon}
      {text && (
        <label className={`label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm  ${error ? "text--red" : "text--black-600"}`}>
          {error ? error : text} {labelIcon ? labelIcon : null}
        </label>
      )}
      <input
        {...rest}
        ref={ref}
        placeholder={placeholder}
        className={`form--control w--full h-min--${height}  radius--sm p-l--${paddingLeft} p-r--${paddingRight} ${extraClasses} 
      ${error ? "border-full--red" : "border-full--black-100"}
       ${icon ? "p-l--2xl" : ""}
      `}
      />
    </div>
  );
};

export default React.forwardRef(FormInput);
