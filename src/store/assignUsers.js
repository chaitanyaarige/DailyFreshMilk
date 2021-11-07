import axiosInstance from "axiosConfig";

export const assigningUsersToAgent = (access_token, assign_data) => {
  return axiosInstance({
    method: "POST",
    url: "/agentuser/assignUser",
    headers: { access_token: access_token },
    data: assign_data,
  });
};

export const listAgentUsers = (access_token, assign_data) => {
  return axiosInstance({
    method: "POST",
    url: "/agentuser/listAgentUsers",
    headers: { access_token: access_token },
    data: assign_data,
  });
};