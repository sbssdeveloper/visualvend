import { useState } from 'react';

const useSelectedValue = (params) => {
  const [selectedValue, setSelectedValue] = useState({
    id: 'machine',
    name: 'By machine',
    selectedId: "machine_id"
  });

  return [selectedValue, setSelectedValue];
};

export default useSelectedValue;
