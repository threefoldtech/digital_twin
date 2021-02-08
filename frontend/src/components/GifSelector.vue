<template>
  <div class="test mx-4 px-4" style="width: 100%; height: 220px; overflow-x: scroll">
    <input type="text" v-model="searchTerm">
    <button @click="$emit('close')">close</button>
    <img
        height="200"
        style="height: 200px; display: inline-block; "
        v-for="gif in gifs"
        :src="gif"
        alt=""
        @click="$emit('sendgif', gif)"
    >
    <span v-if="gifs.length === 0">no Gifs found</span >
  </div>
</template>
<script lang="ts">
import {fetchGif} from "@/services/gifService";
import {ref, watch} from "vue";

export default {
  name: 'GifSelector',
  setup(props) {
    const gifs = ref([])
    const searchTerm = ref('')

    fetchGif().then(gs => {
      gifs.value = gs.data.map(g => g.images.original.url)
    })
    watch(searchTerm, (st) => {
      fetchGif(st).then(gs => {
        gifs.value = gs.data.map(g => g.images.original.url)})
    })

    return {gifs, searchTerm}
  }
}
</script>
