import React, { useEffect, useState,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { fetchAisleData, fetchProductData, categoriesData, updatePlanogram,machinePlanogram } from "../../actions";
import { showSuccessToast } from "../../../../Helpers/web/toastr"; 
import * as yup from "yup"; // Import yup for validations
import { useMediaQuery } from 'react-responsive';
import useIcons from "../../../../Assets/web/icons/useIcons";
export default function EditPlanogram() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [AsileData, setAsileData] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [spaceToSalesSequence, setSpaceToSalesSequence] = useState('');
  const [sequenceAisles, setSequenceAisles] = useState('');
  const [customSequence, setCustomSequence] = useState('');
  const [mappedAisles, setMappedAisles] = useState({});
  const [productSaleSequence, setProductSaleSequence] = useState("");
  const [showCustomSequenceInput, setShowCustomSequenceInput] = useState(false);
  const [baseSequence, setBaseSequence] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [errors, setErrors] = useState({}); // State to track validation errors
  const [showErrorMessage, setShowErrorMessage] = useState(false); // State to show error message
  const [currentS2SType, setCurrentS2SType] = useState(""); // State to maintain current s2s type
  const [maxQuantities, setMaxQuantities] = useState({}); // State to maintain max quantities for aisles
  const [planogramData, setPlanogramData] = useState([]);

  console.log(maxQuantities);

  const id = location.state?.id;
  const product_map_id = location.state?.id;
  const client_id = location.state?.client_id;
  const machine_id = location.state?.machine_id;
  const aisleNumber = location.state?.aisleNumber;

  console.log(product_map_id);

  const validationSchema = yup.object().shape({
    product_quantity: yup
      .number()
      .required("Product Quantity is required")
      .positive("Product Quantity must be a positive number"),
    product_max_quantity: yup
      .number()
      .required("Product Capacity is required")
      .positive("Product Capacity must be a positive number"),
    product_id: yup.string().required("Product is required"),
  });
  
    const {
      ArrowLongLeftIcon,
    } = useIcons();


    const [isDropdownQuantity, setIsDropdownQuantity] = useState(false);
    const [isDropdownMaxQuantity, setIsDropdownMaxQuantity] = useState(false);
  
  const productQuantityRef = useRef(null);
   const productMaxQuantityRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState(AsileData?.product_quantity || "");

    useEffect(() => {
      const fetchPlanogramData = async () => {
        setIsLoading(true); // Show spinner
        var formData = new FormData();
        formData.append("machine_id", machine_id);
        formData.append("type", "planogram");
        const response = await machinePlanogram(formData); 
        if (response && response.data) {
          const { data, machine } = response.data;
          setPlanogramData(data); // Set product data
        }
        setIsLoading(false); // Hide spinner
      };
  
      if (machine_id) {
        fetchPlanogramData();
      }
    }, [machine_id]);
  


  useEffect(() => {
    const AsileData = async () => {
      var formData = new FormData();
      formData.append("product_map_id", id ? id : "");
      formData.append("client_id", client_id);
      formData.append("machine_id", machine_id);
      const response = await fetchAisleData(formData);
      if (response && response?.data) {
        const data = response?.data?.data;
        setAsileData(data);
      }
    };

    const fetchProductsAndCategories = async () => {
      setIsLoading(true); // Start loading
      try {
        var formData = new FormData();
        formData.append("client_id", client_id);
        formData.append("machine_id", machine_id);

        const productResponse = await fetchProductData(formData);
        if (productResponse && productResponse?.data) {
          const combinedProducts = [
            ...(productResponse?.data?.products || []),
            ...(productResponse?.data?.products_unassigned || []),
          ];
          setProducts(combinedProducts);
          setMappedAisles(productResponse?.data?.mapped_aisles || {});
        }

        formData = new FormData();
        formData.append("client_id", client_id);
        const categoryResponse = await categoriesData(formData);
        if (categoryResponse && categoryResponse?.data?.category) {
          setCategories(categoryResponse?.data?.category);
        }
      } catch (error) {
        console.error("Error fetching products or categories:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    if (client_id) {
      AsileData();
      fetchProductsAndCategories();
    }
  }, [client_id, id]);

  useEffect(() => {
    if (AsileData?.product_location?.product_id && mappedAisles) {
      const aisles = mappedAisles[AsileData?.product_location?.product_id] || [];
      const normalizedAisles = aisles.map((aisle) => parseInt(aisle, 10));
      const currentAisleNormalized = parseInt(aisleNumber, 10);

      if (!normalizedAisles.includes(currentAisleNormalized)) {
        normalizedAisles.push(currentAisleNormalized);
        normalizedAisles.sort((a, b) => a - b);
      }

      const updatedAisles = normalizedAisles.map((aisle) => aisle.toString().padStart(2, "0"));
      setBaseSequence(updatedAisles);
      setProductSaleSequence(updatedAisles.join(","));
    }
    generateSpaceToSalesSequence(currentS2SType);
  }, [AsileData?.product_location?.product_id, mappedAisles, aisleNumber]);

  useEffect(() => {
    const defaultS2SType = "all_aisle_then_next_aisle";
    const s2sType = AsileData?.product_location?.s2s_type || defaultS2SType;
    setSpaceToSalesSequence(s2sType);
    setCurrentS2SType(s2sType); // Set the current s2s type in state
    if(s2sType=="custom_sequence"){
      if (AsileData?.product_location?.s2s) {
        setProductSaleSequence(AsileData.product_location.s2s); // Show existing s2s value
      } else if (customSequence) {
        setProductSaleSequence(customSequence); // Show recently entered custom sequence
      } else {
        const generatedSequence = generateSpaceToSalesSequence(s2sType);
        const normalizedSequence = generatedSequence.split(",").map((aisle) => parseInt(aisle, 10));
        const currentAisleNormalized = parseInt(aisleNumber, 10);
  
        if (!normalizedSequence.includes(currentAisleNormalized)) {
          normalizedSequence.push(currentAisleNormalized);
          normalizedSequence.sort((a, b) => a - b);
        }
  
        const finalSequence = normalizedSequence.map((aisle) => aisle.toString().padStart(2, "00")).join(",");
        setProductSaleSequence(finalSequence); // Show framed sequence if s2s is not available
      }
    }else{
      const generatedSequence = generateSpaceToSalesSequence(s2sType);
      const normalizedSequence = generatedSequence.split(",").map((aisle) => parseInt(aisle, 10));
      const currentAisleNormalized = parseInt(aisleNumber, 10);

      if (!normalizedSequence.includes(currentAisleNormalized)) {
        normalizedSequence.push(currentAisleNormalized);
        normalizedSequence.sort((a, b) => a - b);
      }

      const finalSequence = normalizedSequence.map((aisle) => aisle.toString().padStart(2, "00")).join(",");
      setProductSaleSequence(finalSequence); // Show framed sequence if s2s is not available

    }    

  }, [AsileData?.product_location?.s2s, AsileData?.product_location?.s2s_type, baseSequence, aisleNumber]);

  useEffect(() => {
    if (AsileData?.product_max_quantity) {
      setMaxQuantities((prev) => ({
        ...prev,
        [aisleNumber]: parseInt(AsileData.product_max_quantity, 10), // Initialize max quantity for the current aisle
      }));
    }
  }, [AsileData?.product_max_quantity, aisleNumber]);

  useEffect(() => {
    if (planogramData.length > 0 && mappedAisles) {
      const initialMaxQuantities = {};




      // Iterate over mappedAisles to match product locations with planogramData
      Object.entries(mappedAisles).forEach(([productId, locations]) => {

        locations.forEach((location) => {
          const matchingProduct = planogramData.find(
            (product) => product.product_location === location
          );

          if (matchingProduct) {
            initialMaxQuantities[location] = matchingProduct.product_max_quantity;
          } else {
            initialMaxQuantities[location] = 1; // Default maxQuantity to 1 if no match
          }
        });
      });

      setMaxQuantities(initialMaxQuantities); // Initialize maxQuantities
    }
  }, [planogramData, mappedAisles]);

  useEffect(() => {
    if (Object.keys(maxQuantities).length > 0) {
      const transformedQuantities = Object.entries(maxQuantities).map(([location, maxQuantity]) => ({
        location: parseInt(location, 10), // Ensure location is a number
        maxQuantity,
      }));
    }
  }, [maxQuantities]);
  const handleClick = (e, field) => {
    // Get the bounding box of the element (ref.current is necessary to access the DOM element)
    const rect =
      field === "product_quantity"
        ? productQuantityRef.current.getBoundingClientRect()
        : productMaxQuantityRef.current.getBoundingClientRect();
  
    // Calculate the width of the field and offset for the arrows section (e.g., for number inputs, the arrow section)
    const fieldWidth = rect.width;
    const fieldLeft = rect.left;
  
    // Exclude the rightmost part (where the arrows would be in a number input or dropdown)
    const excludeArrowSectionWidth = 40; // Example: Assume the arrow button occupies 40px on the right side of the field
    const clickableWidth = fieldWidth - excludeArrowSectionWidth;
  
    // Get the position of the click
    const clickPosition = e.clientX - fieldLeft; // Position relative to the left edge of the input
  
    // Check if the click happens in the area excluding the arrow section
    if (clickPosition >= 0 && clickPosition <= clickableWidth) {
      // Toggle dropdown visibility based on which field was clicked
      if (field === "product_quantity") {
        setIsDropdownQuantity(true);
      } else {
        setIsDropdownMaxQuantity(true);
      }
    } else {
      // If the click happens near the arrow section, disable dropdown
      if (field === "product_quantity") {
        setIsDropdownQuantity(false);
      } else {
        setIsDropdownMaxQuantity(false);
      }
    }
  };
  
  const handleDropdownChange = (e) => {
    setSelectedValue(e.target.value);
    handleChange(e);
  };

  // Handle number input change
  const handleInputChange = (e) => {
    setSelectedValue(e.target.value);
    handleChange(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsileData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
        product_location: {
          ...prev.product_location,
          [name]: value, 
        },
      };

      // Clear the error for the field being updated
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));

      if (name === "product_id") {
        const aisles = mappedAisles[value] || [];
        setBaseSequence(aisles); 
        setProductSaleSequence(generateSpaceToSalesSequence(currentS2SType)); // Regenerate sequence based on current s2s type
      }

      if (name === "product_max_quantity") {
        const normalizedAisleNumber = aisleNumber.toString().padStart(2, "0"); // Normalize aisleNumber
        setMaxQuantities((prev) => ({
          ...prev,
          [aisleNumber]: parseInt(value, 10) || 1, // Update max quantity for the current aisle
          [normalizedAisleNumber]: parseInt(value, 10) || 1, // Ensure both formats are updated
        }));

        const updatedAisles = baseSequence.map((aisle) => ({
          location: aisle,
          maxQuantity: parseInt(value, 10) || 1,
        }));
        const repeatAisles = (aisles) =>
          aisles.flatMap((aisle) => Array(aisle.maxQuantity).fill(aisle.location)).join(",");
        setProductSaleSequence(repeatAisles(updatedAisles)); // Update sequence dynamically
      }

      return updatedData;
    });
  };

