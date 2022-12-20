import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { envVariable } from "src/utils/constant";

const useAuth = () => {
  const [identity, setIdentity] = useState();

  // A custom hook that builds on useLocation to parse
  // the query string for you.
  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const saveToken = (accessToken) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      console.log(`Saved Token to local storage: ${accessToken}`);
      // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem("accessToken");
      // delete axios.defaults.headers.common.Authorization;
    }
  };

  const clearToken = () => {
    localStorage.removeItem("accessToken");
  };

  const getSavedToken = () => localStorage.getItem("accessToken");

  const query = useQuery();

  const fetchAccessToken = useCallback(async () => {
    try {
      let accessToken = getSavedToken();
      if (accessToken) return accessToken;

      const response = await axios.post(
        "https://api.freshbooks.com/auth/oauth/token",
        {
          grant_type: "authorization_code",
          client_id: envVariable.client_id,
          client_secret: envVariable.client_secret,
          code: query.get("code"),
          redirect_uri: envVariable.redirect_uri,
        }
      );
      accessToken = response.data.access_token;
      // console.log(`accessToken: ${accessToken}`);
      if (accessToken) saveToken(accessToken);

      return accessToken;
    } catch (err) {
      console.log("error happened");
      console.error(err);
    }
  }, [query]);

  const getIdentity = useCallback(async () => {
    try {
      const accessToken = await fetchAccessToken();
      if (!accessToken) {
        console.log("auth error");
        return;
      }

      const UserResponse = await axios.get(
        "https://api.freshbooks.com/auth/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log(UserResponse.data);
      setIdentity(UserResponse.data.response);
    } catch (err) {
      console.log("auth error");
      console.error(err);
      clearToken();
    }
  }, [fetchAccessToken]);

  useEffect(() => {
    getIdentity();
  }, [getIdentity]);

  return { identity, clearToken };
};

export default useAuth;
