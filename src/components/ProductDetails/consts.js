export const DETAIL_TABS_CONST = {
  PRODUCT_DETAILS: "details",
  PRICING: "pricing",
  Surcharges: "surcharges",
  MORE_DETAILS: "more-details",
  LIMIT_ACCESS: "limit-access",
  CONTENT: "content",
  IMAGES: "images",
  INFORMATION: "information"
};
  
export const PRODUCT_CONST = {
  ADD_NEW: "add-new",
  EDIT_PRODUCT: "edit-product"
}

export const TABS_LIST = [
  {
    id: 1,
    name: "Details",
    value: DETAIL_TABS_CONST.PRODUCT_DETAILS
  },
  {
    id: 2,
    name: "Information",
    value: DETAIL_TABS_CONST.INFORMATION
  },
  {
    id: 3,
    name: "Pricing",
    value: DETAIL_TABS_CONST.PRICING
  },
  {
    id: 8,
    name: "Surcharges",
    value: DETAIL_TABS_CONST.Surcharges
  },
  {
    id: 4,
    name: "More Details",
    value: DETAIL_TABS_CONST.MORE_DETAILS
  },
  {
    id: 5,
    name: "Limit Access",
    value: DETAIL_TABS_CONST.LIMIT_ACCESS
  },
  {
    id: 6,
    name: "Content",
    value: DETAIL_TABS_CONST.CONTENT
  },
  {
    id: 7,
    name: "Images",
    value: DETAIL_TABS_CONST.IMAGES
  },
]

export const VALIDATED_FORM_CONTROLS = {
  details: ['product_id', 'product_name', 'client_id'],
  pricing: ['product_price', 'discount_price'],
  "more-details": ['product_description'],
  images: ['product_image', 'product_more_info_image'],
  surcharges: ['surcharge_fees']
};

export const PRODUCT_SIZE_UNIT_LIST = [
  {
    uuid: "1",
    name: "ml",
    value: "ml",
    type: "string",
  },
  {
    uuid: "2",
    name: "gm",
    value: "gm",
    type: "string",
  },
  {
    uuid: "3",
    name: "oz",
    value: "oz",
    type: "string",
  },
  {
    uuid: "4",
    name: "lbs",
    value: "lbs",
    type: "string",
  },
]
export const PRODUCT_SPACE_METHOD_LIST = [
  {
    uuid: "1",
    name: "Asile by Asile",
    value: "aisle_by_aisle",
  },
  {
    uuid: "2",
    name: "All by Asile",
    value: "all_aisle",
  }

]

export const PRODUCT_SPACE_SLAES_START_LIST = [
  {
    uuid: "1",
    name: "Bottom Center",
    value: "bottom_center",
  },
  {
    uuid: "2",
    name: "Bottom Left",
    value: "bottom_left",
  },
  {
    uuid: "3",
    name: "Bottom Right",
    value: "bottom_right",
  },
  {
    uuid: "4",
    name: "Top Left",
    value: "top_left",
  },
  {
    uuid: "5",
    name: "Top right",
    value: "top_right",
  },
  {
    uuid: "6",
    name: "Custom Start",
    value: "custom_start",
  },

]


export const AGE_VERIFICATION_TYPE_LIST = [
  { uuid: 1, value: "A", name: "Age Verification" },
  { uuid: 2, value: "Y", name: "Yoti" },
]


export const createFormData = (data) => {
  const formData = new FormData();

  const appendFormData = (key, value) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {

          formData.append(`${key}[${index}]`, item);
        } else {

          appendFormData(`${key}[${index}]`, item);
        }
      });
    } else if (value instanceof File) {


      formData.append(key, value);
    } else if (value && typeof value === 'object' && !(value instanceof Date)) {

      Object.keys(value).forEach(subKey => {
        appendFormData(`${key}.${subKey}`, value[subKey]);
      });
    } else {
      formData.append(key, value);
    }
  };

  Object.keys(data).forEach(key => {
    appendFormData(key, data[key]);
  });


  return formData;
};

export const PRODUCT_FILE_TYPES = {
  PRODUCT_IMAGE: "product_image",
  PRODUCT_MORE_INFO: "product_more_info_image",
  PROMOTIONAL_IMAGE: "product_promo_image",
  MORE_PRODUCT_IMAGES: "more_product_images"
}

export const PRODUCT_ADD_DATA = {
  // product_promo_image: "",
  // product_batch_no: "",
  // product_batch_expiry_date: "",
  // product_grading_no: "",
  // product_sku: "",
  // product_classification_no: "",
  // product_caption: "",
  // vend_quantity: "",
  // product_status: "",
  // product_discount_code: "",
  // promo_text: "",
  // product_size_amount: "",
  // product_size_unit: "",
  // product_sku: "string",
  // upload_more_products: [],
  others: {
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

}

export const productMoreDetails = {
  product_description: "",
  more_info_text: "",
  promo_text: ""
};

export const ProductDetails = {
  product_name: "",
  product_category: [],
  selectedProductNo: 0,
  product_id: "",
  product_description: "",
  client_id: "",
  product_batch_no: "",
  product_batch_expiry_date: "",
  product_grading_no: "",
  product_sku: "",
  product_caption: "",
  Product_classification_no: "",
  product_status: { status: "active", value: 1 }

};
export const productPricing = {
  product_price: "",
  discount_price: 0,
  product_discount_code: "",
  bundle_price: 0,
}

export const productImages = {
  product_image: "",
  product_more_info_image: "",
  product_promo_image: "",
  more_product_images: [],
}

export const ageDataObject = {
  age: "",
  product_age_verify_required: false,
  product_age_verify_minimum: "55",
  verification_method: ""
}

export const informationData = {
  product_size: 60,
  product_max_qty: 100,
  product_aisle_actual: 4,
  machine_total_same_item_qty: 50,
  product_s2s_sequences: 102955,
  product_space_to_sales_method: "",
  product_space_to_sales_start: "",
  product_space_to_sales: "",
  tax_codes_tax: "TX12345",
  tax_codes_states: "kfs444",
  tax_codes_country: "fasdfasdf"
};

export const Surcharges = {
  surcharge_fees: []
};





