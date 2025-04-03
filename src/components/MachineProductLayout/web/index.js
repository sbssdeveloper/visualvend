import React, { useEffect, useState } from "react";
import Pagination from "../../../Widgets/web/Pagination";
import FormInput from "../../../Widgets/web/FormInput";
import FormSelect from "../../../Widgets/web/FormSelect";
import useIcons from "../../../Assets/web/icons/useIcons";
import Button from "../../../Widgets/web/Button";
import { useNavigate } from "react-router-dom";

export default function MachineProductLayout() {
  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 4,
    swipeToSlide: true,
    // afterChange: function (index) {
    //   console.log(
    //     `Slider Changed to: ${index + 1}, background: red; color: #bada55`
    //   );
    // },
  };
  const { SearchIcon, GalleryIcon, PlusIcon, AngleLeftIcon } = useIcons();
  const navigate = useNavigate();

  return (
    <div className="w--full d--flex flex--column gap--md stockProductLayOutPage h--full">
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Machine Product Layout</div>
          </div>
          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <div className="w--full w-max--250 position--relative">
              <FormInput placeholder="Search" />
              <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
                <SearchIcon width={15} />
              </div>
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
          </div>
        </div>
      </div>
      <div className="w--full d--flex justify-content--between gap--xl bg--white p--md radius--md">
        <div className="w--full d--flex gap--sm w-max--400">
          <FormSelect />
        </div>
        <div className="w--full d--flex gap--sm justify-content--end w-max--200">
          <Button variant="primary" color="white" btnClasses="btn w-max--75">
            <PlusIcon width={20} /> Add
          </Button>
        </div>
      </div>
      <div className="w--full d--flex flex--column gap--sm">
        <div className="d--flex justify-content--between h-min--36 align-items--center">
          <div className="text--black-800 font--600 font--md white-space--nowrap ">Products in Aisle Selections</div>
        </div>
        {/* <div className="w--full  slickSlider">
          <Slider {...settings}>
            <div>
              <div className="w--full border-full--black-100 bg--white radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
                <div className="text--black-600">
                  <GalleryIcon width={70} height={70} />
                </div>
                <div className="text--black-800 font--500 font--md">Row 1</div>
              </div>
            </div>
            <div>
              <div className="w--full border-full--black-100 bg--white radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
                <div className="text--black-600">
                  <GalleryIcon width={70} height={70} />
                </div>
                <div className="text--black-800 font--500 font--md">Row 2</div>
              </div>
            </div>
            <div>
              <div className="w--full border-full--black-100 bg--white radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
                <div className="text--black-600">
                  <GalleryIcon width={70} height={70} />
                </div>
                <div className="text--black-800 font--500 font--md">Row 3</div>
              </div>
            </div>
            <div>
              <div className="w--full border-full--black-100 bg--white radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
                <div className="text--black-600">
                  <GalleryIcon width={70} height={70} />
                </div>
                <div className="text--black-800 font--500 font--md">Row 4</div>
              </div>
            </div>
          </Slider>
        </div> */}
        <div className="d--flex gap--md w--full align-items--center position--relative slideMore">
          {/* <div className="w-min--60 h-min--60 w-max--60 h-max--60 w--full h--full radius--full c--pointer bg--black-50 d--flex align-items--center justify-content--center position--absolute left--4">
            <AngleLeftIcon />
          </div> */}

          <div className="w--full border-full--black-100 bg--white radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
            <div className="text--black-600">
              <GalleryIcon width={70} height={70} />
            </div>
            <div className="text--black-800 font--500 font--md">Row 1</div>
          </div>
          <div className="w--full border-full--black-100 bg--white radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
            <div className="text--black-600">
              <GalleryIcon width={70} height={70} />
            </div>
            <div className="text--black-800 font--500 font--md">Row 2</div>
          </div>
          <div className="w--full border-full--black-100 bg--white radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
            <div className="text--black-600">
              <GalleryIcon width={70} height={70} />
            </div>
            <div className="text--black-800 font--500 font--md">Row 3</div>
          </div>
          <div className="w--full border-full--black-100 bg--white radius--sm h-min--200 d--flex align-items--center justify-content--center flex--column">
            <div className="text--black-600">
              <GalleryIcon width={70} height={70} />
            </div>
            <div className="text--black-800 font--500 font--md">Row 4</div>
          </div>
        </div>
      </div>
      <div className="w--full d--flex gap--md flex--column">
        <div className="stockProductLayOutList w--full overflow--auto">
          <div className="d--grid grid--2 grid--2--xl gap--md w--full ">
            <div className="bg--white radius--sm d--flex gap--md w--full p--md align-items--center" onClick={() => navigate(`/product-layout/1/details`)}>
              <div className=" d--flex gap--sm flex--column align-items--center ">
                <div className="label--control font--sm text--black-600 font--500 white-space--nowrap">Aisle</div>
                <div className="font--md text--red font--900 white-space--nowrap">10</div>
                <div className="text--black font--500 white-space--nowrap">5 of 8</div>
              </div>
              <div className="w-min--75 w-max--75 h-min--75 h-max--75 bg--contrast d--flex justify-content--center align-items--center"></div>
              <div className="w--full d--flex gap--lg p-l--lg border-left--black-100">
                <div className="w--full d--flex gap--md flex--column  justify-content--between">
                  <div className="font--md text--red font--600">Smiths</div>
                  <div className="font--sm text--black--800 font--500">Cheese & Onion</div>
                  <div className="w--full h-min--2 bg--black-100">
                    <div className="w-max--50 h-min--2 bg--primary"></div>
                  </div>
                </div>
                <div className="w--full w-max--200 d--flex flex--column align-items--end justify-content--between gap--sm">
                  <div className="text--black-600 font--500 text--r">nnn gms</div>
                  <div className="font--md text--red font--600 text--r w--full">A$ 3.00</div>
                </div>
              </div>
            </div>
            <div className="bg--white radius--sm d--flex gap--md w--full p--md align-items--center">
              <div className=" d--flex gap--sm flex--column align-items--center ">
                <div className="label--control font--sm text--black-600 font--500 white-space--nowrap">Aisle</div>
                <div className="font--md text--red font--900 white-space--nowrap">10</div>
                <div className="text--black font--500 white-space--nowrap">5 of 8</div>
              </div>
              <div className="w-min--75 w-max--75 h-min--75 h-max--75 bg--contrast d--flex justify-content--center align-items--center"></div>
              <div className="w--full d--flex gap--lg p-l--lg border-left--black-100">
                <div className="w--full d--flex gap--md flex--column  justify-content--between">
                  <div className="font--md text--red font--600">Smiths</div>
                  <div className="font--sm text--black--800 font--500">Cheese & Onion</div>
                  <div className="w--full h-min--2 bg--black-100">
                    <div className="w-max--50 h-min--2 bg--primary"></div>
                  </div>
                </div>
                <div className="w--full w-max--200 d--flex flex--column align-items--end justify-content--between gap--sm">
                  <div className="text--black-600 font--500 text--r">nnn gms</div>
                  <div className="font--md text--red font--600 text--r w--full">A$ 3.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Pagination
            // key="Products-list"
            // data={allProductList?.data || []}
            itemsPerPage={10}
            // onPageChange={handlePageChange}
            // total={allProductList?.total}
            // currentPageNo={page}
          />
        </div>
      </div>
    </div>
  );
}
