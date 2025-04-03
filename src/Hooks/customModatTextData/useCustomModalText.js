import { useState } from 'react';

export default function useCustomModalText() {
  const [modalText, setModalText] = useState({
    text1: "Are you sure?",
    text2: "Delete this machine?",
    firstBtnText: "Cancel",
    secondBtnText: "Yes",
    bottomModal: true,
  });

  const updateModalText = (newText) => {
    setModalText((prevText) => ({
      ...prevText,
      ...newText,
    }));
  };

  return {
    modalText,
    updateModalText,
  };
}
