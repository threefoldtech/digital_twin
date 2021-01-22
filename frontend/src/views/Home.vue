<template>
  <div class="grid place-items-center h-screen">
    <button @click="loginAndPush">Login</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import {login} from "@/services/authService";
export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter();
    const loginAndPush = async () => {
      await login();
      await router.push("/app");
    }

    return {
      loginAndPush
    }
  },
})
</script>

<style scoped>

</style>
