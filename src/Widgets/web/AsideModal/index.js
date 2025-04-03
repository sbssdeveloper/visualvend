import React, { useEffect, useRef } from "react";
import useIcons from "../../../Assets/web/icons/useIcons";

export default function AsideModal({ children, handleClose, shouldCloseOnClickOutside = false, title = "", footerComponent: FooterComponent = () => null }) {
  const { CrossRoundIcon } = useIcons();
  const asideModal = useRef();

  useEffect(() => {
    // if (shouldCloseOnClickOutside) {
    if (asideModal.current) {
      const refrence = asideModal.current;
      refrence.showModal();

      if (shouldCloseOnClickOutside) {
        refrence.addEventListener(
          "click",
          (e) => {
            const modalDimesions = refrence.getBoundingClientRect();
            if (e.clientX < modalDimesions.left || e.clientX > modalDimesions.right || e.clientY < modalDimesions.top || e.clientY > modalDimesions.bottom) {
              closeModal();
            }
          },
          false
        );
      }
      return () => {
        if (refrence && shouldCloseOnClickOutside) {
          refrence.removeEventListener("click", () => null, false);
        }
        closeModal();
      };
    }
    // }
  }, [asideModal, closeModal, shouldCloseOnClickOutside]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function closeModal() {
    if (asideModal.current) {
      asideModal.current.close();
      handleClose();
    }
  }

  return (
    <dialog data-aside-modal="right" ref={asideModal} className="w--xs  w-min--500">
      <dialog-head class="dialog-head h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--between border-bottom--black-100">
        {<div className="font--md font--600">{title}</div>}
        <button type="button" className="font--md font--600 text--primary d--flex c--pointer radius--full" onClick={() => closeModal()}>
          <CrossRoundIcon width={30} height={30} />
        </button>
      </dialog-head>
      <dialog-body class="dialog-body p--md h--full">{children}</dialog-body>
      {FooterComponent && <dialog-footer class="modal-foot h-max--50 h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--end border-top--black-100 gap--sm">{FooterComponent}</dialog-footer>}
    </dialog>
  );
}