const handleSpaceToSalesSequenceChange = (e) => {
  const value = e.target.value.replace(/\s+/g, "_").toLowerCase();
  setSpaceToSalesSequence(value);
  setCurrentS2SType(value); // Update the current s2s type in state

  if (value === "custom_sequence") {
    // Prioritize showing the previously entered custom sequence
    if (customSequence) {
      setProductSaleSequence(customSequence); // Show previously entered custom sequence
    } else if (AsileData?.product_location?.s2s) {
      setProductSaleSequence(AsileData.product_location.s2s); // Show existing s2s value
      setCustomSequence(AsileData.product_location.s2s); // Persist the s2s value
    } else {
      setProductSaleSequence(baseSequence.join(",")); // Show generated sequence
      setCustomSequence(baseSequence.join(",")); // Persist the generated sequence
    }
    setShowCustomSequenceInput(true);
  } else {
    setProductSaleSequence(generateSpaceToSalesSequence(value)); // Show generated sequence for other types
    setShowCustomSequenceInput(false);
  }
};

const handleCustomSequenceChange = (e) => {
  setCustomSequence(e.target.value);
};

const handleCustomSequenceOk = () => {
  const customSequenceArray = customSequence
    .split(",")
    .map((item) => parseInt(item.trim(), 10))
    .filter((item) => !isNaN(item)); // Normalize and filter valid numbers

  const currentAisleNormalized = parseInt(aisleNumber, 10);

  if (!customSequenceArray.includes(currentAisleNormalized)) {
    customSequenceArray.push(currentAisleNormalized);
    customSequenceArray.sort((a, b) => a - b);
  }

  const updatedSequence = customSequenceArray.map((aisle) => aisle.toString().padStart(2, "0"));
  setProductSaleSequence(updatedSequence.join(",")); // Update s2s with the custom sequence
  setCustomSequence(updatedSequence.join(",")); // Persist the custom sequence
  setShowCustomSequenceInput(false);
};

