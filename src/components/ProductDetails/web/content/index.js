import React, { useEffect, useState } from "react";
import FormSelect from "../../../../Widgets/web/FormSelect";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import { useMediaQuery } from "react-responsive";

export default function ProductContent(props) {
  const { ArrowAngleLeftIcon, ArrowAngleRightIcon } = useIcons();
  const isMobile = useMediaQuery({ query: '(max-width:768px)'});

  return (

    <>
    { !isMobile && (
      <div className="w--full h--full d--flex flex--column stockProductContentTab">
        <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">
          Traditional Vend Content
        </div>
        <div className="d--flex flex--column justify-content--between h--full w--full bg--white gap--3xl radius--md p--lg stockProductContentTabList overflow--auto">
          <div className="d--flex justify-content--between h--full w--full">
            <div className="d--flex flex--column gap--md font--sm">
              <div className="w--full text--black-600 font--500">
                Banner Logos
              </div>
              <div className="w--full text--black-600 font--500">
                Bottom Banner Headers​
              </div>
              <div className="w--full text--black-600 font--500">
                Content Display Options​
              </div>
              <div className="w--full text--black-600 font--500">
                Did It Vend content Settings​
              </div>
            </div>
            <div className=" d--flex flex--column gap--md font--sm">
              <div className="w--full text--black-600 font--500">
                Screensaver Media
              </div>
              <div className="w--full text--black-600 font--500">
                Vending Page Content ​
              </div>
              <div className="w--full text--black-600 font--500">
                Content Display Timers ​
              </div>
              <div className="w--full text--black-600 font--500">
                Product Linked Content Settings​
              </div>
            </div>
            <div className=" d--flex flex--column gap--md font--sm">
              <div className="w--full text--black-600 font--500">
                Page Media Ads
              </div>
              <div className="w--full text--black-600 font--500">
                Thank You Screen content​
              </div>
              <div className="w--full text--black-600 font--500">
                Content Update Settings​
              </div>
              <div className="w--full text--black-600 font--500">
                Media Ad Interaction Settings
              </div>
            </div>
          </div>
          <div className="w--full d--flex gap--sm justify-content--center p-b--sm ">
            <Button
              variant="black"
              color="white"
              btnClasses="btn border-full--black-200 w-min--200 w-max--200"
              type="button"
              onClick={props.onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="orange"
              color="white"
              btnClasses="btn  w-min--200 w-max--200"
              type="button"
              onClick={props.onSubmit}
            >
              {props?.productDetails ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    )}

    { isMobile && (
      <div className="w--full h--full d--flex flex--column stockProductContentTab">
      <div className="w--full h-min--36 font--md font--600 align-items--center d--flex ">
        Traditional Vend Content
      </div>
      <div className="d--flex flex--column justify-content--between h--full w--full bg--white gap--lg radius--md  overflow--auto">
        <div className="d--flex justify-content--between h--full gap--md w--full">
          <div className="d--flex flex--column gap--sm font--sm">
            <div className="w--full text--black-600 font--500">
              Banner Logos
            </div>
            <div className="w--full text--black-600 font--500">
              Bottom Banner Headers​
            </div>
            <div className="w--full text--black-600 font--500">
              Content Display Options​
            </div>
            <div className="w--full text--black-600 font--500">
              Did It Vend content Settings​
            </div>
            <div className="w--full text--black-600 font--500">
              Screensaver Media
            </div>
            <div className="w--full text--black-600 font--500">
              Vending Page Content ​
            </div>
          </div>
          {/* <div className=" d--flex flex--column gap--md font--sm">
          </div> */}
          <div className=" d--flex flex--column gap--sm font--sm">
            <div className="w--full text--black-600 font--500">
              Content Display Timers ​
            </div>
            <div className="w--full text--black-600 font--500">
              Product Linked Content Settings​
            </div>
            <div className="w--full text--black-600 font--500">
              Page Media Ads
            </div>
            <div className="w--full text--black-600 font--500">
              Thank You Screen content​
            </div>
            <div className="w--full text--black-600 font--500">
              Content Update Settings​
            </div>
            <div className="w--full text--black-600 font--500">
              Media Ad Interaction Settings
            </div>
          </div>
        </div>
        <div className="w--full d--flex gap--sm align-items--center justify-content--center p-b--sm ">
          <Button
            variant="black"
            color="white"
            btnClasses="btn border-full--black-200 w-min--100 w-max--200"
            type="button"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="orange"
            color="white"
            btnClasses="btn  w-min--100 w-max--200"
            type="button"
            onClick={props.onSubmit}
          >
            {props?.productDetails ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </div>
    )}
    </>
  );
}
