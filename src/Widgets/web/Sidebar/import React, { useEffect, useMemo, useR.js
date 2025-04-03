import React, { useEffect, useMemo, useRef, useState } from "react";
import FormSelect from "../../../Widgets/web/FormSelect";
import FormInput from "../../../Widgets/web/FormInput";
import useIcons from "../../../Assets/web/icons/useIcons";
import Button from "../../../Widgets/web/Button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { deleteProduct, getProductCategoriesProduct, productList } from "../action";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import core Swiper styles
import "swiper/css/navigation"; // Import navigation styles

// Import Swiper core and required modules
import { Navigation } from "swiper/modules";
import { DETAIL_TABS_CONST, PRODUCT_CONST } from "../../ProductDetails/consts";
import Spinner from "../../../Widgets/web/Spinner";
import { MEDIA_BASE_URL, MEDIA_BASE_URL_2 } from "../../../Helpers/constant";
import useDebounce from "../../../Hooks/useDebounce";
import CommonModal from "../../../Widgets/web/CommonModal";
import useMutationData from "../../../Hooks/useCommonMutate";
import { showSuccessToast } from "../../../Helpers/web/toastr";
import useInvalidateQuery from "../../../Hooks/useInvalidateQuery";
import { LOAD_MORE_ITEM_COUNT } from "../../Reports/constant";
import FullScreenLoader from "../../../Widgets/web/FullScreenLoader";
import { useMediaQuery } from 'react-responsive';
export default function Products() {
  const { SearchIcon, GalleryIcon, GallerysIcon, CameraAddIcon, EditIcon, PlusIcon, TrashIcon } = useIcons();

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProductDetails, setSelectedProductsDetails] = useState(null);
  const [length, setLength] = useState(50);
  const [categorieLength, setCategorieLength] = useState(50);
  const [selectedCategory, setSelectedCategory] = useState("");
  const _data = useRef(null);
  const _categoreyData = useRef(null);

  const {
    isLoading,
    data: _allProduct,
    isFetching,
  } = useQuery({
    queryKey: ["stockProductList", page, search, length, selectedCategory],
    queryFn: () => productList({ page: 1, search, sort: "recent", length: length * page, category_id: selectedCategory }),
    select: (data) => {
      return data.data;
    },
  });
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const allProductList = useMemo(() => {
    if (_allProduct) {
      _data.current = _allProduct;
    }
    return _data.current;
  }, [_allProduct]);

  const {
    isLoading: isCategoriesLoading,
    data: _categories,
    isFetching: isCategoriesFatching,
  } = useQuery({
    queryKey: ["productCategoriesList", categoryPage],
    queryFn: () =>
      getProductCategoriesProduct({
        search: "",
        sort: "string",
        length: categorieLength * categoryPage,
      }),
    select: (data) => {
      return data.data.data;
    },
  });

  const categoriesList = useMemo(() => {
    if (_categories) {
      _categoreyData.current = _categories;
    }
    return _categoreyData.current;
  }, [_categories]);

  const handlePageChange = () => {
    setPage(page + 1);
  };

  const handleSearchFilter = useDebounce((value) => {
    setPage(1);
    setSearch(value);
  }, 1000);

  const getMediaDomain = (url) => {
    if (!url) return ``;
    let domain = url.includes("ngapp") ? MEDIA_BASE_URL_2 : MEDIA_BASE_URL;
    return domain + url;
  };

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowModal = (product) => {
    setSelectedProductsDetails(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowDeleteModal = (product) => {
    setSelectedProductsDetails(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const { invalidateQuery } = useInvalidateQuery();

  const deleteSuccess = (data) => {
    const { success, message } = data?.data;
    handleCloseDeleteModal();
    if (success) {
      showSuccessToast("Product deleted successfully!");
      invalidateQuery("stockProductList");
    }
  };

  const { mutate: deletMution, isPending } = useMutationData(deleteProduct, deleteSuccess);
  const delete_Prouduct = () => deletMution({ uuid: selectedProductDetails.uuid });

  const handleCategoryPageChange = () => {
    setCategoryPage(categoryPage + 1);
  };

  return (
    <>
    {!isMobile && (
    <div className="w--full d--flex flex--column gap--md stockProductPage h--full">
      {isFetching && <FullScreenLoader />}
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Product Category</div>
          </div>
          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <div className="w--full w-max--250 position--relative">
              <FormInput
                placeholder="Search"
                onKeyUp={(event) => handleSearchFilter(event.target.value)}
                icon={
                  <div className="position--absolute left--10 top--5 text--black-400">
                    <SearchIcon width={15} />
                  </div>
                }
              />
              {/* <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
                <SearchIcon width={15} />
              </div> */}
            </div>
            {/* <div className="w--full w-max--200 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--200 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--200 ">
              <FormSelect />
            </div> */}
          </div>
        </div>
      </div>
      <div className="d--flex gap--md w--full align-items--center position--relative slideMore">
        {/* <div className="w-min--60 h-min--60 w-max--60 h-max--60 w--full h--full radius--full c--pointer bg--black-50 d--flex align-items--center justify-content--center position--absolute left--4">
          <AngleLeftIcon />
        </div> */}

        {categoriesList && (
          <Swiper
            spaceBetween={10}
            centeredSlides={false}
            navigation={true}
            breakpoints={{
              // when window width is >= 640px
              640: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              // when window width is >= 768px
              768: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1699: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            <SwiperSlide key={"All Categories"}>
              <div className={`w--full border-full--black-100 bg--${!selectedCategory ? "grey" : "white"} radius--sm h-min--60 gap--md p--sm d--flex align-items--center justify-content--start p-l--sm c--pointer`} onClick={() => setSelectedCategory("")}>
                <div className={`text--black-600 h-max--100 border-full--${!selectedCategory ? "white" : "black-100"} radius--sm h-min--50 w-min--50 w-max--50 d--flex align-items--center justify-content--center w-min--50`}>
                  <GalleryIcon width={30} height={30} />
                </div>
                <div className={`text--${!selectedCategory ? "white" : "black-800"} font--600 font--lg`}>All Products</div>
              </div>
            </SwiperSlide>
            {categoriesList &&
              categoriesList?.data.length != 0 &&
              categoriesList?.data.map((category, index) => (
                <SwiperSlide key={index + 1}>
                  <div className={`w--full border-full--black-100 bg--${selectedCategory == category.category_id ? "grey" : "white"} radius--sm h-min--60 gap--md p--sm d--flex align-items--center justify-content--start p-l--sm c--pointer`} onClick={() => setSelectedCategory(category.category_id)}>
                    <div className={`text--black-600 h-max--100 border-full--${selectedCategory == category.category_id ? "white" : "black-100"} radius--sm h-min--50 w-min--50 w-max--50 d--flex align-items--center justify-content--center w-min--50`}>
                      <img className="h-max--50 w-max--50  w--full radius--sm bg--black-100 h-min--50 p--xs" src={getMediaDomain(category.category_image)} alt="productImage" />
                    </div>
                    <div className={`text--${selectedCategory == category.category_id ? "white" : "black-800"} font--600 font--md`}>{category.category_name}</div>
                  </div>
                </SwiperSlide>
              ))}

            {categoriesList.total > categorieLength && (
              <SwiperSlide key={"loadMore"}>
                <div className="w--full border-full--black-100 bg--white radius--full h-min--60 gap--md p--sm d--flex align-items--center justify-content--center p-l--sm">
                  <div className="h-min--50 p--xs d--flex align-items--center">{isCategoriesFatching && <Spinner size="lg" />}</div>

                  <div className="text--black-800 font--600 font--lg c--pointer" onClick={() => handleCategoryPageChange()}>
                    Load more
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </div>
      <div className="w--full d--flex gap--md flex--column">
        <div className="d--flex justify-content--between align-items--center">
          <div className="text--black-800 font--600 font--md white-space--nowrap ">All Products ({allProductList?.pagination.total || 0})</div>
          <div className="d--flex justify-content--end w--full gap--sm">
            <Button variant="orange" color="white" btnClasses="btn w-max--150 white-space--nowrap" onClick={() => navigate(`add-category`)}>
              <PlusIcon width={20} /> Add Category
            </Button>
            <Button variant="black" color="white" btnClasses="btn w-max--150 white-space--nowrap" onClick={() => navigate(`${PRODUCT_CONST.ADD_NEW}/${DETAIL_TABS_CONST.PRODUCT_DETAILS}`)}>
              <PlusIcon width={20} /> Add Product
            </Button>
          </div>
        </div>
        {/* {isLoading ? (
          <div className="w--full h--full stockProductList d--flex align-items--center justify-content--center bg--white radius--sm">
            <Spinner size="lg" />
          </div>
        ) : ( */}
        
        <div className="stockProductList overflow--auto">
          {allProductList && allProductList?.data.length != 0 ? (
            <div className="d--grid grid--2 grid--2--xl gap--md w--full ">
              {allProductList?.data.map((product, index) => (
                <div className="bg--white radius--sm d--flex gap--md w--full p--md" key={index}>
                  {/* <div className="w-min--40 w-max--40 d--flex flex--column gap--sm justify-content--center">
                    <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer file--upload" onClick={() => handleShowModal(product)}>
                      <input type="file" id="file-input" />
                      <label htmlFor="file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                        <GallerysIcon width={18} htmlFor="file-input" />
                      </label>
                    </div>
                    <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer">
                    <CameraAddIcon width={18} />
                  </div>
                  </div> */}
                  <div className="w-min--75 w-max--75 h-min--75 h-max--75 bg--contrast d--flex justify-content--center align-items--center c--pointer" onClick={() => handleShowModal(product)}>
                    <img htmlFor="file-input" className="h--auto" src={getMediaDomain(product.product_image)} alt="" height="100%" />
                  </div>
                  <div className="d--flex gap--sm w--full">
                    <div className="w--full d--flex flex--column gap--sm p-l--lg border-left--black-100">
                      <div className="w--full d--flex gap--sm flex--column">
                        <div className="font--md text--red font--600 " onClick={() => navigate(`${PRODUCT_CONST.EDIT_PRODUCT}/${DETAIL_TABS_CONST.PRODUCT_DETAILS}`, { state: { uuid: product.uuid } })}>
                          {product.product_name}
                        </div>
                      </div>
                      <div className="d--flex w--full">
                        <div className="w--full d--flex gap--sm flex--column">
                          <div className="font--sm text--black-600 font--500" onClick={() => navigate(`${PRODUCT_CONST.EDIT_PRODUCT}/${DETAIL_TABS_CONST.PRODUCT_DETAILS}`, { state: { uuid: product.uuid } })}>
                            Code - {product.product_id}
                          </div>
                          <div className="text--black-600 font--500">
                            {product.product_size_amount || ""} {product.product_size_amount ? product.product_size_unit || "" : ""}
                          </div>
                          <div className="font--sm  font--600">A$ {product.product_price}</div>
                        </div>
                        {/* <div className="w--full d--flex flex--column justify-content--between gap--sm">
                          
                    <div className="text--black-600 font--500 d--flex align-items--center gap--xs ">
                      <SnackIcon width={18} />
                       Snacks
                    </div>
                        </div> */}
                      </div>
                    </div>
                    <div className=" d--flex align-items--end justify-content--end gap--sm ">
                      <Button variant="black-50" color="black-800" btnClasses="btn btn--xs w-max--85 " onClick={() => navigate(`${PRODUCT_CONST.EDIT_PRODUCT}/${DETAIL_TABS_CONST.PRODUCT_DETAILS}`, { state: { uuid: product.uuid } })}>
                        <EditIcon width={16} />
                      </Button>
                      <Button variant="red-100" color="red" btnClasses="btn btn--xs w-max--85 " onClick={() => handleShowDeleteModal(product)}>
                        <TrashIcon width={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div class="d--flex justify-content--center align-items--center h--full font--md bg--white radius--sm">No record found</div>
          )}
        </div>
         
         

        {allProductList && allProductList.data.length != 0 && (
          <div className="d--flex justify-content-between align-items--center ">
            <div className="w--full d--flex gap--sm align-items--center">
              <div className="text--black">
                Total Records: {allProductList?.pagination?.total} &nbsp; | &nbsp; Showing Records: {allProductList?.pagination?.records}
              </div>
              <div className="w-max--100">
                <FormSelect value={length} onChange={(event) => setLength(event.target.value)} options={LOAD_MORE_ITEM_COUNT} />
              </div>
            </div>
            <div className="w--full w-max--150 text--primary text--r c--pointer d--flex justify-content--end  font--sm font--500">
              {allProductList?.pagination?.total > allProductList?.pagination?.records && (
                <div className="bg--black-50 text--black-800 radius--full w--full d--flex justify-content--start align-items--center h-min--36 p-l--md pr--md" onClick={() => handlePageChange()}>
                  <div className="w-min--36 h-min--32 d--flex align-items--center justify-content--start">{/* {isFetching && <Spinner />} */}</div>
                  <div className="d--flex">Load More</div>
                </div>
              )}
            </div>
            <div className="w--full"></div>
          </div>
        )}
        {/* <div>
          <Pagination key="Products-list" data={allProductList?.data || []} itemsPerPage={10} onPageChange={handlePageChange} total={allProductList?.pagination?.total} currentPageNo={page} />
        </div> */}

        <CommonModal show={showModal} onClose={handleCloseModal} title={"Product Images"} isShowCloseBtn={true}>
          <div className=" w--full w-max--800 w-min--800 d--flex flex--column gap--xl">
            <div className="d--flex align-items--center gap--md">
              <div className="d--flex flex--column w--full gap--sm">
                <div className=" font--sm  font--500 d--flex justify-content--start w--full text--black-600">Product image</div>
                <div className="w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center  border-full--black-100">
                  <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{selectedProductDetails?.product_image ? <img className="h-max--200" src={getMediaDomain(selectedProductDetails?.product_image)} alt="productImage" /> : <GalleryIcon width={30} height={30} />}</div>
                </div>
              </div>
              <div className="d--flex flex--column w--full gap--sm">
                <div className=" font--sm  font--500 d--flex justify-content--start w--full text--black-600">Product More Info Image</div>
                <div className="w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center  border-full--black-100">
                  <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{selectedProductDetails?.product_more_info_image ? <img className="h-max--200" src={getMediaDomain(selectedProductDetails?.product_more_info_image)} alt="productImage" /> : <GalleryIcon width={30} height={30} />}</div>
                </div>
              </div>
              <div className="d--flex flex--column w--full gap--sm">
                <div className=" font--sm  font--500 d--flex justify-content--start w--full text--black-600">Promotional Image</div>
                <div className="w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center  border-full--black-100">
                  <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{selectedProductDetails?.product_promo_image ? <img className="h-max--200" src={getMediaDomain(selectedProductDetails?.product_promo_image)} alt="productImage" /> : <GalleryIcon width={30} height={30} />}</div>
                </div>
              </div>
            </div>
            <div className="h-min--1 bg--black-100 "></div>
            {selectedProductDetails?.images.length != 0 && (
              <div className="d--flex flex--column gap--sm">
                <div class="w--full h-min--36 font--md font--600 align-items--center d--flex ">More Product Images</div>
                <div className="d--flex align-items--center gap--md bg--primary-25 p--sm radius--md">
                  {selectedProductDetails?.images.map((el, i) => (
                    <div className="w--full h-min--200 w-max--200 position--relative radius--md  d--flex align-items--center justify-content--center  border-full--black-100" key={i + 1}>
                      <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">
                        <img className="h-max--200" src={getMediaDomain(el?.image)} alt="productImage" />{" "}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CommonModal>

        <CommonModal show={showDeleteModal} onClose={handleCloseDeleteModal} key={"deleteModal"} isShowCloseBtn={false}>
          <div className=" w--full w-max--300 w-min--300 d--flex flex--column gap--md p--xl">
            <div className="w--full p-t--md p-b--md">
              <div className="font--md text--c font--600 line-height--1-dot-5">Are you sure, you want to delete this product? This action cannot be undone! </div>
            </div>
            <div className="modal-foot h--full h-max--50 h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--center  gap--sm">
              <Button variant="black-100" color="black-800 w-max--200" btnClasses="btn" type="button" onClick={() => handleCloseDeleteModal()}>
                No
              </Button>
              <Button disabled={isPending} variant="primary" btnClasses="btn w-max--200" onClick={() => delete_Prouduct()}>
                Yes
              </Button>
            </div>
          </div>
        </CommonModal>
      </div>
    </div>
          )}
          {isMobile && (

<div className="w--full d--flex flex--column gap--md stockProductPage h--full">
{isFetching && <FullScreenLoader />}
<div className="w--full">
  <div className=" justify-content--between align-items--center h-min--36">
    <div className="w-max--400 w--full position--relative">
      <div className="font--lg font--900">Product Category</div>
    </div>
    <div className="d--flex align-items--center justify-content--end gap--sm w--full">
      <div className="w--full w-max--320 position--relative m-t--md">
        <FormInput
          placeholder="Search"
          onKeyUp={(event) => handleSearchFilter(event.target.value)}
          icon={
            <div className="position--absolute left--10 top--5 text--black-400">
              <SearchIcon width={15} />
            </div>
          }
        />
        {/* <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
          <SearchIcon width={15} />
        </div> */}
      </div>
      {/* <div className="w--full w-max--200 ">
        <FormSelect />
      </div>
      <div className="w--full w-max--200 ">
        <FormSelect />
      </div>
      <div className="w--full w-max--200 ">
        <FormSelect />
      </div> */}
    </div>
  </div>
</div>
<div className="d--flex gap--md w--full align-items--center position--relative slideMore">
  {/* <div className="w-min--60 h-min--60 w-max--60 h-max--60 w--full h--full radius--full c--pointer bg--black-50 d--flex align-items--center justify-content--center position--absolute left--4">
    <AngleLeftIcon />
  </div> */}

  {categoriesList && (
    <Swiper
      spaceBetween={10}
      centeredSlides={false}
      navigation={true}
      breakpoints={{
        // when window width is >= 640px
        640: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        // when window width is >= 768px
        768: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        // when window width is >= 1024px
        1024: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        1699: {
          slidesPerView: 5,
          spaceBetween: 10,
        },
      }}
      modules={[Navigation]}
      className="mySwiper"
    >
      <SwiperSlide key={"All Categories"} className="swiper_category">
        <div className={`w--full border-full--black-100 bg--${!selectedCategory ? "grey" : "white"} radius--sm h-min--60 gap--md p--sm d--flex align-items--center justify-content--start p-l--sm c--pointer`} onClick={() => setSelectedCategory("")}>
          <div className={`text--black-600 h-max--100 border-full--${!selectedCategory ? "white" : "black-100"} radius--sm h-min--50 w-min--50 w-max--50 d--flex align-items--center justify-content--center w-min--50 swiper_image1`}>
            <GalleryIcon width={30} height={30} />
          </div>
          <div className={`text--${!selectedCategory ? "white" : "black-800"} font--600 font--lg p-l--xl  `}>All Products</div>
        </div>
      </SwiperSlide>
      {categoriesList &&
        categoriesList?.data.length != 0 &&
        categoriesList?.data.map((category, index) => (
          <SwiperSlide key={index + 1}>
            <div className={`w--full border-full--black-100 bg--${selectedCategory == category.category_id ? "grey" : "white"} radius--sm h-min--60 gap--md p--sm d--flex align-items--center justify-content--start p-l--sm c--pointer`} onClick={() => setSelectedCategory(category.category_id)}>
              <div className={`text--black-600 h-max--100 border-full--${selectedCategory == category.category_id ? "white" : "black-100"} radius--sm h-min--50 w-min--50 w-max--50 d--flex align-items--center justify-content--center w-min--50 swiper_image`}>
                <img className="h-max--50 w-max--50  w--full radius--sm bg--black-100 h-min--50 p--xs" src={getMediaDomain(category.category_image)} alt="productImage" />
              </div>
              <div className={`text--${selectedCategory == category.category_id ? "white" : "black-800"} font--600 font--md p-l--xl`}>{category.category_name}</div>
            </div>
          </SwiperSlide>
        ))}

      {categoriesList.total > categorieLength && (
        <SwiperSlide key={"loadMore"}>
          <div className="w--full border-full--black-100 bg--white radius--full h-min--60 gap--md p--sm d--flex align-items--center justify-content--center p-l--sm">
            <div className="h-min--50 p--xs d--flex align-items--center">{isCategoriesFatching && <Spinner size="lg" />}</div>

            <div className="text--black-800 font--600 font--lg c--pointer" onClick={() => handleCategoryPageChange()}>
              Load more
            </div>
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  )}
</div>
<div className="w--full d--flex gap--md flex--column">
  <div className=" justify-content--between align-items--center">
    <div className="text--black-800 font--600 font--md white-space--nowrap ">All Products ({allProductList?.pagination.total || 0})</div>
    <div className="d--flex justify-content--end w--full gap--sm p-t--md p-b-sm">
      <Button variant="secondary" color="white" btnClasses="btn w-max--150 white-space--nowrap" onClick={() => navigate(`add-category`)}>
        <PlusIcon width={20} /> Add Category
      </Button>
      <Button variant="black" color="white" btnClasses="btn w-max--150 white-space--nowrap" onClick={() => navigate(`${PRODUCT_CONST.ADD_NEW}/${DETAIL_TABS_CONST.PRODUCT_DETAILS}`)}>
        <PlusIcon width={20} /> Add Product
      </Button>
    </div>
  </div>
  {/* {isLoading ? (
    <div className="w--full h--full stockProductList d--flex align-items--center justify-content--center bg--white radius--sm">
      <Spinner size="lg" />
    </div>
  ) : ( */}
  
  <div className="stockProductList overflow--auto">
    {allProductList && allProductList?.data.length != 0 ? (
      <div className="d--grid grid--1 grid--1--xl gap--md w--full">
        {allProductList?.data.map((product, index) => (
          <div className="bg--white radius--sm d--flex gap--md w--full p--md" key={index}>
            {/* <div className="w-min--40 w-max--40 d--flex flex--column gap--sm justify-content--center">
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer file--upload" onClick={() => handleShowModal(product)}>
                <input type="file" id="file-input" />
                <label htmlFor="file-input" className="d--flex align-items--center justify-content--center h--full w--full c--pointer">
                  <GallerysIcon width={18} htmlFor="file-input" />
                </label>
              </div>
              <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer">
              <CameraAddIcon width={18} />
            </div>
            </div> */}
            <div className="w-min--75 w-max--75 h-min--75 h-max--75 bg--contrast d--flex justify-content--center align-items--center c--pointer" onClick={() => handleShowModal(product)}>
              <img htmlFor="file-input" className="h--auto" src={getMediaDomain(product.product_image)} alt="" height="100%" />
            </div>
            <div className="d--flex gap--sm w--full">
              <div className="w--full d--flex flex--column gap--sm p-l--lg border-left--black-100">
                <div className="w--full d--flex gap--sm flex--column">
                  <div className="font--sm text--red font--600 white-space--nowrap" onClick={() => navigate(`${PRODUCT_CONST.EDIT_PRODUCT}/${DETAIL_TABS_CONST.PRODUCT_DETAILS}`, { state: { uuid: product.uuid } })}>
                    {product.product_name}
                  </div>
                </div>
                <div className="d--flex w--full">
                  <div className="w--full d--flex gap--sm flex--column">
                    <div className="font--sm text--black-600 font--500 white-space--nowrap" onClick={() => navigate(`${PRODUCT_CONST.EDIT_PRODUCT}/${DETAIL_TABS_CONST.PRODUCT_DETAILS}`, { state: { uuid: product.uuid } })}>
                      Code - {product.product_id}
                    </div>
                    <div className="text--black-600 font--500">
                      {product.product_size_amount || ""} {product.product_size_amount ? product.product_size_unit || "" : ""}
                    </div>
                    <div className="font--sm  font--600">A$ {product.product_price}</div>
                  </div>
                  {/* <div className="w--full d--flex flex--column justify-content--between gap--sm">
                    
              <div className="text--black-600 font--500 d--flex align-items--center gap--xs ">
                <SnackIcon width={18} />
                 Snacks
              </div>
                  </div> */}
                </div>
              </div>
              <div className=" d--flex align-items--end justify-content--end gap--sm ">
                <Button variant="black-50" color="black-800" btnClasses="btn btn--xs w-max--85 " onClick={() => navigate(`${PRODUCT_CONST.EDIT_PRODUCT}/${DETAIL_TABS_CONST.PRODUCT_DETAILS}`, { state: { uuid: product.uuid } })}>
                  <EditIcon width={16} />
                </Button>
                <Button variant="red-100" color="red" btnClasses="btn btn--xs w-max--85 " onClick={() => handleShowDeleteModal(product)}>
                  <TrashIcon width={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div class="d--flex justify-content--center align-items--center h--full font--md bg--white radius--sm">No record found</div>
    )}
  </div>
   
   

  {allProductList && allProductList.data.length != 0 && (
    <div className="d--flex justify-content-between align-items--center ">
      <div className="w--full d--flex gap--sm align-items--center">
        <div className="text--black">
          Total Records: {allProductList?.pagination?.total} &nbsp; | &nbsp; Showing Records: {allProductList?.pagination?.records}
        </div>
        <div className="w-max--100">
          <FormSelect value={length} onChange={(event) => setLength(event.target.value)} options={LOAD_MORE_ITEM_COUNT} />
        </div>
      </div>
      <div className="w--full w-max--150 text--primary text--r c--pointer d--flex justify-content--end  font--sm font--500">
        {allProductList?.pagination?.total > allProductList?.pagination?.records && (
          <div className="bg--black-50 text--black-800 radius--full w--full d--flex justify-content--start align-items--center h-min--36 p-l--md pr--md" onClick={() => handlePageChange()}>
            <div className="w-min--36 h-min--32 d--flex align-items--center justify-content--start">{/* {isFetching && <Spinner />} */}</div>
            <div className="d--flex">Load More</div>
          </div>
        )}
      </div>
      <div className="w--full"></div>
    </div>
  )}
  {/* <div>
    <Pagination key="Products-list" data={allProductList?.data || []} itemsPerPage={10} onPageChange={handlePageChange} total={allProductList?.pagination?.total} currentPageNo={page} />
  </div> */}

  <CommonModal show={showModal} onClose={handleCloseModal} title={"Product Images"} isShowCloseBtn={true}>
    <div className=" w--full w-max--800 w-min--800 d--flex flex--column gap--xl">
      <div className="d--flex align-items--center gap--md">
        <div className="d--flex flex--column w--full gap--sm">
          <div className=" font--sm  font--500 d--flex justify-content--start w--full text--black-600">Product image</div>
          <div className="w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center  border-full--black-100">
            <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{selectedProductDetails?.product_image ? <img className="h-max--200" src={getMediaDomain(selectedProductDetails?.product_image)} alt="productImage" /> : <GalleryIcon width={30} height={30} />}</div>
          </div>
        </div>
        <div className="d--flex flex--column w--full gap--sm">
          <div className=" font--sm  font--500 d--flex justify-content--start w--full text--black-600">Product More Info Image</div>
          <div className="w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center  border-full--black-100">
            <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{selectedProductDetails?.product_more_info_image ? <img className="h-max--200" src={getMediaDomain(selectedProductDetails?.product_more_info_image)} alt="productImage" /> : <GalleryIcon width={30} height={30} />}</div>
          </div>
        </div>
        <div className="d--flex flex--column w--full gap--sm">
          <div className=" font--sm  font--500 d--flex justify-content--start w--full text--black-600">Promotional Image</div>
          <div className="w--full h-min--200 position--relative radius--md  d--flex align-items--center justify-content--center  border-full--black-100">
            <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">{selectedProductDetails?.product_promo_image ? <img className="h-max--200" src={getMediaDomain(selectedProductDetails?.product_promo_image)} alt="productImage" /> : <GalleryIcon width={30} height={30} />}</div>
          </div>
        </div>
      </div>
      <div className="h-min--1 bg--black-100 "></div>
      {selectedProductDetails?.images.length != 0 && (
        <div className="d--flex flex--column gap--sm">
          <div class="w--full h-min--36 font--md font--600 align-items--center d--flex ">More Product Images</div>
          <div className="d--flex align-items--center gap--md bg--primary-25 p--sm radius--md">
            {selectedProductDetails?.images.map((el, i) => (
              <div className="w--full h-min--200 w-max--200 position--relative radius--md  d--flex align-items--center justify-content--center  border-full--black-100" key={i + 1}>
                <div className="w--full w-max--200 h-max--200 h-min--200 h--full d--flex align-items--center justify-content--center stockProductImagesTabImg  bg--black-25 ">
                  <img className="h-max--200" src={getMediaDomain(el?.image)} alt="productImage" />{" "}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </CommonModal>

  <CommonModal show={showDeleteModal} onClose={handleCloseDeleteModal} key={"deleteModal"} isShowCloseBtn={false}>
    <div className=" w--full w-max--300 w-min--300 d--flex flex--column gap--md p--xl">
      <div className="w--full p-t--md p-b--md">
        <div className="font--md text--c font--600 line-height--1-dot-5">Are you sure, you want to delete this product? This action cannot be undone! </div>
      </div>
      <div className="modal-foot h--full h-max--50 h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--center  gap--sm">
        <Button variant="black-100" color="black-800 w-max--200" btnClasses="btn" type="button" onClick={() => handleCloseDeleteModal()}>
          No
        </Button>
        <Button disabled={isPending} variant="primary" btnClasses="btn w-max--200" onClick={() => delete_Prouduct()}>
          Yes
        </Button>
      </div>
    </div>
  </CommonModal>
</div>
</div>

   )}

   </>
  );
}
