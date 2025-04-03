"use client";
import React, { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { TouchableOpacity, StyleSheet, View } from 'react-native';

import useAuth from "../../../Hooks/useAuth";
import useIcons from "../../../Assets/web/icons/useIcons";
import useClickOutsideDetector from "../ClickOutsideDetector";
import { useMediaQuery } from 'react-responsive';

const StockCollapse = (props) => {
  const { AngleRightIcon } = useIcons();
  const Icon = props?.Icon ?? null;
  const openSidebar = () => {
    if (props?.index == props?.opendSidebarIndex) {
      props.setOpendSidebarIndex(null);
    } else props.setOpendSidebarIndex(props.index);
  };
  const handleSelectItem = (item) => {
    // Call this function to close the sidebar when an item is clicked
    props.setShowSidebar(false); 
  };

  return (
    <div onClick={() => openSidebar()} className="d--flex flex--column dropMenu position--relative h-min--42">
      <div className="d--flex align-items--center justify-content--between h-min--42 font--sm text--black d--flex gap--sm p-l--lg p-r--md c--pointer dropLink border-bottom--black-100">
        <div className="d--flex gap--sm align-items--center navLink">
          <div className="text--orange m-l--sm d--flex">{Icon && <Icon width={21} height={21} />}</div>
          <span className="sideBarItem white-space--nowrap font--sm bg--white h-min--40 d--flex align-items--center font--500">{props.label}</span>
        </div>
        <div className="w-min--8 w-max--8 text--grey m-t--xs position--absolute right--8">
          <AngleRightIcon width={15} height={15} />
        </div>
      </div>
      {props?.index == props?.opendSidebarIndex ? (
        <div className="w--full bg--white  gap--xs d--flex flex--column dropList  w-min--150 h-max--200 overflow--auto ">
          {props?.list?.length &&
            props?.list?.map((list) => {
              return (
                <NavLink key={list.id} to={list.path} onClick={() => handleSelectItem(list)} className="d--flex align-items--center justify-content--start  d--flex  p-r--md p-l--3xl h-min--42 font--sm text--black c--pointer dropItems  border-width--4 border-left--transparent">
                  {list?.lable}
                </NavLink>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default function Sidebar({ isVisible, toggleSidebar}) {
  const { clearUser } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [opendSidebarIndex, setOpendSidebarIndex] = useState(null);
  const mySidebarRef = useRef();
  const { DashboardIcon, GroupIcon, ScanCodeIcon, SnapShotIcon, AlertIcon, MachineIcon, ProductIcon, StockIcon, PaymentIcon, OperationsIcon, MarketingIcon, ReportIcon, VendrunIcon, AssetsIcon, AngleRightIcon, SetUpIcon, SignOutIcon, LogoutIcon, ArrowRightIcon,HamburgerIcon } = useIcons();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    {
      id: 1,
      label: "Home",
      icon: DashboardIcon,
      path: "home",
      isDropdown: false,
    },
    {
      id: 2,
      label: "Payment",
      icon: PaymentIcon,
      path: "payments",
      isDropdown: false,
    },
    {
      id: 3,
      label: "Scan Code",
      icon: ScanCodeIcon,
      path: "scan-code",
      isDropdown: false,
    },
    {
      id: 4,
      label: "Alerts",
      icon: AlertIcon,
      path: "alerts",
      isDropdown: true,
      component: StockCollapse,
      list: [
        {
          id: 1,
          lable: "All",
          icon: "",
          path: "alerts/all",
        },
        {
          id: 2,
          lable: "Payments",
          icon: "",
          path: "alerts/payments",
        },
        {
          id: 3,
          lable: "Stock",
          icon: "",
          path: "alerts/stock",
        },
        {
          id: 4,
          lable: "Operation",
          icon: "",
          path: "alerts/operations",
        },
        {
          id: 5,
          lable: "Assets",
          icon: "",
          path: "alerts/assets",
        },
        {
          id: 6,
          lable: "Marketing",
          icon: "",
          path: "alerts/marketing",
        },
      ],
    },
    {
      id: 5,
      label: "Snapshot",
      icon: SnapShotIcon,
      path: "snapshot",
      isDropdown: false,
    },
    {
      id: 6,
      label: "Machines",
      icon: MachineIcon,
      path: "machines",
      isDropdown: false,
    },
    {
      id: 7,
      label: "Products",
      icon: ProductIcon,
      path: "products",
      isDropdown: false,
    },
    {
      id: 8,
      label: "Stock",
      icon: StockIcon,
      path: "stock",
      isDropdown: true,
      component: StockCollapse,
      list: [
        {
          id: 1,
          lable: "Stock level",
          icon: "",
          path: "stock",
        },
        {
          id: 2,
          lable: "Refill",
          icon: "",
          path: "refill",
        },
        {
          id: 3,
          lable: "Products",
          icon: "",
          path: "products",
        },
        {
          id: 4,
          lable: "Layout",
          icon: "",
          path: "product-layout",
        },
        {
          id: 5,
          lable: "Re-order",
          icon: "",
          path: "reorder/supplier-order",
        },
        {
          id: 6,
          lable: "Reports",
          icon: "",
          path: "",
        },
      ],
    },
    {
      id: 9,
      label: "Operations",
      icon: OperationsIcon,
      path: "operations",
      isDropdown: false,
    },
    {
      id: 10,
      label: "Marketing",
      icon: MarketingIcon,
      path: "marketing",
      isDropdown: false,
    },
    {
      id: 11,
      label: "Reports",
      icon: ReportIcon,
      path: "reports",
      isDropdown: true,
      component: StockCollapse,
      list: [
        {
          id: 1,
          lable: "Sales",
          icon: "",
          path: "report/sales",
        },
        {
          id: 2,
          lable: "Refill",
          icon: "",
          path: "report/refill",
        },
        {
          id: 3,
          lable: "Stock Level",
          icon: "",
          path: "report/stock-level",
        },
        {
          id: 4,
          lable: "Vend Activity",
          icon: "",
          path: "report/vend-activity",
        },
        {
          id: 5,
          lable: "Expiry Product",
          icon: "",
          path: "report/expiry-product",
        },
        {
          id: 6,
          lable: "Vend Error / Feedback",
          icon: "",
          path: "report/vend-error",
        },
        {
          id: 7,
          lable: "Client Feedback",
          icon: "",
          path: "report/client-fedback",
        },
        {
          id: 8,
          lable: "Media Ad",
          icon: "",
          path: "report/media-ad",
        },
        {
          id: 9,
          lable: "Staff",
          icon: "",
          path: "report/staff",
        },
        {
          id: 10,
          lable: "Service",
          icon: "",
          path: "report/service",
        },
        {
          id: 11,
          lable: "Customer",
          icon: "",
          path: "report/customer",
        },
        {
          id: 12,
          lable: "eReceipt",
          icon: "",
          path: "report/e-receipt",
        },
        {
          id: 13,
          lable: "Gift Vend",
          icon: "",
          path: "report/gift-vend",
        },
        {
          id: 14,
          lable: "Payment",
          icon: "",
          path: "report/payment",
        },
      ],
    },
    {
      id: 12,
      label: "Vend Run",
      icon: VendrunIcon,
      path: "vend-run",
      isDropdown: false,
    },
    {
      id: 13,
      label: "Assets",
      icon: AssetsIcon,
      path: "Assets",
      isDropdown: false,
    },
    {
      id: 14,
      label: "Setup",
      icon: SetUpIcon,
      path: "Setup",
      isDropdown: false,
    },
  ];

  const logout = () => {
    clearUser();
  };

  const handleOutsideclick = () => {
    setOpendSidebarIndex(null);
  };
  const handleHamburger = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
 
  const handlesidebar=()=>{
    setShowSidebar(!showSidebar);
  }
const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  useClickOutsideDetector([mySidebarRef], handleOutsideclick);
 
  return (
    <>
    {!isMobile && (
    
    <aside ref={mySidebarRef} className={`sidebar  d--flex flex--column w--full  bg--white radius--sm text--white p-t- p-b--md gap--md h-min--50 w-max--${showSidebar ? "200" : "66"}  h--full  left--0  z-index--sm `}>
     
      <div onClick={handlesidebar} className={`position--absolute ${showSidebar ? "rotate--180" : ""} right---10 top--4 z-index--md  text--white w-min--20 h-min--20 w-max--20 h-max--20 bg--orange radius--full w--full h--full d--flex align-items--center justify-content--center c--pointer`}>

        <ArrowRightIcon width={16} />
      </div>
      {/* <div className=" d--flex text--primary  justify-content--center h-min--50 ">
        <img src={QLogo} alt="" width={42} className="logoImg" />
      </div> */}
      <div className="d--flex flex--column   w--full h--full ">
        {tabs &&
          tabs.length > 0 &&
          tabs.map(({ id, label, icon: Icon, path, component: Component, isDropdown, list }, index) => {
            if (isDropdown) {
              return <Component {...{ id, label, Icon, path, list, index, setOpendSidebarIndex, opendSidebarIndex,setShowSidebar,showSidebar}} key={id} />;
            }
            return (
              <NavLink
                key={id}
                to={path}
                // data-link-hover
                onClick={(event) => {
                  setShowSidebar(!showSidebar);
                  setOpendSidebarIndex(null);
                }}
                className={({ isActive }) => `${isActive ? " text--orange" : "text--black"}  d--flex align-items--center justify-content--start border-bottom--black-100 p-l--xl   d--flex gap--sm    h-min--42 font--500  `}
              >
                <span className="text--orange d--flex iconItem">
                  {" "}
                  <Icon width={20} height={20} />{" "}
                </span>
                {/* <span
                className="text--primary d--flex iconItemTool  z-index--md"
                data-tooltip={label}
                tooltip-position="right"
              >
                <Icon width={20} height={20} />{' '}
              </span> */}
                <span className="sideBarItem white-space--nowrap font--sm">{label}</span>
              </NavLink>
            );
          })}
      </div>
      {/* <div className="d--flex ">
        <Button
          btnClasses="d--flex align-items--center justify-content--start c--pointer font--600"
          type="button"
          variant="transparent"
          icon={<LogoutIcon width={20} height={20} />}
          color="black"
          onClick={() => logout()}
        >
          <span className="sideBarItem">Logout</span>
        </Button>
      </div> */}
    </aside>
      )}
       {isMobile && (
        <div>
          <div>
          
            </div>
            {isVisible && (
         <aside
         ref={mySidebarRef}
         className={`sidebar mobile-sidebar d--flex flex--column w--full h--full bg--white radius--sm text--white p-t--lg p-b--md gap--md h-min--50 
           w-max--${isVisible && showSidebar ? "200" : "66"} 
           h--full position--absolute left--0 z-index--sm box-shadow`}
       >
     
         <div onClick={handlesidebar} className={`position--absolute ${showSidebar ? "rotate--180" : ""} right---10 top---2 z-index--md  text--white w-min--20 h-min--20 w-max--20 h-max--20 bg--orange radius--full w--full h--full d--flex align-items--center justify-content--center c--pointer`}>
   
           <ArrowRightIcon width={16} />
         </div>
         {/* <div className=" d--flex text--primary  justify-content--center h-min--50 ">
           <img src={QLogo} alt="" width={42} className="logoImg" />
         </div> */}
         <div className="d--flex flex--column   w--full h--full bg--white">
           {tabs &&
             tabs.length > 0 &&
             tabs.map(({ id, label, icon: Icon, path, component: Component, isDropdown, list }, index) => {
               if (isDropdown) {
                 return <Component {...{ id, label, Icon, path, list, index, setOpendSidebarIndex, opendSidebarIndex,setShowSidebar,showSidebar}} key={id} />;
               }
               return (
                 <NavLink
                   key={id}
                   to={path}
                   // data-link-hover
                   onClick={(event) => {
                    setShowSidebar(!showSidebar);
                     setOpendSidebarIndex(null);
                    
                   }}
                   className={({ isActive }) => `${isActive ? " text--orange" : "text--black"}  d--flex align-items--center justify-content--start border-bottom--black-100 p-l--xl   d--flex gap--sm    h-min--42 font--500  `}
                 >
                   <span className="text--orange d--flex iconItem">
                     {" "}
                     <Icon width={20} height={20} />{" "}
                   </span>
                   {/* <span
                   className="text--primary d--flex iconItemTool  z-index--md"
                   data-tooltip={label}
                   tooltip-position="right"
                 >
                   <Icon width={20} height={20} />{' '}
                 </span> */}
                  <span className="sideBarItem white-space--nowrap font--sm">{label}</span>
                 </NavLink>
               );
             })}
         </div>
         {/* <div className="d--flex ">
           <Button
             btnClasses="d--flex align-items--center justify-content--start c--pointer font--600"
             type="button"
             variant="transparent"
             icon={<LogoutIcon width={20} height={20} />}
             color="black"
             onClick={() => logout()}
           >
             <span className="sideBarItem">Logout</span>
           </Button>
         </div> */}
       </aside>
            )}
       </div>
       )}

</>
    
  );
}
