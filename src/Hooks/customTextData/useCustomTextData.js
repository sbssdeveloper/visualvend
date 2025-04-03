import { useState } from 'react';

function useCustomTextData() {
  const [searchText, setSearchText] = useState('');
  const updateSearchText = text => setSearchText(text);
  return [searchText, updateSearchText];
}

export default useCustomTextData;