import React, { useEffect, useState } from "react";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Spinner from "../../../../Widgets/web/Spinner";
import Button from "../../../../Widgets/web/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { exportPlanogram, machinePlanogram, resetPlanogram } from "../../actions";
import { MEDIA_BASE_URL, MEDIA_BASE_URL_2 } from "../../../../Helpers/constant";
import { useMediaQuery } from 'react-responsive';

export default function MachinePlanogram() {
  const {
    RightCornerIcon,
    LeftCornerIcon,
    RestoreIcon,
    UploadIcon,
    ExportIcon,
    EditIcon,
    ArrowLongLeftIcon,
  } = useIcons();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { id: machine_id, client_id: client_id, machine_row, machine_column } = location.state || {};

  const [planogramData, setPlanogramData] = useState([]);
  const [machineDetails, setMachineDetails] = useState({ rows: 0, columns: 0 });
  const [isLoading, setIsLoading] = useState(true); // State to manage loading spinner
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
 

  const getMediaDomain = (url) => {
    if (!url) return ``;
    let domain = url.includes("ngapp") ? MEDIA_BASE_URL_2 : MEDIA_BASE_URL;
    return domain + url;
  };
 
  const backToProducts = () => {
    navigate(`/machines`);
  };
  useEffect(() => {
    const fetchPlanogramData = async () => {
      setIsLoading(true); // Show spinner
      var formData = new FormData();
      formData.append("machine_id", machine_id);
      formData.append("type", "planogram");
      const response = await machinePlanogram(formData);
      console.log(response);

      if (response && response.data) {
        const { data, machine } = response.data;
        setPlanogramData(data); // Set product data
        setMachineDetails({
          rows: machine.machine_row || 0,
          columns: machine.machine_column || 0,
        }); // Set machine rows and columns
      }
      setIsLoading(false); // Hide spinner
    };

    if (machine_id) {
      fetchPlanogramData();
    }
  }, [machine_id]);

  if (isLoading) {
    return (
      <div className="bg-white d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text--orange large-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleResetPlanogram = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset the planogram?");
    if (confirmReset) {
      var resetformData = new FormData();
      resetformData.append("machine_id", machine_id);
      try {
        setIsLoading(true); // Show spinner during reset
        await resetPlanogram(resetformData);
        alert("Planogram reset successfully.");
        // Re-fetch the planogram data after reset
        var formData = new FormData();
        formData.append("machine_id", machine_id);
        formData.append("type", "planogram");
        const response = await machinePlanogram(formData);
        if (response && response.data) {
          const { data, machine } = response.data;
          setPlanogramData(data); // Update product data
          setMachineDetails({
            rows: machine.machine_row || 0,
            columns: machine.machine_column || 0,
          }); // Update machine rows and columns
        }
      } catch (error) {
        console.error("Error resetting planogram:", error);
        alert("Failed to reset planogram.");
      } finally {
        setIsLoading(false); // Hide spinner after reset
      }
    }
  };

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

  const renderPlanogram = () => {
    const { rows, columns } = machineDetails;
    const planogram = [];

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= columns; col++) {
        const aisleNumber = (row - 1) * columns + col;
        const product = planogramData.find(
          (item) => parseInt(item.product_location) === aisleNumber
        );

        planogram.push(
          <>
           {!isMobile && (
             <div
             key={`aisle-${aisleNumber}`}
             className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative overflow--hidden"
           >
             <div className="position--absolute text--secondary right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--secondary left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
               <div className="qs_asile_number">{aisleNumber}</div>
               <div
                 className="cursor_pointer w-min--24 h-min--24 d--flex align-items--center justify-content--center text--orange"
                 onClick={() =>
                   navigate(`/machines/machine-planogram/edit-planogram`, {
                     state: { client_id: client_id, id: product?.id, machine_id: machine_id, aisleNumber: aisleNumber },
                   })
                 }
               >
                 <EditIcon className="text--orange" width={18} />
               </div>
             </div>
             <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
               {product ? (
                 <img
                   src={getMediaDomain(product.product_image)}
                   alt={product.product_name}
                   width={80}
                 />
               ) : (
                 <span className="text--red fs_18">Empty</span>
               )}
             </div>
             <div>
               <h6 className="text--black scrolling-text font--600">
                 {product ? product.product_name : "No Product"}
               </h6>
             </div>
             {product && (
               <>
                 <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
                   Qty{" "}
                   <div className="font--sm font--600 text--orange">
                     {product.product_quantity}/{product.product_max_quantity}
                   </div>
                 </div>
                 <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
                   Price{" "}
                   <div className="font--sm font--600 text--orange">
                     {product.product_price} {product.product_price && "$"}
                   </div>
                 </div>
               </>
             )}
           </div>
           )}
            {isMobile && (
               <div
               key={`aisle-${aisleNumber}`}
               className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative overflow--hidden"
             >
               <div className="position--absolute text--secondary right---5 top---4 ">
                 <RightCornerIcon width={30} height={30} />
               </div>
               <div className="position--absolute text--secondary left---4 bottom---10 ">
                 <LeftCornerIcon width={30} height={30} />
               </div>
               <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
                 <div className="qs_asile_number_mobile">{aisleNumber}</div>
                 <div
                   className="cursor_pointer w-min--24 h-min--24 d--flex align-items--center justify-content--center text--orange"
                   onClick={() =>
                     navigate(`/machines/machine-planogram/edit-planogram`, {
                       state: { client_id: client_id, id: product?.id, machine_id: machine_id, aisleNumber: aisleNumber },
                     })
                   }
                 >
                   <EditIcon className="text--orange" width={15} />
                 </div>
               </div>
               <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
                 {product ? (
                   <img
                     src={getMediaDomain(product.product_image)}
                     alt={product.product_name}
                     width={80}
                   />
                 ) : (
                   <span className="text--red fs_18">Empty</span>
                 )}
               </div>
               <div>
                 <h6 className="text--black scrolling-text font--600">
                   {product ? product.product_name : "No Product"}
                 </h6>
               </div>
               {product && (
                 <>
                   <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
                     Qty{" "}
                     <div className="font--sm font--600 text--orange">
                       {product.product_quantity}/{product.product_max_quantity}
                     </div>
                   </div>
                   <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
                     Price{" "}
                     <div className="font--sm font--600 text--orange">
                       {product.product_price} {product.product_price && "$"}
                     </div>
                   </div>
                 </>
               )}
             </div>
            )}
         
          </>
        );
      }
    }

    return planogram;
  };

  const totalAisles = machineDetails.rows * machineDetails.columns;

  return (
    <>
    {!isMobile && (
       <div className="w--full d--flex flex--column gap--md machineMainPage h--full">
       <div className="w--full d--flex justify-content--flex-end gap--xl bg--white p--md radius--md">
       <div className="d--flex c--pointer" onClick={() => backToProducts()}>
               <ArrowLongLeftIcon />
         </div>
         <div className=" d--flex gap--sm justify-content--end ">
         
           <Button
             variant="orange"
             color="white"
             btnClasses="btn gap--xs  white-space--nowrap"
             type="button"
             onClick={handleResetPlanogram} // Use the updated reset handler
           >
             <RestoreIcon width={20} /> Reset Planogram
           </Button>
           <Button
             variant="black"
             color="white"
             btnClasses="btn gap--xs  white-space--nowrap"
             type="button"
             onClick={() => navigate(`upload-plannogram`, {
               state: { client_id: client_id, machine_id: machine_id },
             })}
           >
             <UploadIcon width={20} />
             Import Excel 
           </Button>
           <Button
             variant="orange"
             color="white"
             btnClasses="btn gap--xs  white-space--nowrap"
             type="button"
             onClick={() => handleExportPlanogram(machine_id)} // Trigger export functionality
           >
             <ExportIcon width={20} />
             Export to Excel
           </Button>
         </div>
       </div>
       <div className="w--full d--grid grid--5 grid--5--xl gap--lg">
         {renderPlanogram()}
       </div>
     </div>
    )}
    {isMobile && (
       <div className="w--full d--flex flex--column gap--md machineMainPage h--full">
       <div className="w--full  justify-content--flex-end gap--xl bg--white p--md radius--md">
       <div className="d--flex justify-content--flex-end   align-items--center w--100 machinepage">
  {/* Back Arrow */}
  <div className="c--pointer" onClick={() => backToProducts()}>
    <ArrowLongLeftIcon />
  </div>

  {/* Reset Planogram Button */}

    <Button
      variant="orange"
      color="white"
      btnClasses="btn gap--xs white-space--nowrap"
      type="button"
      onClick={handleResetPlanogram} // Use the updated reset handler
    >
      <RestoreIcon width={20} /> Reset Planogram
    </Button>
  
</div>

          
         <div className=" d--flex gap--sm justify-content--end m-t--md  ">
     
        
           <Button
             variant="black"
             color="white"
             btnClasses="btn gap--xs  white-space--nowrap"
             type="button"
             onClick={() => navigate(`upload-plannogram`, {
               state: { client_id: client_id, machine_id: machine_id },
             })}
           >
             <UploadIcon width={20} />
             Import Excel 
           </Button>
           <Button
             variant="orange"
             color="white"
             btnClasses="btn gap--xs  white-space--nowrap"
             type="button"
             onClick={() => handleExportPlanogram(machine_id)} // Trigger export functionality
           >
             <ExportIcon width={20} />
             Export to Excel
           </Button>
         </div>
       </div>
       <div className="w--full d--grid grid--3 grid--3--xl gap--sm">
         {renderPlanogram()}
       </div>
     </div>
    )}
   
    </>
  );
}
