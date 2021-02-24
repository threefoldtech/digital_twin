<template>
  <a
      class="py-2 px-2 bg-blue-300 border-r-2"
      :href="fileUrl"
      download
  >{{ message.body.filename }}</a
  >
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {getFileUrl} from "@/services/urlService";


export default defineComponent({
  name: "FileContent",
  props: {
    message: {type: Object, required: true},
  },
  setup(props) {
    const fileUrl = getFileUrl(props.message);

    return {fileUrl};
  }
});
</script>

