import React, { useState, useContext, createContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { reset, setUser } from "../../redux/slices/authSlice";

import {
  clearLocalStorage,
  getToken,
  setTokenInLocalStorage,
} from "../../Helpers/web";
import { resetDateFilter } from "../../redux/slices/common-filter-slice";

const useAuth = () => {
  const dispatchAction = useDispatch();
  const [user, setCurrentUser] = useState(null);
  const [token, setToken] = useState(getToken());
  const [isUserLoading, setIsUserLoading] = useState(true);

  const setUsers = (payload) => {
    setCurrentUser(payload);
    setIsUserLoading(false);
  };

  const setUserToken = (response) => {
    setToken(response?.data.token);
    setTokenInLocalStorage(response?.data.token);
    dispatchAction(setUser(response?.data));
    // window.location.reload(true);
  };

  const clearUser = () => {
    clearLocalStorage();
    setCurrentUser(null);
    setToken(null);
    dispatchAction(reset());
    dispatchAction(resetDateFilter());
  };

  const values = useMemo(
    () => ({
      user,
      token,
      setUsers,
      clearUser,
      isUserLoading,
      setIsUserLoading,
      setUserToken,
    }),
    [user]
  );
  return values;
};

export default useAuth;
