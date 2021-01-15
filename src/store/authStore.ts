import { reactive } from "@vue/reactivity";
import { User } from '../types';

const authState = reactive<AuthState>({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
});

const login = (name) => {
    const user = {
        name, 
        image:`https://avatars.dicebear.com/4.5/api/avataaars/${encodeURIComponent(name)}.svg`,
        email: `${name.replace(/ /g,'')}@domain.com`
    }
    authState.user = user;
    localStorage.setItem('user', JSON.stringify(user))
}

export const useAuthState = () => {
    return {
        ...authState
    }
}

export const useAuthActions = () => {
    return {
        login
    }
}

interface AuthState {
    user: User
}

