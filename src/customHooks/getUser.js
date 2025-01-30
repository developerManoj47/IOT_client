import React, { useEffect } from "react";

const getUser = () => {
  let user;
  let isUser = false;

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    // console.log("user data : ", user);
    if (!user) {
      console.log("user is not available");
      isUser = false;
    } else if (Object.keys(user).length === 0) {
      isUser = false;
    } else {
      isUser = true;
    }
  }, [JSON.parse(localStorage.getItem("user"))]);

  if (isUser) {
    return {
      ...user,
      isUser,
    };
  } else {
    return {
      isUser,
    };
  }
};

export default getUser;
