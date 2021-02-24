<template>
  <div class="gif flex items-center justify-center pt-2">
    <img class="h-48 self-center block " :src="fileUrl" alt="">
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {getFileUrl} from "@/services/urlService";

export default defineComponent({
  name: "ImageContent",
  props: {
    message: {type: Object, required: true},
  },
  setup(props) {
    const fileUrl = getFileUrl(props.message);

    return {fileUrl};
  }
});
</script>

