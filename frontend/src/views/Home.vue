<template>
  <div class="grid place-items-center h-screen">

    <input selected v-model="userName" autofocus="autofocus">
    <button @click="loginAndPush">Login</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import {useAuthActions} from "../store/authStore";
export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter();
    const {login} = useAuthActions();
    const userName = ref("Jason Parser")
    const loginAndPush = (() => {
      login(userName.value);
      router.push("/app");
    })

    return {
      loginAndPush,
      userName
    }
  },
})
</script>

<style scoped>

</style>