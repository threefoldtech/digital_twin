import axios from "axios";
import { ref } from "vue";
import { reactive } from "@vue/reactivity";
import {useAuthState} from "@/store/authStore";

export const statusList = reactive<Object>({});
export const watchingUsers = [];

const fetchStatus = async digitalTwinId => {
  let url =
    window.location.origin === "http://localhost:8080"
      ? "http://localhost:3000/api/user/getStatus"
      : `https://${digitalTwinId}.digitaltwin.jimbertesting.be/api/user/getStatus`;
  // let url = `http://localhost:3000/api/user/getStatus`;
  const response = await axios.get(url);
  let status = response.data;
  statusList[digitalTwinId] = status;
  const {user} = useAuthState()

  if (user.id === digitalTwinId){
    user.status = status.status
    user.image = status.avatar ? status.avatar : user.image
  }

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
