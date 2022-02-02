import axiosInstance from "axiosConfig";

export const listDeliveryTypes = (access_token) => {
  return axiosInstance({
    method: "GET",
    url: "deliverytype/listdeliverytypes",
    headers: { access_token: access_token },
  });
};

export const updateDeliveryTypes = (access_token, senddata, id) => {
  return axiosInstance({
    method: "POST",
    url: `deliverytype/${id}/updatedeliverytype`,
    headers: { access_token: access_token },
    data: senddata,
  });
};

export const addDeliveryTypes = (access_token, data) => {
  return axiosInstance({
    method: "POST",
    url: "deliverytype/adddeliverytype",
    data: data,
    headers: { access_token: access_token },
  });
};

export const listAgentDelivery = (userid, access_token) => {
  return axiosInstance({
    method: "GET",
    url: `agent/${userid}/listDeliveries`,
    headers: { access_token: access_token },
  });
};

export const scannedDelivery = (data, access_token) => {
  return axiosInstance({
    method: "POST",
    url: "/agent/delivery",
    headers: { access_token: access_token },
    data: data,
  });
};

export const getHistory = (access_token, data) => {
  return axiosInstance({
    method: "POST",
    url: "/history/getHistory",
    headers: { access_token: access_token },
    data: data,
  });
};

export const cancelDelivery = (access_token, data) => {
  return axiosInstance({
    method: "POST",
    url: "agentuser/cancelDelivery",
    headers: { access_token: access_token },
    data: data,
  });
};
