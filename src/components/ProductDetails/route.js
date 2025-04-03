export const PRODUCT_API_ROUTES = {
  ADD_PRODUCT: {
    METHOD: "POST",
    URL: "v1/product/create",
  },
  UPDATE_PRODUCT: {
    METHOD: "POST",
    URL: "v1/product/update",
  },
  PRODUCT_CATEGOREY_LIST: {
    METHOD: "GET",
    URL: "v1/category/list",
  },
  CLIENT_LIST: {
    METHOD: "GET",
    URL: "v1/client/list",
  },
  PRODUCT_IMAGE_UPDATE: {
    METHOD: "POST",
    URL: "v1/product/upload/image",
  },
  PRODUCT_INFO_BY_ID: {
    METHOD: "POST",
    URL: "v1/product/info",
  },
  GETBUKET_URL: {
    METHOD: "POST",
    URL: "s3/preassigned/multiple/url"
  },
  GETBUKET_URI: {
    METHOD: "POST",
    URL: "s3/preassigned/url"
  }, 

};

