import React, { useState, useEffect } from 'react';
import Button from "../../../../Widgets/web/Button";
import FormInput from "../../../../Widgets/web/FormInput";
import '../../../../App.css';
import useIcons from "../../../../Assets/web/icons/useIcons";
import FormSelect from "../../../../Widgets/web/FormSelect";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMediaQuery } from 'react-responsive';

export default function Surcharges(props) {
  const [surchargeList, setSurchargeList] = useState([]);
  const { TrashIcon, CloneIcon } = useIcons();
  const { control, setValue, watch, errors } = props;
  const surchargetype = watch("product_surcharges.surcharge_type");
  const [surchargeType, setSurchargeType] = useState('');
  const isMobile = useMediaQuery({ query : '(max-width:768px)' });

  const handleSurchargeTypeChange = (event) => {
    const value = event.target.value;
    setSurchargeType(value);
    if (value === 'no_surcharge') {
      setValue('product_surcharges.surcharge_value', 0);
    }
  };

  useEffect(() => {
    if (props.productDetails) {
      const { surcharge_fees, product_surcharges } = props.productDetails;
      if (surcharge_fees) {
        if (surcharge_fees.length > 0) {
        setSurchargeList(surcharge_fees);
        surcharge_fees.forEach((surcharge, index) => {
          Object.keys(surcharge).forEach(key => {
            setValue(`surcharge_fees[${index}].${key}`, surcharge[key]);
          });
        });
      }else{
        const defaultRow = {
          id: Date.now(),  // Using Date.now() to generate a unique id
          name: '',
          type: 'amount', // Default type
          amount: 0,
          percentage: 0,
          min_price: 0,
          max_price: 0,
          from_date: '',
          to_date: '',
          description: '',
          product_ids: [],  // Default empty array for product ids
        };
        setSurchargeList([defaultRow]); // Add the default row to the list
        // Set default values for the new row in the form
        setValue('surcharge_fees[0]', defaultRow);
      }
      }
      if (product_surcharges) {
        setSurchargeType(product_surcharges.surcharge_type || '');
        setValue('product_surcharges.surcharge_value', product_surcharges.surcharge_value || '');
      }
    }
  }, [props.productDetails, setValue]);

  const handleAddSurcharge = () => {
    const newRow = {
      id: Date.now(),
      name: '',
      type: 'amount',
      amount: 0,
      percentage: 0,
      min_price: '',
      max_price: '',
      from_date: '',
      to_date: '',
      description: '',
    };
    const updatedSurchargeList = [...surchargeList, newRow];
    setSurchargeList(updatedSurchargeList);
    setValue('surcharge_fees', updatedSurchargeList);

    // Clear specific errors
    if (errors.surcharge_fees) {
      errors.surcharge_fees = [];
    }
    if (errors.product_surcharges) {
      errors.product_surcharges = {};
    }
  };

  const handleClone = (index) => {
    setSurchargeList(prevSurcharge => {
      const newSurcharge = [...prevSurcharge];
      newSurcharge.splice(index, 0, { ...prevSurcharge[index], id: Date.now() });
      return newSurcharge;
    });
  };
 
  const handleDelete = (index) => {
    const updatedSurcharge = surchargeList.filter((_, i) => i !== index);
    setSurchargeList(updatedSurcharge);
    setValue('surcharge_fees', updatedSurcharge);
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

  const handleTypeChange = (index, value) => {
    const updatedSurchargeList = surchargeList.map((surcharge, i) => {
      if (i === index) {
        return { ...surcharge, type: value };
      }
      return surcharge;
    });
    setSurchargeList(updatedSurchargeList);
    setValue(`surcharge_fees[${index}].type`, value);
  };

  const handleSave = () => {
    let hasError = false;

    surchargeList.forEach((surcharge, index) => {
      const from_date = surcharge.from_date;
      const to_date = surcharge.to_date;

      const dateError = validateDates(from_date, to_date);
      const overlapError = checkDateOverlap(surchargeList, index, from_date, to_date);

      if (dateError || overlapError) {
        hasError = true;
        setValue(`surcharge_fees[${index}].dateError`, dateError || '');
        setValue(`surcharge_fees[${index}].overlapError`, overlapError || '');
      } else {
        setValue(`surcharge_fees[${index}].dateError`, '');
        setValue(`surcharge_fees[${index}].overlapError`, '');
      }
    });

    if (hasError) {
      // alert("Please fix the errors before saving.");
      return;
    }

    props.onSubmit();
  };


  console.log(errors);


  return (

    <>
    { !isMobile && (
      <div className="d--flex flex--column w--full gap--lg h--full bg--white">
        <div className="d--flex bg--white radius--md gap--md p-t--lg p-l--lg p-r--lg h-min--36 align-items--center shadow-md w--full">
          <div className="w-min--300 d--flex flex--column w--half">
            {/* <label className="font--sm font--600 m-b--sm d--flex align-items--center gap--sm">
              Surcharge Type
            </label> */}
            <Controller
              name="product_surcharges.surcharge_type"
              control={control}
              defaultValue={surchargeType || "plus"} // Set default value to "plus"
              render={({ field }) => (
                <FormSelect
                  {...field}
                  type="select"
                  label='Surcharge Type'
                  options={[
                    { value: "plus", name: "Plus (+)" },
                    { value: "including", name: "Including" },
                    { value: "no_surcharge", name: "No Surcharge" },
                  ]}
                  onChange={(e) => {
                    field.onChange(e.target.value); // Update the field value
                    handleSurchargeTypeChange(e); // Call your custom function
                  }}
                  error={errors.product_surcharges?.surcharge_type?.message}
                
                />
              )}
            />
          </div>

          {(surchargeType === 'plus' || surchargeType === 'including') && (
            <div className="w-min--300 d--flex flex--column w--half">
              <label className="font--sm font--600 m-b--sm d--flex align-items--center gap--sm">
                Surcharge
              </label>
              <Controller
                name="product_surcharges.surcharge_value"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    type="number"
                    placeholder="Surcharge amount"

                    className={`form--control w--full h-min--36 radius--sm p-l--md p-r--md border-full--black-100 ${errors.product_surcharges?.surcharge_value ? 'border--red' : ''}`}
                    error={errors.product_surcharges?.surcharge_value?.message}
                    />
                    
                )}
              />
            
            </div>
          )}
        </div>

        <div className="d--flex justify-content--between align-items--center m--lg">
          <h1 className="surcharge_title">Surcharges Fee Table</h1>
          <div className="d--flex gap--sm">
            <Button variant="black" color="white" btnClasses="btn w-max--200 w-min--150" type="button" onClick={handleAddSurcharge}>
              Add Surcharges
            </Button>
            <Button variant="orange" color="white" btnClasses="btn w-max--200 w-min--150" type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
        <div className="w--full table--responsive bg--white radius--sm flex--column d--flex position--relative m--sm">
          <table className="table table--bordered table--hover table--responsive surcharge_table">
            <thead>
              <tr className="table border">
                <th>Surcharge Name</th>
                <th>Surcharge Amount Type</th>
                <th>Amount</th>
                <th>Percentage (%)</th>
                <th>From Price</th>
                <th>To Price</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Description</th>
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
                        defaultValue=""
                        render={({ field }) => (
                          <FormInput
                            {...field}
                            type="text"
                            placeholder="Surcharge Name"
                            className="surcharge_name"
                            error={errors.surcharge_fees?.[index]?.name?.message}
                          />
                        )}
                      />
                    </td>
                    <td>
                    <Controller
                      name={`surcharge_fees[${index}].type`}
                      control={control}
                      defaultValue={row.type || "amount"}
                      render={({ field }) => (
                        <FormSelect
                          {...field}
                          type="select"
                          options={[
                            { value: "amount", name: "Amount" },
                            { value: "percentage", name: "Percentage" },
                            { value: "amount-percentage", name: "Amount+Percentage" },
                          ]}
                          onChange={(e) => {
                            field.onChange(e.target.value); // Update the field value
                            handleTypeChange(index, e.target.value); // Call your custom function
                          }}
                          error={errors.surcharge_fees?.[index]?.type?.message}
                        />
                      )}
                    />

                    </td>
                    <td>
                      <Controller
                        name={`surcharge_fees[${index}].amount`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormInput
                            {...field}
                            type="number"
                            value={row.type === "amount" || row.type === "amount-percentage" ? field.value : 0}
                            disabled={!(watch(`surcharge_fees[${index}].type`) === "amount" || watch(`surcharge_fees[${index}].type`) === "amount-percentage")}
                            error={errors.surcharge_fees?.[index]?.amount?.message}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`surcharge_fees[${index}].percentage`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormInput
                            {...field}
                            type="number"
                            value={row.type === "percentage" || row.type === "amount-percentage" ? field.value : 0}
                            disabled={!(watch(`surcharge_fees[${index}].type`) === "percentage" || watch(`surcharge_fees[${index}].type`) === "amount-percentage")}
                            error={errors.surcharge_fees?.[index]?.percentage?.message}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`surcharge_fees[${index}].min_price`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormInput
                            {...field}
                            type="number"
                            step="any"
                            value={field.value || 0} 
                            error={errors.surcharge_fees?.[index]?.min_price?.message}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`surcharge_fees[${index}].max_price`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormInput
                            {...field}
                            type="number"
                            step="any"
                            value={field.value || 0} 
                            error={errors.surcharge_fees?.[index]?.max_price?.message}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`surcharge_fees[${index}].from_date`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormInput
                            {...field}
                            type="date"
                            onChange={(e) => handleDateChange(index, 'from_date', e.target.value)}
                            error={errors.surcharge_fees?.[index]?.from_date?.message}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`surcharge_fees[${index}].to_date`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormInput
                            {...field}
                            type="date"
                            onChange={(e) => handleDateChange(index, 'to_date', e.target.value)}
                            error={errors.surcharge_fees?.[index]?.to_date?.message}
                          />
                        )}
                      />
                      {dateError && <div className="text--red">{dateError}</div>}
                      {overlapError && <div className="text--red">{overlapError}</div>}
                    </td>
                    <td>
                      <Controller
                        name={`surcharge_fees[${index}].description`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormInput
                            {...field}
                            type="textarea"
                            error={errors.surcharge_fees?.[index]?.description?.message}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <div className="d--flex gap--sm">
                        <div onClick={() => handleClone(index)} style={{ color: 'green', cursor: 'pointer' }}>
                          <CloneIcon width={18} height={20} />
                        </div>
                        <div onClick={() => handleDelete(index)} style={{ color: 'red', cursor: 'pointer' }}>
                          <TrashIcon width={18} height={20} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}

    { isMobile && (
      <div className="d--flex flex--column w--full gap--lg h--full bg--white">
      <div className=" bg--white radius--md d--flex flex--column gap--md p--sm h-min--36 shadow-md w--full">
        <div className="w-min--300 d--flex flex--column w--half">
          {/* <label className="font--sm font--600 m-b--sm d--flex align-items--center gap--sm">
            Surcharge Type
          </label> */}
          <Controller
            name="product_surcharges.surcharge_type"
            control={control}
            defaultValue={surchargeType || "plus"} // Set default value to "plus"
            render={({ field }) => (
              <FormSelect
                {...field}
                type="select"
                label='Surcharge Type'
                options={[
                  { value: "plus", name: "Plus (+)" },
                  { value: "including", name: "Including" },
                  { value: "no_surcharge", name: "No Surcharge" },
                ]}
                onChange={(e) => {
                  field.onChange(e.target.value); // Update the field value
                  handleSurchargeTypeChange(e); // Call your custom function
                }}
                error={errors.product_surcharges?.surcharge_type?.message}
              
              />
            )}
          />
        </div>
        
        {(surchargeType === 'plus' || surchargeType === 'including') && (
          <div className="w-min--300 d--flex flex--column w--half">
           
            <label className="font--sm font--600 m-b--sm d--flex align-items--center gap--sm">
              Surcharge
            </label>
           
            <Controller
              name="product_surcharges.surcharge_value"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="number"
                  placeholder="Surcharge amount"
                  className={`form--control w--full h-min--36 radius--sm p-l--md p-r--md border-full--black-100 ${errors.product_surcharges?.surcharge_value ? 'border--red' : ''}`}
                  error={errors.product_surcharges?.surcharge_value?.message}
                  />
                  
              )}
            />
            
          
          </div>
        )}
      </div>

      <div className="d--flex flex--column justify-content--between align-items--start p--sm">
        <h1 className="surcharge_title fs-2">Surcharges Fee Table</h1>
        <div className="d--flex w--full gap--sm">
          <Button variant="black" color="white" btnClasses="btn w-max--200" type="button" onClick={handleAddSurcharge}>
            Add Surcharges
          </Button>
          <Button variant="orange" color="white" btnClasses="btn w-max--200" type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
      <div className="w--full table--responsive bg--white radius--sm flex--column d--flex position--relative m--sm">
        <table className="table table--bordered table--hover table--responsive surcharge_table">
          <thead>
            <tr className="table border">
              <th className="w-min--150">Surcharge Name</th>
              <th className="w-min--150">Surcharge Amount Type</th>
              <th>Amount</th>
              <th>Percentage (%)</th>
              <th className="w-min--100">From Price</th>
              <th className="w-min--100">To Price</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Description</th>
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
                      defaultValue=""
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          type="text"
                          placeholder="Surcharge Name"
                          className="surcharge_name"
                          error={errors.surcharge_fees?.[index]?.name?.message}
                        />
                      )}
                    />
                  </td>
                  <td>
                  <Controller
                    name={`surcharge_fees[${index}].type`}
                    control={control}
                    defaultValue={row.type || "amount"}
                    render={({ field }) => (
                      <FormSelect
                        {...field}
                        type="select"
                        options={[
                          { value: "amount", name: "Amount" },
                          { value: "percentage", name: "Percentage" },
                          { value: "amount-percentage", name: "Amount+Percentage" },
                        ]}
                        onChange={(e) => {
                          field.onChange(e.target.value); // Update the field value
                          handleTypeChange(index, e.target.value); // Call your custom function
                        }}
                        error={errors.surcharge_fees?.[index]?.type?.message}
                      />
                    )}
                  />

                  </td>
                  <td>
                    <Controller
                      name={`surcharge_fees[${index}].amount`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          type="number"
                          value={row.type === "amount" || row.type === "amount-percentage" ? field.value : 0}
                          disabled={!(watch(`surcharge_fees[${index}].type`) === "amount" || watch(`surcharge_fees[${index}].type`) === "amount-percentage")}
                          error={errors.surcharge_fees?.[index]?.amount?.message}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`surcharge_fees[${index}].percentage`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          type="number"
                          value={row.type === "percentage" || row.type === "amount-percentage" ? field.value : 0}
                          disabled={!(watch(`surcharge_fees[${index}].type`) === "percentage" || watch(`surcharge_fees[${index}].type`) === "amount-percentage")}
                          error={errors.surcharge_fees?.[index]?.percentage?.message}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`surcharge_fees[${index}].min_price`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          type="number"
                          step="any"
                          value={field.value || 0} 
                          error={errors.surcharge_fees?.[index]?.min_price?.message}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`surcharge_fees[${index}].max_price`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          type="number"
                          step="any"
                          value={field.value || 0} 
                          error={errors.surcharge_fees?.[index]?.max_price?.message}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`surcharge_fees[${index}].from_date`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          type="date"
                          onChange={(e) => handleDateChange(index, 'from_date', e.target.value)}
                          error={errors.surcharge_fees?.[index]?.from_date?.message}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name={`surcharge_fees[${index}].to_date`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          type="date"
                          onChange={(e) => handleDateChange(index, 'to_date', e.target.value)}
                          error={errors.surcharge_fees?.[index]?.to_date?.message}
                        />
                      )}
                    />
                    {dateError && <div className="text--red">{dateError}</div>}
                    {overlapError && <div className="text--red">{overlapError}</div>}
                  </td>
                  <td>
                    <Controller
                      name={`surcharge_fees[${index}].description`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          type="textarea"
                          error={errors.surcharge_fees?.[index]?.description?.message}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <div className="d--flex gap--sm">
                      <div onClick={() => handleClone(index)} style={{ color: 'green', cursor: 'pointer' }}>
                        <CloneIcon width={18} height={20} />
                      </div>
                      <div onClick={() => handleDelete(index)} style={{ color: 'red', cursor: 'pointer' }}>
                        <TrashIcon width={18} height={20} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    )}

    </>
  );
}
