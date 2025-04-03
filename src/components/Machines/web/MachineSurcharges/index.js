import React, { useState, useEffect } from 'react';
import Button from "../../../../Widgets/web/Button";
import FormInput from "../../../../Widgets/web/FormInput";
import '../../../../App.css';
import useIcons from "../../../../Assets/web/icons/useIcons";
import { Controller, useForm } from "react-hook-form";
import { machineSurcharges, machineSaveSurcharges } from '../../actions'; // Import the API functions
import { useLocation,useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Import react-select
import { showSuccessToast } from "../../../../Helpers/web/toastr";
import FullScreenLoader from "../../../../Widgets/web/FullScreenLoader";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from 'react-responsive';
const validationSchema = yup.object().shape({
  surcharge_fees: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Please enter the surcharge name."),
      type: yup
        .string()
        .required("Please specify the surcharge type.")
        .oneOf(["amount", "percentage", "amount-percentage"], "Invalid surcharge type."),
      amount: yup.number().when('type', {
        is: (val) => val === 'amount' || val === 'amount-percentage',
        then: yup.number().required("Please enter the surcharge amount.").min(0.01, "The surcharge amount must be greater than zero."),
      }),
      percentage: yup.number().when('type', {
        is: (val) => val === 'percentage' || val === 'amount-percentage',
        then: yup.number().required("Please enter the surcharge percentage.").min(0.01, "The surcharge percentage must be greater than zero."),
      }),
      min_price: yup.number().required("Please enter the minimum price.").min(1, "The minimum price must be greater than zero."),
      max_price: yup.number().required("Please enter the maximum price.").min(1, "The maximum price must be greater than zero."),
      from_date: yup.date().required("Please select the start date."),
      to_date: yup.date().required("Please select the end date."),
      description: yup.string().required("Please provide a description."),
       
    })
  ),


});


