import { apiClient } from "../../Helpers/axios";
import { ROUTES } from "./routes";

export const machinesList = (data) => {
    return apiClient({
        method: ROUTES.MACHINES_LIST.METHOD,
        url: ROUTES.MACHINES_LIST.URL,
        data
    });
};

export const addMachine = (data) => {
    return apiClient({
        method: ROUTES.ADD_MACHINE.METHOD,
        url: ROUTES.ADD_MACHINE.URL,
        data,
    });
};

export const updateMachine = (data) => {
    return apiClient({
        method: ROUTES.UPDATE_MACHINE.METHOD,
        url: ROUTES.UPDATE_MACHINE.URL,
        data,
    });
};

export const editMachine = (data) => {
    return apiClient({
        method: ROUTES.EDIT_MACHINE.METHOD,
        url: ROUTES.EDIT_MACHINE.URL,
        data,
    });
};

export const deleteMachine = (data) => {
    return apiClient({
        method: ROUTES.DELETE_MACHINE.METHOD,
        url: `${ROUTES.DELETE_MACHINE.URL}${data}`,
    });
};

export const deletePlanogram = (data) => {
    return apiClient({
        method: ROUTES.DELETE_PLANOGRAM.METHOD,
        url: ROUTES.DELETE_PLANOGRAM.URL,
        data
    });
};
 
export const planogramProducts = ({ machine_id = 10 } = {}) => {
    return apiClient({
        method: ROUTES.PLANOGRAM_PRODUCTS.METHOD,
        url: ROUTES.PLANOGRAM_PRODUCTS.URL,
        params: { machine_id: machine_id },
    });
};

export const uploadPlanogram = (data) => {
    return apiClient({
        headers: { 'Content-Type': 'multipart/form-data' },
        method: ROUTES.UPLOAD_PLANOGRAM.METHOD,
        url: ROUTES.UPLOAD_PLANOGRAM.URL,
        data
    });
};


export const exportPlanogram = (data) => {
    return apiClient({
        method: ROUTES.EXPORT_PLANOGRAM.METHOD,
        url: ROUTES.EXPORT_PLANOGRAM.URL,
        data
    });
};
 
export const planogramReset = (data) => {
    return apiClient({
        method: ROUTES.PLANOGRAM_RESET.METHOD,
        url: ROUTES.PLANOGRAM_RESET.URL,
        data
    });
}

export const cloneMachine = (data) => {
    return apiClient({
        method: ROUTES.CLONE_MACHINE.METHOD,
        url: ROUTES.CLONE_MACHINE.URL,
        data
    });
}

export const machineInfo = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_INFO.METHOD,
        url: ROUTES.MACHINE_INFO.URL,
        data,
    });
};

export const machineUsername = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_USERNAME.METHOD,
        url: ROUTES.MACHINE_USERNAME.URL,
        data,
    });
};


export const mahcineProductInformation = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_PRODUCT_INFO.METHOD,
        url: ROUTES.MACHINE_PRODUCT_INFO.URL,
        params: data
    });
};

export const machineConfiguration = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_CONFIGURE.METHOD,
        url: ROUTES.MACHINE_CONFIGURE.URL,
        data,
    });
};




export const planogramListingMobile = (data, fetchForInnerList) => {
    return apiClient({
        method: ROUTES.PLANOGRAM_LIST.METHOD,
        url: fetchForInnerList ? ROUTES.PLANOGRAM_LIST_NESTED.URL : ROUTES.PLANOGRAM_LIST.URL,
        data,
    });
};


// machine surcharges 

export const machineSurcharges = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_SURCHARGE_INFO.METHOD,
        url: ROUTES.MACHINE_SURCHARGE_INFO.URL,
        data,
    });
}


export const machineSaveSurcharges = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_SAVE_SURCHARGE.METHOD,
        url: ROUTES.MACHINE_SAVE_SURCHARGE.URL,
        data,
    });
}

 
// machine planogram

export const machinePlanogram = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_PLANOGRAM.METHOD,
        url: ROUTES.MACHINE_PLANOGRAM.URL,
        data,
    });
}


// fetch asile data 

export const fetchAisleData = (data) => {
    return apiClient({
        method: ROUTES.FETCH_ASILE_DATA.METHOD,
        url: ROUTES.FETCH_ASILE_DATA.URL,
        data,
    });
}

// fetch product data

export const fetchProductData = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_PRODUCT_DATA.METHOD,
        url: ROUTES.MACHINE_PRODUCT_DATA.URL,
        data,
    });
}
 
// reset planogram

export const resetPlanogram = (data) => {
    return apiClient({
        method: ROUTES.RESET_PLANOGRAM.METHOD,
        url: ROUTES.RESET_PLANOGRAM.URL,
        data,
    });
}

// Update Planogram 

export const updatePlanogram = (data) => {
    return apiClient({
        method: ROUTES.UPDATE_PLANOGRAM.METHOD,
        url: ROUTES.UPDATE_PLANOGRAM.URL,
        data,
    });
}

// Categories Data

export const categoriesData = (data) => {
    return apiClient({
        method: ROUTES.MACHINE_CATEGORIES_DATA.METHOD,
        url: ROUTES.MACHINE_CATEGORIES_DATA.URL,
        data,
    });
}


