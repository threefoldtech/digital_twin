<template>
  <div class="grid place-items-center h-screen">
    <button @click="loginAndPush">Login</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import {useAuthActions} from "../store/authStore";
export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter();
    const {login} = useAuthActions();
    const loginAndPush = (() => {
      login('Jason Parser');
      router.push("/app");
    })

    return {
      loginAndPush
    }
  },
})
</script>

<style scoped>

</style>