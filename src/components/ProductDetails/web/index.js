import React, { useEffect, useMemo, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import FormSelect from "../../../Widgets/web/FormSelect";
import useIcons from "../../../Assets/web/icons/useIcons";
import FormInput from "../../../Widgets/web/FormInput";
import { PRODUCT_CONST, TABS_LIST, VALIDATED_FORM_CONTROLS, createFormData } from "../consts";
import ProductDetails from "./details";
import ProductPricing from "./pricing";
import Surcharges from "./surcharges"; 
import ProductMoreDetails from "./more-details";
import ProductLimitAccess from "./limited-access";
import ProductContent from "./content";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../../Widgets/web/Button";
import ProductImages from "./stock";
import ProductInformation from "./information";
import useMutationData from "../../../Hooks/useCommonMutate";
import { addProduct, getBucketUrl, getProductById, productCategoreyList, updateProduct, uploadFile } from "../action";
import { showSuccessToast } from "../../../Helpers/web/toastr";
import { store } from "../../../redux/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FullScreenLoader from "../../../Widgets/web/FullScreenLoader";
import { generateRandomString } from "../../../Helpers/web";
import { useMediaQuery } from 'react-responsive';

import { Accordion, Card } from 'react-bootstrap';

const components = {
  details: ProductDetails,
  pricing: ProductPricing,
  surcharges: Surcharges,
  "more-details": ProductMoreDetails,
  "limit-access": ProductLimitAccess,
  content: ProductContent,
  images: ProductImages,
  information: ProductInformation,
};

const initialValues = {
  client_id: "",
  product_name: "",
  product_id: "",
  product_price: 1,
  discount_price: 1,
  product_description: "",
  product_image: null,
  product_more_info_image: null,
  product_promo_image: "",
  product_batch_no: "",
  product_batch_expiray_date: "",
  product_grading_no: "",
  product_sku: "",
  product_classification_no: "",
  product_caption: "",
  vend_quantity: "",
  product_status: 1,
  product_category: [],
  product_discount_code: generateRandomString(5),
  more_info_text: "",
  promo_text: "",
  product_size_amount: 1,
  product_size_unit: "ml",
  product_age_verify_required: false,
  product_age_verify_minimum: "",
  verification_method: "",
  more_product_images: [],
  others: {
    bundle_price: 1,
    product_max_qty: "",
    product_aisle_actual: "",
    machine_item_qty: "",
    product_space: "Y",
    product_sequence: "",
    product_space_method: "",
    product_space_start: "",
    tax_code_tax: "",
    tax_code_state: "",
    tax_code_country: "",
  },
};
 
const validationSchema = yup.object().shape({
  product_name: yup.string().required("Product name is required"),
  product_id: yup.string().required("Product id is required"),
  product_price: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .nullable()
    .required("Product price is required"),
  discount_price: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .nullable()
    .required("Discount price is required"),
  product_description: yup.string().required("Product description is required"),
  product_image: yup.mixed().required("Product image is required"),
  product_more_info_image: yup.mixed().required("Product image more info is required"),
  product_promo_image: yup.mixed().optional("Product image more info is required"),
  product_batch_no: yup.string().optional(),
  product_batch_expiray_date: yup.string().optional(),
  product_grading_no: yup.string().optional(),
  product_sku: yup.string().optional(),
  product_classification_no: yup.string().optional(),
  product_caption: yup.string().optional(),
  vend_quantity: yup.string().optional(),
  product_status: yup.string().optional(),
  product_discount_code: yup.string().optional(),
  product_category: yup.array().optional(),
  more_info_text: yup.string().optional(),
  promo_text: yup.string().optional(),
  product_size_amount: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .nullable()
    .optional(),
  product_size_unit: yup.string().optional(),
  product_age_verify_required: yup.boolean().optional(),
  product_age_verify_minimum: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .nullable()
    .optional(),
  verification_method: yup.string().optional(),
  client_id: yup.string().required("Client ID is required"),
  more_product_images: yup.array().optional(),
  others: yup.object().shape({
    bundle_price: yup
      .number()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      })
      .nullable()
      .optional(),
    product_max_qty: yup.string().optional(),
    product_aisle_actual: yup.string().optional(),
    machine_item_qty: yup.string().optional(),
    product_space: yup.string().optional(),
    product_sequence: yup.string().optional(),
    product_space_method: yup.string().optional(),
    product_space_start: yup.string().optional(),
    tax_code_tax: yup.string().optional(),
    tax_code_state: yup.string().optional(),
    tax_code_country: yup.string().optional(),
  }),
 
  surcharge_fees: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Please enter the surcharge name."),
      type: yup.string().required("Please specify the surcharge type."),
      amount: yup.number().when('type', {
        is: (val) => val === 'amount' || val === 'amount-percentage',
        then: yup.number().required("Please enter the surcharge amount.").min(0, "The surcharge amount must be greater than zero."),
      }),
      percentage: yup.number().when('type', {
        is: (val) => val === 'percentage' || val === 'amount-percentage',
        then: yup.number().required("Please enter the surcharge percentage.").min(0, "The surcharge percentage must be greater than zero."),
      }),
      min_price: yup.number().required("Please enter the minimum price.").min(1, "The minimum price must be greater than zero."),
      max_price: yup.number().required("Please enter the maximum price.").min(1, "The maximum price must be greater than zero."),
      from_date: yup.date().required("Please select the start date."),
      to_date: yup.date().required("Please select the end date."),
      description: yup.string().required("Please provide a description."),
    })
  ),
  product_surcharges: yup.object().shape({
    surcharge_type: yup
      .string()
      .oneOf(["plus", "including", "no_surcharge"], "Invalid surcharge type.")
      .required("Surcharge type is required."),

    surcharge_value: yup
      .number()
      .when("surcharge_type", {
        is: (surchargeType) => surchargeType == "plus" || surchargeType == "including",
        then: yup
          .number(),
        otherwise: yup.number().notRequired(),
      }),

    // Add any other fields in the object, like "id", "product_id", etc.
   
  }),

  

});

