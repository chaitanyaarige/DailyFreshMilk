import axiosInstance from "axiosConfig";

export const getUser = (token) => {
  return axiosInstance({
    method: "GET",
    url: "user/details",
    headers: {
      access_token: token,
    },
  });
};

export const editOtherUser = (data) => {
  return axiosInstance({
    method: "POST",
    url: "user/update",
    data: {
      name: data.name,
      email_id: data.email_id,
      address: data.address,
      customer_user_id: data.customer_user_id,
    },
    headers: {
      access_token: data.access_token,
    },
  });
};

export const editUser = (data) => {
  return axiosInstance({
    method: "POST",
    url: "user/update",
    data: {
      name: data.name,
      email_id: data.email_id,
    },
    headers: {
      access_token: data.access_token,
    },
  });
};

export const listUsers = (queryKeys) => {
  const { queryKey } = queryKeys;
  return axiosInstance({
    method: "POST",
    url: "/user/listUsers",
    data: {
      type_of_user: queryKey[0],
    },
    headers: { access_token: queryKey[1] },
  });
};

export const registerUser = (data) => {
  return axiosInstance({
    method: "POST",
    url: "/user/register/",
    data: data.user,
    headers: {
      access_token: data.access_token,
    },
  });
};

export const verifyRegisteredUser = (data) => {
  return axiosInstance({
    method: "GET",
    url: `/user/${data.verify_code}/verify/${data.otp}`,
  });
};
