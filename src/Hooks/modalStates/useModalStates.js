import { useState } from 'react';

const useModalStates = () => {
  const [modalStates, setModalStates] = useState(null);
  return [modalStates, setModalStates,];
};

export default useModalStates;
