'use client';
import React, { useEffect } from 'react';
const forwardingOptions = ['Members', 'Number', 'Voicemail', 'Hangup'];

function ForwardingSelect({ option, register }) {
  return (
    <select
      {...register(option)}
      className={`form--control w--full h-min--36  radius--sm p-l--md p-r--md border-full--black-200 `}
    >
      <option value="">Select</option>
      {forwardingOptions &&
        forwardingOptions.length > 0 &&
        forwardingOptions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
    </select>
  );
}
function ForwardInput({ option, register }) {
  return (
    <input
      {...register(option)}
      placeholder={'Enter Number'}
      className={`form--control w--full h-min--36 radius--sm p-l--md p-r--md border-full--black-200 `}
    />
  );
}

function getOptionsMap(option, register) {
  switch (option) {
    case 'Members':
    case 'Voicemail':
      return <ForwardingSelect option={option} register={register} />;
    case 'Number':
      return <ForwardInput option={option} register={register} />;
    default:
      return null;
  }
}

function FilterItem({ option, register, optionType, errors }) {
  return (
    <div className="d--flex align-items--center justify-content--between h-min--40 ">

      <div className='d--flex align-items--center gap--sm'>
        <input
          className="radio"
          id={option}
          type="radio"
          value={option}
          {...register('type')}
        />
        <label className='font--sm font--500' htmlFor={option}>{option}</label>
      </div>

      <span className='d--flex w--full w-max--300 flex--column'>
        {optionType === option && getOptionsMap(option, register)}
        <span className='w--full text--secondary'>{errors?.[option] && errors?.[option]?.message}</span>
      </span>
    </div>
  );
}

export default function ForwardingFilters({
  register,
  watch,
  clearErrors,
  errors,
}) {
  const optionType = watch('type');

  useEffect(() => {
    if (optionType) {
      clearErrors();
    }
  }, [optionType, clearErrors]);

  return (
    <div className="d--flex flex--column gap--md">
      {forwardingOptions && forwardingOptions.length > 0
        ? forwardingOptions.map((option) => (
          <FilterItem
            key={option}
            option={option}
            register={register}
            watch={watch}
            errors={errors}
            optionType={optionType}
          />
        ))
        : null}
    </div>
  );
}
