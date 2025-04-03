import React, { useEffect, useRef } from "react";
import useIcons from "../../../Assets/web/icons/useIcons";
export default function Modal({ children, handleClose }) {
  const { CrossRoundIcon } = useIcons();
  const modalRef = useRef();

  useEffect(() => {
    if (modalRef.current) {
      const refrence = modalRef.current;
      refrence.showModal();
      refrence.addEventListener(
        "click",
        (e) => {
          const modalDimesions = refrence.getBoundingClientRect();
          if (
            e.clientX < modalDimesions.left ||
            e.clientX > modalDimesions.right ||
            e.clientY < modalDimesions.top ||
            e.clientY > modalDimesions.bottom
          ) {
            closeModal();
          }
        },
        false
      );
      return () => {
        if (refrence) {
          refrence.removeEventListener("click", () => null, false);
        }
        closeModal();
      };
    }
  }, [modalRef, closeModal]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function closeModal() {
    if (modalRef.current) {
      modalRef.current.close();
      handleClose();
    }
  }

  return (
    <dialog
      data-modal
      ref={modalRef}
      className="w--xs h-min--500 w-min--500  m--auto border-full--black-100 radius--sm "
    >
      <dialog-head class="dialog-head h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--between border-bottom--black-100">
        {<div className="font--md font--600">Heading modal</div>}
        <button
          type="button"
          className=" font--md font--600 text--primary d--flex c--pointer radius--full"
          onClick={() => closeModal()}
        >
          <CrossRoundIcon width={30} height={30} />
        </button>
      </dialog-head>
      <dialog-body class="dialog-body p--md h--full">{children}</dialog-body>
      <dialog-footer class="modal-foot h-max--50 h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--between border-top--black-100">
        22
      </dialog-footer>
    </dialog>
  );
}
