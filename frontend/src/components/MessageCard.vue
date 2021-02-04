<template>
  <div
      class="my-2 flex"
      :class="{
            'justify-end': isMine(message),
          }"
  >
    <div class="bg-white p-4 rounded-lg truncate">
      <span v-if="message.type === 'FILE'">
        <a class="py-2 px-2 bg-green-200 border-r-2" :href="`http://${message.from.replace('localhost:8080','localhost:3000')}/api/files/${message.to}/${message.body.filename}`" download>{{message.body.filename}}</a>
      </span>
      <span v-else>
              {{ message.body }}
      </span>
      <p
          class="font-thin"
          :class="{
                'text-right': isMine(message),
              }"
      >
        {{ m(message.timeStamp).fromNow() }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from "vue";
import {useAuthState} from "../store/authStore";
import moment from "moment";


export default defineComponent({
  name: "MessageCard",
  props: {
    message: Object,
  },
  setup(props) {

    const {user} = useAuthState()

    const isMine = (message) => {
      return message.from == user.id;
    };

    const m = (val) => moment(val);


    return {
      isMine,
      m,
    };
  },
});
</script>

<style scoped>
</style>