const generateSpaceToSalesSequence = (sequenceType) => {

  console.log("aisles");
  
  if (sequenceType === "custom_sequence") {
    return productSaleSequence || baseSequence.join(",");
  }

  const aisles = baseSequence.map((aisle) => {
    const normalizedAisle = String(Number(aisle)); // Convert to a number first, then back to a string
    return {
      location: aisle,
      maxQuantity: maxQuantities[normalizedAisle] || 1,
    };
  });
  

  console.log(aisles);


  const repeatAisles = (aisles) => 
    aisles.flatMap(aisle => Array(Number(aisle.maxQuantity)).fill(aisle.location)).join(',');
  
  const rows = parseInt(AsileData?.machine?.machine_row, 10);
  const cols = parseInt(AsileData?.machine?.machine_column, 10);


  if (sequenceType === "space_to_sales_c2l2r") {
    let result = [];
    for (let row = 0; row < rows; row++) {
      let rowAisles = aisles.filter(aisle => Math.floor((aisle.location - 1) / cols) === row);
      if (rowAisles.length > 0) { // Check if rowAisles is not empty
        let center = Math.floor(rowAisles.length / 2);
        let right = center;
        let left = center - 1;
        while (left >= 0 || right < rowAisles.length) {
          if (right < rowAisles.length) {
            result.push(...Array(rowAisles[right].maxQuantity).fill(rowAisles[right].location));
            right++;
          }
          if (left >= 0) {
            result.push(...Array(rowAisles[left].maxQuantity).fill(rowAisles[left].location));
            left--;
          }
        }
      }
    }
    return result.join(',');
  } else if (sequenceType === "space_to_sales_c2r2l") {
    let result = [];
    for (let row = 0; row < rows; row++) {
      let rowAisles = aisles.filter(aisle => Math.floor((aisle.location - 1) / cols) === row);
      if (rowAisles.length > 0) { // Check if rowAisles is not empty
        let center = Math.floor(rowAisles.length / 2);
        let left = center;
        let right = center + 1;
        while (left >= 0 || right < rowAisles.length) {
          if (left >= 0) {
            result.push(...Array(rowAisles[left].maxQuantity).fill(rowAisles[left].location));
            left--;
          }
          if (right < rowAisles.length) {
            result.push(...Array(rowAisles[right].maxQuantity).fill(rowAisles[right].location));
            right++;
          }
        }
      }
    }
    return result.join(',');
  }

  if (sequenceType === "all_aisle_then_next_aisle") {
    return repeatAisles(aisles);
  } else if (sequenceType === "space_to_sales_l2r") {
    let result = [];
    let maxQuantity = Math.max(...aisles.map((aisle) => aisle.maxQuantity));
    for (let i = 0; i < maxQuantity; i++) {
      for (let j = 0; j < aisles.length; j++) {
        if (i < aisles[j].maxQuantity) {
          result.push(aisles[j].location);
        }
      }
    }
    return result.join(",");
  } else if (sequenceType === "space_to_sales_r2l") {
    let result = [];
    let maxQuantity = Math.max(...aisles.map((aisle) => aisle.maxQuantity));
    for (let i = 0; i < maxQuantity; i++) {
      for (let j = aisles.length - 1; j >= 0; j--) {
        if (i < aisles[j].maxQuantity) {
          result.push(aisles[j].location);
        }
      }
    }
    return result.join(",");
  }
  return repeatAisles(aisles);
};

