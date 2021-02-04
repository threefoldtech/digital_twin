<template>
 <div class="grid grid-cols-3 md:grid-cols-7 h-12 items-center">
   <img src="/TFN-black.svg" alt="TF-Logo" class="h-full ">
   <div class="col-end-13 text-right text-gray-500 flex items-center justify-end">
    <img :src="user.image" alt="User image" class="h-10 mr-4 bg-icon rounded-full">
    <span class="mr-2">{{user.name}}</span> 
   </div>
 </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {useAuthState} from "../store/authStore";

export default defineComponent({
  name: "Topbar",
  setup() {
    const {user} = useAuthState();
    return {
      user
    }
  }
});
</script>

<style scoped>
</style>