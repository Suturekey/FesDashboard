<script setup lang="ts">
defineProps<{
  icon: string;
  colour?: string;
  size?: string;
}>();
</script>

<template>
  <span
    :class="`icon icon--${icon} icon--${size ? size : 'm'}`"
    :style="`--colour: ${colour ? colour : 'black'}`"
  ></span>
</template>

<style scoped>
.icon {
  display: inline-block;
  height: var(--dim);
  width: var(--dim);
  mask-size: contain;
  background-color: var(--colour);
  flex-shrink: 0;
}

/* Icon sizes */
.icon--m {
  --dim: 1rem;
}
.icon--l {
  --dim: 1.5rem;
}
.icon--xl {
  --dim: 2rem;
}

/* Image */
.icon--heartRate {
  mask-image: url("@/assets/icons/iconmonstr-medical-6.svg");
}
.icon--speed {
  mask-image: url("@/assets/icons/iconmonstr-dashboard-7.svg");
}
</style>
