import React, { useState, useEffect } from "react";
import Button from "../Button";
import useIcons from "../../../Assets/web/icons/useIcons";
import { stringFormating } from "../../../Helpers/resource";
import Spinner from "../Spinner";
import { PAYMENT_TYPE_CONST } from "../../../Helpers/constant";
import Pagination from "../Pagination";

const TableWithPagination = ({ data = [], itemsPerPage, onPageChange, columns, actions, isPagination, isColumns, total, actionWidth, customClass = "", isLoading, currentPageNo = 1 }) => {

  const handlePageChange = (page) => {
    onPageChange(page);
  };


  return (
    <div className="d--flex flex--column gap--sm">
      <div className="w--full table--responsive table--responsive--full-scroll bg--white radius--sm flex--column d--flex position--relative">
        <table className="table border-bottom--black-100 ">
          {isColumns && (
            <thead>
              <tr>
                {columns.map((column, i) => (
                  <th align="left" className="white-space--nowrap" key={i}>
                    {column.name}
                  </th>
                ))}
                {isColumns && actions && actions.length != 0 && (
                  <th align="center" width={actionWidth + "%"} className={customClass}>
                    Actions
                  </th>
                )}
                {/* <div className="loader-line"></div> */}
              </tr>
            </thead>
          )}

          {data && data.length ? (
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {columns.map((el, columnIndex) =>
                    (
                      <td key={columnIndex}>
                        {el.render ? el.render(row) : row[el.key] || "-"}
                      </td>
                    )
                  )}
                  {actions && actions.length != 0 && (
                    <td align="center">
                      {actions.map((action, actionIndex) => (
                        <button key={actionIndex} onClick={() => action.onClick(row)}>
                          {action.icon ?? action.label}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                {isLoading ? (
                  <td colSpan={columns.length}>
                    <div className="d--flex w--full align-items--center justify-content--center h--full tableContentHeight">
                      <Spinner size="md" />
                    </div>
                  </td>
                ) : (
                  <td>No record found!</td>
                )}
              </tr>
            </tbody>
          )}
        </table>
        {/* <div className="d--flex align-items--center justify-content--center w--full h--full bg--white-200 position--absolute top--0">
          <Spinner size="md" />
        </div> */}
      </div>
      {data && data.length != 0 && isPagination && <Pagination key="Products-list" data={data || []} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} total={total} currentPageNo={currentPageNo} />}
    </div>
  );
};

// actions={[
//     { label: 'Edit', onClick: handleEdit },
//     { label: 'Delete', onClick: handleDelete },
//   ]}

export default TableWithPagination;
