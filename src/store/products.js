import axiosInstance from "axiosConfig";

export const listProducts = (queryKeys) => {
  const { queryKey } = queryKeys;
  return axiosInstance({
    method: "POST",
    url: "product/get",
    data: {
      availability: queryKey[0],
    },
    headers: { access_token: queryKey[1] },
  });
};

// export const getSingleProduct = (id, access_token) => {
//   return axiosInstance({
//     method: "POST",
//     url: `product/${id}`,
//     headers: { access_token: access_token },
//   });
// };

// export const updateProduct = (queryKeys) => {
//   const { queryKey } = queryKeys;
//   return axiosInstance({
//     method: "POST",
//     url: `/product/${queryKey[1]}/update`,
//     data: queryKey[2],
//     headers: { access_token: queryKey[0] },
//   });
// };

export const updateProduct = (access_token, id, data) => {
  return axiosInstance({
    method: "POST",
    url: `/product/${id}/update`,
    data: data,
    headers: { access_token: access_token },
  });
};

export const addProduct = (data) => {
  return axiosInstance({
    method: "POST",
    url: "product/add",
    data: data.product,
    headers: { access_token: data.access_token },
  });
};
