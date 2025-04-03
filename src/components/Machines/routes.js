export const ROUTES = {
    MACHINES_LIST: {
        METHOD: "POST",
        URL: "v1/machine/list",
    },
    ADD_MACHINE: {
        METHOD: "POST",
        URL: "v1/machine/create",
    },
    UPDATE_MACHINE: {
        METHOD: "POST",
        URL: "v1/machine/update",
    },
    DELETE_MACHINE: {
        METHOD: "DELETE",
        URL: "v1/machine/delete/",
    },

    DELETE_PLANOGRAM: {
        METHOD: "POST",
        URL: "v1/planogram/delete/",
    },


    MACHINE_PRODUCT_INFO: {
        METHOD: "GET",
        URL: "v1/machine/product/info",
    },


    PLANOGRAM_PRODUCTS: {
        METHOD: "GET",
        URL: "v1/machine/products/list",
    },

    MACHINE_CONFIGURE: {
        METHOD: "POST",
        URL: "v1/machine/configuration",
    },

    UPLOAD_PLANOGRAM: {
        METHOD: "POST",
        URL: "v1/planogram/upload",
    },

    EXPORT_PLANOGRAM: {
        METHOD: "POST",
        URL: "v1/planogram/export",
    },

    PLANOGRAM_RESET: {
        METHOD: "POST",
        URL: "v1/planogram/reset",
    },
 
    CLONE_MACHINE: {
        METHOD: "POST",
        URL: "v1/machine/clone",
    },

    MACHINE_INFO: {
        METHOD: "POST",
        URL: "v1/machine/info",
    },

    MACHINE_USERNAME: {
        METHOD: "POST",
        URL: "v1/user/available/list",
    },
    PLANOGRAM_LIST: {
        METHOD: "POST",
        URL: "v1/planogram/mobile/list"
    },
    PLANOGRAM_LIST_NESTED: {
        METHOD: "POST",
        URL: "v1/planogram/mobile/list/data"
    },

    MACHINE_SURCHARGE_INFO: {
        METHOD: "POST",
        URL: "v1/machine/info-surcharges",
    },

    MACHINE_SAVE_SURCHARGE: {
        METHOD: "POST",
        URL: "v1/machine/save-surcharges",
    },

    MACHINE_PLANOGRAM: {
        METHOD: "POST",
        URL: "v1/planogram/planogram-list",
    },

    FETCH_ASILE_DATA:{
        METHOD: "POST",
        URL: "v1/machine/product-mapped/info",
    },

    MACHINE_PRODUCT_DATA:{
        METHOD: "POST",
        URL: "v1/client/product-list",
    },

    MACHINE_CATEGORIES_DATA:{
        METHOD: "POST",
        URL: "v1/client/category-list",
    },

    RESET_PLANOGRAM:{
        METHOD: "POST",
        URL: "v1/planogram/reset-planogram",
    },

    UPDATE_PLANOGRAM:{
        METHOD: "POST",
        URL: "v1/planogram/update-planogram-products",
    },
};

  