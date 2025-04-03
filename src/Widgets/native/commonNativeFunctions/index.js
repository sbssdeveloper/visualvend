import RNFetchBlob from "rn-fetch-blob";
import { Buffer } from 'buffer'
import { uploadFile } from "../../../components/ProductDetails/action";
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { showToaster } from "../commonFunction";
import { columnWidhth } from "../../../components/Machines/constants";

export const getRouteNameByIndex = (index) => {
  const routes = {
    0: 'Insights',
    1: 'Products',
    2: 'Machines',
    3: 'Payments',
    4: 'Stock',
    5: 'Reports',
    6: 'Alerts',
    7: 'Operations',
    8: 'Marketing',
    9: 'Vend Run',
    10: 'Assets',
    11: 'Setup',
    12: 'Logout',
  };
  return routes[index] || null;
};

export const mapArrayUsingObject = (arr, obj) => {
  if (!Array.isArray(arr) || !arr.length) {
    return [];
  }
  if (typeof obj !== 'object' || obj === null) {
    return arr;
  }
  return arr.map(item => {
    let newItem = {};
    for (let key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        newItem[key] = item?.[obj[key]] ?? null;
      }
    }
    return newItem;
  });
};


export const generateRandomString = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const handleValues = (key, text, setValues, values, valueType = "float") => {
  const regex = valueType === "integer" ? /^\d*$/ : /^\d*\.?\d*$/;

  // Check if the input is either a valid number or an empty string (to handle clearing)
  if (regex?.test(text) || text === '') {
    // Update the values using setValues
    setValues({
      ...values,
      [key]: text === '' ? '' : text  // Ensure that clearing sets the value to an empty string
    });
  }
};


export const checkRequiredFields = (data) => {
  const requiredFields = [
    "product_name",
    "product_id",
    "product_description",
    // "client_id",
    "product_price",
    // "discount_price",
    // "more_info_text",
    // "product_age_verify_minimum",
    // "verification_method",
    // "product_age_verify_required",
    // "bundle_price",
    // 'product_category',
    "product_image",
    // "product_more_info_image"


  ];

  for (const field of requiredFields) {
    if (!isFieldFilled(data[field])) {
      return { success: false, missingField: `${field} is missing` };
    }
  }
  return { success: true };
};

export const getExtension = (mimeType) => mimeType.split('/')[1];
export const covertIntoBuffer = async (uri) => {
  try {
    const base64Data = await RNFetchBlob.fs.readFile(uri, 'base64');
    return Buffer.from(base64Data, 'base64');

  } catch (error) {
    console.error('Error processing URI:', uri, error);
    throw error; // re-throw the error to handle it in the calling function if needed
  }
};

export const imagesArray = async (array) => {

  try {
    const promises = array?.map(uri => covertIntoBuffer(uri?.fileSource?.path));
    const buffers = await Promise.all(promises);
    return buffers;
  } catch (error) {
    console.error('Error processing image URIs:', error);
    throw error; // re-throw the error to handle it in the calling function if needed
  }
};

export const buildDataObject = (first, second, third, moreImagesArray = []) => {

  const result = {};

  const addKeyIfValid = (key, value) => {
    if (value) {
      result[key] = getExtension(value?.mime || "image/jpg");
    }
  };

  // Adding the first three images
  addKeyIfValid('product_image', first);
  addKeyIfValid('product_more_info_image', second);
  addKeyIfValid('product_image_thumbnail', third);
  moreImagesArray?.forEach((image, index) => {
    addKeyIfValid(`more_product_images_${index + 1}`, image?.url);
  });

  return { length: Object.keys(result)?.length, selectedImagesKeys: result };
};


export const isFieldFilled = (field) => field !== "" && field !== null && field !== undefined;

export const uploadOnWasabi = async (item) => {
  try {
    const payload = {
      uri: item.uri,
      file: item.file,
    };
    const success = await uploadFile(payload);
    return { wasabiuri: item?.wasabiuri, success };
  } catch (error) {
    console.error('Error processing Wasabi URL:', item.wasabiuri, error);
    throw error;
  }
};


const statusMapping = {
  "0": { status: "INPROGRESS", color: "#f1c40f" },
  "1": { status: "INPROGRESS", color: "#f1c40f" },
  "2": { status: "SUCCESS", color: "#19b067" },
  "3": { status: "SERIAL_ERROR", color: "#DC405C" },
  "4": { status: "AISLE_ERROR", color: "#DC405C" },
  "5": { status: "MOTOR_ERROR", color: "#DC405C" },
  "6": { status: "OUT_OF_STOCK", color: "#f1c40f" },
  "7": { status: "INPROGRESS", color: "#f1c40f" },
  "8": { status: "DROP_ERROR", color: "#DC405C" },
  "11": { status: "INPROGRESS", color: "#f1c40f" },
  "22": { status: "MAXIMUM", color: "#f1c40f" },
  "00": { status: "CANCEL", color: "#DC405C" },
  "22": { status: "PAYMENT_ERROR", color: "#DC405C" },
};

export const getStatusDetails = (status) => {

  return statusMapping[status] || {}
};


export const isValidData = (data) => {
  if (data === undefined || data === null) return false;
  if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data)?.length === 0) return false;
  if (Array.isArray(data) && data?.length === 0) return false;
  if (typeof data === 'string' && data?.trim() === '') return false;
  return true;
};

export const createAndDownloadExcelFile = async (excelData = []) => {
  try {
    if (excelData?.length === 0) return
    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = columnWidhth;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    const buffer = new ArrayBuffer(wbout?.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i !== wbout.length; ++i) { view[i] = wbout.charCodeAt(i) & 0xFF }
    const base64 = Buffer.from(view).toString('base64');
    const folderPath = `${RNFS.DownloadDirectoryPath}/QuizeepayExcels`;
    const folderExists = await RNFS.exists(folderPath);
    if (!folderExists) {
      await RNFS.mkdir(folderPath);
    }
    const filePath = `${folderPath}/${generateRandomString()}.xlsx`;
    await RNFS.writeFile(filePath, base64, 'base64');
    showToaster("success", 'Download Complete : Saved Into Downloads');
  } catch (error) {
    console.error('Download error:', error);
    showToaster("error", "Error', 'Failed to download file");
  }
}













