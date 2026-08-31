<script>
  import { onMount } from 'svelte';
  import { Line } from 'svelte-chartjs';
  import 'leaflet/dist/leaflet.css';

  export let filename = null;
  export let title = '';
  export let subtitle = '';
  export let contextLabel = '';
  export let intervalSeconds = 0;
  export let onClose = () => {};

  let richData = null;
  let timeseriesChartData = null;
  let chartOptions = null;
  
  let mapContainer;
  let leafletMap;
  let polylineLayer;

  const loadRichData = async () => {
    try {
      const richFilename = filename.replace('.json', '_rich.json');
      const basePath = import.meta.env.BASE_URL || './';
      const cleanBasePath = basePath.endsWith('/') ? basePath : basePath + '/';
      const res = await fetch(`${cleanBasePath}fits/${richFilename}`);
      if (res.ok) {
        richData = await res.json();
        
        if (richData.merged_data && richData.merged_data.length > 0) {
          
          timeseriesChartData = {
            labels: richData.merged_data.map((_, i) => `${Math.floor((i * 15)/60)}m`),
            datasets: [
              {
                label: 'Watt',
                data: richData.merged_data.map(s => s.w),
                borderColor: '#10b981',
                borderWidth: 1.5,
                pointRadius: 0,
                yAxisID: 'y',
                tension: 0.2
              },
              {
                label: 'HF (bpm)',
                data: richData.merged_data.map(s => s.hr),
                borderColor: '#ef4444',
                borderWidth: 1.5,
                pointRadius: 0,
                yAxisID: 'y1',
                tension: 0.2
              },
              {
                label: 'km/h',
                data: richData.merged_data.map(s => s.kph),
                borderColor: '#3b82f6',
                borderWidth: 1.5,
                pointRadius: 0,
                yAxisID: 'y2',
                tension: 0.2
              }
            ]
          };

          chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false
            },
            plugins: {
              legend: { labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 } } },
              zoom: {
                zoom: {
                  wheel: { enabled: true },
                  drag: { enabled: true, backgroundColor: 'rgba(59, 130, 246, 0.3)' },
                  pinch: { enabled: true },
                  mode: 'x',
                  onZoomComplete: syncMap
                },
                pan: {
                  enabled: true,
                  mode: 'x',
                  onPanComplete: syncMap
                }
              }
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', maxTicksLimit: 8 } },
              y: { type: 'linear', display: true, position: 'left', grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#10b981' }, title: {display: true, text: 'Watt', color: '#10b981'} },
              y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#ef4444' }, title: {display: true, text: 'HF', color: '#ef4444'} },
              y2: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#3b82f6' }, title: {display: true, text: 'km/h', color: '#3b82f6'} }
            }
          };
        }
        
        setTimeout(initMap, 100);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const syncMap = ({ chart }) => {
    if (!leafletMap || !polylineLayer || !richData) return;
    const minIndex = Math.max(0, Math.floor(chart.scales.x.min));
    const maxIndex = Math.min(richData.merged_data.length - 1, Math.ceil(chart.scales.x.max));
    
    const visibleCoords = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      const pt = richData.merged_data[i];
      if (pt.lat !== null && pt.lon !== null) {
        visibleCoords.push([pt.lat, pt.lon]);
      }
    }
    
    if (visibleCoords.length > 0) {
      polylineLayer.setLatLngs(visibleCoords);
      leafletMap.fitBounds(polylineLayer.getBounds(), { padding: [20, 20], maxZoom: 15 });
    }
  };

  const initMap = async () => {
    if (!mapContainer || !richData) return;
    
    const allCoords = richData.merged_data.filter(pt => pt.lat !== null).map(pt => [pt.lat, pt.lon]);
    if (allCoords.length === 0) return;

    const L = await import('leaflet');

    if (leafletMap) {
      leafletMap.remove();
    }

    leafletMap = L.map(mapContainer, {
      scrollWheelZoom: false,
      tap: true
    }).setView(allCoords[0], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    polylineLayer = L.polyline(allCoords, { color: '#dc2626', weight: 4 }).addTo(leafletMap);
    leafletMap.fitBounds(polylineLayer.getBounds());
  };

  $: if (filename) {
    richData = null;
    timeseriesChartData = null;
    loadRichData();
  }
</script>

<div 
  class="fixed inset-0 bg-black/90 flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 z-50" 
  on:click={onClose}
  on:keydown={(e) => e.key === 'Escape' && onClose()}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div 
    class="bg-brand-surface rounded-t-2xl sm:rounded-xl border border-gray-700 w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" 
    on:click|stopPropagation
    role="document"
  >
    
    <div class="sticky top-0 bg-brand-surface/95 backdrop-blur z-20 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-700 flex justify-between items-start shrink-0">
      <div class="pr-2">
        <h3 class="text-xl sm:text-2xl font-bold text-brand-emerald leading-snug">{title}</h3>
        <p class="text-gray-300 text-sm sm:text-base font-medium mt-0.5">{subtitle}</p>
        {#if contextLabel}
          <p class="text-brand-emerald font-bold mt-1.5 bg-brand-emerald/20 inline-block px-2.5 py-0.5 rounded border border-brand-emerald/30 text-xs sm:text-sm">{contextLabel}</p>
        {/if}
      </div>
      <button 
        on:click={onClose} 
        aria-label="Schließen"
        class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors shrink-0 text-3xl leading-none flex items-center justify-center w-10 h-10"
      >
        &times;
      </button>
    </div>

    <div class="p-4 sm:p-6 overflow-y-auto flex-1">
      {#if richData}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-5">
          <div class="bg-brand-dark p-3 rounded-lg border border-gray-700">
            <span class="text-xs text-gray-500 block">Ø Leistung</span>
            <span class="font-semibold text-white text-base sm:text-lg block">
              {richData.avg_watts > 0 ? `${richData.avg_watts} W` : 'N/A'}
            </span>
            {#if richData.avg_watts > 0}
              <span class="text-xs text-gray-400 block">{(richData.avg_watts / 67).toFixed(1)} W/kg</span>
            {/if}
          </div>
          <div class="bg-brand-dark p-3 rounded-lg border border-gray-700">
            <span class="text-xs text-gray-500 block">Ø Herzfrequenz</span>
            <span class="font-semibold text-white text-base sm:text-lg block">{richData.avg_hr > 0 ? `${richData.avg_hr} bpm` : 'N/A'}</span>
          </div>
          <div class="bg-brand-dark p-3 rounded-lg border border-gray-700">
            <span class="text-xs text-gray-500 block">Ø Geschwindigkeit</span>
            <span class="font-semibold text-white text-base sm:text-lg block">{richData.avg_speed > 0 ? `${richData.avg_speed} km/h` : 'N/A'}</span>
          </div>
          <div class="bg-brand-dark p-3 rounded-lg border border-gray-700">
            <span class="text-xs text-gray-500 block">Distanz</span>
            <span class="font-semibold text-white text-base sm:text-lg block">{richData.distance > 0 ? `${richData.distance} km` : 'N/A'}</span>
          </div>
        </div>

        {#if timeseriesChartData && chartOptions}
          <div class="h-56 sm:h-64 w-full bg-brand-dark rounded-lg border border-gray-700 p-2 mb-2">
            <Line data={timeseriesChartData} options={chartOptions} />
          </div>
          <p class="text-xs text-gray-500 text-center mb-5">Tipp: Ziehe einen Bereich im Chart (Drag), um heranzuzoomen. Die Karte passt sich an.</p>
        {/if}

        <div class="h-64 sm:h-80 w-full rounded-lg overflow-hidden border border-gray-700 mb-5 bg-gray-900" bind:this={mapContainer}></div>

        <div class="flex flex-col sm:flex-row justify-end pt-3 border-t border-gray-700 mt-2">
          {#if richData.fit_url}
            <a 
              href={richData.fit_url.startsWith('/') ? ((import.meta.env.BASE_URL || './').replace(/\/+$/, '') + '/' + richData.fit_url.replace(/^\/+/, '')) : richData.fit_url} 
              download 
              class="w-full sm:w-auto text-center justify-center bg-brand-emerald text-brand-dark px-5 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Originale .FIT Datei laden</span>
            </a>
          {:else}
            <p class="text-sm text-gray-500 text-center sm:text-right">Keine .fit-Datei hinterlegt.</p>
          {/if}
        </div>
      {:else if filename === null}
        <div class="py-12 flex justify-center text-center">
          <p class="text-gray-400">Keine detaillierten GPS- oder FIT-Daten für diese Aktivität hinterlegt.</p>
        </div>
      {:else}
        <div class="py-12 flex justify-center text-center">
          <p class="text-brand-emerald animate-pulse">Lade Kontext-Daten (Map, Strecke, Relation)...</p>
        </div>
      {/if}

    </div>
  </div>
</div>
