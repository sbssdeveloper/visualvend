import React, { useState, useEffect } from "react";
import Button from "../Button";
import useIcons from "../../../Assets/web/icons/useIcons";

const Pagination = ({
  data,
  itemsPerPage,
  onPageChange,
  total,
  currentPageNo = 1,
}) => {
  const [currentPage, setCurrentPage] = useState(currentPageNo);
  const [totalPages, setTotalPage] = useState();
  const {
    ArrowLeftIcon,
    ArrowRightIcon,
  } = useIcons();

  useEffect(() => {
    if (data && total && itemsPerPage) {
      setTotalPage(Math.ceil(total / itemsPerPage));
    }
  }, [data, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };


  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    let startPage, endPage;

    if (totalPages <= maxPageNumbers) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxPageNumbers;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - (maxPageNumbers - 1);
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          variant={`${currentPage === i ? "secondary" : "secondary-100"}`}
          btnClasses=" w-min--28 h-min--28 w-max--28 h-max--28 c--pointer w--full h--full  d--flex align-items--center justify-content--center"
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={currentPage === i}
          color={`${currentPage === i ? "white" : "secondary"}`}
        >
          {i}
        </Button>
      );
    }

    if (totalPages > maxPageNumbers && endPage < totalPages) {
      pageNumbers.push(<span key="ellipse">...</span>);
      pageNumbers.push(
        <Button
          variant={`${
            currentPage === totalPages ? "secondary" : "secondary-100"
          }`}
          btnClasses=" w-min--28 h-min--28 w-max--28 h-max--28 c--pointer w--full h--full  d--flex align-items--center justify-content--center"
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          color={`${currentPage === totalPages ? "white" : "secondary"}`}
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
      
        <div className="w--full d--flex align-items--center gap--xs justify-content--end">
          <Button
            variant="secondary-100"
            btnClasses=" w-min--28 h-min--28 w-max--28 h-max--28 c--pointer w--full h--full text--secondary d--flex align-items--center justify-content--center"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            color="secondary"
          >
            <ArrowLeftIcon width={18} height={18} />
          </Button>
          <div className="d--flex align-items--center gap--xs">
            {renderPageNumbers()}
          </div>
          <Button
            variant="secondary-100"
            btnClasses=" w-min--28 h-min--28 w-max--28 h-max--28 c--pointer w--full h--full text--secondary d--flex align-items--center justify-content--center"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            color="secondary"
          >
            <ArrowRightIcon width={18} height={18} />
          </Button>
        </div>
      
  );
};


export default Pagination;
