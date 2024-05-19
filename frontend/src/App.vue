<template>
  <div class="container">
    <p>
      <div>Enter the Media URL and click download</div>
      <div>Activate "Audio only (mp3)" to download just the mp3</div>
    </p>
    <input type="text" placeholder="Media URL" class="media-url" v-model="mediaUrl" />

    <label for="audioOnly">
      <input id="audioOnly" type="checkbox" v-model="audioOnly" />
      Audio only (mp3)
    </label>

    <span v-if="loading">Loading...</span>

    <button type="button" @click="download">Download</button>
    <p class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mediaUrl = ref<string>();
const audioOnly = ref(false);

const loading = ref(false);
const error = ref<string>();

const download = async () => {
  loading.value = true;
  error.value = undefined;

  console.log(`Download ${mediaUrl.value}`);
  if (mediaUrl.value == null || mediaUrl.value === "") {
    loading.value = false;
    const errorMessage = "Media URL is empty";
    console.log(errorMessage);
    error.value = errorMessage;
    return;
  }

  const apiUrl = `/api/videos?mediaUrl=${mediaUrl.value}${
    audioOnly.value ? "&audioOnly" : ""
  }`;

  try {
    console.log(`Fetch ${apiUrl}`);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      console.error(errorMessage);
      error.value = errorMessage;
      return;
    }

    console.log(`Response: ${response.status} ${response.statusText}`);
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
  loading.value = false;
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
