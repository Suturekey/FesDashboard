<script setup lang="ts">
import Icon from "./components/Icon.vue";
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { useAthleteStore } from "./stores/athleteStore";
import type { I_AthleteData } from "./../types";

const socketAdress = "ws://ubuntu01.fes-sport.de:10001";

const athleteStore = useAthleteStore();

let socket: WebSocket;
const connectionLive = ref(false);
const attemptingReconnect = ref(false);
const displayFailedConnInfo = ref(false);

function connectToWebSocket() {
  socket = new WebSocket(socketAdress);

  socket.onopen = () => {
    connectionLive.value = true;
    displayFailedConnInfo.value = false;
    attemptingReconnect.value = false;
  };

  socket.onmessage = (messageEvent) => {
    const athleteList: I_AthleteData[] = JSON.parse(messageEvent.data);
    athleteStore.replaceList(athleteList);
  };

  socket.onclose = (closeEvent) => {
    connectionLive.value = false;
    console.warn("The WebSocket server closed the connection", closeEvent);
  };

  socket.onerror = (errorEvent) => {
    connectionLive.value = false;
    console.error("A WebSocket connection error occured", errorEvent);
  };
}

function reconnect() {
  setTimeout(() => {
    attemptingReconnect.value = false;
    if (!connectionLive.value) {
      displayFailedConnInfo.value = true;
    }
  }, 5000);
  attemptingReconnect.value = true;
  displayFailedConnInfo.value = false;
  connectToWebSocket();
}

onBeforeMount(() => {
  connectToWebSocket();
});

onUnmounted(() => socket.close());
</script>

<template>
  <div v-if="!connectionLive" class="warning">
    <span class="message">
      <Icon icon="warning" colour="#ff0000" size="l"></Icon>
      <span class="bold"> Die Verbindung zum Server ist unterbrochen. </span>
    </span>
    <span
      v-if="displayFailedConnInfo && !attemptingReconnect"
      class="failedConn"
      >Info: Neuverbindung fehlgeschlagen</span
    >
    <button @click="reconnect" :disabled="attemptingReconnect">
      <Icon icon="reload" :colour="`var(--c-text-light)`" class="icon"></Icon>
      {{ attemptingReconnect ? "Baue Verbindung auf..." : "Neu verbinden" }}
    </button>
  </div>
  <router-view class="background"></router-view>
</template>

<style scoped>
.background {
  overflow-y: auto;
  min-height: 100%;
}

.warning {
  position: absolute;
  left: 50%;
  translate: -50%;
  width: clamp(300px, 80%, 500px);

  z-index: 99;
  color: var(--c-text-light);
  background-color: #fdedee;
  padding: 1rem;
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  margin-top: 1rem;

  .message {
    display: flex;
    gap: 1rem;

    .bold {
      font-weight: 600;
      color: #470000;
    }
  }

  .failedConn {
    font-size: 0.8rem;
    font-weight: 600;
    align-self: center;
    color: #470000;
  }

  button {
    margin-inline: auto;
    display: flex;
    align-items: center;
    background-color: #bcd1de;
    padding: 0.25rem 1rem;
    border-radius: 90px;
    font-weight: 600;
    gap: 0.5rem;

    &:disabled {
      background-color: var(--c-bg-gray-light);

      .icon {
        animation-name: rotation;
        animation-duration: 1.7s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
    }
  }
}

@keyframes rotation {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}
</style>
