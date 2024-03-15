<template>
  <div class="grid-square">
    <img
      v-if="squareIsImage"
      alt="image name"
      :src="imageSrc"
      :style="imageSize"
    />
    <button v-else @click="$emit('gridSquareClicked', squareNo)"></button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import "./grid.css";

interface ImagesType {
  id: number;
  squareNo: number;
  imageName: string;
}

interface ImagesObject {
  [key: string]: ImagesType;
}

const props = defineProps<{
  squareNo: number;
  images: ImagesObject;
}>();

const squareIsImage = computed(() => {
  return props.images[props.squareNo];
});

const imageSrc = computed(() => {
  return props.images[props.squareNo].imageName;
});

const imageSize = computed(() => {
  return `height: 50px; width: 50px;`;
});
</script>
