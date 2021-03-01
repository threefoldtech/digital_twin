<template>
  <img
      :src="src"
      alt="User image"
      class="bg-icon rounded-full"
      :title="id"
      :class='{
        "h-12 w-12": !small && !xsmall,
        "h-8 w-8": small,
        "h-6 w-6": xsmall
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
    small: {required: false, default: false, type: Boolean},
    xsmall: {required: false, default: false, type: Boolean}
  },
  setup(props) {
    // startFetchStatusLoop(props.id)

    const status = computed(() => {
      // return statusList[props.id].status
      return 
    })
    const src = computed(() => {
console.log(statusList)
return `https://avatars.dicebear.com/4.5/api/jdenticon/${encodeURI(
            props.id
        )}.svg?m=14&b=%23ffffff`;
      // if (!status.value || !status.value.avatar) {
      //   return `https://avatars.dicebear.com/4.5/api/jdenticon/${encodeURI(
      //       props.id
      //   )}.svg?m=14&b=%23ffffff`;
      // }
      // return status.value.avatar;

    })


    return {
      src
    }
  }
}
</script>
