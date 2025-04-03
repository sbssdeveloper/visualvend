import React, { useEffect, useState } from "react";
import FormSelect from "../../../../Widgets/web/FormSelect";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import Dropdown from "../../../../Widgets/web/Dropdown";
import Switch from "../../../../Widgets/web/Switch";
import FormInput from "../../../../Widgets/web/FormInput";
import { Controller } from "react-hook-form";
import { AGE_VERIFICATION_TYPE_LIST } from "../../consts";
import { useMediaQuery } from "react-responsive";

export default function ProductLimitAccess(props) {
  const { ArrowAngleLeftIcon, ArrowAngleRightIcon, SupportIcon, AngleDownIcon } = useIcons();
  const isMobile = useMediaQuery({ query: '(max-width:768px)'});
  const [ageVarification, setAgeVerification] = useState(props.watch("product_age_verify_required"));

  const handleAgeSwitch = (event) => {
    props.setValue("product_age_verify_required", event.target.checked);
    setAgeVerification(event.target.checked);
  };
  return (
    <>
    { !isMobile && (
      <div className="d--flex flex--column w--full h--full gap--md stockProductLimitedAccessTab">
        {/* <div className="w--full d--flex gap--xl bg--white p--md radius--md">
          <div className="w--full d--flex gap--sm">
            <FormSelect />
            <div className="w-min--36 h-min--36 w-max--36 h-min--36 d--flex align-items--center justify-content--center c--pointer">
              <SupportIcon width={18} />
            </div>
          </div>
          <div className="w--full d--flex gap--sm">
            <FormSelect />
            <div className="w-min--36 h-min--36 w-max--36 h-min--36 d--flex align-items--center justify-content--center c--pointer">
              <SupportIcon width={18} />
            </div>
          </div>
          <div className="w--full d--flex gap--sm">
            <FormSelect />
            <div className="w-min--36 h-min--36 w-max--36 h-min--36 d--flex align-items--center justify-content--center c--pointer">
              <SupportIcon width={18} />
            </div>
          </div>
        </div> */}
        <div className="w--full  d--flex flex--column gap--xs">
          <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">Access Control</div>
          <div className="d--flex  w--full bg--white gap--3xl radius--md p--lg h-max--100 overflow--auto">
            <div className="d--flex gap--4xl w--full">
              <div className="w--full w-max--400 d--flex align-items--center gap--xl h-min--36">
                <div className=" font--sm font--600 white-space--nowrap">Age Verification enabled for this product?</div>
                <div className=" d--flex gap--sm justify-content--end w-max--200">
                  <Switch id={"newTest"} controlValue={ageVarification} handleFunction={(event) => handleAgeSwitch(event)} />
                </div>
              </div>
              {props.watch("product_age_verify_required") && (
                <div className="w--full ">
                  <div className="w--full d--flex align-items--center gap--sm justify-content--between">
                    <div className="w--full d--flex gap--3xl align-items--center">
                      <div className="w--full d--flex gap--md">
                        <div className="label--control font--sm font--500 d--flex align-items--center gap--md   text--black-600 white-space--nowrap">Minimum Verify Age</div>
                        <Controller name="product_age_verify_minimum" control={props.control} render={({ field }) => <FormInput {...field} type="number" label="" placeholder="Enter your minimum verify age" />} />
                      </div>
                      <div className="w--full d--flex gap--md">
                        <div className="label--control font--sm font--500 d--flex align-items--center gap--md   text--black-600 white-space--nowrap">Verify Age With</div>
                        <Controller name="verification_method" control={props.control} render={({ field }) => <FormSelect {...field} label="" options={AGE_VERIFICATION_TYPE_LIST} />} />
                      </div>
                    </div>
                    {/* <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800 m-t--md">
                  <div className="d--flex c--pointer">
                    <ArrowAngleLeftIcon width="20" />
                  </div>
                  <div className="w-min--30 d--flex justify-content--center">nnnnn</div>
                  <div className="d--flex c--pointer">
                    <ArrowAngleRightIcon width="20" />
                  </div>
                </div> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w--full h--full d--flex flex--column gap--xs">
          {/* <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">
            Asset Tracking
          </div> */}
          <div className="d--flex justify-content--between flex--column w--full h--full bg--white gap--lg radius--md p--lg stockLimitAccessTab ">
            {/* <div className="d--flex flex--column gap--lg  w--full stockProductLimitedAccessTabList  overflow--auto">
              <div className="d--flex gap--4xl w--full">
                <div className="w--full d--flex align-items--center gap--sm justify-content--between">
                  <div className="w--full font--sm font--600">
                    User ID required to access this product?
                  </div>
                  <div className="w--full d--flex gap--sm justify-content--end w-max--200">
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
                <div className="w--full d--flex align-items--center gap--sm justify-content--between">
                  <div className="w--full font--sm font--600">
                    Display price of product during access?
                  </div>
                  <div className="w--full d--flex gap--sm justify-content--end w-max--200">
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
              <div className="d--flex gap--4xl w--full">
                <div className="w--full d--flex align-items--center gap--sm justify-content--between">
                  <div className="w--full font--sm font--600">
                    Limit Quantity/Access per user?
                  </div>
                  <div className="w--full d--flex gap--sm justify-content--end w-max--200">
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
                <div className="w--full d--flex align-items--center gap--sm justify-content--between"></div>
              </div>
            </div> */}
            <div className="w--full"></div>
            <div className="w--full d--flex gap--sm justify-content--center p-b--sm">
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
    )}

    { isMobile && (
      <div className="d--flex flex--column w--full h--full gap--lg">
      <div className="w--full  d--flex flex--column gap--xs">
        <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">Access Control</div>
        <div className="d--flex  w--full bg--white gap--lg radius--md p--sm h-max--200 overflow--auto">
          <div className="d--flex gap--lg flex--column w--full">
            <div className="w--full w-max--400 d--flex align-items--center gap--md h-min--36">
              <div className=" font--sm font--600 white-space--nowrap">Age Verification enabled for this product?</div>
              <div className=" d--flex gap--sm justify-content--end w-max--200">
                <Switch id={"newTest"} controlValue={ageVarification} handleFunction={(event) => handleAgeSwitch(event)} />
              </div>
            </div>
            {props.watch("product_age_verify_required") && (
              <div className="w--full ">
                <div className="w--full d--flex align-items--center gap--sm justify-content--between">
                  <div className="w--full d--flex gap--lg flex--column align-items--center">
                    <div className="w--full d--flex gap--md">
                      <div className="label--control font--sm font--500 d--flex align-items--center gap--md   text--black-600 white-space--nowrap">Minimum Verify Age</div>
                      <Controller name="product_age_verify_minimum" control={props.control} render={({ field }) => <FormInput {...field} type="number" label="" placeholder="Enter your minimum verify age" />} />
                    </div>
                    <div className="w--full d--flex gap--md">
                      <div className="label--control font--sm font--500 d--flex align-items--center gap--md   text--black-600 white-space--nowrap">Verify Age With</div>
                      <Controller name="verification_method" control={props.control} render={({ field }) => <FormSelect {...field} label="" options={AGE_VERIFICATION_TYPE_LIST} />} />
                    </div>
                  </div>
  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w--full h--full d--flex flex--column gap--xs">
        <div className="d--flex justify-content--between flex--column w--full h--full bg--white radius--md stockLimitAccessTab ">
          <div className="w--full"></div>
          <div className="w--full d--flex align-items--center gap--sm justify-content--center p-b--sm">
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
    )}

    </>
  );
}
