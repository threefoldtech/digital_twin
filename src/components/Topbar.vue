<template>
 <div class="grid grid-cols-12 h-12 items-center">
   <div class="bg-icon mr-4 h-full place-items-center grid">
     LOGO
   </div>
   <div class="col-span-2 col-end-13 text-right mr-5 text-gray-500 flex items-center justify-end">
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