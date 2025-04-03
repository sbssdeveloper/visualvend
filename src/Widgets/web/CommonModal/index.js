import React, { useEffect } from "react";
import useIcons from "../../../Assets/web/icons/useIcons";
import Button from "../Button";

const CommonModal = ({ show, onClose, children , title, isShowCloseBtn}) => {
  const { CrossIcon } = useIcons();
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (show) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  // console.log("isShowCloseBtn", isShowCloseBtn)

  return (
    <div className="modal-backdrop z-index--lg position--fixed top--0 left--0 w--full h--full bg--black-600 d--flex align-items--center justify-content--center">
      <div className="modal  bg--white radius--md box-shadow--sm" role="dialog" aria-modal="true">
        {(title || isShowCloseBtn) && <div className="modal-head h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--between ">
          {title && <div className="titleHeading font--md font--600">{title}</div>}
          {isShowCloseBtn && <button type="button" className="font--md font--600 text--black-800 d--flex c--pointer radius--full" onClick={onClose}>
            <CrossIcon width={30} height={30} />
          </button>}
        </div>}
        <div className="modal-body p--md h--full h-min--150">{children}</div>
        {/* <div className="modal-foot h--full h-max--50 h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--center  gap--sm">
          <Button variant="black-100" color="black-800 w-max--200" btnClasses="btn" onClick={onClose} aria-label="Close modal">
            Cancel
          </Button>
          <Button variant="primary" btnClasses="btn w-max--200" onClick={onClose} aria-label="Close modal">
            Close
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default CommonModal;
