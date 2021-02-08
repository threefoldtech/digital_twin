<template>
  <div class="relative w-full">
    <input
      v-model="searchTerm"
      @input="handleInput"
      :placeholder="placeholder"
      ref="input"
      tabindex="0"
    />
    <span
      v-if="modelValue"
      @click.prevent="reset()"
      class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
    >
      x
    </span>
    <div
      v-show="showOptions"
      @click.self="handleSelf()"
      @focusout="showOptions = false"
      tabindex="0"
      :class="dropdownClass"
    >
      <ul class="py-1">
        <li
          v-for="(item, index) in searchResults()"
          :key="index"
          @click="handleClick(item)"
          class="px-3 py-2 cursor-pointer hover:bg-gray-200 capitalize"
        >
          {{ item }}
        </li>
        <li v-if="!searchResults().length" class="px-3 py-2 text-center">
          No Matching Results
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed} from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: "Enter text here.",
    },
    data: {
      type: Array,
      required: true,
    },
    dropdownClass: {
      type: String,
      required: false,
      default:
        "absolute w-full z-50 bg-white border border-gray-300 mt-1 mh-48 overflow-hidden overflow-y-scroll rounded-md shadow-md",
    },
  },

  setup(props, { emit }) {
    const showOptions = ref(false);
    const chosenOption = ref("");
    const searchTerm = ref("");

    const reset = () => {
      emit("update:modelValue", "");
      chosenOption.value = "";
      searchTerm.value = ""
    };

    const handleInput = (evt) => {
      showOptions.value = true;
    };

    const handleClick = (item) => {
      chosenOption.value = item;
      searchTerm.value = item;
      emit("update:modelValue", item);
      showOptions.value = false;
    };

    const clickedOutside = () => {
      showOptions.value = false;

      if (!chosenOption.value) {
        emit("update:modelValue", "");
      }
    };
    const searchResults = () => {
      return props.data.filter((item) => {
        return item.toLowerCase().includes(searchTerm.value.toLowerCase());
      });
    };

    return {
      reset,
      handleInput,
      handleClick,
      clickedOutside,
      showOptions,
      chosenOption,
      searchTerm,
      searchResults,
    };
  },
});
</script>

<style scoped>
.mh-48 {
  max-height: 10rem;
}
</style>