const handleValidation = async (payload) => {
  try {
    if (payload.product_max_quantity <= payload.product_quantity) {
      throw new Error("Product Max Quantity must be greater than Product Quantity");
    }
    await validationSchema.validate(payload, { abortEarly: false });
    setErrors({});
    setShowErrorMessage(false);
    return true;
  } catch (err) {
    const validationErrors = {};
    if (err.message === "Product Max Quantity must be greater than Product Quantity") {
      validationErrors.product_max_quantity = true;
    } else {
      err.inner.forEach((error) => {
        validationErrors[error.path] = true; // Mark the field as invalid
      });
    }
    setErrors(validationErrors);
    setShowErrorMessage(true);
    return false;
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();


  // Set default s2s type if empty
  const s2sType = spaceToSalesSequence || "all_aisle_then_next_aisle";

  const payload = {
    id: id,
    client_id: client_id,
    machine_id: machine_id,
    category_id: AsileData?.product_location?.category_id,
    s2s: productSaleSequence,
    s2s_type: currentS2SType, // Use the current s2s type from state
    product_id: AsileData?.product_location?.product_id,
    product_location: aisleNumber,
    product_quantity: AsileData?.product_quantity,
    product_max_quantity: AsileData?.product_max_quantity,
  };

  const isValid = await handleValidation(payload);
  if (!isValid) return;

  try {
    const response = await updatePlanogram(payload);
    if (response?.data?.success === true) {
      showSuccessToast("Aisle updated successfully!");
      navigate(-1);
    } else {
      console.error("Failed to update planogram");
    }
  } catch (error) {
    console.error("Error updating planogram:", error);
  }
};

const getMaxQuantity = (aisleNumber) => {
  const normalizedAisleNumber = aisleNumber.toString().padStart(2, "0"); // Normalize to match keys with leading zeros
  return maxQuantities[aisleNumber] || maxQuantities[normalizedAisleNumber] || 0; // Check both formats
};

  return (
    <>
    {!isMobile && (
       <div className="w--full d--flex flex--column gap--md machineMainPage editPlanogramPage h--full">
       <div className="w--full">
         <div className="d--flex justify-content--between align-items--center h-min--36">
           <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900 d--flex align-items--center gap--lg">
           <div className="d--flex c--pointer" onClick={() => navigate(-1)}>
                <ArrowLongLeftIcon />
            </div>
             Edit Aisle
            </div>
           </div>
         </div> 
       </div>
       {isLoading ? ( // Show loading icon while fetching data
         <div className="bg-white d-flex justify-content-center align-items-center h-100">
           <div 
             className="spinner-border text--orange large-spinner" 
             role="status"
           >
             <span className="visually-hidden">Loading...</span>
           </div>
         </div>
 
       ) : (
         <form
           onSubmit={handleSubmit}
           className="w--full h--full d--flex flex--column justify-content--between gap--5xl bg--white p--md radius--md editPlanogramPageForm"
         >
           {showErrorMessage && (
             <div className="text-danger px-5 mb-3 fs-5">
               Please fill out the mandatory fields highlighted below.
               {errors.product_max_quantity && (
                 <div>Product Max Quantity must be greater than Product Quantity.</div>
               )}
             </div>
           )}
           <div className="d--flex gap--5xl w--full">
             <div className="w--full d--flex flex--column gap--xl p-5">
               <div className="w--full d--flex flex--column">
                 <Form.Group controlId="product_location">
                   <Form.Label>Aisle Number</Form.Label>
                   <Form.Control
                     type="text"
                     name="product_location"
                     defaultValue={aisleNumber}
                     disabled
                   />
                 </Form.Group>
               </div>
               <div className="w--full d--flex flex--column">
               <Form.Group controlId="product_quantity">
               <Form.Label>Product Quantity</Form.Label>
             
              {isDropdownQuantity  ? (
                // If it's a dropdown, render the select element
                <Form.Control
                  as="select"
                  ref={productQuantityRef}
                  name="product_quantity"
                  value={AsileData?.product_quantity || ""} // Use getMaxQuantity to get the value
                  onChange={handleDropdownChange}
                  onClick={(e) => handleClick(e, "product_quantity")}
                  className={errors.product_quantity ? "is-invalid" : ""}
                >
                  {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                // Otherwise, render a regular number input field
                <Form.Control
                  type="number"
                  ref={productQuantityRef}
                  name="product_quantity"
                  value={AsileData?.product_quantity || ""} // Use getMaxQuantity to get the value
                  onChange={handleInputChange}
                  onClick={(e) => handleClick(e, "product_quantity")}
                  className={errors.product_quantity ? "is-invalid" : ""}
                />
              )}
           
              
                 </Form.Group>
               </div>
               <div className="w--full d--flex flex--column">
                 <Form.Group controlId="product_max_quantity">
                   <Form.Label>Product Max Quantity</Form.Label>

                   {isDropdownMaxQuantity  ? (
                // If it's a dropdown, render the select element
                <Form.Control
                  as="select"
                  ref={productMaxQuantityRef}
                  name="product_max_quantity"
                  value={getMaxQuantity(aisleNumber)} // Use getMaxQuantity to get the value
                  onChange={handleDropdownChange}
                  onClick={(e) => handleClick(e, "product_max_quantity")}
                  className={errors.product_max_quantity ? "is-invalid" : ""}
                >
                  {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                // Otherwise, render a regular number input field
                <Form.Control
                  type="number"
                  ref={productMaxQuantityRef}
                  name="product_max_quantity"
                  value={getMaxQuantity(aisleNumber)}// Use getMaxQuantity to get the value
                  onChange={handleInputChange}
                  onClick={(e) => handleClick(e, "product_max_quantity")}
                  className={errors.product_max_quantity ? "is-invalid" : ""}
                />
              )}
                 </Form.Group>
               </div>
             </div>
             <div className="w--full d--flex flex--column gap--xl p-5">
               <div className="w--full d--flex flex--column">
                 <Form.Group controlId="product_id">
                   <Form.Label>Product</Form.Label>
                   <Form.Select
                     name="product_id"
                     value={AsileData?.product_location?.product_id || ""}
                     onChange={handleChange}
                     className={errors.product_id ? "is-invalid" : ""}
                   >
                     <option value="" disabled>Select a product</option>
                     {products.map((product) => (
                       <option key={product.product_id} value={product.product_id}>
                         {product.product_name}
                       </option>
                     ))}
                   </Form.Select>
                 </Form.Group>
               </div>
               {product_map_id && (categories.length) > 0 && (
                 <div className="w--full d--flex flex--column">
                   <Form.Group controlId="category_id">
                     <Form.Label>Category</Form.Label>
                     <Form.Select
                       name="category_id"
                       value={AsileData?.product_location?.category_id || ""}
                       onChange={handleChange}
                       disabled // Make category read-only
                     >
                       <option value="" disabled>Select a category</option>
                       {categories.map((category) => (
                         <option key={category.category_id} value={category.category_id}>
                           {category.category_name}
                         </option>
                       ))}
                     </Form.Select>
                   </Form.Group>
                 </div>
               )}
               {AsileData?.product_max_quantity && (
                 <div className="w--full d--flex flex--column">
                   <Form.Group controlId="space_to_sales_sequence">
                     {productSaleSequence &&(
                       <>
                         <Form.Label>Space to Sales Sequence</Form.Label>
                         <Form.Select
                           className="custom-dropdown"
                           aria-label="Select Space to Sales Sequence"
                           onChange={handleSpaceToSalesSequenceChange}
                           value={spaceToSalesSequence} // Update to use `value` instead of `defaultValue`
                         >
                           <option value="all_aisle_then_next_aisle">All Aisle then next aisle</option>
                           <option value="space_to_sales_l2r">Space to sales L2R</option>
                           <option value="space_to_sales_r2l">Space to sales R2L</option>
                           <option value="space_to_sales_c2r2l">Space to sales C2R2L</option>
                           <option value="space_to_sales_c2l2r">Space to sales C2L2R</option>
                           <option value="custom_sequence">Custom Sequence</option>
                         </Form.Select>
                       </>
                     )}
                     {spaceToSalesSequence === "custom_sequence" && showCustomSequenceInput && (
                       <div className="d-flex mt-2">
                         <Form.Control
                           type="text"
                           placeholder="Enter custom sequence"
                           defaultValue={productSaleSequence}
                           onChange={handleCustomSequenceChange}
                           className="me-2"
                         />
                         <Button variant="orange" onClick={handleCustomSequenceOk}>
                           OK
                         </Button>
                       </div>
                     )}
                     {!showCustomSequenceInput && productSaleSequence && (
                       <p className="mt-2 fw-bold bg-light text-dark text-break p-1 bg-secondary form-control" style={{ wordWrap: 'break-word' }}>
                         {productSaleSequence} {/* Dynamically updated sequence */}
                       </p>
                     )}
                   </Form.Group>
                 </div>
               )}
             </div>
           </div>
           <div className="w--full d--flex gap--sm justify-content--center p-b--sm">
             <button onClick={() => navigate(-1)} type="button" variant="white" color="black" className="btn border-full--black-200 w-min--200 w-max--200 btn-- bg--black text--white">
               Cancel
             </button>
             <button type="submit" variant="primary" color="white" className=" btn-- bg--orange text--white radius--sm btn  w-min--200 w-max--200">
               Submit
             </button>
           </div>
         </form>
       )}
     </div>
    )}
    {isMobile && (
       <div className="w--full d--flex flex--column gap--md machineMainPage editPlanogramPage h--full">
       <div className="w--full">
         <div className="d--flex justify-content--between align-items--center h-min--36">
           <div className="w-max--400 w--full position--relative">
           <div className="font--lg font--900 d--flex align-items--center gap--lg">
           <div className="d--flex c--pointer" onClick={() => navigate(-1)}>
                <ArrowLongLeftIcon />
            </div>
    
             Edit Aisle
            </div>
            
           </div>
         </div> 
       </div>
       {isLoading ? ( // Show loading icon while fetching data
         <div className="bg-white d-flex justify-content-center align-items-center h-100">
           <div 
             className="spinner-border text--orange large-spinner" 
             role="status"
           >
             <span className="visually-hidden">Loading...</span>
           </div>
         </div>
 
       ) : (
         <form
           onSubmit={handleSubmit}
           className="w--full h--full d--flex flex--column justify-content--between gap--5xl bg--white p--md radius--md editPlanogramPageForm"
         >
           {showErrorMessage && (
             <div className="text-danger px-5 mb-3 fs-5">
               Please fill out the mandatory fields highlighted below.
               {errors.product_max_quantity && (
                 <div>Product Max Quantity must be greater than Product Quantity.</div>
               )}
             </div>
           )}
           <div className=" gap--5xl w--full">
             <div className="w--full d--flex flex--column gap--xl p-5">
               <div className="w--full d--flex flex--column">
                 <Form.Group controlId="product_location">
                   <Form.Label>Aisle Number</Form.Label>
                   <Form.Control
                     type="text"
                     name="product_location"
                     defaultValue={aisleNumber}
                     disabled
                   />
                 </Form.Group>
               </div>
               <div className="w--full d--flex flex--column">
                 <Form.Group controlId="product_quantity">
                   <Form.Label>Product Quantity</Form.Label>
                   {isDropdownQuantity  ? (
                // If it's a dropdown, render the select element
                <Form.Control
                  as="select"
                  ref={productQuantityRef}
                  name="product_quantity"
                  value={AsileData?.product_quantity || ""} // Use getMaxQuantity to get the value
                  onChange={handleDropdownChange}
                  onClick={(e) => handleClick(e, "product_quantity")}
                  className={errors.product_quantity ? "is-invalid" : ""}
                >
                  {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                // Otherwise, render a regular number input field
                <Form.Control
                  type="number"
                  ref={productQuantityRef}
                  name="product_quantity"
                  value={AsileData?.product_quantity || ""} // Use getMaxQuantity to get the value
                  onChange={handleInputChange}
                  onClick={(e) => handleClick(e, "product_quantity")}
                  className={errors.product_quantity ? "is-invalid" : ""}
                />
              )}
           
              
                 </Form.Group>
               </div>
               <div className="w--full d--flex flex--column">
                 <Form.Group controlId="product_max_quantity">
                   <Form.Label>Product Max Quantity</Form.Label>

                   {isDropdownMaxQuantity  ? (
                // If it's a dropdown, render the select element
                <Form.Control
                  as="select"
                  ref={productMaxQuantityRef}
                  name="product_max_quantity"
                  value={getMaxQuantity(aisleNumber)} // Use getMaxQuantity to get the value
                  onChange={handleDropdownChange}
                  onClick={(e) => handleClick(e, "product_max_quantity")}
                  className={errors.product_max_quantity ? "is-invalid" : ""}
                >
                  {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                // Otherwise, render a regular number input field
                <Form.Control
                  type="number"
                  ref={productMaxQuantityRef}
                  name="product_max_quantity"
                  value={getMaxQuantity(aisleNumber)}// Use getMaxQuantity to get the value
                  onChange={handleInputChange}
                  onClick={(e) => handleClick(e, "product_max_quantity")}
                  className={errors.product_max_quantity ? "is-invalid" : ""}
                />
              )}
                 </Form.Group>
               </div>
             </div>
             <div className="w--full d--flex flex--column gap--xl p-5">
               <div className="w--full d--flex flex--column">
                 <Form.Group controlId="product_id">
                   <Form.Label>Product</Form.Label>
                   <Form.Select
                     name="product_id"
                     value={AsileData?.product_location?.product_id || ""}
                     onChange={handleChange}
                     className={errors.product_id ? "is-invalid" : ""}
                   >
                     <option value="" disabled>Select a product</option>
                     {products.map((product) => (
                       <option key={product.product_id} value={product.product_id}>
                         {product.product_name}
                       </option>
                     ))}
                   </Form.Select>
                 </Form.Group>
               </div>
               {product_map_id && (categories.length) > 0 && (
                 <div className="w--full d--flex flex--column">
                   <Form.Group controlId="category_id">
                     <Form.Label>Category</Form.Label>
                     <Form.Select
                       name="category_id"
                       value={AsileData?.product_location?.category_id || ""}
                       onChange={handleChange}
                       disabled // Make category read-only
                     >
                       <option value="" disabled>Select a category</option>
                       {categories.map((category) => (
                         <option key={category.category_id} value={category.category_id}>
                           {category.category_name}
                         </option>
                       ))}
                     </Form.Select>
                   </Form.Group>
                 </div>
               )}
               {AsileData?.product_max_quantity && (
                 <div className="w--full d--flex flex--column">
                   <Form.Group controlId="space_to_sales_sequence">
                     {productSaleSequence &&(
                       <>
                         <Form.Label>Space to Sales Sequence</Form.Label>
                         <Form.Select
                           className="custom-dropdown"
                           aria-label="Select Space to Sales Sequence"
                           onChange={handleSpaceToSalesSequenceChange}
                           value={spaceToSalesSequence} // Update to use `value` instead of `defaultValue`
                         >
                           <option value="all_aisle_then_next_aisle">All Aisle then next aisle</option>
                           <option value="space_to_sales_l2r">Space to sales L2R</option>
                           <option value="space_to_sales_r2l">Space to sales R2L</option>
                           <option value="space_to_sales_c2r2l">Space to sales C2R2L</option>
                           <option value="space_to_sales_c2l2r">Space to sales C2L2R</option>
                           <option value="custom_sequence">Custom Sequence</option>
                         </Form.Select>
                       </>
                     )}
                     {spaceToSalesSequence === "custom_sequence" && showCustomSequenceInput && (
                       <div className="d-flex mt-2">
                         <Form.Control
                           type="text"
                           placeholder="Enter custom sequence"
                           defaultValue={productSaleSequence}
                           onChange={handleCustomSequenceChange}
                           className="me-2"
                         />
                         <Button variant="orange" onClick={handleCustomSequenceOk}>
                           OK
                         </Button>
                       </div>
                     )}
                     {!showCustomSequenceInput && productSaleSequence && (
                       <p className="mt-2 fw-bold bg-light text-dark text-break p-1 bg-secondary form-control" style={{ wordWrap: 'break-word' }}>
                         {productSaleSequence} {/* Dynamically updated sequence */}
                       </p>
                     )}
                   </Form.Group>
                 </div>
               )}
             </div>
           </div>
           <div className="w--full d--flex gap--sm justify-content--center p-b--sm">
             <button onClick={() => navigate(-1)} type="button" variant="black" color="white" className="btn border-full--black-200 w-min--150 w-max--200 btn-- bg--black text--white">
               Cancel
             </button>
             <button type="submit" variant="orange" color="white" className=" btn-- bg--orange text--white radius--sm btn  w-min--150 w-max--200">
               Submit
             </button>
           </div>
         </form>
       )}
     </div>

    )}
    </>
   
  );
}