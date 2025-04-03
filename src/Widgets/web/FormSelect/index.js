import React from "react";

const FormSelect = ({ placeholder, label, error, extraClasses = "", options = [], renderOption: RenderOption = ({ item }) => <option value={item?.value}>{item?.name}</option>, height = "36", icon = null, defaultPlaceholder = true, ...rest }, ref) => {
  const text = error || label || "";
  return (
    <div className="w--full  d--flex flex--column position--relative">
      {icon && icon}
      {text && <label className={`label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm ${error ? "text--red" : "text--black-600"}`}>{text}</label>}

      <select
        {...rest}
        ref={ref}
        placeholder={placeholder}
        className={`form--control w--full h-min--${height}   radius--sm p-l--md p-r--md ${extraClasses} ${error ? "border-full--red" : "border-full--black-100"}
         ${icon ? "p-l--2xl" : ""}
         `}
      >
        {defaultPlaceholder && (
          <option
            value={JSON.stringify({
              uuid: "",
              name: "",
              value: "",
              type: "",
            })}
          >
            Select
          </option>
        )}
        {options && options.length > 0 && options.map((item) => <RenderOption key={item.uuid || item.id} item={item} />)}
      </select>
    </div>
  );
};

export default React.forwardRef(FormSelect);
