import { reactive } from "@vue/reactivity";
import { User } from '../types';
import {popupCenter} from "@/services/popupService";

const authState = reactive<AuthState>({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
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

