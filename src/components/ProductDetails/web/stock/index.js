import React, { useEffect, useState } from "react";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import core Swiper styles
import "swiper/css/navigation"; // Import navigation styles
import { Navigation, Autoplay } from "swiper/modules";
import { PRODUCT_CONST, PRODUCT_FILE_TYPES } from "../../consts";
import { MEDIA_BASE_URL } from "../../../../Helpers/constant";
import { updateProductImage } from "../../action";
import useMutationData from "../../../../Hooks/useCommonMutate";
import { useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../../../Helpers/web/toastr";
import useInvalidateQuery from "../../../../Hooks/useInvalidateQuery";
import { useMediaQuery } from "react-responsive";

export default function ProductImages(props) {
  const { CrossIcon, GallerysIcon, GalleryIcon, PlusIcon, EditIcon } = useIcons();
  const { productId, pageType } = useParams();
  const [productImage, setProductImage] = useState(null);
  const [productMoreInfoImage, setProductMoreInfoImage] = useState(null);
  const [promotionalImage, setPromotionalImage] = useState(null);
  const [moreProductImage, setMoreProductImage] = useState([]);
  const { invalidateQuery } = useInvalidateQuery();
  const isMobile = useMediaQuery({ query: '(max-width:768px)'});

  useEffect(() => {
    setMoreProductImageFromDetails();
    if (props?.productDetails) {
      setProductImage(
        props?.productDetails[PRODUCT_FILE_TYPES.PRODUCT_IMAGE]
          ? {
              url: MEDIA_BASE_URL + props?.productDetails[PRODUCT_FILE_TYPES.PRODUCT_IMAGE],
            }
          : null
      );
      setProductMoreInfoImage(
        props?.productDetails[PRODUCT_FILE_TYPES.PRODUCT_MORE_INFO]
          ? {
              url: MEDIA_BASE_URL + props?.productDetails[PRODUCT_FILE_TYPES.PRODUCT_MORE_INFO],
            }
          : null
      );
      setPromotionalImage(
        props?.productDetails[PRODUCT_FILE_TYPES.PROMOTIONAL_IMAGE]
          ? {
              url: MEDIA_BASE_URL + props?.productDetails[PRODUCT_FILE_TYPES.PROMOTIONAL_IMAGE],
            }
          : null
      );
    }
  }, [props?.productDetails]);

  const setMoreProductImageFromDetails = () => {
    if (props?.productDetails && props?.productDetails.images.length != 0) {
      let uploadedImages = [];
      props?.productDetails.images.forEach((el1) => {
        uploadedImages.push({
          url: MEDIA_BASE_URL + el1.image,
          id: el1.id,
          uuid: el1.uuid,
        });
      });
      setMoreProductImage(uploadedImages);
    }
  };

  const handleProductImage = (event, type, index) => {
    let file = event.target.files[0];
    if (file.size > 2e6) {
      showErrorToast("File too large, Please select a file that is less than 2 MB in size. ");
      return;
    }
    if (file.type.startsWith("image")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFileForView(
          type,
          {
            url: reader.result,
            type: file.type,
          },
          index
        );
      };

      if (file) {
        if (type == PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES) {
          let files = props.watch(type);
          if (![null, undefined].includes(index)) {
            files.splice(index, 1);
            files.splice(index, 0, file);
            props.setValue(type, [...files]);
          } else {
            props.setValue(type, [...files, file]);
          }
        } else props.setValue(type, file);
        // }
        reader.readAsDataURL(file);
      }
    } else {
      showErrorToast("Only image files are allowed. Please select a file with a supported image format (e.g., JPG, PNG, GIF).");
    }
  };

  function setFileForView(type, file, index) {
    switch (type) {
      case PRODUCT_FILE_TYPES.PRODUCT_IMAGE:
        setProductImage(file);
        break;
      case PRODUCT_FILE_TYPES.PRODUCT_MORE_INFO:
        setProductMoreInfoImage(file);
        break;
      case PRODUCT_FILE_TYPES.PROMOTIONAL_IMAGE:
        setPromotionalImage(file);
        break;
      case PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES:
        if (props.productDetails && ![undefined, null].includes(index)) {
          let moreImages = moreProductImage;
          moreImages[index].url = file.url;
          setMoreProductImage([...moreImages]);
        } else {
          setMoreProductImage([...moreProductImage, file]);
        }

        break;
      default:
        break;
    }
  }

  const removeMoreProductImages = (index) => {
    moreProductImage.splice(index, 1);
    setMoreProductImage(moreProductImage);
    let formValue = props.watch(PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES);
    formValue.splice(index, 1);
    props.setValue(PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES, formValue);
  };

  const handleSuccess = (data) => {
    const status = data?.status;
    const responseData = data?.data;
    if (status !== 200) {
      return;
    }
    invalidateQuery("productDetailsById");
    showSuccessToast("Product image updated successfully!");
  };

  const updateProductImageRequest = useMutationData(updateProductImage, (data) => {
    handleSuccess(data);
  });

  const updateImages = (type, file, index) => {
    let payload = {
      type: type,
      image: file,
      uuid: props?.productDetails.uuid,
    };
    if (type == PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES) {
      payload["image_id"] = moreProductImage[index]?.id || 0;
      payload["type"] = "more_product_images";
    }
    updateProductImageRequest.mutate(payload);
  };

  return (

    <>
    { !isMobile && (
      <div className="d--flex flex--column gap--sm  stockProductImagesTab ">
        <div className="w--full bg--white h--full d--flex gap--3xl p--lg radius--md">
          <div className="w--full d--flex flex--column gap--md justify-content--center align-items--center">
            <div className={` font--sm  font--500 d--flex justify-content--start w--full ${props.errors?.product_image?.message ? "text--red" : "text--black-600"}`}>{props.errors?.product_image?.message ? props.errors?.product_image?.message : "Product Image"}</div>
            <div className={`w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center  ${props.errors?.product_image?.message ? "border-full--red " : "border-full--black-100"}`}>
              {productImage && !props?.productDetails && (
                <div
                  className="position--absolute right--5 top--5 c--pointer"
                  onClick={() => {
                    props.setValue("product_image", null);
                    setProductImage(null);
                  }}
                >
                  <CrossIcon />
                </div>
              )}
              <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{productImage ? <img src={productImage.url} alt="productImage" /> : "Image"}</div>
            </div>
            <div className="w--full d--flex justify-content--center">
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-25 d--flex justify-content--center align-items--center c--pointer file--upload">
                <input type="file" accept="image/*" id="product-image-file-input" onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.PRODUCT_IMAGE)} />
                <label htmlFor="product-image-file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                  <GallerysIcon width={20} />
                </label>
              </div>
            </div>
          </div>
          <div className="w--full d--flex flex--column gap--md justify-content--center align-items--center">
            <div className={`font--sm  font--500 d--flex justify-content--start w--full ${props.errors?.product_more_info_image?.message ? "text--red" : "text--black-600"}`}>{props.errors?.product_more_info_image?.message ? props.errors?.product_more_info_image?.message : "Product More Info Image"}</div>
            <div className={`w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center ${props.errors?.product_more_info_image?.message ? "border-full--red " : "border-full--black-100"}`}>
              {productMoreInfoImage && !props?.productDetails && (
                <div
                  className="position--absolute right--5 top--5 c--pointer"
                  onClick={() => {
                    props.setValue("product_more_info_image", null);
                    setProductMoreInfoImage(null);
                  }}
                >
                  <CrossIcon />
                </div>
              )}
              <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg bg--black-25">{productMoreInfoImage ? <img src={productMoreInfoImage.url} alt="productMoreInfoImage" /> : "Image"}</div>
            </div>
            <div className="w--full d--flex justify-content--center">
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-25 d--flex justify-content--center align-items--center c--pointer file--upload">
                <input type="file" accept="image/*" id="product-more-info-file-input" onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.PRODUCT_MORE_INFO)} />
                <label htmlFor="product-more-info-file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                  <GallerysIcon width={20} />
                </label>
              </div>
            </div>
          </div>
          <div className="w--full d--flex flex--column gap--md justify-content--center align-items--center">
            <div className=" font--sm text--black-600 font--500 d--flex justify-content--start w--full">Promotional Image</div>
            <div className="w--full h-min--200 position--relative radius--md border-full--black-100 d--flex align-items--center justify-content--center">
              {promotionalImage && !props?.productDetails && (
                <div
                  className="position--absolute right--5 top--5 c--pointer"
                  onClick={() => {
                    props.setValue("product_promo_image", null);
                    setPromotionalImage(null);
                  }}
                >
                  <CrossIcon />
                </div>
              )}
              <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg bg--black-25 ">{promotionalImage ? <img src={promotionalImage.url} alt="productImage" /> : "Image"}</div>
            </div>
            <div className="w--full d--flex justify-content--center">
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-25 d--flex justify-content--center align-items--center c--pointer file--upload">
                <input type="file" accept="image/*" id="promotional-info-file-input" onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.PROMOTIONAL_IMAGE)} />
                <label htmlFor="promotional-info-file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                  <GallerysIcon width={20} />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="w--full h--full d--flex flex--column gap--xs">
          <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">More Product Images</div>
          <div className="d--flex flex--column  w--full gap--5xl h--full justify-content--between bg--white gap--3xl radius--md p--lg stockProductImageTabList ">
            <div className="d--flex gap--md w--full align-items--center position--relative slideMore">
              {moreProductImage &&
                moreProductImage.length != 0 &&
                moreProductImage.map((el, i) => (
                  <div className="w-max--400 w--full h-min--200 position--relative radius--md border-full--black-100 d--flex align-items--center justify-content--center stockProductImagesCard" key={i + 1}>
                    {!props?.productDetails && (
                      <div className="position--absolute right--5 top--5 c--pointer" onClick={() => removeMoreProductImages(i)}>
                        <CrossIcon />
                      </div>
                    )}
                    <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg bg--black-25">
                      <img src={el.url} alt="productImage" />
                      <div className="w-min--50 w-max--50 h-min--50 h-max--50 w--full h--full radius--full bg--primary text--white d--flex justify-content--center align-items--center c--pointer edit--img  position--absolute">
                        <input type="file" accept="image/*" id={`file-input${i + 1}`} onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES, i)} />
                        <label htmlFor={`file-input${i + 1}`} className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                          <EditIcon width={24} height={24} />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

              {moreProductImage.length < 4 && (
                <div className="w-max--400 w--full h-min--200 position--relative radius--md border-full--black-100 d--flex align-items--center justify-content--center">
                  <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg ">
                    <div className="w-min--50 w-max--50 h-min--50 h-max--50 w--full h--full radius--full bg--orange text--white d--flex justify-content--center align-items--center c--pointer file--upload">
                      <input type="file" accept="image/*" id="file-input" onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES)} />
                      <label htmlFor="file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                        <PlusIcon width={40} height={40} />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="w--full d--flex gap--sm justify-content--center p-b--sm ">
              <Button variant="black" color="white" btnClasses="btn border-full--black-200 w-min--200 w-max--200" type="button" onClick={props.onCancel}>
                Cancel
              </Button>
              <Button variant="orange" color="white" btnClasses="btn  w-min--200 w-max--200" type="button" onClick={props.onSubmit}>
                {props?.productDetails ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}

    { isMobile && (
      <div className="d--flex flex--column gap--sm  stockProductImagesTab ">
      <div className="w--full bg--white h--full d--flex flex--column gap--lg p--sm radius--md">
        <div className="w--full d--flex flex--column gap--md justify-content--center align-items--center">
          <div className={` font--sm  font--500 d--flex justify-content--start w--full ${props.errors?.product_image?.message ? "text--red" : "text--black-600"}`}>{props.errors?.product_image?.message ? props.errors?.product_image?.message : "Product Image"}</div>
          <div className={`w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center  ${props.errors?.product_image?.message ? "border-full--red " : "border-full--black-100"}`}>
            {productImage && !props?.productDetails && (
              <div
                className="position--absolute right--5 top--5 c--pointer"
                onClick={() => {
                  props.setValue("product_image", null);
                  setProductImage(null);
                }}
              >
                <CrossIcon />
              </div>
            )}
            <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{productImage ? <img src={productImage.url} alt="productImage" /> : "Image"}</div>
          </div>
          <div className="w--full d--flex justify-content--center">
            <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-25 d--flex justify-content--center align-items--center c--pointer file--upload">
              <input type="file" accept="image/*" id="product-image-file-input" onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.PRODUCT_IMAGE)} />
              <label htmlFor="product-image-file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                <GallerysIcon width={20} />
              </label>
            </div>
          </div>
        </div>
        <div className="w--full d--flex flex--column gap--md justify-content--center align-items--center">
          <div className={`font--sm  font--500 d--flex justify-content--start w--full ${props.errors?.product_more_info_image?.message ? "text--red" : "text--black-600"}`}>{props.errors?.product_more_info_image?.message ? props.errors?.product_more_info_image?.message : "Product More Info Image"}</div>
          <div className={`w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center ${props.errors?.product_more_info_image?.message ? "border-full--red " : "border-full--black-100"}`}>
            {productMoreInfoImage && !props?.productDetails && (
              <div
                className="position--absolute right--5 top--5 c--pointer"
                onClick={() => {
                  props.setValue("product_more_info_image", null);
                  setProductMoreInfoImage(null);
                }}
              >
                <CrossIcon />
              </div>
            )}
            <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg bg--black-25">{productMoreInfoImage ? <img src={productMoreInfoImage.url} alt="productMoreInfoImage" /> : "Image"}</div>
          </div>
          <div className="w--full d--flex justify-content--center">
            <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-25 d--flex justify-content--center align-items--center c--pointer file--upload">
              <input type="file" accept="image/*" id="product-more-info-file-input" onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.PRODUCT_MORE_INFO)} />
              <label htmlFor="product-more-info-file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                <GallerysIcon width={20} />
              </label>
            </div>
          </div>
        </div>
        <div className="w--full d--flex flex--column gap--md justify-content--center align-items--center">
          <div className=" font--sm text--black-600 font--500 d--flex justify-content--start w--full">Promotional Image</div>
          <div className="w--full h-min--200 position--relative radius--md border-full--black-100 d--flex align-items--center justify-content--center">
            {promotionalImage && !props?.productDetails && (
              <div
                className="position--absolute right--5 top--5 c--pointer"
                onClick={() => {
                  props.setValue("product_promo_image", null);
                  setPromotionalImage(null);
                }}
              >
                <CrossIcon />
              </div>
            )}
            <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg bg--black-25 ">{promotionalImage ? <img src={promotionalImage.url} alt="productImage" /> : "Image"}</div>
          </div>
          <div className="w--full d--flex justify-content--center">
            <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-25 d--flex justify-content--center align-items--center c--pointer file--upload">
              <input type="file" accept="image/*" id="promotional-info-file-input" onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.PROMOTIONAL_IMAGE)} />
              <label htmlFor="promotional-info-file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                <GallerysIcon width={20} />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="w--full h--full d--flex flex--column gap--xs">
        <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">More Product Images</div>
        <div className="d--flex flex--column  w--full h--full justify-content--between bg--white gap--xl radius--md p--lg stockProductImageTabList ">
          <div className="d--flex gap--md w--full align-items--center position--relative slideMore">
            {moreProductImage &&
              moreProductImage.length != 0 &&
              moreProductImage.map((el, i) => (
                <div className="w-max--400 w--full h-min--200 position--relative radius--md border-full--black-100 d--flex align-items--center justify-content--center stockProductImagesCard" key={i + 1}>
                  {!props?.productDetails && (
                    <div className="position--absolute right--5 top--5 c--pointer" onClick={() => removeMoreProductImages(i)}>
                      <CrossIcon />
                    </div>
                  )}
                  <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg bg--black-25">
                    <img src={el.url} alt="productImage" />
                    <div className="w-min--50 w-max--50 h-min--50 h-max--50 w--full h--full radius--full bg--primary text--white d--flex justify-content--center align-items--center c--pointer edit--img  position--absolute">
                      <input type="file" accept="image/*" id={`file-input${i + 1}`} onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES, i)} />
                      <label htmlFor={`file-input${i + 1}`} className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                        <EditIcon width={24} height={24} />
                      </label>
                    </div>
                  </div>
                </div>
              ))}

            {moreProductImage.length < 4 && (
              <div className="w-max--400 w--full h-min--200 position--relative radius--md border-full--black-100 d--flex align-items--center justify-content--center">
                <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg ">
                  <div className="w-min--50 w-max--50 h-min--50 h-max--50 w--full h--full radius--full bg--orange text--white d--flex justify-content--center align-items--center c--pointer file--upload">
                    <input type="file" accept="image/*" id="file-input" onChange={(event) => handleProductImage(event, PRODUCT_FILE_TYPES.MORE_PRODUCT_IMAGES)} />
                    <label htmlFor="file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                      <PlusIcon width={40} height={40} />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w--full d--flex align-items--center gap--sm justify-content--center p-b--sm ">
            <Button variant="black" color="white" btnClasses="btn border-full--black-200 w-min--100 w-max--200" type="button" onClick={props.onCancel}>
              Cancel
            </Button>
            <Button variant="orange" color="white" btnClasses="btn  w-min--100 w-max--200" type="button" onClick={props.onSubmit}>
              {props?.productDetails ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </div>
    )}

    </>
  );
}
