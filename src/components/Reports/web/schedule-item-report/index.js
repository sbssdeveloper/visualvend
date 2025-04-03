import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TableWithPagination from "../../../../Widgets/web/CommonTable";
import FormInput from "../../../../Widgets/web/FormInput";
import useIcons from "../../../../Assets/web/icons/useIcons";
import FormSelect from "../../../../Widgets/web/FormSelect";
import Button from "../../../../Widgets/web/Button";
import { SCHEDULE_ITEM_REPORT_TABLE_COLUMNS } from "../../constant";
import CommonModal from "../../../../Widgets/web/CommonModal";

export default function ScheduleItemsReport() {
  const { SearchIcon } = useIcons();

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = () => {
    
    handleShowModal();
  };

  const handleDelete = () => {
    
    handleShowModal();
  };

 
  return (
    <div className="w--full d--flex flex--column gap--md salesReportPage scheduleSalesReportPage  h--full">
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Schedule Items Report</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <div className="w--full w-max--250 position--relative">
              <FormInput placeholder="Search" />
              <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
                <SearchIcon width={15} />
              </div>
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
          </div>
        </div>
      </div>
      <div className="w--full bg--white radius--sm p--md gap--md d--flex align-items--end">
        <div className="w--full">
          <FormSelect label="Client" />
        </div>
        <div className="w--full">
          <FormSelect label="Recipient Email " />
        </div>
        <div className="w--full">
          <FormSelect label="Frequency " />
        </div>
        <div className="w--full w-max--100">
          <Button variant="primary" color="white" btnClasses="btn">
            Submit
          </Button>
        </div>
      </div>
      <div className="d--flex flex--column w--full gap--sm m-t--sm">
        <div className="d--flex align-items--center justify-content--between">
          <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm h-min--36">
            Scheduled Recipient Email List
          </div>
          <div className="w--full w-max--300 position--relative">
            <FormInput placeholder="Search Keyword (Client Name, Email)" />
            <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
              <SearchIcon width={15} />
            </div>
          </div>
        </div>
        <div className="w--full h--full bg--white p--sm radius--md scheduleSalesReportList">
          <TableWithPagination
            key="refill"
            data={[
              { client_name: "Test 1", email: "test.com", frequency: "12345" },
            ]}
            columns={SCHEDULE_ITEM_REPORT_TABLE_COLUMNS}
            isPagination={false}
            isColumns={true}
            actions={[
              { label: "Edit", onClick: handleEdit },
              { label: "Delete", onClick: handleDelete },
            ]}
          />
        </div>
      </div>
       
      <CommonModal show={showModal} onClose={handleCloseModal}>
        <h1>Modal Content</h1>
        <p>This is the content inside the modal</p>
      </CommonModal>
      
    </div>
  );
}
