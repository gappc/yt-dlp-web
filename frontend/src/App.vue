<template>
  <div class="container">
    <input type="text" class="media-url" v-model="mediaUrl" />
    <p>Media URL: {{ mediaUrl }}</p>

    <label for="audioOnly">
      <input id="audioOnly" type="checkbox" v-model="audioOnly" />
      Audio only (mp3)
    </label>

    <button type="button" @click="download">Download</button>
    <p class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mediaUrl = ref<string>();
const audioOnly = ref(false);

const error = ref<string>();

const download = async () => {
  error.value = undefined;

  console.log(`Download ${mediaUrl.value}`);
  if (mediaUrl.value == null || mediaUrl.value === "") {
    const errorMessage = "Media URL is empty";
    console.log(errorMessage);
    error.value = errorMessage;
    return;
  }

  const apiUrl = `/api/videos?mediaUrl=${mediaUrl.value}${
    audioOnly.value ? "&audioOnly" : ""
  }`;

  try {
    const response = await fetch(apiUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const filename = response.headers.get("filename") || "download.unknown";
    a.download = decodeURIComponent(filename);

    a.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error:", err);
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Error occurred";
    }
  }
};
</script>

<style>
.error {
  color: red;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
}
.media-url {
  padding: 1em;
  width: 100%;
}
</style>
