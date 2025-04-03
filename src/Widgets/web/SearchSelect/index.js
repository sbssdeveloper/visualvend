import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const SearchSelect = ({
  label = null,
  selectedOption = {},
  handleChange = () => { },
  uniqueKey = '',
  uniqueFn = () => { },
  labelKey = '',
  valueKey = '',
  placeholder = 'Select',
  extraColumObj = {},
  options = [],
  error = null,
  labelIcon = null,
}) => {

  const { data } = useQuery({
    queryKey: [uniqueKey, 'search'],
    queryFn: uniqueFn,
    select: (data) => {
      return extraColumObj
        ? [extraColumObj, ...data.data.data]
        : data.data.data;
    },
    enabled: options.length == 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
  });

  const filteredOption = selectedOption?.value
    ? data?.find((item) => item[valueKey] === selectedOption.value)
    : null;

  const finalSelectedOption = filteredOption
    ? { label: filteredOption[labelKey], value: filteredOption[valueKey] }
    : selectedOption;

  const selectOptions = options.length != 0
    ? options
    : data?.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));


  return (
    <div className='w--full multiSelect'>
      {label && (
        <label className={`label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm  ${error ? "text--red" : "text--black-600"}`}>
          {error ? error : label} {labelIcon || null}
        </label>
      )}
      <Select
        value={finalSelectedOption}
        onChange={handleChange}
        options={selectOptions}
        placeholder={placeholder}
        isSearchable
        styles={customStyles}
        className='form--control'
      />

    </div>
  );
};

export default SearchSelect;
