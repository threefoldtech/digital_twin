<template>
  {{message.body}}
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "SystemContent",
  props: {
    message: {type: Object, required: true},
  },
  setup(props) {

    return {

    };
  }
});
</script>

