import React, { useEffect, useState } from "react";
import { LOAD_MORE_ITEM_COUNT } from "../../../components/Reports/constant";
import Spinner from "../Spinner";
import useIcons from "../../../Assets/web/icons/useIcons";
import FormSelect from "../FormSelect";
import Button from "../Button";

const CommonReportTable = ({ data, columnsList, handlePageChange, totalRecords, setLength, length, isExpandAll, selectedMachineIds, setMachineIds, additionalConditionsArr, isFetching }) => {
  const [openedRowIndexs, setOpenedRowIndexs] = useState([0]);
  const { AngleDownIcon } = useIcons();

  const onSelectMachinePair = (event, el) => {
    if (event.target.checked) {
      setMachineIds([...data?.pairedIds[el]]);
    } else {
      const newFilteredIds = selectedMachineIds.filter((id) => !data?.pairedIds[el].includes(id));
      setMachineIds(newFilteredIds);
    }
  };

  const checkRowMachineIsSelected = (el) => {
    return data?.pairedIds[el].every((id) => selectedMachineIds.includes(id));
  };

  const onSelectMachine = (id) => {
    let asileNoIndex = selectedMachineIds.findIndex((el) => el === id);
    if (asileNoIndex !== -1) {
      const newSelectedAsile = selectedMachineIds.filter((el) => el !== id);
      setMachineIds(newSelectedAsile);
    } else {
      setMachineIds([...selectedMachineIds, id]);
    }
  };

  const checkRowIsSelected = (id) => {
    return selectedMachineIds.includes(id);
  };

  const selectAllMachines = (event) => {
    if (event.target.checked) {
      setMachineIds([...data?.allIds]);
    } else {
      setMachineIds([]);
    }
  };

  useEffect(() => {
    toggleAllTable()
  }, [isExpandAll]);

  const toggleAllTable = () => {
    if(!isExpandAll && openedRowIndexs.length != 0 ) return
    if(isExpandAll && data?.pairs ){
      let indexs = []
      Object.entries(data?.pairs).map(([key, value], index) => {
        indexs.push(index)
      })
      setOpenedRowIndexs(indexs)
    }else {
      setOpenedRowIndexs([])
    }
  }


  const expandTable = (index) => {
    let keyIndex = openedRowIndexs.findIndex((el) => el === index);
    if (keyIndex !== -1) {
      const newSelectedKey = openedRowIndexs.filter(
        (el) => el !== index
      );
      setOpenedRowIndexs(newSelectedKey);
    } else {
      setOpenedRowIndexs([...openedRowIndexs, index]);
    }
  }

  return (
    <div className=" d--flex gap--md flex--column">
      <div className="w--full table--responsive table--responsive--full-scroll bg--white radius--sm flex--column d--flex p-l--sm p-r--sm tableCustom">
        <table className="table border--none border--spacing ">
          <thead>
            <tr>
              <th width="1%" align="left" className="white-space--nowrap" key={"checkBox"}>
                <input type="checkbox" className="form--control" name="saveCard" onChange={(event) => selectAllMachines(event)} checked={selectedMachineIds.length != 0 && selectedMachineIds.length == data?.allIds?.length} />
              </th>
              {columnsList.map((column) => (
                <th align="left" className="white-space--nowrap" key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          { data && additionalConditionsArr ? (
            <tbody>
              {Object.entries(data?.pairs).length > 0 ? (Object.entries(data?.pairs).map(([key, value], index) => (
                <React.Fragment key={value}>
                  <tr key={value}>
                    <td className="bg--contrast border--none">
                      <input type="checkbox" className="form--control" name="saveCard" onChange={(event) => onSelectMachinePair(event, key)} checked={checkRowMachineIsSelected(key)} />
                    </td>
                    <td colSpan={columnsList.length} className="bg--contrast border--none" onClick={() => expandTable(index)}>
                      <div className="d--flex align-items--center justify-content--between c--pointer">
                        {value}
                        <div className="c--pointer ">
                          <AngleDownIcon width={16} />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {openedRowIndexs.includes(index) &&
                    data?.data[key].map((el) => (
                      <tr key={el.id}>
                        <td>
                          <input type="checkbox" className="form--control" name="saveCard" onChange={() => onSelectMachine(el.id)} checked={!!checkRowIsSelected(el.id)} />
                        </td>
                        {columnsList.map((item) => (
                          <td key={item.key}>{item.render ? item.render(el[item.key]) :  el[item.key]}</td>
                        ))}
                      </tr>
                    ))}
                </React.Fragment>
              ))): (
                <tr>
                  <td colSpan="11">No records found</td>
                </tr>
              )}
            </tbody>
          ) : (
            <tbody>
              {data && data?.pairs.length == 0 && data?.data.length != 0 ? (data?.data.map((el) => (
                  <tr key={el.id}>
                    <td>
                      <input type="checkbox" className="form--control" name="saveCard" onChange={() => onSelectMachine(el.id)} checked={!!checkRowIsSelected(el.id)} />
                    </td>
                    {columnsList.map((item) => (
                      <td key={item.key}>{item.render ? item.render(el[item.key]) :  el[item.key]}</td>
                    ))}
                  </tr>
                ))) : (
                  <tr>
                    <td colSpan="11">No records found</td>
                  </tr>
                )}
            </tbody>
          )}
        </table>
      </div>
   <div className="justify-content-between align-items--center ">
        <div className="w--full d--flex gap--sm align-items--center">
          <div className="text--black">
            Total Records: {totalRecords} &nbsp; | &nbsp; Showing Records: {data?.pagination?.records}
          </div>
          <div className="w-max--100">
            <FormSelect value={length} onChange={(event) => setLength(event.target.value)} options={LOAD_MORE_ITEM_COUNT} />
          </div>
        </div>
        {totalRecords > data?.pagination?.records && <div className="w--full w-max--150 text--primary text--r c--pointer d--flex justify-content--end  font--sm font--500" onClick={() => handlePageChange()}>
          <div className="bg--black-50 text--black-800 radius--full w--full d--flex justify-content--start align-items--center h-min--36 p-l--md pr--md">
            <div className="w-min--36 h-min--32 d--flex align-items--center justify-content--start">
              {/* {isFetching && <Spinner />} */}
              </div>
            <div className="d--flex">Load More</div>
          </div>
        </div>}
        <div className="w--full"></div>
      </div>
    </div>
  );
};

export default CommonReportTable;
