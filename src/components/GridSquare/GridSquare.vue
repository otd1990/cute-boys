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
  imageSizeWidth: string;
  squareImagesUses: number;
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
  if (props.images[props.squareNo] === undefined)
    return `height: 48px; width: 48px;`;

  const imageSizeWidth = 48;
  const imgSze = imageSizeWidth * props.images[props.squareNo].squareImagesUses;

  return `height: ${imgSze}px; width: ${imgSze}px;`;
});
</script>
