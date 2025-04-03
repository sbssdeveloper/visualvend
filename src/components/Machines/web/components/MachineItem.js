import React, { memo } from 'react'
import MachintActivity from "../../../../Assets/web/images/Alerts/machine-activity.svg";
import Button from "../../../../Widgets/web/Button";
import { useNavigate } from 'react-router-dom';
import useIcons from '../../../../Assets/web/icons/useIcons';
import { exportPlanogram , resetPlanogram} from "../../actions";
import { useMediaQuery } from 'react-responsive';



const MachineItem = memo(({ machine = {} }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    // console.log(machine);

    const navigate = useNavigate();
    const { RightCornerIcon, LeftCornerIcon, EditIcon, TrashIcon } = useIcons();

    const handleExportPlanogram = async (machine_id) => {
        try {
        const formData = new FormData();
        formData.append("machine_id", machine_id);
        formData.append("type", "planogram");
        const response = await exportPlanogram(formData);
        console.log("Export Planogram Response:", response?.data); // Log the response

        if (response?.data?.success === true && response?.data?.download_url) {
            window.open(response?.data?.download_url, "_blank"); // Open the download URL in a new tab
        } else {
            if(response?.data?.success === false) {
            alert(response?.data?.message || "Failed to export planogram."); // Show error message if any
            }
        }

        } catch (error) {
        console.error("Error exporting planogram:", error); // Log any errors
        }
    };

    const handleResetPlanogram =  async (machine_id) => {
        const confirmReset = window.confirm("Are you sure you want to reset the planogram?");
        if (confirmReset) {
            var resetformData = new FormData();
            resetformData.append("machine_id", machine_id);
            try {
            await resetPlanogram(resetformData);
            alert("Planogram reset successfully.");
            } catch (error) {
            console.error("Error resetting planogram:", error);
            alert("Failed to reset planogram.");
            } 
        }
    };

    return (
        <>
        {!isMobile && (
            <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative machines">
            <div className="position--absolute text--secondary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--secondary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
                {machine?.machine_name || 'NA'}
                {/* <div className="w-min--24 h-min--24 w-max--24 h-max--24 d--flex align-items--center justify-content--center ">
                    <input type="checkbox" className="form--control w-min--16 h-min--16" name="saveCard" />
                </div> */}
            </div>
            <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
                <img src={MachintActivity} alt="vendingAlert" width={80} />
            </div>
            <div className="w--full border-bottom--black-100 d--flex align-items--center font--md text--black-600 font--500"></div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500" onClick={() => navigate("machine-planogram", { state: { id: machine?.id , client_id:machine?.machine_client_id} })}>
                Planogram
            </div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500"  onClick={() => navigate("machine-planogram/upload-plannogram", { state: { machine_id: machine?.id , client_id:machine?.machine_client_id} })} >Upload Planogram</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500"  onClick={() => handleExportPlanogram(machine?.id)}>Export Planogram</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500"  onClick={() => handleResetPlanogram(machine?.id)} >Reset Planogram</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500">Configure</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500">Clone Machine</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500">Initial Setup</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500" onClick={() => navigate("machine-surcharges", { state: { id: machine?.id } })} >Surcharges</div>
            <div className="w--full border-bottom--black-100 cursor_pointer d--flex align-items--center font--md text--black-600 font--500"></div> 
 
            <div className="w--full d--flex gap--sm justify-content--center m-t--md">
                <Button onClick={() => navigate('/machines/upsert', { state: { type: "edit", data: machine } })} variant="black" color="white" size="md" btnClasses="btn gap--xs white-space--nowrap">
                    <EditIcon width={18} /> Edit
                </Button>
                <Button variant="orange" color="white" size="md" btnClasses="btn gap--xs white-space--nowrap">
                    <TrashIcon width={18} /> Remove
                </Button>
            </div>
        </div>
        )}
        {isMobile && (
            <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative machines w-max--155 ">
            <div className="position--absolute text--secondary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--secondary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
                {machine?.machine_name || 'NA'}
                {/* <div className="w-min--24 h-min--24 w-max--24 h-max--24 d--flex align-items--center justify-content--center ">
                    <input type="checkbox" className="form--control w-min--16 h-min--16" name="saveCard" />
                </div> */}
            </div>
            <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
                <img src={MachintActivity} alt="vendingAlert" width={80} />
            </div>
            <div className="w--full border-bottom--black-100 d--flex align-items--center font--md text--black-600 font--500"></div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500" onClick={() => navigate("machine-planogram", { state: { id: machine?.id , client_id:machine?.machine_client_id} })}>
                Planogram
            </div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500"  onClick={() => navigate("machine-planogram/upload-plannogram", { state: { machine_id: machine?.id , client_id:machine?.machine_client_id} })} >Upload Planogram</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500"  onClick={() => handleExportPlanogram(machine?.id)}>Export Planogram</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500"  onClick={() => handleResetPlanogram(machine?.id)} >Reset Planogram</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500">Configure</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500">Clone Machine</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500">Initial Setup</div>
            <div className="w--full h-min--40 border-bottom--black-100 cursor_pointer d--flex align-items--center justify-content--between font--sm text--black-600 font--500" onClick={() => navigate("machine-surcharges", { state: { id: machine?.id } })} >Surcharges</div>
            <div className="w--full border-bottom--black-100 cursor_pointer d--flex align-items--center font--md text--black-600 font--500"></div> 
 
            <div className="w--full d--flex gap--sm justify-content--center m-t--md">
                <Button onClick={() => navigate('/machines/upsert', { state: { type: "edit", data: machine } })} variant="black" color="white" size="sm" btnClasses="btn gap--xs white-space--nowrap">
                    <EditIcon width={18} /> 
                </Button>
                <Button variant="orange" color="white" size="sm" btnClasses="btn gap--xs white-space--nowrap">
                    <TrashIcon width={18} /> 
                </Button>
            </div>
        </div>
        )}
        </>
       
    );
});

export default MachineItem;