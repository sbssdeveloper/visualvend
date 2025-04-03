import React, { useEffect, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import FormSelect from "../../../../Widgets/web/FormSelect";
import useIcons from "../../../../Assets/web/icons/useIcons";
import machineVendImg from "../../../../Assets/web/images/Alerts/userVendMachine.svg";
import Button from "../../../../Widgets/web/Button";
import { uploadPlanogram, machineInfo } from "../../actions";
import { useLocation, useNavigate } from "react-router-dom";
import { MEDIA_BASE_URL, MEDIA_BASE_URL_2 } from "../../../../Helpers/constant";
import { useMediaQuery } from 'react-responsive';

export default function UploadPlanogram() {
  const { SearchIcon, ArrowLongLeftIcon, DownloadIcon, EyeIcon } = useIcons();
  const [selectedFile, setSelectedFile] = useState(null);
  const [machineData, setMachineData] = useState(null);
  const location = useLocation();
  const client_id = location.state?.client_id;
  const machine_id = location.state?.machine_id;
  const navigate = useNavigate();

  console.log(machineData);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  useEffect(() => {
    const fetchMachineInfo = async () => {
      try {
        const formData = new FormData();
        formData.append("machine_id", machine_id);
        const response = await machineInfo(formData);

        if (response?.data) {
          setMachineData(response.data);
        } else {
          alert("Failed to fetch machine information.");
        }
      } catch (error) {
        console.error("Error fetching machine information:", error);
        alert("An error occurred while fetching machine information.");
      }
    };

    if (machine_id) {
      fetchMachineInfo();
    }
  }, [machine_id]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("machine_id", machine_id);
    formData.append("type", "upload");
    formData.append("targetPath", "/ngapp/assets/csv/planogram/");
    try {
      await uploadPlanogram(formData);
      alert("File uploaded successfully.");
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };



  return (
    <>
    {!isMobile && (
    <div className="w--full d--flex flex--column gap--md machineMainPage resetMachinePage h--full">
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900 d--flex align-items--center gap--sm">
              <div className="d--flex c--pointer" onClick={() => navigate(-1)}>
                <ArrowLongLeftIcon />
              </div>
              Upload Planogram to {machineData?.data?.machine_name || "Machine"}
            </div>
          </div>
        </div>
      </div>
      <div className="w--full  d--flex align-items--center justify-content--between h-min--50 font--sm font--600  bg--white p--md radius--md text--black-600">
        You should only upload .xls, .xlsx, .csv file formats.
        <div className="d--flex">
          <a
            href={`${MEDIA_BASE_URL_2}http://162.252.85.40/ngapp/samples/sample_single.xlsx`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="orange" color="white" btnClasses="btn  w-min--200 gap--sm" type="button">
              <DownloadIcon width={20} />
              Download Sample Files
            </Button>
          </a>
        </div>
      </div>
      <div className="w--full h--full  d--flex flex--column align-items--center justify-content--between h-min--50 font--sm font--600  bg--white p--md radius--md resetMachineList">
        <div className="w--full h--full d--flex align-items--start justify-content--between  gap--md ">
          <div className="w--full w-max--500">
            <FormInput label="File" type="file" paddingLeft="xs" onChange={handleFileChange} />
          </div>
        </div>
        <div className="w--full d--flex gap--sm justify-content--center p-b--md">
          <Button variant="black" color="white" btnClasses="btn border-full--black-200 w-min--200 w-max--200" type="button" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            variant="orange"
            color="white"
            btnClasses="btn  w-min--200 w-max--200"
            type="button"
            onClick={handleUpload}
          >
            Upload Planogram
          </Button>
        </div>
      </div>
    </div>
    )}
    {isMobile && (

          <div className="w--full d--flex flex--column gap--md machineMainPage resetMachinePage h--full">
          <div className="w--full">
            <div className="d--flex justify-content--between align-items--center h-min--36">
              <div className="w-max--400 w--full position--relative">
                <div className="font--lg font--900 d--flex align-items--center gap--sm">
                  <div className="d--flex c--pointer" onClick={() => navigate(-1)}>
                    <ArrowLongLeftIcon />
                  </div>
                  Upload Planogram to {machineData?.data?.machine_name || "Machine"}
                </div>
              </div>
            </div>
          </div>
          <div className="w--full  d--flex align-items--center justify-content--between h-min--50 font--sm font--600  bg--white p--md radius--md text--black-600">
            You should only upload .xls, .xlsx, .csv file formats.
            <div className="d--flex">
              <a
                href={`${MEDIA_BASE_URL_2}http://162.252.85.40/ngapp/samples/sample_single.xlsx`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="orange" color="white" btnClasses="btn  w-min--200 gap--sm" type="button">
                  <DownloadIcon width={20} />
                  Download Sample Files
                </Button>
              </a>
            </div>
          </div>
          <div className="w--full h--full  d--flex flex--column align-items--center justify-content--between h-min--50 font--sm font--600  bg--white p--md radius--md resetMachineList">
            <div className="w--full h--full d--flex align-items--start justify-content--between  gap--md ">
              <div className="w--full w-max--500">
                <FormInput label="File" type="file" paddingLeft="xs" onChange={handleFileChange} />
              </div>
            </div>
            <div className="w--full d--flex gap--sm justify-content--center p-b--md">
              <Button variant="black" color="white" btnClasses="btn border-full--black-200 w-min--150 w-max--200" type="button" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                variant="orange"
                color="white"
                btnClasses="btn  w-min--150 w-max--200"
                type="button"
                onClick={handleUpload}
              >
                Upload Planogram
              </Button>
            </div>
          </div>
          </div>


    )}

    </>
  );
}
