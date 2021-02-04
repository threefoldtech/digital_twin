import axios from "axios";
import {ref} from "vue";
import {reactive} from "@vue/reactivity";

export const statusList = reactive<Object>({})

export const fetchStatus = async digitalTwinId => {
  let url = "https://chatty.jimbertesting.be/api/user/getStatus";
  const response = await axios.get(url);
  let status = response.data;
  statusList[digitalTwinId] = status
  return status;
};
