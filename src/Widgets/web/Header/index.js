import React, { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useIcons from "../../../Assets/web/icons/useIcons";
import Button from "../Button";
import Modal from "../Modal";
import Dropdown from "../Dropdown";
import QLogo from "../../../Assets/web/images/qlogo.png";
import Sidebar from "../Sidebar";
import { useMediaQuery } from 'react-responsive';

export default function Header() {
  const dropList = {
    component: ({ item }) => <div onClick={() => handleDropClick(item)}>{item?.title}</div>,
    data: [{ title: "Logout", value: "logout" }],
  };
  const [show, setshow] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { CallIcon, UserIcon, CaretIcon, BellIcon, LogoutIcon,HamburgerIcon } = useIcons();
    const [showSidebar, setShowSidebar] = useState(false);

  const { clearUser } = useAuth();

  const logout = () => {
    clearUser();
  };
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    setShowSidebar(!showSidebar);
  };

  const handleDropClick = (item) => {
    switch (item.value) {
      case "logout":
        logout();
        break;

      default:
        break;
    }
  };

  const dropEl = (
    <div className="d--flex align-items--center font--sm font--600 gap--sm">
      <Button btnClasses="btn bg--black-100 w-max--36" type="button" variant="primary" icon={<UserIcon width={20} height={20} />} color="orange" rounded />
      User Vend
    </div>
  );
  return (
    <>
    {!isMobile && (
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <img src={QLogo} alt="Logo" width={35} className="logo-img" />
          </div>
          <div className="actions-container">
            <Button
              btnClasses="btn bg--secondary-100 w-max--36"
              type="button"
              variant="orange"
              icon={<BellIcon width={20} height={20} />}
              color="secondary"
              rounded
            />
            {show && (
              <Modal handleClose={() => setshow(false)}>
                <h1>HI test modal</h1>
              </Modal>
            )}
            <Dropdown
              closeOnClickOutside={true}
              dropList={dropList}
              caretComponent={CaretIcon}
              showcaret={true}
            >
              {dropEl}
            </Dropdown>
          </div>
        </div>
      </header>
    )}

    {isMobile && (
      <header className="header">
        <div className="w--full  gap--sm d--flex">
          <div className="p-l--md">
            <div onClick={toggleSidebar}>
              <HamburgerIcon width={30} height={30} />
            </div>
            <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar}  />
          </div>
          <div className=" d--flex text--orange  justify-content--center  p-l--md">
            <img src={QLogo} alt="" width={28} className="logoImg" />
          </div>
        </div>
        <div className="w--full d--flex justify-content--end align-items--center">
          <Button btnClasses="btn bg--secondary-100 w-max--36" type="button" variant="orange" icon={<BellIcon width={20} height={20} />} color="orange" rounded />
          {show && (
            <Modal handleClose={() => setshow(false)}>
              <h1>HI test modal</h1>
            </Modal>
          )}
          <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={CaretIcon} showcaret={true}>
            {dropEl}
            <div className="d--flex ">
            </div>
          </Dropdown>
        </div>
      </header>
    )}
   </>
  );
}
