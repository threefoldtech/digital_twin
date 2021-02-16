import axios from "axios";
import config from "../../public/config/config";

export const getBlockList = async () => {
  let axiosResponse = await axios.get(`${config.baseUrl}api/blocked/`, {});
  return axiosResponse.data;
};
export const deleteBlockedEntry = async user => {
  await axios.delete(`${config.baseUrl}api/blocked/${user}/`);
};
