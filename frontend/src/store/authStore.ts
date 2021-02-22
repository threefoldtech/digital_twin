import { reactive } from "@vue/reactivity";
import { User } from "../types";

const authState = reactive<AuthState>({
  user: {
    id: window.location.host.split(".")[0].replace('localhost:8080','localhost:3000'),
    image: `${window.location.origin}/api/user/avatar/default`,
    email: "testemail",
    status: "",
    // @TODO implement this
    location: "@TODO implement this"
  }
});

export const useAuthState = () => {
  return {
    ...authState
  };
};

export const useAuthActions = () => {
  return {
  };
};

interface AuthState {
  user: User;
}
