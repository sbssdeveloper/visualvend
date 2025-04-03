import { useState, useCallback, } from 'react';

const useSelectableData = () => {
  const [selectedData, setSelectedData] = useState([]);

  const selectItem = useCallback((id) => {
    setSelectedData((prev) =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((allItems) => {
    const allIds = allItems.map(item => item.id);
    setSelectedData(allIds);
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedData([]);
  }, []);

  const handleSelection = useCallback((action, allItems) => {
    if (action === 'selectAll') {
      selectAll(allItems);
    } else if (action === 'deselectAll') {
      deselectAll();
    } else {
      selectItem(action);
    }
  }, [selectAll, deselectAll, selectItem]);

  return [selectedData, handleSelection];
};

export default useSelectableData;
