import axios from "axios";
import { ref } from "vue";
import { reactive } from "@vue/reactivity";
import {useAuthState} from "@/store/authStore";
import {calculateBaseUrl} from "../services/urlService"

export const statusList = reactive<Object>({});
export const watchingUsers = [];

export const fetchStatus = async digitalTwinId => {
  const baseLocation = calculateBaseUrl(digitalTwinId)
  let url = `${baseLocation}/api/user/getStatus`;
  const response = await axios.get(url);
  let status = response.data;
  statusList[digitalTwinId] = status;
  return status;
};

export const startFetchStatusLoop = digitalTwinId => {
  if (watchingUsers.find(wu => wu === digitalTwinId)) {
    return;
  }
  watchingUsers.push(digitalTwinId);
  fetchStatus(digitalTwinId);

  setInterval(() => {
    try {
      fetchStatus(digitalTwinId);
    } catch (e) {}
  }, 5000);
};
