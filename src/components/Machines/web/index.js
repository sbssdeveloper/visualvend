import React, { useEffect, useState } from "react";
import FormInput from "../../../Widgets/web/FormInput";
import FormSelect from "../../../Widgets/web/FormSelect";
import useIcons from "../../../Assets/web/icons/useIcons";
import Button from "../../../Widgets/web/Button";
import { useNavigate } from "react-router-dom";
import MachineItem from "./components/MachineItem";
import { useQuery } from "@tanstack/react-query";
import { machinesList } from "../actions";
import FullScreenLoader from "../../../Widgets/web/FullScreenLoader";
import { LOAD_MORE_ITEM_COUNT } from "../../Reports/constant";
import useDebounce from "../../../Hooks/useDebounce";
import { MACHINES_SORT_OPTIONS } from "../constants";
import { useMediaQuery } from 'react-responsive';
 




export default function Machines() {
  const navigate = useNavigate();
  const { SearchIcon, PlusIcon, TickCheckIcon, ListIcon, ExportIcon } = useIcons();
  const [page, setPage] = useState(1);
  const [length, setLength] = useState(50);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at-ASC");
  const [machineState, setMachineState] = useState(null)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


  let payload = { search, sort: sort?.split('-')?.at(0), direction: sort?.split('-')?.at(1), length: length * page, };
  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['machinesList', payload],
    queryFn: ({ queryKey: payloadData }) => machinesList(payloadData[1] || {}),
    select: data => data?.data?.data
  });

  const handleSearchFilter = useDebounce((value) => {
    setPage(1);
    setSearch(value);
  }, 1000);

  const isLoader = [isLoading, isFetching].includes(true)

  useEffect(() => {
    if (data && Object.keys(data)?.length) setMachineState(data)
  }, [data])


  return (
    <>    
      {!isMobile && (
        <div className="w--full d--flex flex--column gap--md machineMainPage h--full">
          {isLoader && <FullScreenLoader />}
          <div className="w--full">
            <div className="d--flex justify-content--between align-items--center h-min--36">
              <div className="w-max--400 w--full position--relative">
                <div className="font--lg font--900">Machine</div>
              </div>
              <div className="d--flex align-items--center justify-content--end gap--sm w--full">
                <div className="w--full w-max--250 position--relative">
                  <FormInput placeholder="Search" onKeyUp={(event) => handleSearchFilter(event.target.value)} />
                  <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
                    <SearchIcon width={15} />
                  </div>
                </div>
                <div className="w--full w-max--250 ">
                  <FormSelect value={sort} onChange={(event) => setSort(event.target.value)} options={MACHINES_SORT_OPTIONS} defaultPlaceholder={false} />
                </div>
              </div>
            </div>
          </div>
          <div className="w--full d--flex justify-content--between gap--xl bg--white p--md radius--md">
            <div className="w--full d--flex gap--sm w-max--400">
              {/* <FormSelect /> */}
            </div>
            <div className="w--full d--flex gap--lg justify-content--end w-max--150">
           
              <Button variant="orange" color="white" btnClasses="btn gap--xs w-min--100" onClick={() => navigate("/machines/upsert", { state: { type: 'add' } })}>
                <PlusIcon width={24} /> Add Machine
              </Button>
            </div>
          </div>
          <div className="w--full d--grid grid--5 grid--5--md  gap--lg">
            {Array.isArray(machineState?.data) && machineState.data.length ? (
              machineState.data.map(machine => <MachineItem key={machine?.id} machine={machine} />)
            ) : !isLoader && <p>No Record Found!</p>}
          </div>
          {machineState && machineState?.data?.length != 0 && (
            <div className="d--flex justify-content-between align-items--center ">
              <div className="w--full d--flex gap--sm align-items--center">
                <div className="text--black">
                  Total Records: {machineState?.total} &nbsp; | &nbsp; Showing Records: {machineState?.to}
                </div>
                <div className="w-max--100">
                  <FormSelect value={length} onChange={(event) => setLength(event.target.value)} options={LOAD_MORE_ITEM_COUNT} />
                </div>
              </div>
              <div className="w--full w-max--150 text--primary text--r c--pointer d--flex justify-content--end  font--sm font--500">
                {machineState?.total > machineState?.to && (
                  <div onClick={() => setPage(page => page + 1)} className="bg--black-50 text--black-800 radius--full w--full d--flex justify-content--start align-items--center h-min--36 p-l--md pr--md">
                    <div className="w-min--36 h-min--32 d--flex align-items--center justify-content--start">{/* {isFetching && <Spinner />} */}</div>
                    <div className="d--flex">Load More</div>
                  </div>
                )}
              </div>
              <div className="w--full"></div>
            </div>
          )}
        </div >
      )}

      {isMobile &&(
        <div className="w--full d--flex flex--column gap--md machineMainPage h--full">
          {isLoader && <FullScreenLoader />}
          <div className="w--full">
            <div className="d--flex justify-content--between align-items--center h-min--36">
              <div className="w-max--400 w--sm position--relative">
                <div className="font--lg font--900">Machine</div>
              </div>
              <div className="d--flex align-items--center justify-content--end gap--sm w--full">
                <div className="w--full w-max--250 position--relative">
                  <FormInput placeholder="Search" onKeyUp={(event) => handleSearchFilter(event.target.value)} />
                  <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
                    <SearchIcon width={15} />
                  </div>
                </div>
                <div className="w--full w-max--250 ">
                  <FormSelect value={sort} onChange={(event) => setSort(event.target.value)} options={MACHINES_SORT_OPTIONS} defaultPlaceholder={false} />
                </div>
              </div>
            </div>
          </div>
          <div className="w--full d--flex justify-content--between gap--xl bg--white p--md radius--md">
            <div className="w--full d--flex gap--sm w-max--400">
              {/* <FormSelect /> */}
            </div>
            <div className="w--full d--flex gap--sm justify-content--end w-max--150">
              {/* <Button variant="primary" color="white" btnClasses="btn gap--xs w-min--100 white-space--nowrap" type="button" onClick={() => navigate("planogram-list")}>
                <ListIcon width={20} /> Planogram List
              </Button>
              <Button variant="primary" color="white" btnClasses="btn gap--xs w-min--100">
                <TickCheckIcon width={20} /> Select All
              </Button>
              <Button variant="primary" color="white" btnClasses="btn gap--xs w-min--100">
                <ExportIcon width={20} /> Export to Excel
              </Button> */}
              <Button variant="orange" color="white" btnClasses="btn gap--xs w-min--100" onClick={() => navigate("/machines/upsert", { state: { type: 'add' } })}>
                <PlusIcon width={24} /> Add Machine
              </Button>
            </div>
          </div>
          <div className="w--full d--grid grid--2 grid--2--md  gap--lg">
            {Array.isArray(machineState?.data) && machineState.data.length ? (
              machineState.data.map(machine => <MachineItem key={machine?.id} machine={machine} />)
            ) : !isLoader && <p>No Record Found!</p>}
          </div>
          {machineState && machineState?.data?.length != 0 && (
            <div className="d--flex justify-content-between align-items--center ">
              <div className="w--full d--flex gap--sm align-items--center">
                <div className="text--black">
                  Total Records: {machineState?.total} &nbsp; | &nbsp; Showing Records: {machineState?.to}
                </div>
                <div className="w-max--100">
                  <FormSelect value={length} onChange={(event) => setLength(event.target.value)} options={LOAD_MORE_ITEM_COUNT} />
                </div>
              </div>
              <div className="w--full w-max--150 text--primary text--r c--pointer d--flex justify-content--end  font--sm font--500">
                {machineState?.total > machineState?.to && (
                  <div onClick={() => setPage(page => page + 1)} className="bg--black-50 text--black-800 radius--full w--full d--flex justify-content--start align-items--center h-min--36 p-l--md pr--md">
                    <div className="w-min--36 h-min--32 d--flex align-items--center justify-content--start">{/* {isFetching && <Spinner />} */}</div>
                    <div className="d--flex">Load More</div>
                  </div>
                )}
              </div>
              <div className="w--full"></div>
            </div>
          )}
        </div >
      )}

    </>
  );
}

