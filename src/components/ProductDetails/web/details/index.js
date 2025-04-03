import React, { useEffect, useState } from "react";
import useIcons from "../../../../Assets/web/icons/useIcons";
import FormSelect from "../../../../Widgets/web/FormSelect";
import Button from "../../../../Widgets/web/Button";
import { Controller } from "react-hook-form";
import FormInput from "../../../../Widgets/web/FormInput";
import Select from "react-select";
import { getClientList, productCategoreyList } from "../../action";
import { Query, useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "react-responsive";

export default function ProductDetails(props) {
  const { SupportIcon } = useIcons();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const { isLoading: isClientListLoading, data: clientList } = useQuery({
    queryKey: ["clientList"],
    queryFn: () => getClientList({}),
    select: (data) => {
      return data.data.data;
    },
    enabled: props.userState.auth.user.client_id == -1,
  });

  return (
    <>
    { !isMobile && (
    <div className="d--flex flex--column  h--full w--full bg--white gap--3xl radius--md p--lg stockProductDetailsTab overflow--auto">
      <div className="d--flex flex--column w--full gap--lg h--full  ">
        <div className="w--full d--flex gap--4xl">
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <div className="d--flex flex--column">
              <div className={`label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm ${props.errors?.product_id?.message ? "text--red" : "text--black-600"}`}>
                {props.errors?.product_id?.message ? props.errors?.product_id?.message : "Product ID"}
                <SupportIcon width={15} height={15} />
              </div>
              {!props?.productDetails ? <Controller name="product_id" control={props.control} render={({ field }) => <FormInput {...field} type="input" error={props.errors?.product_id?.message} placeholder="Enter your product id" />} /> : <div className="form--control w--full h-min--36  radius--sm p-l--md p-r--md  border-full--black-100 bg--black-50 d--flex align-items--center ">{props?.productDetails?.product_id}</div>}
            </div>
            <Controller name="product_grading_no" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product Grading No." placeholder="Enter your product grading no" />} />

            {props.userState.auth.user.client_id == -1 && (
              <Controller
                name="client_id"
                control={props.control}
                render={({ field }) => (
                  <FormSelect
                    {...field}
                    error={props.errors?.client_id?.message}
                    options={
                      clientList && clientList.length != 0
                        ? clientList.map((el, i) => {
                          return {
                            uuid: el.id,
                            name: el.client_name,
                            value: el.id,
                          };
                        })
                        : []
                    }
                    label="Client"
                  />
                )}
              />
            )}
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller name="product_name" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product name" placeholder="Enter your product name" error={props.errors?.product_name?.message} />} />
            <Controller name="product_sku" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product SKU" placeholder="Enter your product SKU" />} />
            <Controller name="vend_quantity" control={props.control} render={({ field }) => <FormInput {...field} type="number" label="Quantity to Vend" placeholder="0" />} />
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller name="product_batch_no" control={props.control} render={({ field }) => <FormInput {...field} type="text" label="Product Batch No." placeholder="Enter your product batch no." />} />
            <Controller name="product_caption" control={props.control} render={({ field }) => <FormInput {...field} type="text" label="Product Caption" placeholder="Enter your product caption" />} />
            <div className="d--flex flex--column  w--full">
              <div className="label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm text--black-600">Product Category</div>

              <Controller
                name="product_category"
                control={props.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={
                      props.allProductCatgoryList
                        ? props.allProductCatgoryList.map((el) => {
                          return {
                            label: el.category_name,
                            value: el.category_id,
                          };
                        })
                        : []
                    }
                    isMulti
                    labelledBy="Choose Product Category"
                    isDisabled={props.isCategoryListLoading}
                  />
                )}
              />
            </div>
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller name="product_batch_expiray_date" control={props.control} render={({ field }) => <FormInput {...field} type="date" label="Product Batch Expire Date" placeholder="dd-mm-yyyy" />} />
            <Controller name="product_classification_no" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product Classification No." placeholder="Enter your product classification no." />} />
          </div>
          {/* <div className="d--flex w--full flex--column gap--2xl p-r--2xl">
            {!props.isEditable ? (
              <div className="d--flex flex--column gap--sm">
                <div className="label--control font--sm text--black-600 font--500">Product Name</div>
                <div className="font--sm text--black-800 font--600">Red Bull Sugar Free</div>
              </div>
            ) : (
              <Controller name="product_name" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product Name" placeholder="Enter product name" error={props.errors?.product_name?.message}  />} />
            )}

            {!props.isEditable ? (
              <div className="d--flex flex--column gap--sm">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">
                  Product ID
                  <div className="d--flex c--pointer">
                    <SupportIcon width={16} />
                  </div>
                </div>
                <div className="font--sm text--black-800 font--600">10025890</div>
              </div>
            ) : (
              <Controller name="product_id" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product id" placeholder="Enter product id" error={props.errors?.product_id?.message}  />} />
            )}

            <div className="w--full d--flex justify-content--between align-items--end">
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">
                  Product Supplier 1
                  <div className="d--flex text--primary c--pointer">
                    <InfoIcon width={20} />
                  </div>
                </div>
                <div className="d--flex w-max--150 m-t--sm">
                  <FormSelect />
                </div>
              </div>
              <div className="d--flex justify-content--end">
                <Button variant="primary" color="white" btnClasses="btn w-min--100 ">
                  <PlusIcon width={20} /> Add
                </Button>
              </div>
            </div>
          </div>
          <div className="d--flex w--full flex--column gap--2xl p-r--2xl ">
            <div className="w--full d--flex justify-content--between align-items--end">
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">
                  Product Supplier 1
                  <div className="d--flex text--primary c--pointer">
                    <InfoIcon width={20} />
                  </div>
                </div>
                <div className="font--sm text--black-800 font--600">Drinks</div>
              </div>
              <div className="d--flex justify-content--end">
                <Button variant="primary" color="white" btnClasses="btn w-min--100 ">
                  <PlusIcon width={20} /> Add
                </Button>
              </div>
            </div>

            {!props.isEditable ? (
              <div className="d--flex flex--column gap--sm">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">
                  Product Description
                  <div className="h-min--20 m-t--sm"></div>
                </div>
                <div className="font--sm text--black-800 font--600">Energy Drink 30% Energy</div>
              </div>
            ) : (
              <Controller name="product_description" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product description" placeholder="Enter product description" error={props.errors?.product_description?.message}  />} />
            )}

            <div className="w--full d--flex justify-content--between align-items--end">
              <div className="d--flex flex--column gap--sm w--full">
                <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">
                  Product Supplier 1
                  <div className="d--flex text--primary c--pointer">
                    <InfoIcon width={20} />
                  </div>
                </div>
                <div className="d--flex w-max--150 m-t--sm">
                  <FormSelect />
                </div>
              </div>
              <div className="d--flex justify-content--end">
                <Button variant="primary" color="white" btnClasses="btn w-min--100 ">
                  <PlusIcon width={20} /> Add
                </Button>
              </div>
            </div>
          </div> */}
        </div>
        <div className="d--flex flex--column gap--sm w--full">
          <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">Product Status</div>
          <div className="d--flex gap--lg">
            <label className="d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
              <Controller
                name="product_status"
                control={props.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="radio"
                    className="form--control"
                    name="saveCard"
                    value={1}
                    checked={props.watch("product_status") == 1}
                  />
                )}
              />
              Active
            </label>
            <label className="d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
              <Controller
                name="product_status"
                control={props.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="radio"
                    className="form--control"
                    name="saveCard"
                    value={2}
                    checked={props.watch("product_status") == 2}
                  />
                )}
              />
              Suspended
            </label>
            <label className="d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
              <Controller
                name="product_status"
                control={props.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="radio"
                    className="form--control"
                    name="saveCard"
                    value={3}
                    checked={props.watch("product_status") == 3}
                  />
                )}
              />
              Recalled
            </label>
          </div>

        </div>
      </div>
      <div className="w--full d--flex gap--sm justify-content--center p-b--sm">
        <Button variant="black" color="white" btnClasses="btn border-full--black-200 w-min--200 w-max--200 text--white" type="button" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button variant="orange" color="white" btnClasses="btn  w-min--200 w-max--200" type="button" onClick={props.onSubmit}>
          {props?.productDetails ? "Update" : "Add"}
        </Button>
      </div>

      {/* <div className="w--full w-max--400 d--flex flex--column gap--xl p-b--lg">
        <div className="w--full d--flex flex--column justify-content--center align-items--center gap--md p-b--sm">
          <div className="w--full text--c font--sm font--500 text--black-600">
            Menu Image 2
          </div>
          <div className="d--flex gap--md w--full align-items--center position--relative ">
            <div className="w-min--50 h-min--50 w-max--50 h-max--50 w--full h--full radius--full c--pointer bg--black-50 text--black-400 d--flex align-items--center justify-content--center ">
              <AngleLeftIcon width={20} />
            </div>

            <div className="w--full border-full--black-100 bg--contrast radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
              <div className="text--black-600">
                <GalleryIcon width={70} height={70} />
              </div>
            </div>
            <div className="w-min--50 h-min--50 w-max--50 h-max--50 w--full h--full radius--full c--pointer bg--black-50 text--black-400 d--flex align-items--center justify-content--center ">
              <AngleRightIcon width={15} height={18} />
            </div>
          </div>
          <div className="w--full">
            <div className="w-min--40  d--flex  gap--lg justify-content--center w--full">
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer">
                <GallerysIcon width={15} />
              </div>
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer">
                <CameraAddIcon width={15} />
              </div>
            </div>
          </div>
        </div>
        <div className="w--full d--flex flex--column justify-content--center align-items--center gap--md p-b--sm">
          <div className="w--full text--c font--sm font--500 text--black-600">
            Menu Image 2
          </div>
          <div className="d--flex gap--md w--full align-items--center position--relative ">
            <div className="w-min--50 h-min--50 w-max--50 h-max--50 w--full h--full radius--full c--pointer bg--black-50 text--black-400 d--flex align-items--center justify-content--center ">
              <AngleLeftIcon width={20} />
            </div>

            <div className="w--full border-full--black-100 bg--contrast radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
              <div className="text--black-600">
                <GalleryIcon width={70} height={70} />
              </div>
            </div>
            <div className="w-min--50 h-min--50 w-max--50 h-max--50 w--full h--full radius--full c--pointer bg--black-50 text--black-400 d--flex align-items--center justify-content--center ">
              <AngleRightIcon width={15} height={18} />
            </div>
          </div>
          <div className="w--full">
            <div className="w-min--40  d--flex  gap--lg justify-content--center w--full">
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer">
                <GallerysIcon width={15} />
              </div>
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer">
                <CameraAddIcon width={15} />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
    )}

    {isMobile && (
      <div className="d--flex flex--column  h--full w--full bg--white gap--lg radius--md p--sm overflow--auto">
      <div className="d--flex flex--column w--full gap--lg h--full  ">
        <div className="w--full d--flex flex-column gap--lg">
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <div className="d--flex flex--column">
              <div className={`label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm ${props.errors?.product_id?.message ? "text--red" : "text--black-600"}`}>
                {props.errors?.product_id?.message ? props.errors?.product_id?.message : "Product ID"}
                <SupportIcon width={15} height={15} />
              </div>
              {!props?.productDetails ? <Controller name="product_id" control={props.control} render={({ field }) => <FormInput {...field} type="input" error={props.errors?.product_id?.message} placeholder="Enter your product id" />} /> : <div className="form--control w--full h-min--36  radius--sm p-l--md p-r--md  border-full--black-100 bg--black-50 d--flex align-items--center ">{props?.productDetails?.product_id}</div>}
            </div>
            <Controller name="product_grading_no" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product Grading No." placeholder="Enter your product grading no" />} />

            {props.userState.auth.user.client_id == -1 && (
              <Controller
                name="client_id"
                control={props.control}
                render={({ field }) => (
                  <FormSelect
                    {...field}
                    error={props.errors?.client_id?.message}
                    options={
                      clientList && clientList.length != 0
                        ? clientList.map((el, i) => {
                          return {
                            uuid: el.id,
                            name: el.client_name,
                            value: el.id,
                          };
                        })
                        : []
                    }
                    label="Client"
                  />
                )}
              />
            )}
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller name="product_name" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product name" placeholder="Enter your product name" error={props.errors?.product_name?.message} />} />
            <Controller name="product_sku" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product SKU" placeholder="Enter your product SKU" />} />
            <Controller name="vend_quantity" control={props.control} render={({ field }) => <FormInput {...field} type="number" label="Quantity to Vend" placeholder="0" />} />
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller name="product_batch_no" control={props.control} render={({ field }) => <FormInput {...field} type="text" label="Product Batch No." placeholder="Enter your product batch no." />} />
            <Controller name="product_caption" control={props.control} render={({ field }) => <FormInput {...field} type="text" label="Product Caption" placeholder="Enter your product caption" />} />
            <div className="d--flex flex--column  w--full">
              <div className="label--control font--sm font--500 d--flex align-items--center gap--md m-b--sm text--black-600">Product Category</div>

              <Controller
                name="product_category"
                control={props.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={
                      props.allProductCatgoryList
                        ? props.allProductCatgoryList.map((el) => {
                          return {
                            label: el.category_name,
                            value: el.category_id,
                          };
                        })
                        : []
                    }
                    isMulti
                    labelledBy="Choose Product Category"
                    isDisabled={props.isCategoryListLoading}
                  />
                )}
              />
            </div>
          </div>
          <div className="w--full d--flex flex--column gap--lg w-max--500">
            <Controller name="product_batch_expiray_date" control={props.control} render={({ field }) => <FormInput {...field} type="date" label="Product Batch Expire Date" placeholder="dd-mm-yyyy" />} />
            <Controller name="product_classification_no" control={props.control} render={({ field }) => <FormInput {...field} type="input" label="Product Classification No." placeholder="Enter your product classification no." />} />
          </div>
        </div>
        <div className="d--flex flex--column gap--sm w--full">
          <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  h-min--24">Product Status</div>
          <div className="d--flex gap--lg">
            <label className="d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
              <Controller
                name="product_status"
                control={props.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="radio"
                    className="form--control"
                    name="saveCard"
                    value={1}
                    checked={props.watch("product_status") == 1}
                  />
                )}
              />
              Active
            </label>
            <label className="d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
              <Controller
                name="product_status"
                control={props.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="radio"
                    className="form--control"
                    name="saveCard"
                    value={2}
                    checked={props.watch("product_status") == 2}
                  />
                )}
              />
              Suspended
            </label>
            <label className="d--flex gap--sm text--black-800 font--sm font--600 c--pointer">
              <Controller
                name="product_status"
                control={props.control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="radio"
                    className="form--control"
                    name="saveCard"
                    value={3}
                    checked={props.watch("product_status") == 3}
                  />
                )}
              />
              Recalled
            </label>
          </div>

        </div>
      </div>
      <div className="w--full d--flex align-items-center gap--sm justify-content--center p-b--sm">
        <Button variant="black" color="white" btnClasses="btn border-full--black-200 w-min--100 w-max--200" type="button" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button variant="orange" color="white" btnClasses="btn  w-min--100 w-max--200" type="button" onClick={props.onSubmit}>
          {props?.productDetails ? "Update" : "Add"}
        </Button>
      </div>
    </div>
    )}

    </>

  );
}
