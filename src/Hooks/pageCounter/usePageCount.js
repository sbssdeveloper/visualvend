import { useState } from 'react';

const usePageCount = (initialCount = 1) => {
 const [pageCount, setPageCount] = useState(initialCount);
 const incrementPageCount = () => setPageCount(prevCount => prevCount + 1);
 return { pageCount, incrementPageCount };
};

export default usePageCount;
