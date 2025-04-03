import React, { useRef, useState } from "react";
import useClickOutside from "../../../Hooks/useClickOutside";

const Dropdown = ({
  children,
  dropList = {},
  closeOnClickOutside = false,
  caretComponent: CaretComponent = null,
  showcaret = false,
}) => {
  const [show, setShow] = useState(false);
  const elRef = useRef(null);
  useClickOutside([elRef], () => {
    setShow(false);
  });

  return (
    <dropdown-element
      dropdown-element
      ref={elRef}
      onClick={() => {
        if (closeOnClickOutside) {
          setShow((prev) => !prev);
        } else {
          setShow(true);
        }
      }}
    >
      <dropdown-caret dropdown-caret>
        {children} {showcaret && <CaretComponent width={18} />}
      </dropdown-caret>
      {show && (
        <dropdown-menu dropdown-menu>
          {dropList?.data?.length > 0 ? (
            dropList.data.map((item) => {
              return (
                <dropdown-menu-item dropdown-menu-item key={item.id}>
                  <dropList.component item={item} />
                </dropdown-menu-item>
              );
            })
          ) : (
            <span>No record</span>
          )}
        </dropdown-menu>
      )}
    </dropdown-element>
  );
};

export default Dropdown;
