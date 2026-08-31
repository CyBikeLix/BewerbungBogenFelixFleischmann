<script>
  import { Line } from 'svelte-chartjs';
  import ActivityModal from './ActivityModal.svelte';

  export let mmpData = [];
  export let weightKg = 67;

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  $: chartData = {
    labels: mmpData.map(d => formatTime(d.time_seconds)),
    datasets: [
      {
        label: 'MMP (Watt)',
        data: mmpData.map(d => d.watts),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        pointBackgroundColor: '#0f172a',
        pointBorderColor: '#10b981',
        pointHoverBackgroundColor: '#10b981',
        pointHoverBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 9,
        pointHitRadius: 30,
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  let showModal = false;
  let selectedData = null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#10b981',
        callbacks: {
          label: (context) => {
            const watts = context.parsed.y;
            const wkg = weightKg > 0 ? (watts / weightKg).toFixed(1) : null;
            return wkg ? `${watts} Watt (${wkg} W/kg)` : `${watts} Watt`;
          }
        }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#94a3b8' } }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        selectedData = mmpData[dataIndex];
        showModal = true;
      }
    }
  };

  const closeModal = () => { showModal = false; };
</script>

<div class="h-72 w-full relative cursor-pointer" title="Klicke auf einen Eintrag für GPS-Strecke, Leistungsdaten & .FIT-Download">
  <Line data={chartData} options={chartOptions} />
</div>

{#if showModal && selectedData}
  <ActivityModal 
    filename={selectedData.filename || null} 
    title={selectedData.custom_context || 'Aktivität'} 
    subtitle={`Maxwert: ${selectedData.watts} Watt (${(selectedData.watts / weightKg).toFixed(2)} W/kg) • ${formatTime(selectedData.time_seconds)}`} 
    contextLabel=""
    intervalSeconds={selectedData.time_seconds}
    onClose={closeModal} 
  />
{/if}