export default function ProductDetailsOutlet() {

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });
  const { InfoIcon, ArrowLongLeftIcon } = useIcons();
  const { productId, pageType } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const ActiveComponent = useMemo(() => components[pageType], [pageType]);
  const userState = store.getState();
  const [isProductAdding, setIsProductAdding] = useState(false);
  const { tabId } = useParams();
  const [pagetype, setPagetype] = useState(tabId);

  const[client_id, setClientId] = useState(null);

  useEffect(() => {
    if (userState.auth && userState.auth.user && userState.auth.user.client_id != -1) {
      setValue("client_id", userState.auth.user.client_id);
    }
    if(userState.auth && userState.auth.user){
      setClientId(userState.auth.user.client_id);
    }
  }, [userState, setValue]);

  useEffect(() => {
    setPagetype(tabId);
  }, [tabId]);

  const wasabiResonseSuccess = async (data) => {
    let keys = Object.keys(data.data);
    let urls = [];
    keys.forEach((el) => {
      urls.push({
        keyName: el,
        url: data.data[el].url,
        filename: data.data[el].filename,
      });
    });
    handleImageMutation(urls);
  };

  const handleImageMutation = async (urls) => {
    let moreProductsUrls = [];
    let moreProductFiles = watch("more_product_images");
    moreProductFiles.forEach((el) => {
      if (el.uuid) {
        moreProductsUrls.push(el.image);
      }
    });
    await Promise.all(
      urls.map(async (url, index) => {
        try {
          let keyArr = url.keyName.split("_");
          let lastVal = keyArr[keyArr.length - 1];
          let file = url.keyName.includes("more_product_images") ? moreProductFiles[+lastVal - 1] : watch(url.keyName);
          uploadFile({ uri: url.url, file: file });
          if (url.keyName.includes("more_product_images")) {
            moreProductsUrls.splice(+lastVal - 1, 0, url.filename);
            setValue("more_product_images", moreProductsUrls);
          } else setValue(url.keyName, url.filename);
        } catch (error) {
          setIsProductAdding(false);
          return { index, status: "error", error: error.message };
        }
      })
    ).then(() => {
      let values = watch();
      values.product_category = values.product_category.map((el) => el.value).join(",");
      values.product_age_verify_required = values.product_age_verify_required ? 1 : 0;
      if (!productDetails) {
        addProductRequest.mutate(values);
      } else {
        values = { uuid: productDetails.uuid, ...values };
        updateProductRequest.mutate(values);
      }
    });
  };

  const wasabiUrlMuation = useMutationData(getBucketUrl, (data) => wasabiResonseSuccess(data));

  const {
    isLoading,
    data: productDetails,
    isSuccess,
  } = useQuery({
    queryKey: ["productDetailsById", state?.uuid],
    queryFn: () => getProductById({ uuid: state.uuid }),
    select: (data) => {
      return data.data.data;
    },
    enabled: state?.uuid ? true : false,
  });

  useEffect(() => {
    patchFormValue();
  }, [isSuccess]);

  const flattenObject = (obj, prefix = "", res = {}) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          flattenObject(obj[key], newKey, res);
        } else if (obj[key] !== null && obj[key] !== undefined) {
          res[newKey] = obj[key];
        }
      }
    }
    return res;
  };

  const patchFormValue = () => {
    if (productDetails && !isLoading && state?.uuid) {
      if (productDetails.others && typeof productDetails.others == "string") {
        productDetails.others = JSON.parse(productDetails.others);
      }
      const flattenedDetails = flattenObject(productDetails);
      Object.keys(flattenedDetails).forEach((key) => {
        setValue(key, flattenedDetails[key]);
      });

      setValue("more_product_images", productDetails.images);
    }
  };

  const handleSuccess = (data) => {
    const status = data?.status;
    const responseData = data?.data;
    setIsProductAdding(false);
    if (status !== 200) {
      return;
    }
    queryClient.invalidateQueries("productDetailsById")
    showSuccessToast(`Product ${productId == PRODUCT_CONST.ADD_NEW ? "added" : "updated"} successfully!`);
    navigate(`/products`);
  };

  const addProductRequest = useMutationData(addProduct, (data) => {
    handleSuccess(data);
  });

  const updateProductRequest = useMutationData(updateProduct, (data) => {
    handleSuccess(data);
  });

  async function onSubmit(values) {
    let payload = {
      type: "image",
      data: {},
    };
    setIsProductAdding(true);

    if (typeof watch("product_image") != "string") {
      payload.data["product_image"] = getFileType(watch("product_image"));
    }
    if (typeof watch("product_more_info_image") != "string") {
      payload.data["product_more_info_image"] = getFileType(watch("product_more_info_image"));
    }

    // if (watch("product_promo_image") && typeof watch("product_more_info_image") != "string") {
    //   payload.data["product_promo_image"] = getFileType(watch("product_promo_image"));
    // }
    if (watch("product_promo_image") != "string") {
      payload.data["product_promo_image"] = getFileType(watch("product_promo_image"));
    }

    if (watch("more_product_images").length != 0) {
      watch("more_product_images").forEach((el, i) => {
        // console.log("typeof (el)", el.type);
        if (el.type) {
          payload.data[`more_product_images_${i + 1}`] = getFileType(el);
        }
      });
    }

    if (Object.keys(payload.data).length !== 0) {
      wasabiUrlMuation.mutate(payload);
      return;
    }

    if (productDetails) {
      values.product_category = values.product_category.map((el) => el.value).join(",");
      values.product_age_verify_required = values.product_age_verify_required ? 1 : 0;
      values = { uuid: productDetails.uuid, ...values };
      updateProductRequest.mutate(values);
    }
  }

  const getFileType = (file) => {
    let fileType = file.type;
    if (fileType) {
      return fileType.replace("image/", "");
    }
    return "jpg";
  };

  const { isLoading: isCategoryListLoading, data: allProductCatgoryList } = useQuery({
    queryKey: ["productCategoryList", watch("client_id")],
    queryFn: () => productCategoreyList({ cid: watch("client_id") }),
    select: (data) => {
      return data.data.data;
    },
  });

  useEffect(() => {
    setCategoreyValue();
  }, [productDetails, allProductCatgoryList]);

  const setCategoreyValue = () => {
    if (productDetails && productDetails.assigned_categories && productDetails.assigned_categories.length != 0 && allProductCatgoryList) {
      let selectedCategoreyArr = [];

      productDetails.assigned_categories.forEach((el1) => {
        let index = allProductCatgoryList.findIndex((el2) => el2.category_id == el1.category_id);
        if (index != -1) {
          selectedCategoreyArr.push({
            label: allProductCatgoryList[index].category_name,
            value: allProductCatgoryList[index].category_id,
          });
        }
      });
      setValue("product_category", selectedCategoreyArr);
    }
  };

  const getErrors = (tab) => {
    const keysArray = Object.keys(errors);
    if (VALIDATED_FORM_CONTROLS[tab]) {
      const hasCommonElement = VALIDATED_FORM_CONTROLS[tab].some((item) => keysArray.includes(item));
      return hasCommonElement;
    }
    return false;
  };

  const backToProducts = () => {
    navigate(`/products`);
  };

  return (
    <>
      {!isMobile && (
        <div className="w--full d--flex flex--column gap--md stockProductPage  h--full">
          {isProductAdding && <FullScreenLoader />}

          <div className="w--full">
            <div className="d--flex justify-content--between align-items--center h-min--36">
              <div className="w-max--400 w--full position--relative">
                <div className="font--lg font--900 d--flex align-items--center gap--sm">
                  <div className="d--flex c--pointer" onClick={() => backToProducts()}>
                    <ArrowLongLeftIcon />
                  </div>
                  {productDetails ? productDetails.product_name : "Add new product"}
                </div>
              </div>
            </div>
          </div>
          <div className="d--flex bg--white radius--md gap--md  p-l--lg p-r--lg h-min--36 align-items--center ">
            {TABS_LIST.filter(tab => !(tab.name === "Surcharges" && client_id !== -1))
              .map((tab) => (
                <div 
                  className={`d--flex gap--sm font--sm font--600 border-bottom--${tab.value == pageType ? "orange" : "transparent"} border-width--2 h-min--36 d--flex align-items--center justify-content--center w-min--100 w--full c--pointer`} 
                  onClick={() => navigate(`/products/${productId}/${tab.value}`, { state })} 
                  key={tab.id}
                >
                  {tab.name}
                  {getErrors(tab.value) && (
                    <div className="text--red d--flex c--pointer">
                      <InfoIcon width={15} />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <form className="w--full">
            <ActiveComponent
              {...{
                control,
                errors,
                isEditable: productId == PRODUCT_CONST.ADD_NEW,
                onSubmit: () => handleSubmit(onSubmit)(),
                setValue,
                watch,
                userState,
                productDetails: productDetails || null,
                onCancel: () => backToProducts(),
                allProductCatgoryList,
                isCategoryListLoading,
              }}
            />
          </form>
        </div>
       )}

      {isMobile && (
        <div className="w--full d--flex flex--column gap--md stockProductPage h--full">
          {isProductAdding && <FullScreenLoader />}
    
          <div className="w--full">
            <div className="d--flex justify-content--between align-items--center h-min--36">
              <div className="w-max--400 w--full position--relative">
                <div className="font--lg font--900 d--flex align-items--center gap--sm">
                  <div className="d--flex c--pointer" onClick={() => backToProducts()}>
                    <ArrowLongLeftIcon />
                  </div>
                  {productDetails ? productDetails.product_name : "Add new product"}
                </div>
              </div>
            </div>
          </div>
    
          {/* Accordion implementation */}
          <Accordion activeKey={pagetype} defaultActiveKey="1">
            {TABS_LIST.filter((tab) => !(tab.name === "Surcharges" && client_id !== -1)).map((tab) => (
              <Accordion.Item eventKey={tab.id.toString()} key={tab.id}>
                <Accordion.Header   onClick={() => navigate(`/products/${productId}/${tab.value}`, { state })}> 
                  <div
                    className={`d--flex gap--sm font--sm font--800 align-items--center justify-content--start w-min--100 w--full c--pointer ${tab.value === pageType ? "border-bottom--transparent" : "border-bottom--transparent"}`}
                    onClick={() => navigate(`/products/${productId}/${tab.value}`, { state })}
                  >
                    {tab.name}
                    {getErrors(tab.value) && (
                      <div className="text--red d--flex c--pointer">
                        <InfoIcon width={15}  />
                      </div>
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  {/* Content for each tab */}
                  <form className="w--full">
                    <ActiveComponent
                      {...{
                        control,
                        errors,
                        isEditable: productId === PRODUCT_CONST.ADD_NEW,
                        onSubmit: () => handleSubmit(onSubmit)(),
                        setValue,
                        watch,
                        userState,
                        productDetails: productDetails || null,
                        onCancel: () => backToProducts(),
                        allProductCatgoryList,
                        isCategoryListLoading,
                      }}
                    />
                  </form>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      )}
    </>

  );
}
