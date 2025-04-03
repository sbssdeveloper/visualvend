import React, { useEffect, useState } from "react";
import useIcons from "../../../../Assets/web/icons/useIcons";
import FormSelect from "../../../../Widgets/web/FormSelect";
import Button from "../../../../Widgets/web/Button";
import { useMediaQuery } from "react-responsive";

import FormInput from "../../../../Widgets/web/FormInput";
import { Controller } from "react-hook-form";
import {
  PRODUCT_SIZE_UNIT_LIST,
  PRODUCT_SPACE_METHOD_LIST,
  PRODUCT_SPACE_SLAES_START_LIST,
} from "../../consts";

export default function ProductInformation(props) {
  const { SupportIcon } = useIcons();
  const isMobile = useMediaQuery({ query : ' (max-width:768px) '});

  return (
    <>
    { !isMobile && (
    <div className="d--flex  h--full w--full bg--white gap--3xl radius--md p--lg stockProductDetailsTab overflow--auto">
      <div className="d--flex flex--column w--full gap--lg   ">
        <div className="w--full d--flex gap--4xl h--full">
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <div className="d--flex flex--column w--full">
              <div className="label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm text--black-600">
                Product Size
              </div>
              <div className="d--flex gap--xs ">
                <Controller
                  name="product_size_amount"
                  control={props.control}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      type="number"
                      placeholder="Enter your product size"
                    />
                  )}
                />
                <div className="w-max--75 w--full">
                  <Controller
                    name="product_size_unit"
                    control={props.control}
                    render={({ field }) => (
                      <FormSelect {...field} options={PRODUCT_SIZE_UNIT_LIST} defaultPlaceholder={false} />
                    )}
                  />
                </div>
              </div>
            </div>
            <Controller
              name="others.product_sequence"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Product S2S Sequences"
                  placeholder="Enter your product S2S sequences"
                />
              )}
            />
            <Controller
              name="others.tax_code_tax"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Tax Codes (Tax)"
                  placeholder="Enter your tax codes (Tax)"
                />
              )}
            />
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller
              name="others.product_max_qty"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="number"
                  label="Product Max Quantity"
                  placeholder="Enter your product max quantity"
                />
              )}
            />

            <Controller
              name="others.product_space_method"
              control={props.control}
              render={({ field }) => (
                <FormSelect
                  height="40"
                  {...field}
                  label="Product Space to Sales Method"
                  options={PRODUCT_SPACE_METHOD_LIST}
                />
              )}
            />

            <Controller
              name="others.tax_code_state"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Tax Codes (States)"
                  placeholder="Enter your tax codes (States)"
                />
              )}
            />
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller
              name="others.product_aisle_actual"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Product Aisle Actual"
                  placeholder="Enter your product asile actual"
                />
              )}
            />

            <Controller
              name="others.product_space_start"
              control={props.control}
              render={({ field }) => (
                <FormSelect
                  height="40"
                  {...field}
                  label="Product Space to Sales Start"
                  options={PRODUCT_SPACE_SLAES_START_LIST}
                />
              )}
            />

            <Controller
              name="others.tax_code_country"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Tax Codes (Country)"
                  placeholder="Enter your tax codes (Country)"
                />
              )}
            />
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller
              name="others.machine_item_qty"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Machine Total Same Item Qty"
                  placeholder="Enter your machine total same item qty"
                />
              )}
            />
            <div className="d--flex flex--column gap--md w--full ">
              <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">
                Product Space to Sales
              </div>
              <div className="d--flex gap--lg ">
                <div className="d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
                  <Controller
                    name="others.product_space"
                    control={props.control}
                    render={({ field }) => (
                      <input
                        type="radio"
                        {...field}
                        checked={props.watch("others.product_space") == "Y"}
                        className="form--control"
                        name="saveCard"
                        value={"Y"}
                      />
                    )}
                  />
                  Yes
                </div>
                <div className=" d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
                  <Controller
                    name="others.product_space"
                    control={props.control}
                    render={({ field }) => (
                      <input
                        type="radio"
                        {...field}
                        checked={props.watch("others.product_space") == "N"}
                        className="form--control"
                        name="saveCard"
                        value={"N"}
                      />
                    )}
                  />
                  No
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w--full d--flex gap--sm justify-content--center p-b--sm">
          <Button
            variant="black"
            color="white"
            btnClasses="btn border-full--black-200 w-min--200 w-max--200"
            type="button"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="orange"
            color="white"
            btnClasses="btn  w-min--200 w-max--200"
            type="button"
            onClick={props.onSubmit}
          >
            {props?.productDetails ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </div>
    )}

    { isMobile && (
      <div className="d--flex  h--full w--full bg--white gap--3xl radius--md p--sm  overflow--auto">
      <div className="d--flex flex--column w--full gap--lg   ">
        <div className="w--full d--flex flex--column gap--lg h--full">
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <div className="d--flex flex--column w--full">
              <div className="label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm text--black-600">
                Product Size
              </div>
              <div className="d--flex gap--xs ">
                <Controller
                  name="product_size_amount"
                  control={props.control}
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      type="number"
                      placeholder="Enter your product size"
                    />
                  )}
                />
                <div className="w-max--75 w--full">
                  <Controller
                    name="product_size_unit"
                    control={props.control}
                    render={({ field }) => (
                      <FormSelect {...field} options={PRODUCT_SIZE_UNIT_LIST} defaultPlaceholder={false} />
                    )}
                  />
                </div>
              </div>
            </div>
            <Controller
              name="others.product_sequence"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Product S2S Sequences"
                  placeholder="Enter your product S2S sequences"
                />
              )}
            />
            <Controller
              name="others.tax_code_tax"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Tax Codes (Tax)"
                  placeholder="Enter your tax codes (Tax)"
                />
              )}
            />
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller
              name="others.product_max_qty"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="number"
                  label="Product Max Quantity"
                  placeholder="Enter your product max quantity"
                />
              )}
            />

            <Controller
              name="others.product_space_method"
              control={props.control}
              render={({ field }) => (
                <FormSelect
                  height="40"
                  {...field}
                  label="Product Space to Sales Method"
                  options={PRODUCT_SPACE_METHOD_LIST}
                />
              )}
            />

            <Controller
              name="others.tax_code_state"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Tax Codes (States)"
                  placeholder="Enter your tax codes (States)"
                />
              )}
            />
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller
              name="others.product_aisle_actual"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Product Aisle Actual"
                  placeholder="Enter your product asile actual"
                />
              )}
            />

            <Controller
              name="others.product_space_start"
              control={props.control}
              render={({ field }) => (
                <FormSelect
                  height="40"
                  {...field}
                  label="Product Space to Sales Start"
                  options={PRODUCT_SPACE_SLAES_START_LIST}
                />
              )}
            />

            <Controller
              name="others.tax_code_country"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Tax Codes (Country)"
                  placeholder="Enter your tax codes (Country)"
                />
              )}
            />
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller
              name="others.machine_item_qty"
              control={props.control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="text"
                  label="Machine Total Same Item Qty"
                  placeholder="Enter your machine total same item qty"
                />
              )}
            />
            <div className="d--flex flex--column gap--md w--full ">
              <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">
                Product Space to Sales
              </div>
              <div className="d--flex gap--lg ">
                <div className="d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
                  <Controller
                    name="others.product_space"
                    control={props.control}
                    render={({ field }) => (
                      <input
                        type="radio"
                        {...field}
                        checked={props.watch("others.product_space") == "Y"}
                        className="form--control"
                        name="saveCard"
                        value={"Y"}
                      />
                    )}
                  />
                  Yes
                </div>
                <div className=" d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
                  <Controller
                    name="others.product_space"
                    control={props.control}
                    render={({ field }) => (
                      <input
                        type="radio"
                        {...field}
                        checked={props.watch("others.product_space") == "N"}
                        className="form--control"
                        name="saveCard"
                        value={"N"}
                      />
                    )}
                  />
                  No
                </div>
              </div>
            </div>
          </div>
          <div className="w--full d--flex gap--sm align-items--center justify-content--center p-b--sm">
            <Button
              variant="black"
              color="white"
              btnClasses="btn border-full--black-200 w-min--100 w-max--200"
              type="button"
              onClick={props.onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="orange"
              color="white"
              btnClasses="btn  w-min--100 w-max--200"
              type="button"
              onClick={props.onSubmit}
            >
              {props?.productDetails ? "Update" : "Add"}
            </Button>
          </div>
        </div>

      </div>
    </div>
    )}

    </>
  );
}
