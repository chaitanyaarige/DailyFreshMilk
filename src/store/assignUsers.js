import axiosInstance from "axiosConfig";

export const assigningUsersToAgent = (access_token, assign_data) => {
  return axiosInstance({
    method: "POST",
    url: "/agentuser/assignUser",
    headers: { access_token: access_token },
    data: assign_data,
  });
};

export const listAgentUsers = (queryKeys) => {
  const { queryKey } = queryKeys;
  return axiosInstance({
    method: "POST",
    url: "/agentuser/listAgentUsers",
    data: queryKey[1],
    headers: { access_token: queryKey[0] },
  });
};

export const updateLocationOfUser = (access_token, latlong, delivery_id) => {
  return axiosInstance({
    method: "POST",
    url: `agentuser/${delivery_id}/updatedUserDeliveryDetails`,
    data: latlong,
    headers: { access_token: access_token },
  });
};
