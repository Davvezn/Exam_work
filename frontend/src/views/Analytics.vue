<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Analytics</h2>


    <div class="mb-4">
        <label for="dataType" class="mr-2 font-semibold">Select Data type:</label>
        <select v-model="selectedType" id="dataType" class="p-2 border rounded">
            <option value="users">Total Users</option>
            <option value="pokemon">total Pokemon</option>
        </select>
    </div>

  <div class="w-full h-64">
    <canvas ref="canvasRef" width="400" height="200"></canvas>
  </div> 
  </div>
</template>

<script setup>
//imports
import { ref,onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const chartInstance = ref(null);
const chartData = ref(null);
const canvasRef = ref(null);
const selectedType = ref('users'); // default type

const fetchAnalysis = async () => {
    try {
        
        const res = await fetch(`http://localhost:3000/analytics?type=${selectedType.value}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json();

        //select types, modular for some more additions, not many tho
        const label = selectedType.value === 'users' ? 'Users' : 'Pokemon';
        const count = selectedType.value === 'users' ? data.totalUsers : data.totalPokemon;

        chartData.value = {
            labels: [label],
            datasets: [{
                label: label,
                data: [count || 0],
                backgroundColor: ['#36A2EB']
            }]
        };
    } catch (error) {
        console.error('Failed to fetch data analysis', error);
    }
};

const renderChart = () => {
    if (chartInstance.value) {
        chartInstance.value.destroy();//destroys previous or when changing values chart.
        chartInstance.value = null;
    }

    

    const ctx = canvasRef.value?.getContext('2d');
    if (!ctx) {
        console.error("Canvas not available");
        return;
    }

    chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: chartData.value,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

onMounted(async () => {
    await fetchAnalysis();
    await nextTick();
    renderChart();
});

watch(selectedType, async () => {
    await fetchAnalysis();
    await nextTick();
    renderChart();
});

</script>

<style scoped>
canvas {
    max-width: 100%;
}
</style>