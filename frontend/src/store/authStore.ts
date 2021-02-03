import { reactive } from "@vue/reactivity";
import { User } from '../types';

const authState = reactive<AuthState>({
    // user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    user: {"id":window.location.host.split('.')[0],"image":"https://avatars.dicebear.com/4.5/api/avataaars/tobias3.svg","email":"testemail"}
});

export const useAuthState = () => {
    return {
        ...authState
    }
}

export const useAuthActions = () => {
    return {
    }
}

interface AuthState {
    user: User
}

