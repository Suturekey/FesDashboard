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
    :style="`--colour: ${colour ? colour : 'var(--c-text)'}`"
  ></span>
</template>

<style scoped>
.icon {
  display: inline-block;
  height: var(--dim);
  width: var(--dim);
  mask-size: cover;
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
.icon--steps {
  mask-image: url("@/assets/icons/shoe-print.svg");
}
.icon--crown {
  mask-image: url("@/assets/icons/crown.svg");
}
.icon--distance {
  mask-image: url("@/assets/icons/map-marker-distance.svg");
}
.icon--elevation {
  mask-image: url("@/assets/icons/elevation-rise.svg");
}
.icon--metronome {
  mask-image: url("@/assets/icons/metronome.svg");
}
.icon--heart {
  mask-image: url("@/assets/icons/heart.svg");
}
.icon--clock {
  mask-image: url("@/assets/icons/iconmonstr-time-3.svg");
}
.icon--medal {
  mask-image: url("@/assets/icons/medal.svg");
}
.icon--sun-moon {
  mask-image: url("@/assets/icons/theme-light-dark.svg");
}
.icon--sun {
  mask-image: url("@/assets/icons/wb-sunny.svg");
}
.icon--moon {
  mask-image: url("@/assets/icons/moon-fill.svg");
}
</style>
