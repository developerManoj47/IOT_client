export const handleApiError = (errCode) => {
  // 401, 403, 404, 500
  if (errCode === "UNAUTHORIZED_USER") {
    alert("No authorization token was found. please Logout and Sign in again.");
  } else if (errCode === "TOKEN_EXPIRED") {
    alert("Authorization token expired. please Logout and sign in again.");
  } else if (errCode === "TOKEN_INVALID") {
    alert("Invalid authentication token,please Logout and  sign in again.");
  } else if (errCode === "USER_NOT_FOUND") {
    alert(
      "Not validated as a registered user or removed by admin,please Logout and sign in with a registered account."
    );
  } else if (errCode === "FORBIDDEN_ACCESS") {
    alert("Access restricted to administrators only.");
  } else if (errCode === "INTERNAL_SERVER_ERROR") {
    alert(
      "Something went wrong on our end. Please refresh the page or come back later."
    );
  }
};

export const handleNetworkError = () => {
  console.log("axios error function called ");
  alert("Check you internet connection and try again.");
};
