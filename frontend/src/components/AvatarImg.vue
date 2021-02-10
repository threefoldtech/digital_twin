<template>
  <img
      :src="src"
      alt="User image"
      class="bg-icon rounded-full"
      :class='{
        "h-12 w-12": !small,
        "h-8 w-8": small
      }'
  />
</template>
<script lang="ts">
import {computed} from "vue";
import {startFetchStatusLoop, statusList} from "@/store/statusStore";

export default {
  name: 'AvatarImg',
  props: {
    id: {required: true},
    small: {required: false, default: false, type: Boolean}
  },
  setup(props) {
    startFetchStatusLoop(props.id)

    const status = computed(() => {
      return statusList[props.id]
    })
    const src = computed(() => {
      if (!status.value || !status.value.avatar) {
        return `https://avatars.dicebear.com/4.5/api/avataaars/${encodeURI(
            props.id
        )}.svg`;
      }
      return status.value.avatar;

    })


    return {
      src
    }
  }
}
</script>
