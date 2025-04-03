import React, { useEffect, useState } from "react";
import FormSelect from "../../../../Widgets/web/FormSelect";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import Dropdown from "../../../../Widgets/web/Dropdown";
import FormInput from "../../../../Widgets/web/FormInput";
import { Controller } from "react-hook-form";
import { useMediaQuery } from "react-responsive";

export default function ProductMoreDetails(props) {
  const { ArrowAngleLeftIcon, ArrowAngleRightIcon, SupportIcon, AngleDownIcon } = useIcons();
  const dropList = {
    component: ({ item }) => <div>{item?.title}</div>,
    data: [
      { title: "Test 1", value: "Test 1" },
      { title: "Test 2", value: "Test 2" },
    ],
  };
  
  const isMobile = useMediaQuery({ query: '(max-width:768px)'});
  const dropEl = <div className="d--flex align-items--center font--sm font--600 gap--sm m-r--sm">Saturated Fat %</div>;
  return (
    <>
    { !isMobile && (
        <div className="d--flex flex--column w--full h--full gap--md stockProductMoreDetailsTab">
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
          </div>
          <div className="w--full h--full d--flex flex--column gap--xs">
            <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">Nutrition Information</div>
            <div className="d--flex  w--full bg--white gap--3xl radius--md p--lg stockProductMoreDetailsTabList overflow--auto">
              <div className="d--flex flex--column w--full gap--lg   ">
                <div className="w--full d--flex gap--3xl">
                  <div className="d--flex w--full flex--column gap--2xl p-r--2xl">
                    <div className="d--flex flex--column gap--sm">
                      <div className="label--control font--sm text--black-600 font--500 w-max--200">
                        <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={AngleDownIcon} showcaret={true}>
                          Per Serving
                        </Dropdown>
                      </div>
                      <div className="d--flex gap--xl w--full align-items--center">
                        <div className="font--sm font--600 w-min--50 text--black-800">nnn</div>
                        <div className="w--full w-max--200 ">
                          <FormSelect />
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                          <div className="d--flex c--pointer">
                            <ArrowAngleLeftIcon width="20" />
                          </div>
                          <div className="w-min--30 d--flex justify-content--center">nnnnn</div>
                          <div className="d--flex c--pointer">
                            <ArrowAngleRightIcon width="20" />
                          </div>
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800"></div>
                        <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800"></div>
                      </div>
                    </div>
                    <div className="d--flex flex--column gap--sm">
                      <div className="label--control font--sm text--black-600 font--500 w-max--200">
                        <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={AngleDownIcon} showcaret={true}>
                          Overall Fat %
                        </Dropdown>
                      </div>
                      <div className="d--flex gap--xl w--full align-items--center">
                        <div className="font--sm font--600 w-min--50 text--black-800">mmmm</div>
                        <div className="w--full w-max--200 ">
                          <FormSelect />
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                          <div className="d--flex c--pointer">
                            <ArrowAngleLeftIcon width="20" />
                          </div>
                          <div className="w-min--30 d--flex justify-content--center">mmm</div>
                          <div className="d--flex c--pointer">
                            <ArrowAngleRightIcon width="20" />
                          </div>
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                          <div className="d--flex c--pointer">
                            <ArrowAngleLeftIcon width="20" />
                          </div>
                          <div className="w-min--30 d--flex justify-content--center">nnnn</div>
                          <div className="d--flex c--pointer">
                            <ArrowAngleRightIcon width="20" />
                          </div>
                        </div>
                        <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800">%</div>
                      </div>
                    </div>
                    <div className="d--flex flex--column gap--sm">
                      <div className="label--control font--sm text--black-600 font--500 w-max--200">
                        <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={AngleDownIcon} showcaret={true}>
                          Total Sugar(s) %
                        </Dropdown>
                      </div>
    
                      <div className="d--flex gap--xl w--full align-items--center">
                        <div className="font--sm font--600 w-min--50 text--black-800">nnn</div>
                        <div className="w--full w-max--200 ">
                          <FormSelect />
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                          <div className="d--flex c--pointer">
                            <ArrowAngleLeftIcon width="20" />
                          </div>
                          <div className="w-min--30 d--flex justify-content--center">nnn</div>
                          <div className="d--flex c--pointer">
                            <ArrowAngleRightIcon width="20" />
                          </div>
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                          <div className="d--flex c--pointer">
                            <ArrowAngleLeftIcon width="20" />
                          </div>
                          <div className="w-min--30 d--flex justify-content--center">nn</div>
                          <div className="d--flex c--pointer">
                            <ArrowAngleRightIcon width="20" />
                          </div>
                        </div>
                        <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800">%</div>
                      </div>
                    </div>
                  </div>
                  <div className="d--flex w--full flex--column gap--2xl p-r--2xl">
                    <div className="d--flex flex--column gap--sm">
                      <div className="label--control font--sm text--black-600 font--500 w-max--200">
                        <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={AngleDownIcon} showcaret={true}>
                          Per 100g Serving
                        </Dropdown>
                      </div>
    
                      <div className="d--flex gap--xl w--full align-items--center">
                        <div className="font--sm font--600 w-min--50 text--black-800">mmmm</div>
                        <div className="w--full w-max--200 ">
                          <FormSelect />
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                          <div className="d--flex c--pointer">
                            <ArrowAngleLeftIcon width="20" />
                          </div>
                          <div className="w-min--30 d--flex justify-content--center">mmm</div>
                          <div className="d--flex c--pointer">
                            <ArrowAngleRightIcon width="20" />
                          </div>
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800"></div>
                        <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800"></div>
                      </div>
                    </div>
                    <div className="d--flex flex--column gap--sm">
                      <div className="label--control font--sm text--black-600 font--500 w-max--200">
                        <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={AngleDownIcon} showcaret={true}>
                          {dropEl}
                        </Dropdown>
                      </div>
    
                      <div className="d--flex gap--xl w--full align-items--center">
                        <div className="font--sm font--600 w-min--50 text--black-800">mmmm</div>
                        <div className="w--full w-max--200 ">
                          <FormSelect />
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                          <div className="d--flex c--pointer">
                            <ArrowAngleLeftIcon width="20" />
                          </div>
                          <div className="w-min--30 d--flex justify-content--center">mmm</div>
                          <div className="d--flex c--pointer">
                            <ArrowAngleRightIcon width="20" />
                          </div>
                        </div>
                        <div className="font--sm font--600 d--flex align-items--center justify-content--center gap--sm w-min--100 text--black-800">
                          <div className="d--flex c--pointer">
                            <ArrowAngleLeftIcon width="20" />
                          </div>
                          <div className="w-min--30 d--flex justify-content--center">nnnn</div>
                          <div className="d--flex c--pointer">
                            <ArrowAngleRightIcon width="20" />
                          </div>
                        </div>
                        <div className="w-min--20 font--md font--600 d--flex justify-content--center text--black-800">%</div>
                      </div>
                    </div>
                    <div className="d--flex flex--column gap--sm">
                      <div className="label--control font--sm text--black-600 font--500 w-max--200 m-b--sm">Ingredients</div>
    
                      <div className="d--flex gap--xl w--full align-items--center">
                        <div className="w--full w-max--200 ">
                          <FormSelect />
                        </div>
    
                        <div className="w--full w-max--200 ">
                          <FormSelect />
                        </div>
                        <div className="w--full w-max--200 ">
                          <FormSelect />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="w--full h--full d--flex flex--column gap--xs">
            <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">More Information</div>
            <div className="d--flex  w--full bg--white gap--3xl radius--md p--lg stockProductMoreDetailsTabList overflow--auto">
              <div className="d--flex flex--column w--full gap--5xl h--full justify-content--between  ">
                <div className="d--flex gap--2xl">
                  <div className="d--flex flex--column gap--sm w--full">
                    <div className={`label--control font--sm  font--500 d--flex gap--lg align-items--center  h-min--24 ${props.errors?.product_description?.message ? "text--red" : "text--black-600"}`}>{props.errors?.product_description?.message ? props.errors?.product_description?.message : "Product Description"}</div>
                    <div className="d--flex ">
                      <Controller name="product_description" control={props.control} render={({ field }) => <textarea className={`form--control w--full h-min--100  radius--sm p--md  ${props.errors?.product_description?.message ? "border-full--red " : "border-full--black-100"}`} row="4" {...field}></textarea>} />
                    </div>
                  </div>
                  <div className="d--flex flex--column gap--sm w--full">
                    <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">More Info Text</div>
                    <div className="d--flex ">
                      <Controller name="more_info_text" control={props.control} render={({ field }) => <textarea className="form--control w--full h-min--100  radius--sm p--md  border-full--black-100" row="4" {...field}></textarea>} />
                    </div>
                  </div>
                  <div className="d--flex flex--column gap--sm w--full">
                    <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">Promotional Text</div>
                    <div className="d--flex ">
                      <Controller name="promo_text" control={props.control} render={({ field }) => <textarea className="form--control w--full h-min--100  radius--sm p--md  border-full--black-100" row="4" {...field}></textarea>} />
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
      <div className="d--flex flex--column w--full h--full gap--md stockProductMoreDetailsTab">
      <div className="w--full h--full d--flex flex--column gap--xs">
        <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">More Information</div>
        <div className="d--flex  w--full bg--white gap--3xl radius--md p--sm  overflow--auto">
          <div className="d--flex flex--column w--full gap--lg h--full justify-content--between  ">
            <div className="d--flex flex--column gap--lg">
              <div className="d--flex flex--column gap--sm w--full">
                <div className={`label--control font--sm  font--500 d--flex gap--lg align-items--center  h-min--24 ${props.errors?.product_description?.message ? "text--red" : "text--black-600"}`}>{props.errors?.product_description?.message ? props.errors?.product_description?.message : "Product Description"}</div>
                <div className="d--flex ">
                  <Controller name="product_description" control={props.control} render={({ field }) => <textarea className={`form--control w--full h-min--100  radius--sm p--sm  ${props.errors?.product_description?.message ? "border-full--red " : "border-full--black-100"}`} row="4" {...field}></textarea>} />
                </div>
              </div>
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">More Info Text</div>
                <div className="d--flex ">
                  <Controller name="more_info_text" control={props.control} render={({ field }) => <textarea className="form--control w--full h-min--100  radius--sm p--sm  border-full--black-100" row="4" {...field}></textarea>} />
                </div>
              </div>
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">Promotional Text</div>
                <div className="d--flex ">
                  <Controller name="promo_text" control={props.control} render={({ field }) => <textarea className="form--control w--full h-min--100  radius--sm p--sm  border-full--black-100" row="4" {...field}></textarea>} />
                </div>
              </div>
            </div>
            <div className="w--full d--flex gap--sm align-items-center justify-content--center p-b--sm ">
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
