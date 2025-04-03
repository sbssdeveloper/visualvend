import React, { useEffect, useState } from "react";
import FormSelect from "../../../../Widgets/web/FormSelect";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import FormInput from "../../../../Widgets/web/FormInput";
import { Controller } from "react-hook-form";
import { generateRandomString } from "../../../../Helpers/web";
import { useMediaQuery } from "react-responsive";

export default function ProductPricing(props) {
  const { ArrowAngleLeftIcon, ArrowAngleRightIcon, PlusIcon } = useIcons();
  const isMobile = useMediaQuery({ query: '(max-width:768px)' });  
  const handleDiscountCoupon = () => {
    let code = generateRandomString(5);
    props.setValue("product_discount_code", code);
  };
  return (
    <>
    { !isMobile && (
    <div className="d--flex flex--column  h--full w--full gap--md   stockProductPricingTab">
      {/* <div className="d--flex flex--column w--full gap--lg  bg--white radius--md p--lg justify-content--between  ">
        <div className="w--full d--flex gap--3xl">
          <div className="d--flex w--full flex--column gap--2xl p-r--2xl">
            <div className="d--flex flex--column gap--sm">
              <div className="label--control font--sm text--black-600 font--500">
                Avg Buy Price
              </div>
              <div className="d--flex gap--xl w--full align-items--center">
                <div className="font--sm font--600 w-min--50 text--black-800">
                  $ 2.00
                </div>
                <div className="w--full w-max--200 ">
                  <FormSelect />
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800"></div>
              </div>
            </div>
            <div className="d--flex flex--column gap--sm">
              <div className="label--control font--sm text--black-600 font--500">
                GST Rate
              </div>
              <div className="d--flex gap--xl w--full align-items--center">
                <div className="font--sm font--600 w-min--50 text--black-800">
                  $ 2.00
                </div>
                <div className="w--full w-max--200 ">
                  <FormSelect />
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800">
                  %
                </div>
              </div>
            </div>
            <div className="d--flex flex--column gap--sm">
              <div className="label--control font--sm text--black-600 font--500">
                Machine Surcharge Fee
              </div>
              <div className="d--flex gap--xl w--full align-items--center">
                <div className="font--sm font--600 w-min--50 text--black-800">
                  $ 2.00
                </div>
                <div className="w--full w-max--200 ">
                  <FormSelect />
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800"></div>
              </div>
            </div>
            <div className="d--flex flex--column gap--sm">
              <div className="label--control font--sm text--black-600 font--500">
                Prepaid Surcharge Fee
              </div>
              <div className="d--flex gap--xl w--full align-items--center">
                <div className="font--sm font--600 w-min--50 text--black-800">
                  $ 2.00
                </div>
                <div className="w--full w-max--200 ">
                  <FormSelect />
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800"></div>
              </div>
            </div>
          </div>
          <div className="d--flex w--full flex--column gap--2xl p-r--2xl">
            <div className="d--flex flex--column gap--sm">
              <div className="label--control font--sm text--black-600 font--500">
                GST/VAT Tax
              </div>
              <div className="d--flex gap--xl w--full align-items--center ">
                <div className="font--sm font--600 w-min--50 text--black-800 w-min--300">
                  GST Tax Applies?
                </div>
                <div className="w--full w-max--200 d--flex gap--sm align-items--center  ">
                  <Button
                    variant="primary"
                    color="white"
                    btnClasses="btn w-max--75"
                    type="button"
                  >
                    Yes
                  </Button>
                  <Button
                    variant="red"
                    color="white"
                    btnClasses="btn w-max--75"
                    type="button"
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
            <div className="d--flex flex--column gap--sm">
              <div className="label--control font--sm text--black-600 font--500">
                Machine Display Price
              </div>
              <div className="d--flex gap--xl w--full align-items--center">
                <div className="font--sm font--600 w-min--50 text--black-800">
                  $ 2.00
                </div>
                <div className="w--full w-max--200 ">
                  <FormSelect />
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800"></div>
              </div>
            </div>
            <div className="d--flex flex--column gap--sm">
              <div className="label--control font--sm text--black-600 font--500">
                Card Surcharge Fee
              </div>
              <div className="d--flex gap--xl w--full align-items--center">
                <div className="font--sm font--600 w-min--50 text--black-800">
                  $ 2.00
                </div>
                <div className="w--full w-max--200 ">
                  <FormSelect />
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">
                    20
                  </div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div>
                <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800"></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="w--full h--full d--flex flex--column gap--xs">
        {/* <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">More Information</div> */}
        <div className="d--flex  w--full bg--white gap--3xl radius--md p--lg stockProductPriceTabList overflow--auto">
          <div className="d--flex flex--column w--full gap--5xl  h--full   justify-content--between  ">
            <div className="d--flex gap--2xl">
              <div className="d--flex flex--column gap--sm w--full">
                <div className={`label--control font--sm  font--500 d--flex gap--lg align-items--center  h-min--24 ${props.errors?.product_price?.message ? "text--red" : "text--black-600"}`}>{props.errors?.product_price?.message ? props.errors?.product_price?.message : "Product Price"}</div>
                <Controller name="product_price" control={props.control} render={({ field }) => <FormInput {...field} type="number" placeholder="0" height="40" error={props.errors?.product_price?.message} />} />
              </div>
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">Bundle Price</div>
                <Controller name="others.bundle_price" control={props.control} render={({ field }) => <FormInput {...field} type="number" placeholder="0" height="40" />} />
              </div>
              <div className="d--flex flex--column gap--sm w--full">
                <div className={`label--control font--500 d--flex gap--lg align-items--center  h-min--24  ${props.errors?.discount_price?.message ? "text--red" : "text--black-600"}`}>{props.errors?.discount_price?.message ? props.errors?.discount_price?.message : "Discount Price"}</div>
                <Controller name="discount_price" control={props.control} render={({ field }) => <FormInput {...field} type="number" placeholder="0" height="40" error={props.errors?.product_price?.message} />} />
              </div>
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">Discount Codes</div>
                <div className="d--flex gap--sm">
                  <Controller name="product_discount_code" control={props.control} render={({ field }) => <FormInput {...field} type="text" placeholder="0" height="40" />} />
                  <div className="w--full w-max--125">
                    <Button variant="black" color="white" btnClasses="btn" type="button" onClick={() => handleDiscountCoupon()}>
                      <PlusIcon /> Add Code
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w--full d--flex gap--sm justify-content--center p-b--sm ">
              <Button variant="black" color="white" btnClasses="btn border-full--black-200 w-min--200 w-max--200" type="button" onClick={props.onCancel}>
                Cancel
              </Button>
              <Button variant="orange" color="white" btnClasses="btn  w-min--200 w-max--200" type="button" onClick={props.onSubmit}>
                {props?.productDetails ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}

    { isMobile && (
      <div className="d--flex flex--column h--full w--full gap--md   stockProductPricingTab">
      <div className="w--full h--full d--flex flex--column gap--xs">
        {/* <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">More Information</div> */}
        <div className="d--flex  w--full bg--white gap--lg radius--md p--sm  overflow--auto">
          <div className="d--flex flex--column w--full gap--lg  h--full   justify-content--between  ">
            <div className="d--flex flex--column gap--lg">
              <div className="d--flex flex--column gap--sm w--full">
                <div className={`label--control font--sm  font--500 d--flex gap--lg align-items--center  h-min--24 ${props.errors?.product_price?.message ? "text--red" : "text--black-600"}`}>{props.errors?.product_price?.message ? props.errors?.product_price?.message : "Product Price"}</div>
                <Controller name="product_price" control={props.control} render={({ field }) => <FormInput {...field} type="number" placeholder="0" height="40" error={props.errors?.product_price?.message} />} />
              </div>
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">Bundle Price</div>
                <Controller name="others.bundle_price" control={props.control} render={({ field }) => <FormInput {...field} type="number" placeholder="0" height="40" />} />
              </div>
              <div className="d--flex flex--column gap--sm w--full">
                <div className={`label--control font--500 d--flex gap--lg align-items--center  h-min--24  ${props.errors?.discount_price?.message ? "text--red" : "text--black-600"}`}>{props.errors?.discount_price?.message ? props.errors?.discount_price?.message : "Discount Price"}</div>
                <Controller name="discount_price" control={props.control} render={({ field }) => <FormInput {...field} type="number" placeholder="0" height="40" error={props.errors?.product_price?.message} />} />
              </div>
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">Discount Codes</div>
                <div className="d--flex gap--sm">
                  <Controller name="product_discount_code" control={props.control} render={({ field }) => <FormInput {...field} type="text" placeholder="0" height="40" />} />
                  <div className="w--full w-max--125">
                    <Button variant="black" color="white" btnClasses="btn" type="button" onClick={() => handleDiscountCoupon()}>
                      <PlusIcon /> Add Code
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w--full d--flex align-items--center gap--sm justify-content--center p-b--sm ">
              <Button variant="black" color="white" btnClasses="btn border-full--black-200 w-min--100 w-max--200" type="button" onClick={props.onCancel}>
                Cancel
              </Button>
              <Button variant="orange" color="white" btnClasses="btn  w-min--100 w-max--200" type="button" onClick={props.onSubmit}>
                {props?.productDetails ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}

    </>
  );
}
