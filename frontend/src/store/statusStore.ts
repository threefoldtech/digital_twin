import axios from "axios";
import {ref} from "vue";
import {reactive} from "@vue/reactivity";

export const statusList = reactive<Object>({})
export const watchingUsers = []


export const fetchStatus = async digitalTwinId => {
  if(watchingUsers.find(digitalTwinId)){
    return
  }
  watchingUsers.push(digitalTwinId)
  let url = `https://${digitalTwinId}.digitaltwin.jimbertesting.be/api/user/getStatus`;
  // let url = `http://localhost:3000/api/user/getStatus`;
  const response = await axios.get(url);
  let status = response.data;
  statusList[digitalTwinId] = status
  return status;
};
