import React, { useEffect, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import FormSelect from "../../../../Widgets/web/FormSelect";
import Button from "../../../../Widgets/web/Button";
import useIcons from "../../../../Assets/web/icons/useIcons";

export default function SpecificProductDetails() {
  const { SearchIcon, RefreshIcon, SnackIcon, CameraAddIcon, EmptyBettryhIcon, HalfBettryhIcon, SetUpIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md stockProductLayOutPage h--full">
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Smiths Cheese & Onion</div>
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
        <div className="w--full d--flex align-items--center gap--sm w-max--400 font--600 font--sm">Refilled 23 Sep 23:13:44</div>
        <div className="w--full d--flex gap--sm justify-content--end w-max--200">
          <div className="d--flex align-items--center justify-content--center w-min--36 w-max--36 h-min--36 bg--primary p--xs radius--sm text--white">
            <RefreshIcon width={20} />
          </div>
        </div>
      </div>
      <div className="w--full d--flex justify-content--between gap--xl bg--white p--sm radius--md">
        <div className="bg--white radius--sm d--flex gap--md w--full p--md align-items--center">
          <div className=" d--flex gap--sm flex--column align-items--center ">
            <div className="w-min--36 w-max--36 h-min--36 h-max--36 w--full h--full radius--full bg--black-50 d--flex justify-content--center align-items--center c--pointer">
              <CameraAddIcon width={15} />
            </div>
          </div>
          <div className="w-min--75 w-max--75 h-min--75 h-max--75 bg--contrast d--flex justify-content--center align-items--center"></div>
          <div className="w--full d--flex gap--lg p-l--lg border-left--black-100">
            <div className="w--full d--flex gap--md flex--column  justify-content--between">
              <div className="font--md text--red font--600">Smiths</div>
              <div className="font--sm text--black--800 font--500">Cheese & Onion</div>
              <div className="text--black-600 font--500 ">nnn gms</div>
            </div>
            <div className="w--full w-max--200 d--flex flex--column align-items--end justify-content--between gap--sm">
              <div className="font--md text--red font--600 text--r w--full">A$ 3.00</div>

              <div className="text--black-600 font--500 d--flex align-items--center gap--xs ">
                <SnackIcon width={18} /> Snacks
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d--flex flex--column gap--sm">
        <div className="d--flex justify-content--between h-min--36 align-items--center">
          <div className="text--black-800 font--600 font--md white-space--nowrap ">Current Stock / Max Qty Levels</div>
        </div>
        <div className="d--flex gap--xl">
          <div className="w--full d--flex flex--column gap--lg bg--white p--md radius--md">
            <div className="d--flex gap--sm text--black-800 font--sm font--400 c--pointer">
              <input type="checkbox" className="form--control" name="saveCard" />
              Apply Empty, Refill or Part Fill to all same Products (S2S)
            </div>
            <div className="d--flex gap--xl justify-content--between">
              <Button variant="black-50" color="black-600" btnClasses="btn gap--sm">
                <EmptyBettryhIcon width={20} />
                Empty
              </Button>
              <Button variant="black-50" color="black-600" btnClasses="btn gap--sm">
                <HalfBettryhIcon width={20} />
                Part Fill
              </Button>
              <Button variant="black-50" color="black-600" btnClasses="btn gap--sm">
                <RefreshIcon width={20} />
                Refill
              </Button>
            </div>
            <div className="d--flex flex--column gap--md">
              <div className="font--md font--600 d--flex justify-content--end">5 of 8</div>
              <div className="w--full h-min--2 bg--black-100">
                <div className="w-max--50 h-min--2 bg--primary"></div>
              </div>
            </div>
          </div>
          <div className="w--full d--flex flex--column gap--lg bg--white p--md radius--md">
            <div className="d--flex justify-content--between w--full  h-max--50 border-bottom--black-100 p-b--md">
              <div className="w--full ">
                <FormSelect />
              </div>
              <div className=" w--full d--flex align-items--center justify-content--end gap--sm">
                <div className="text--primary font--md">10.20</div>
                <div className="c--pointer d--flex">
                  <SetUpIcon width={20} />
                </div>
              </div>
            </div>
            <div className="d--flex justify-content--between w--full align-items--center font--sm gap--md">
              <div className="label--control font--sm text--black-600 font--500 d--flex gap--lg align-items--center  ">Pricing</div>
              <div className="d--flex gap--sm text--black-800 font--sm font--400 c--pointer">
                <input type="checkbox" className="form--control" name="saveCard" />
                Load default product price
              </div>
            </div>
            <div className="d--flex justify-content--between w--full align-items--center font--sm gap--md">
              <div className="d--flex gap--xl align-items--center w--full">
                <div className="w--full w-max--100 font--sm font--600">Selling Price</div>
                <div className="w--full ">
                  <FormSelect />
                </div>
              </div>
              <div className="w--full font--md font--600 text--r">3.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
