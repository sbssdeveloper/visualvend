import React, { useEffect, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import Button from "../../../../Widgets/web/Button";
import useIcons from "../../../../Assets/web/icons/useIcons";
import { useNavigate } from "react-router-dom";
import FormSelect from "../../../../Widgets/web/FormSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { getBucketUrl, getClientList, uploadFile } from "../../../ProductDetails/action";
import { store } from "../../../../redux/store";
import { useQuery } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "../../../../Helpers/web/toastr";
import useMutationData from "../../../../Hooks/useCommonMutate";
import { addCategory } from "../../action";

const initialValues = {
  client_id: "",
  image: null,
  category_id: "",
  category_name: ""
};

const validationSchema = yup.object().shape({
  category_name: yup.string().required("Category name is required"),
  category_id: yup.string().required("Category ID is required"),
  image: yup.mixed().required("Category image is required"),
  client_id: yup.string().required("Client ID is required"),
});

export default function AddEditCategory() {
  const { SupportIcon, CrossIcon, GallerysIcon, ArrowLongLeftIcon } = useIcons();
  const [categoryImage, setCategoryImage] = useState(null);
  const [isProductAdding, setIsProductAdding] = useState(false);
  const navigate = useNavigate();
  const backToProducts = () => {
    navigate(`/products`);
  };

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

  const userState = store.getState();
  if (userState.auth && userState.auth.user && userState.auth.user.client_id != -1) {
    setValue("client_id", userState.auth.user.client_id);
  }

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

  const handleImageMutation = async (data) => {
          uploadFile({ uri: data.data.image.url, file: watch("image") });
          setValue("image", data.data.image.filename);
                let values = watch();
                addCategoryRequest.mutate(values);
    // await Promise.all(
    //   urls.map(async (url, index) => {
    //     try {
    //       let keyArr = url.keyName.split("_");
    //       let lastVal = keyArr[keyArr.length - 1];
    //       let file = url.keyName.includes("more_product_images") ? moreProductFiles[+lastVal - 1] : watch(url.keyName);
    //       uploadFile({ uri: url.url, file: file });
    //       if (url.keyName.includes("more_product_images")) {
    //         moreProductsUrls.splice(+lastVal - 1, 0, url.filename);
    //         setValue("more_product_images", moreProductsUrls);
    //       } else setValue(url.keyName, url.filename);
    //     } catch (error) {
    //       setIsProductAdding(false);
    //       return { index, status: "error", error: error.message };
    //     }
    //   })
    // ).then(() => {
    //   let values = watch();
    //   if (!productDetails) {
    //     addProductRequest.mutate(values);
    //   } else {
    //     values = { uuid: productDetails.uuid, ...values };
    //     updateProductRequest.mutate(values);
    //   }
    // });
  };

  const handleSuccess = (data) => {
    const status = data?.status;
    const responseData = data?.data;
    setIsProductAdding(false);
    if (status !== 200) {
      return;
    }
    showSuccessToast(`Category added successfully!`);
    navigate(`/products`);
  };

  const addCategoryRequest = useMutationData(addCategory, (data) => {
    handleSuccess(data);
  });

  const wasabiUrlMuation = useMutationData(getBucketUrl, (data) => handleImageMutation(data));


  const { isLoading: isClientListLoading, data: clientList } = useQuery({
    queryKey: ["clientList"],
    queryFn: () => getClientList({}),
    select: (data) => {
      return data.data.data;
    },
    enabled: userState.auth.user.client_id == -1,
  });

  async function onSubmit(values) {
    let payload = {
      type: "image",
      data: {},
    };
    setIsProductAdding(true);
    if (typeof watch("image") != "string") {
      payload.data["image"] = getFileType(watch("image"));
    }

    if (Object.keys(payload.data).length !== 0) {
      wasabiUrlMuation.mutate(payload);
      return;
    }
  }

  const handleImage = (event) => {
    let file = event.target.files[0];
    if (file.size > 2e6) {
      showErrorToast("File too large, Please select a file that is less than 2 MB in size. ");
      return;
    }
    if (file.type.startsWith("image")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCategoryImage(          {
            url: reader.result,
            type: file.type,
          }
        );
      };

      if (file) {
        setValue("image", file)
        reader.readAsDataURL(file);
      }
    } else {
      showErrorToast("Only image files are allowed. Please select a file with a supported image format (e.g., JPG, PNG, GIF).");
    }
  };

  const getFileType = (file) => {
    let fileType = file.type;
    if (fileType) {
      return fileType.replace("image/", "");
    }
    return "jpg";
  }


  return (
    <div className="w--full d--flex flex--column gap--md categoryPage  h--full">
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="font--lg font--900 d--flex align-items--center gap--sm">
            <div className="d--flex c--pointer" onClick={() => backToProducts()}>
              <ArrowLongLeftIcon />
            </div>
            Add New Category
          </div>
        </div>
      </div>
      <form className="w--full">
        <div className="d--flex flex--column  h--full w--full bg--white gap--3xl radius--md p--lg categoryAddList  overflow--auto">
          <div className="d--flex flex--column w--full gap--lg h--full  ">
            <div className="w--full d--flex gap--xl">
              <div className="w--full d--flex flex--column gap--lg w-max--500">
                <div className="d--flex flex--column">
                  {/* <FormSelect type="input" label="Client ID" placeholder="Enter your product id" /> */}
                  {userState.auth.user.client_id == -1 && (
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    {...field}
                    error={errors?.client_id?.message}
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
              </div>
              <div className="w--full d--flex flex--column gap--lg w-max--500">
                <div className="d--flex flex--column">
                  <Controller name="category_id" control={control} render={({ field }) => <FormInput {...field} type="input" label="Category ID" placeholder="Enter your category id" error={errors?.category_id?.message} />} />
                </div>
              </div>
              <div className="w--full d--flex flex--column gap--lg w-max--500">
                <div className="d--flex flex--column">
                  <Controller name="category_name" control={control} render={({ field }) => <FormInput {...field} type="input" label="Category Name" placeholder="Enter your category name" error={errors?.category_name?.message} />} />
                </div>
              </div>
            </div>
            <div className="w--full d--flex gap--xl">
              <div className="w--full d--flex flex--column gap--xs">
                <div className="w--full d--flex flex--column gap--md justify-content--center align-items--center">
                  <div className={` font--sm  font--500 d--flex justify-content--start w--full ${errors?.image?.message ? "text--red" : "text--black-600"}`}>{errors?.image?.message ? errors?.image?.message : "Category Image"}</div>
                  <div className={`w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center ${errors?.image?.message ? "border-full--red " : "border-full--black-100"} `}>
                    <div className="position--absolute right--5 top--5 c--pointer">
                    {categoryImage && (
              <div
                className="position--absolute right--5 top--5 c--pointer"
                onClick={() => {
                  setValue("image", null);
                  setCategoryImage(null);
                }}
              >
                <CrossIcon />
              </div>
            )}
                    </div>
                    <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{categoryImage ? <img src={categoryImage.url} alt="categoryImage" /> : "Image"}</div>
                  </div>
                  <div className="w--full d--flex justify-content--center">
                    <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-25 d--flex justify-content--center align-items--center c--pointer file--upload">
                      <input type="file" accept="image/*" id="product-image-file-input" onChange={(event) => handleImage(event)} />
                      <label htmlFor="product-image-file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                        <GallerysIcon width={20} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w--full"></div>
              <div className="w--full"></div>
            </div>
          </div>
          <div className="w--full d--flex gap--sm justify-content--center p-b--sm">
            <Button variant="white" color="black" btnClasses="btn border-full--black-200 w-min--200 w-max--200" type="button">
              Cancel
            </Button>
            <Button variant="primary" color="white" btnClasses="btn  w-min--200 w-max--200" type="button" onClick={() => handleSubmit(onSubmit)()}>
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
