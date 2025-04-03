import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
const ResetOrUpdateForm = ({ resetForm, reFillFields }) => {

 const { operationType, updateProductData } = useSelector(state => state?.productSlice);



 useEffect(() => {
  !focus && operationType !== "EDIT" && !updateProductData && resetForm();
 }, [focus])

 useEffect(() => {
  if (operationType === "EDIT" && updateProductData) {
   //call method
   focus && reFillFields()
  }
 }, [operationType, updateProductData, focus])

}

export default ResetOrUpdateForm;
