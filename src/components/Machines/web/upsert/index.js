import React, { useEffect, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import FormSelect from "../../../../Widgets/web/FormSelect";
import Button from "../../../../Widgets/web/Button";
import { ALL_CLIENT_CONST, MACHIES_DEFAULT_VALUES, MACHINE_CATEGORY_TYPE } from "../../constants";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import { getClientList } from "../../../ProductDetails/action";
import { useCustomForm } from "../../../../Hooks";
import { schemaUpsertMachine } from "../../schema";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { showSuccessToast } from "../../../../Helpers/web/toastr";
import { addMachine, editMachine, machineInfo } from "../../actions";
import FullScreenLoader from "../../../../Widgets/web/FullScreenLoader";
import { useMediaQuery } from 'react-responsive';
import useIcons from "../../../../Assets/web/icons/useIcons";


export default function UpsertMachine() {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { user = {} } = useSelector(({ auth }) => auth);
  const { handleSubmit, register, errors, watch, setValue } = useCustomForm({ defaultValues: MACHIES_DEFAULT_VALUES, schema: schemaUpsertMachine(user?.isClient) });
  const isEdit = locationState?.type === 'edit';
  const selectedMachineID = locationState?.data?.id;
   const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [aisleStart, setAisleStart] = useState('');
  const [aisleEnd, setAisleEnd] = useState('');
  const rows = watch('machine_row');
  const columns = watch('machine_column');
   
   const {
        ArrowLongLeftIcon,
      } = useIcons();
  
  useEffect(() => {
    if (rows && columns) {
      const totalAisles = rows * columns;
      if (aisleStart) {
        const prefix = aisleStart.match(/^\D*/)[0]; // Extract non-numeric prefix
        const startNumber = parseInt(aisleStart.match(/\d+$/)?.[0] || '0', 10); // Extract numeric part
        const endNumber = startNumber + totalAisles - 1;
        setAisleEnd(`${prefix}${endNumber}`);
      } else {
        setAisleStart('01'); // Default start value
        setAisleEnd(`${totalAisles}`);
      }
    } else {
      setAisleEnd('');
    }
  }, [aisleStart, rows, columns]);

  const { mutate: mutateUpsertMachine, isPending: isPendingUpsertMachine } = useMutation({
    mutationFn: isEdit ? editMachine : addMachine,
    onSuccess: (data) => {
      showSuccessToast(data?.data?.message || `Machine ${isEdit ? 'updated' : 'added'} successfully`)
      navigate(-1)
    }
  });

  const { data: dataMachineInfo } = useQuery({
    queryKey: ['machineInfo', selectedMachineID],
    queryFn: () => machineInfo({ machine_id: selectedMachineID }),
    enabled: isEdit
  })


  const handleSubmitForm = async (data) => {
    const { machine_client_id: clientID, machine_is_single_category: machineCategory, ...rest } = data;
    const payload = {
      machine_client_id: user?.isClient || clientID?.value,
      machine_is_single_category: machineCategory === 'single' ? 1 : 0,
      ...rest
    }
    if (isEdit) payload.machine_id = selectedMachineID;
    mutateUpsertMachine(payload)
  }



  useEffect(() => {
    if (dataMachineInfo?.data?.data && Object.keys(dataMachineInfo?.data?.data)?.length) {
      const data = dataMachineInfo?.data?.data;
      setValue("machine_client_id", { label: "Select Client", value: data?.machine_client_id })
      setValue("machine_name", data?.machine_name)
      setValue("machine_row", data?.machine_row)
      setValue("machine_column", data?.machine_column)
      setValue("machine_address", data?.machine_address)
      setValue("machine_latitude", data?.machine_latitude)
      setValue("machine_longitude", data?.machine_longitude)
      setValue("machine_is_single_category", data?.machine_is_single_category === 1 ? 'single' : 'multiple')
      setAisleStart(data?.aisle_start || '01');
      setAisleEnd(data?.aisle_end || '');
    }

  }, [dataMachineInfo])

  return (
    <>
    {!isMobile && (
       <div className="w--full d--flex flex--column gap--md machineMainPage addMachinePage h--full">
       {isPendingUpsertMachine && <FullScreenLoader />}
       <div className="w--full">
         <div className="d--flex justify-content--between align-items--center h-min--36">
           <div className="w-max--400 w--full position--relative">
             <div className="font--lg font--900 d--flex align-items--center gap--lg">
             <div className="d--flex c--pointer" onClick={() => navigate(-1)}>
                <ArrowLongLeftIcon />
            </div>
              {`${isEdit ? 'Edit' : 'Add'} Machine`}

              </div>
           </div>
         </div>
       </div>
       <form onSubmit={handleSubmit(handleSubmitForm)} className="w--full h--full d--flex flex--column justify-content--between gap--5xl bg--white p--md radius--md addMachinePageForm">
         <div className="d--flex gap--5xl w--full">
           <div className="w--full d--flex flex--column gap--xl">
             <div className="w--full d--flex flex--column">
               <SearchSelect
                 key={"clientIdsSelect"}
                 {...{
                   label: 'Client',
                   selectedOption: watch('machine_client_id'),
                   handleChange: (value) => setValue('machine_client_id', value, { shouldValidate: true }),
                   uniqueKey: "getClientList",
                   uniqueFn: () => getClientList({ type: "list" }),
                   labelKey: "client_name",
                   valueKey: "id",
                   placeholder: "Select Client",
                   extraColumObj: ALL_CLIENT_CONST,
                   error: errors?.machine_client_id?.value?.message,
                 }}
               />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_row')} type='number' label="Number of Row" placeholder="Enter Number of Rows" />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_address')} label="Machine Address" placeholder="Enter Machine Address" />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_longitude')} label="Machine longitude" placeholder="Enter Machine Longitude" />
             </div>
 
             {rows && columns && (
               <>
               <div className="d--flex gap-5">
                 <div className="w--full d--flex flex--column ">
                   <FormInput
                     type="text"
                     label="Aisle# Start"
                     placeholder="Enter Aisle Start"
                     defaultValue ={aisleStart}
                     onChange={(e) => setAisleStart(e.target.value)}
                   />
                 </div>
                 <div className="w--full d--flex flex--column ">
                   <FormInput
                     type="text"
                     label="Aisle# End"
                     placeholder="Aisle End"
                     defaultValue ={aisleEnd}
                     disabled
                     readOnly
                   />
                 </div>
               </div>
                 {/* <div className="w--full d--flex flex--column ">
                   <p>Total Aisles: {rows * columns}</p>
                 </div> */}
               </>
             )}
           </div>
           <div className="w--full d--flex flex--column gap--xl">
             <div className="w--full d--flex flex--column">
               <div className="w--full d--flex gap--lg">
                 <FormInput {...register('machine_name')} label="Machine Name" placeholder="Enter Machine Name"
                   error={errors?.machine_name?.message}
                 />
               </div>
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_column')} type='number' label="Number of Columns" placeholder="Enter Number of Columns" />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_latitude')} label="Machine Latitude" placeholder="Enter Machine Latitude" />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormSelect {...register('machine_is_single_category')} label="Machine Category Type" options={MACHINE_CATEGORY_TYPE} defaultPlaceholder={false} />
             </div>
           </div>
         </div>
         <div className="w--full d--flex gap--sm justify-content--center p-b--sm ">
           <Button onClick={() => navigate(-1)} type='button' variant="black" color="white" btnClasses="btn border-full--black-200 w-min--200 w-max--200">
             Cancel
           </Button>
           <Button type='submit' variant="orange" color="white" btnClasses="btn  w-min--200 w-max--200">
             {`${isEdit ? 'Edit' : 'Add'} Machine`}
           </Button>
         </div>
       </form>
     </div>
    )}
    {isMobile && (
       <div className="w--full d--flex flex--column gap--md machineMainPage addMachinePage h--full">
       {isPendingUpsertMachine && <FullScreenLoader />}
       <div className="w--full">
         <div className="d--flex justify-content--between align-items--center h-min--36">
           <div className="w-max--400 w--full position--relative">
             <div className="font--lg font--900 d--flex align-items--center gap--lg">
             <div className="d--flex c--pointer" onClick={() => navigate(-1)}>
                <ArrowLongLeftIcon />
            </div>
              {`${isEdit ? 'Edit' : 'Add'} Machine`}</div>
           </div>
         </div>
       </div>
       <form onSubmit={handleSubmit(handleSubmitForm)} className="w--full h--full d--flex flex--column justify-content--between gap--5xl bg--white p--md radius--md addMachinePageForm">
         <div className=" gap--5xl w--full">
           <div className="w--full d--flex flex--column gap--xl">
             <div className="w--full d--flex flex--column">
               <SearchSelect
                 key={"clientIdsSelect"}
                 {...{
                   label: 'Client',
                   selectedOption: watch('machine_client_id'),
                   handleChange: (value) => setValue('machine_client_id', value, { shouldValidate: true }),
                   uniqueKey: "getClientList",
                   uniqueFn: () => getClientList({ type: "list" }),
                   labelKey: "client_name",
                   valueKey: "id",
                   placeholder: "Select Client",
                   extraColumObj: ALL_CLIENT_CONST,
                   error: errors?.machine_client_id?.value?.message,
                 }}
               />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_row')} type='number' label="Number of Row" placeholder="Enter Number of Rows" />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_address')} label="Machine Address" placeholder="Enter Machine Address" />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_longitude')} label="Machine longitude" placeholder="Enter Machine Longitude" />
             </div>
 
             {rows && columns && (
               <>
               <div className="d--flex gap-5">
                 <div className="w--full d--flex flex--column ">
                   <FormInput
                     type="text"
                     label="Aisle# Start"
                     placeholder="Enter Aisle Start"
                     defaultValue ={aisleStart}
                     onChange={(e) => setAisleStart(e.target.value)}
                   />
                 </div>
                 <div className="w--full d--flex flex--column ">
                   <FormInput
                     type="text"
                     label="Aisle# End"
                     placeholder="Aisle End"
                     defaultValue ={aisleEnd}
                     disabled
                     readOnly
                   />
                 </div>
               </div>
                 {/* <div className="w--full d--flex flex--column ">
                   <p>Total Aisles: {rows * columns}</p>
                 </div> */}
               </>
             )}
           </div>
           <div className="w--full d--flex flex--column gap--xl bg--white m-l--sm">
             <div className="w--full d--flex flex--column">
               <div className="w--full d--flex gap--lg">
                 <FormInput {...register('machine_name')} label="Machine Name" placeholder="Enter Machine Name"
                   error={errors?.machine_name?.message}
                 />
               </div>
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_column')} type='number' label="Number of Columns" placeholder="Enter Number of Columns" />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormInput {...register('machine_latitude')} label="Machine Latitude" placeholder="Enter Machine Latitude" />
             </div>
             <div className="w--full d--flex flex--column ">
               <FormSelect {...register('machine_is_single_category')} label="Machine Category Type" options={MACHINE_CATEGORY_TYPE} defaultPlaceholder={false} />
             </div>
           </div>
         </div>
         <div className="w--full d--flex gap--sm justify-content--center p-b--sm ">
           <Button onClick={() => navigate(-1)} type='button' variant="black" color="white" btnClasses="btn border-full--black-200 w-min--150 w-max--200">
             Cancel
           </Button>
           <Button type='submit' variant="orange" color="white" btnClasses="btn  w-min--150 w-max--200">
             {`${isEdit ? 'Edit' : 'Add'} Machine`}
           </Button>
         </div>
       </form>
     </div>
    )}
    </>
   
  );
}