export default function MachineSurcharges(props) {
  const [surchargeList, setSurchargeList] = useState([]); // Initialize as an empty array
  const [machineProducts, setMachineProducts] = useState([]); // Store machine products
  const { TrashIcon, CloneIcon,ArrowLongLeftIcon } = useIcons();
   const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [issurcharge,setIssurcharge]=useState(false);
  const location = useLocation();
  const { id: machine_id } = location.state || {};  
  const Navigate=useNavigate();
  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      surcharge_fees: surchargeList, // Default values for surcharge fees
    },
    mode: 'onSubmit', // Trigger validation when form is submitted
  });
  useEffect(() => {
    if (!machine_id) {
      console.error("Machine ID not found");
      return;
    }
  
    const fetchSurchargeData = async () => {
      try {
        const response = await machineSurcharges({ machine_id });
        const data = response.data.data;
  
        if (Array.isArray(data.machine_surcharges) && data.machine_surcharges.length > 0) {
          const updatedSurcharges = data.machine_surcharges.map(surcharge => ({
            ...surcharge,
            product_ids: surcharge.product_ids.split(',').map(Number), // Convert comma-separated string to array of numbers
          }));
  
          setSurchargeList(updatedSurcharges);
  
          updatedSurcharges.forEach((surcharge, index) => {
            Object.keys(surcharge).forEach(key => {
              setValue(`surcharge_fees[${index}].${key}`, surcharge[key]);
            });
          });
        } else {
          console.log("No surcharges found.");
          const defaultRow = {
            id: Date.now(),
            name: '',
            type: 'amount', // Default type is 'amount'
            amount: 0,
            percentage: 0,
            min_price: 0,
            max_price: 0,
            from_date: '',
            to_date: '',
            description: '',
            product_ids: [],
          };
          setSurchargeList([defaultRow]); // Set default row
        
  
           // Empty surcharge list
        }
  
        // Set machine products list
        setMachineProducts(data.machineProducts);
        setIssurcharge(false);
      } catch (error) {
        console.error("Failed to fetch surcharge data:", error);
        setIssurcharge(true);
      }
    };
  
    fetchSurchargeData();
  }, [setValue, machine_id]);

  const handleAddSurcharge = () => {
    const newRow = {
      id: Date.now(),
      name: '',
      type: 'amount', // Default type is 'amount'
      amount: 0,
      percentage: 0,
      min_price: 0,
      max_price: 0,
      from_date: '',
      to_date: '',
      description: '',
      product_ids: [],  // Initialize as an empty array
    };
    setSurchargeList(prevSurcharge => [...prevSurcharge, newRow]);
  };

  const handleClone = (index) => {
    setSurchargeList(prevSurcharge => {
      const newSurcharge = [...prevSurcharge];
      newSurcharge.splice(index, 0, { ...prevSurcharge[index], id: Date.now() });
      return newSurcharge;
    });
  };

  const onSubmit = async (data) => {
    try {
      console.log('Received data:', data);
      console.log('Surcharge List:', surchargeList);
  
      // Prepare form data to be sent
      const formData = surchargeList.map((row, index) => ({
        id: row.id,
        name: data.surcharge_fees[index].name,
        type: data.surcharge_fees[index].type,
        amount: data.surcharge_fees[index].amount,
        percentage: data.surcharge_fees[index].percentage,
        min_price: data.surcharge_fees[index].min_price,
        max_price: data.surcharge_fees[index].max_price,
        from_date: new Date(data.surcharge_fees[index].from_date).toISOString().slice(0, 19).replace('T', ' '),
        to_date: new Date(data.surcharge_fees[index].to_date).toISOString().slice(0, 19).replace('T', ' '),
      
        description: data.surcharge_fees[index].description,
        product_ids: row.product_ids.join(','),  // Convert array to comma-separated string
      }));
  
      const finalFormData = {
        machine_id: machine_id,  // Pass the machine_id separately
        surcharges: formData,  // Attach surcharge data
      };
  
      // Proceed with the save operation
      setIssurcharge(true);
      await machineSaveSurcharges(finalFormData);
  
      // Redirect and show success toast
      Navigate('/machines');
      showSuccessToast(`Surcharge updated successfully!`);
      console.log('Surcharges saved successfully!');
      console.log(surchargeList);
    } catch (error) {
      console.error('Error saving surcharges:', error);
      setIssurcharge(true);
    }
  };
  


  const handleDelete = (index) => {
    const updatedSurcharge = surchargeList.filter((_, i) => i !== index);
    setSurchargeList(updatedSurcharge);
    setValue('surcharge_fees', updatedSurcharge);
  };

  const handleProductSelection = (index, selected) => {
    const selectedIds = selected ? selected.map(product => product.value) : [];
    setSurchargeList(prevSurcharge => {
      const updated = [...prevSurcharge];
      updated[index].product_ids = selectedIds;
      return updated;
    });
  };

  const handleSurchargeTypeChange = (index, newType) => {
    setSurchargeList(prev => {
      const updatedSurcharge = [...prev];
      updatedSurcharge[index].type = newType;

      // Clear amount/percentage if needed based on type
      if (newType !== "amount" && newType !== "amount-percentage") {
        updatedSurcharge[index].amount = '';
      }
      if (newType !== "percentage" && newType !== "amount-percentage") {
        updatedSurcharge[index].percentage = '';
      }

      return updatedSurcharge;
    });
  };

  const validateDates = (from_date, to_date) => {
    if (new Date(to_date) < new Date(from_date)) {
      return "To Date should be greater than or equal to From Date";
    }
    return null;
  };

  const checkDateOverlap = (updatedList, index, from_date, to_date) => {
    const newFromDate = new Date(from_date).getTime();
    const newToDate = new Date(to_date).getTime();

    for (let i = 0; i < updatedList.length; i++) {
      if (i !== index) {
        const surcharge = updatedList[i];
        const existingFromDate = new Date(surcharge.from_date).getTime();
        const existingToDate = new Date(surcharge.to_date).getTime();

        if (
          (newFromDate >= existingFromDate && newFromDate <= existingToDate) ||
          (newToDate >= existingFromDate && newToDate <= existingToDate) ||
          (newFromDate <= existingFromDate && newToDate >= existingToDate)
        ) {
          return "Date range overlaps with another surcharge";
        }
      }
    }
    return null;
  };

  const handleDateChange = (index, field, value) => {
    const updatedSurchargeList = surchargeList.map((surcharge, i) => {
      if (i === index) {
        return { ...surcharge, [field]: value };
      }
      return surcharge;
    });

    setSurchargeList(updatedSurchargeList);
    setValue(`surcharge_fees[${index}].${field}`, value);

    updatedSurchargeList.forEach((surcharge, i) => {
      const from_date = surcharge.from_date;
      const to_date = surcharge.to_date;

      const dateError = validateDates(from_date, to_date);
      const overlapError = checkDateOverlap(updatedSurchargeList, i, from_date, to_date);

      setValue(`surcharge_fees[${i}].dateError`, dateError || '');
      setValue(`surcharge_fees[${i}].overlapError`, overlapError || '');
    });

    setSurchargeList([...updatedSurchargeList]);
  };
  const handleInput = (index, field, value) => {
    const updatedSurchargeList = surchargeList.map((surcharge, i) => {
      if (i === index) {
        return { ...surcharge, [field]: value };
      }
      return surcharge;
    });
    setSurchargeList(updatedSurchargeList);
    setValue(`surcharge_fees[${index}].${field}`, value);
  };

  return (
    <>
    {!isMobile && (
       <div className="d--flex flex--column w--full gap--lg h--full bg--white">
       { issurcharge && <FullScreenLoader />}
       <div className="d--flex justify-content--between align-items--center m--lg">
       <div className="font--lg font--900 d--flex align-items--center gap--lg">
       <div className="d--flex c--pointer" onClick={() => Navigate(-1)}>
                <ArrowLongLeftIcon />
            </div>
         Surcharges Fee Table
         </div> 
         <div className="d--flex gap--lg">
           <Button variant="black" color="white" btnClasses="btn w-max--200 w-min--200" type="button" onClick={handleAddSurcharge}>
             Add Surcharges
           </Button>
           <Button variant="orange" color="white" btnClasses="btn w-max--200 w-min--200" type="button" onClick={handleSubmit(onSubmit)}>
             Save
           </Button>
         </div>
       </div>
       <div className="w--full table--responsive bg--white radius--sm flex--column d--flex position--relative m--sm">
         {surchargeList.length === 0 ? (
           <div className="font--lg font--900">No surcharges available</div>
         ) : (
           <div className='h-min--300'>
             <table className="table table--bordered table--hover table--responsive surcharge_table">
               <thead>
                 <tr className="table border">
                   <th>Surcharge Name</th>
                   <th>Surcharge Type</th>
                   <th>Amount</th>
                   <th>Percentage (%)</th>
                   <th>From Price</th>
                   <th>To Price</th>
                   <th>From Date</th>
                   <th>To Date</th>
                   <th>Description</th>
                   <th className='w-min--150'>Machine Products</th>
                   <th>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {surchargeList.map((row, index) => {
                   const type = watch(`surcharge_fees[${index}].type`);
                   const from_date = watch(`surcharge_fees[${index}].from_date`);
                   const to_date = watch(`surcharge_fees[${index}].to_date`);
                   const dateError = watch(`surcharge_fees[${index}].dateError`);
                   const overlapError = watch(`surcharge_fees[${index}].overlapError`);
                   return (
                     <tr key={row.id}>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].name`}
                           control={control}
                           defaultValue={row.name || ""}
                           render={({ field }) => <FormInput {...field} type="text" placeholder="Surcharge Name" className="surcharge_name" onChange={(e)=>handleInput(index,'name',e.target.value)} 
                           error={errors.surcharge_fees?.[index]?.name?.message}/>}
                         />
                       </td>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].type`}
                           control={control}
                           defaultValue={row.type || "amount"}
                           render={({ field }) => (
                             <select
                               {...field}
                               className="form--control w--full h-min--36 radius--sm p-l--md p-r--md border-full--black-100"
                               onChange={(e) => {
                                 const newType = e.target.value;
                                 field.onChange(e);
                                 handleSurchargeTypeChange(index, newType);
                               }}
                               error={errors.surcharge_fees?.[index]?.type?.message}
                             >
                               <option value="amount">Amount</option>
                               <option value="percentage">Percentage</option>
                               <option value="amount-percentage">Amount + Percentage</option>
                             </select>
                           )}
                         />
                       </td>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].amount`}
                           control={control}
                           defaultValue={row.amount || 0}
                           render={({ field }) => (
                             <FormInput 
                               {...field} 
                               type="number" 
                               value={row.type === "amount" || row.type === "amount-percentage"? field.value : 0} 
                               disabled={!(row.type === "amount" || row.type === "amount-percentage")} 
                               error={errors.surcharge_fees?.[index]?.amount?.message}
                             />
                           )}
                         />
                       </td>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].percentage`}
                           control={control}
                           defaultValue={row.percentage || 0}
                           render={({ field }) => (
                             <FormInput 
                               {...field} 
                               type="number" 
                               value={row.type === "percentage" || row.type === "amount-percentage"? field.value : 0}
                               disabled={!(row.type === "percentage" || row.type === "amount-percentage")} 
                               error={errors.surcharge_fees?.[index]?.percentage?.message}
                             />
                           )}
                         />
                       </td>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].min_price`}
                           control={control}
                           defaultValue={row.min_price || 0}
                           render={({ field }) => <FormInput {...field} type="text" onChange={(e)=>handleInput(index,'min_price',e.target.value)} 
                           error={errors.surcharge_fees?.[index]?.min_price?.message}/>}
                         />
                       </td>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].max_price`}
                           control={control}
                           defaultValue={row.max_price || 0}
                           render={({ field }) => <FormInput {...field} type="text"
                           error={errors.surcharge_fees?.[index]?.max_price?.message}
                            onChange={(e)=>handleInput(index,'max_price',e.target.value)} />}
                         />
                       </td>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].from_date`}
                           control={control}
                           defaultValue={from_date || ""}
                           render={({ field }) => <FormInput {...field} type="date" onChange={(e)=>handleDateChange(index,"from_date",e.target.value)} 
                           error={errors.surcharge_fees?.[index]?.from_date?.message}/>}
                         />
                       </td>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].to_date`}
                           control={control}
                           defaultValue={to_date || ""}
                           render={({ field }) => <FormInput {...field} type="date" onChange={(e)=>handleDateChange(index,"to_date",e.target.value)} 
                           error={errors.surcharge_fees?.[index]?.to_date?.message}/>}
                         />
                          {dateError && <div className="text--red">{dateError}</div>}
                          {overlapError && <div className="text--red">{overlapError}</div>}
                       </td>
                       <td>
                         <Controller
                           name={`surcharge_fees[${index}].description`}
                           control={control}
                           defaultValue={row.description || ""}
                           render={({ field }) => <FormInput {...field} type="text" onChange={(e)=>handleInput(index,"description",e.target.value)}
                           error={errors.surcharge_fees?.[index]?.description?.message}/>}
                         />
                       </td>
                       <td>
                         <Select
                           isMulti
                           name={`surcharge_fees[${index}].product_ids`}
                           options={machineProducts.map(product => ({
                             value: product.id,
                             label: product.product_name,
                           }))}
                           value={Array.isArray(row.product_ids) ? row.product_ids.map(product_id => ({
                             value: product_id,
                             label: machineProducts.find(product => product.id === product_id)?.product_name || 'Unknown Product'
                           })) : []}
                           onChange={(selected) => handleProductSelection(index, selected)}
                           className="basic-multi-select"
                           classNamePrefix="select"
                           error={errors.surcharge_fees?.[index]?.product_ids?.message}
                         />
                       </td>
                       <td>
                         <Button onClick={() => handleClone(index)} className="clone-button" style={{ color: 'green', cursor: 'pointer' }}>
                           <CloneIcon width={18} height={20} />
                         </Button>
                         <Button onClick={() => handleDelete(index)} className="delete-button" style={{ color: 'red', cursor: 'pointer' }}>
                           <TrashIcon width={18} height={20} />
                         </Button>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         )}
       </div>
     </div>
    )}
       {isMobile && (
         <div className="d--flex flex--column w--full gap--lg h--full bg--white">
         { issurcharge && <FullScreenLoader />}
         <div className=" justify-content--between align-items--center m--lg">
         <div className="font--lg font--900 d--flex align-items--center gap--lg">
         <div className="d--flex c--pointer" onClick={() => Navigate(-1)}>
                <ArrowLongLeftIcon />
            </div>
          Surcharges Fee Table
           </div>
           <div className="d--flex gap--lg p-t--lg">
             <Button variant="black" color="white" btnClasses="btn w-max--500" type="button" onClick={handleAddSurcharge}>
               Add Surcharges
             </Button>
             <Button variant="orange" color="white" btnClasses="btn w-max--200" type="button" onClick={handleSubmit(onSubmit)}>
               Save
             </Button>
           </div>
         </div>
         <div className="w--full table--responsive bg--white radius--sm flex--column d--flex position--relative m--sm">
           {surchargeList.length === 0 ? (
             <div className="font--lg font--900">No surcharges available</div>
           ) : (
             <div className='h-min--300'>
               <table className="table table--bordered table--hover table--responsive surcharge_table">
                 <thead>
                   <tr className="table border">
                     <th>Surcharge Name</th>
                     <th>Surcharge Type</th>
                     <th>Amount</th>
                     <th>Percentage (%)</th>
                     <th>From Price</th>
                     <th>To Price</th>
                     <th>From Date</th>
                     <th>To Date</th>
                     <th>Description</th>
                     <th className='w-min--150'>Machine Products</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {surchargeList.map((row, index) => {
                     const type = watch(`surcharge_fees[${index}].type`);
                     const from_date = watch(`surcharge_fees[${index}].from_date`);
                     const to_date = watch(`surcharge_fees[${index}].to_date`);
                     const dateError = watch(`surcharge_fees[${index}].dateError`);
                     const overlapError = watch(`surcharge_fees[${index}].overlapError`);
                     return (
                       <tr key={row.id}>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].name`}
                             control={control}
                             defaultValue={row.name || ""}
                             render={({ field }) => <FormInput {...field} type="text" placeholder="Surcharge Name" className="surcharge_name" onChange={(e)=>handleInput(index,'name',e.target.value)} 
                             error={errors.surcharge_fees?.[index]?.name?.message}/>}
                           />
                         </td>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].type`}
                             control={control}
                             defaultValue={row.type || "amount"}
                             render={({ field }) => (
                               <select
                                 {...field}
                                 className="form--control w--full h-min--36 radius--sm p-l--md p-r--md border-full--black-100"
                                 onChange={(e) => {
                                   const newType = e.target.value;
                                   field.onChange(e);
                                   handleSurchargeTypeChange(index, newType);
                                 }}
                                 error={errors.surcharge_fees?.[index]?.type?.message}
                               >
                                 <option value="amount">Amount</option>
                                 <option value="percentage">Percentage</option>
                                 <option value="amount-percentage">Amount + Percentage</option>
                               </select>
                             )}
                           />
                         </td>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].amount`}
                             control={control}
                             defaultValue={row.amount || 0}
                             render={({ field }) => (
                               <FormInput 
                                 {...field} 
                                 type="text" 
                                 value={row.type === "amount" || row.type === "amount-percentage"? field.value : 0} 
                                 disabled={!(row.type === "amount" || row.type === "amount-percentage")} 
                                 error={errors.surcharge_fees?.[index]?.amount?.message}
                               />
                             )}
                           />
                         </td>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].percentage`}
                             control={control}
                             defaultValue={row.percentage || 0}
                             render={({ field }) => (
                               <FormInput 
                                 {...field} 
                                 type="text" 
                                 value={row.type === "percentage" || row.type === "amount-percentage"? field.value : 0}
                                 disabled={!(row.type === "percentage" || row.type === "amount-percentage")} 
                                 error={errors.surcharge_fees?.[index]?.percentage?.message}
                               />
                             )}
                           />
                         </td>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].min_price`}
                             control={control}
                             defaultValue={row.min_price || 0}
                             render={({ field }) => <FormInput {...field} type="text" onChange={(e)=>handleInput(index,'min_price',e.target.value)} 
                             error={errors.surcharge_fees?.[index]?.min_price?.message}/>}
                           />
                         </td>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].max_price`}
                             control={control}
                             defaultValue={row.max_price || 0}
                             render={({ field }) => <FormInput {...field} type="text"
                             error={errors.surcharge_fees?.[index]?.max_price?.message}
                              onChange={(e)=>handleInput(index,'max_price',e.target.value)} />}
                           />
                         </td>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].from_date`}
                             control={control}
                             defaultValue={from_date || ""}
                             render={({ field }) => <FormInput {...field} type="date" onChange={(e)=>handleDateChange(index,"from_date",e.target.value)} 
                             error={errors.surcharge_fees?.[index]?.from_date?.message}/>}
                           />
                         </td>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].to_date`}
                             control={control}
                             defaultValue={to_date || ""}
                             render={({ field }) => <FormInput {...field} type="date" onChange={(e)=>handleDateChange(index,"to_date",e.target.value)} 
                             error={errors.surcharge_fees?.[index]?.to_date?.message}/>}
                           />
                            {dateError && <div className="text--red">{dateError}</div>}
                            {overlapError && <div className="text--red">{overlapError}</div>}
                         </td>
                         <td>
                           <Controller
                             name={`surcharge_fees[${index}].description`}
                             control={control}
                             defaultValue={row.description || ""}
                             render={({ field }) => <FormInput {...field} type="text" onChange={(e)=>handleInput(index,"description",e.target.value)}
                             error={errors.surcharge_fees?.[index]?.description?.message}/>}
                           />
                         </td>
                         <td>
                           <Select
                             isMulti
                             name={`surcharge_fees[${index}].product_ids`}
                             options={machineProducts.map(product => ({
                               value: product.id,
                               label: product.product_name,
                             }))}
                             value={Array.isArray(row.product_ids) ? row.product_ids.map(product_id => ({
                               value: product_id,
                               label: machineProducts.find(product => product.id === product_id)?.product_name || 'Unknown Product'
                             })) : []}
                             onChange={(selected) => handleProductSelection(index, selected)}
                             className="basic-multi-select"
                             classNamePrefix="select"
                             error={errors.surcharge_fees?.[index]?.product_ids?.message}
                           />
                         </td>
                         <td>
                           <Button onClick={() => handleClone(index)} className="clone-button" style={{ color: 'green', cursor: 'pointer' }}>
                             <CloneIcon width={18} height={20} />
                           </Button>
                           <Button onClick={() => handleDelete(index)} className="delete-button" style={{ color: 'red', cursor: 'pointer' }}>
                             <TrashIcon width={18} height={20} />
                           </Button>
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
           )}
         </div>
       </div>
    )}
   
    </>
  );
}
