<template>
    <button class="download-btn" @click="downloadProjectZip">
        Download Project
    </button>
</template>

<script setup>
const downloadProjectZip = async () => {
    try {
        const response = await fetch('http://localhost:3000/download-zip');
        if (!response.ok) throw new Error("Failed to fetch zip!");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "project_bundle.zip";
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
    }
};
</script>

<style scoped>
.download-btn {
    background-color: black;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    box-shadow: 0 4px 8px rgba(0,0,0, 0.1);
    cursor: pointer;
}

.download-btn:hover {
    background-color: blueviolet;
    transform: scale(1.03);
}
</style>