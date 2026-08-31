<script>
  import data from './lib/data.json';
  import Chart from './Chart.svelte';
  import ActivityModal from './ActivityModal.svelte';

  let showActivityModal = false;
  let selectedActivityFile = null;
  let selectedActivityTitle = '';
  let selectedActivitySubtitle = '';
  let showPhotoLightbox = false;

  const openRace = (result) => {
    selectedActivityFile = result.filename || null;
    selectedActivityTitle = result.race;
    selectedActivitySubtitle = `${result.result} (${result.year})`;
    showActivityModal = true;
  };

  const openDurabilityItem = (item) => {
    if (!item.filename) return;
    selectedActivityFile = item.filename;
    selectedActivityTitle = item.race;
    selectedActivitySubtitle = `${item.duration} Peak: ${item.watts}W (${item.wkg} W/kg) • nach ${item.kj_at_start.toLocaleString('de-DE')} kJ (${item.date})`;
    showActivityModal = true;
  };

  // Body-Scroll Lock bei geöffnetem Modal
  $: {
    if (showActivityModal || showPhotoLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
</script>

<main class="max-w-xl mx-auto min-h-screen bg-brand-dark text-white p-4 sm:p-6 space-y-12 pb-24 font-sans leading-relaxed">
  
  <section class="space-y-6 pt-4 border-b border-gray-700 pb-8">
    <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
      <button 
        on:click={() => showPhotoLightbox = true}
        class="w-32 h-32 rounded-full bg-brand-surface border-2 border-brand-emerald flex items-center justify-center overflow-hidden shrink-0 shadow-lg cursor-pointer hover:border-emerald-400 hover:shadow-emerald-500/20 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:ring-offset-2 focus:ring-offset-brand-dark"
        aria-label="Profilbild vergrößern"
      >
        <img src={data.profile.photo_url} alt={data.profile.name} class="w-full h-full object-cover" style="object-position: center;" />
      </button>
      
      <div class="w-full">
        <h1 class="text-3xl font-bold tracking-tight mb-4">{data.profile.name}</h1>
        
        <div class="space-y-2 text-gray-300">
          <div class="flex border-b border-gray-800 pb-1">
            <span class="w-24 text-gray-500">Alter:</span>
            <span>{data.profile.age} Jahre ({data.profile.dob})</span>
          </div>
          <div class="flex border-b border-gray-800 pb-1">
            <span class="w-24 text-gray-500">Körper:</span>
            <span>{data.profile.height_cm} cm, {data.profile.weight_kg} kg</span>
          </div>
          <div class="flex border-b border-gray-800 pb-1">
            <span class="w-24 text-gray-500">Beruf:</span>
            <span>{data.profile.profession}</span>
          </div>
          <div class="flex border-b border-gray-800 pb-1">
            <span class="w-24 text-gray-500">Telefon:</span>
            <a href={`tel:${data.profile.contact.phone_raw}`} class="text-brand-emerald hover:underline select-all">{data.profile.contact.phone}</a>
          </div>
          <div class="flex border-b border-gray-800 pb-1">
            <span class="w-24 text-gray-500">E-Mail:</span>
            <a href={`mailto:${data.profile.contact.email}`} class="text-brand-emerald hover:underline select-all">{data.profile.contact.email}</a>
          </div>
          {#if data.profile.contact.pcs_url || data.profile.contact.radnet_url}
          <div class="flex border-b border-gray-800 pb-2">
            <span class="w-24 text-gray-500">Profile:</span>
            <div class="flex flex-col space-y-1">
              {#if data.profile.contact.pcs_url}
                <a href={data.profile.contact.pcs_url} target="_blank" rel="noopener noreferrer" class="text-brand-emerald hover:underline">ProCyclingStats</a>
              {/if}
              {#if data.profile.contact.radnet_url}
                <a href={data.profile.contact.radnet_url} target="_blank" rel="noopener noreferrer" class="text-brand-emerald hover:underline">rad-net.de</a>
              {/if}
            </div>
          </div>
          {/if}
        </div>
      </div>
    </div>
  </section>

  {#if data.goals && data.goals.text}
  <section class="space-y-4">
    <h2 class="text-xl font-bold border-b border-gray-700 pb-2">{data.goals.title}</h2>
    <div class="bg-brand-surface p-5 rounded-lg border-l-4 border-brand-emerald text-gray-300">
      {data.goals.text}
    </div>
  </section>
  {/if}

  <section class="space-y-4">
    <h2 class="text-xl font-bold border-b border-gray-700 pb-2">Top Ergebnisse 2026</h2>
    <ul class="space-y-3">
      {#each data.palmares as result}
        <li 
          class="flex items-center justify-between bg-brand-surface p-3.5 rounded-lg border transition-colors {result.filename ? 'border-gray-800 hover:border-brand-emerald cursor-pointer' : 'border-transparent'}" 
          on:click={() => result.filename && openRace(result)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && result.filename && openRace(result)}
          tabindex={result.filename ? 0 : -1}
          role={result.filename ? "button" : undefined}
        >
          <div class="pr-2">
            <span class="font-bold text-brand-emerald">{result.result}</span>
            <span class="text-gray-300 ml-2">{result.race}</span>
          </div>
          <div class="flex items-center space-x-3 shrink-0">
            <span class="text-gray-500 text-sm">{result.year}</span>
            {#if result.filename}
              <span class="inline-flex items-center text-xs text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded border border-brand-emerald/30">
                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                FIT
              </span>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
    <p class="text-xs text-gray-500 mt-2 text-right">Klicke auf einen Eintrag für GPS-Strecke, Leistungsdaten & .FIT-Download.</p>
  </section>

  <section class="space-y-4">
    <h2 class="text-xl font-bold border-b border-gray-700 pb-2">Power Profile & MMP</h2>
    {#if data.power_profile.pitch_text}
      <p class="text-gray-300 text-sm leading-relaxed bg-brand-surface p-4 rounded-lg">
        {data.power_profile.pitch_text}
      </p>
    {/if}
    
    <div class="flex space-x-4 mb-2 mt-4">
      <div class="bg-brand-surface px-4 py-3 rounded-lg flex-1 text-center border border-gray-700">
        <div class="text-xs text-gray-400">Critical Power</div>
        <div class="text-xl font-bold text-brand-emerald">{data.power_profile.cp > 0 ? `${data.power_profile.cp}W` : '-'}</div>
        <div class="text-xs text-gray-400 mt-0.5">{data.power_profile.cp > 0 ? `${(data.power_profile.cp / data.profile.weight_kg).toFixed(2)} W/kg` : ''}</div>
      </div>
      <div class="bg-brand-surface px-4 py-3 rounded-lg flex-1 text-center border border-gray-700">
        <div class="text-xs text-gray-400">Max Power (10s)</div>
        <div class="text-xl font-bold text-brand-emerald">{data.power_profile.mmp_curve.find(d => d.time_seconds === 10)?.watts || '-'}W</div>
        <div class="text-xs text-gray-400 mt-0.5">{data.power_profile.mmp_curve.find(d => d.time_seconds === 10) ? `${(data.power_profile.mmp_curve.find(d => d.time_seconds === 10).watts / data.profile.weight_kg).toFixed(1)} W/kg` : ''}</div>
      </div>
    </div>
    
    <div class="bg-brand-surface rounded-xl p-4 border border-gray-700 mt-4">
      <p class="text-xs text-gray-500 mb-2 text-center">Klicke auf einen Eintrag für GPS-Strecke, Leistungsdaten & .FIT-Download.</p>
      <Chart mmpData={data.power_profile.mmp_curve} weightKg={data.profile.weight_kg} />
    </div>
  </section>

  <section class="space-y-4">
    <h2 class="text-xl font-bold border-b border-gray-700 pb-2">Durability (Ermüdungsresistenz)</h2>

    {#if data.durability.table && data.durability.table.length > 0}
    <div class="bg-brand-surface rounded-xl border border-gray-700 overflow-hidden mt-4">
      <div class="p-3.5 sm:p-4 bg-brand-dark/50 border-b border-gray-700">
        <h3 class="font-bold text-sm sm:text-base text-gray-200">Maximalwerte nach Vorbelastung (&gt;2000 kJ)</h3>
        <p class="text-xs text-gray-400 mt-0.5">Werte stammen vollständig aus realen Rennsituationen (keine isolierten Watt-Tests).</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-brand-dark/30 text-gray-400 border-b border-gray-700 uppercase tracking-wider text-[10px] sm:text-[11px]">
            <tr>
              <th class="py-2.5 px-2.5 sm:px-4 font-semibold">Dauer</th>
              <th class="py-2.5 px-2 sm:px-4 font-semibold">Max Watt</th>
              <th class="py-2.5 px-2 sm:px-4 font-semibold">Vorbelastung</th>
              <th class="py-2.5 px-2.5 sm:px-4 font-semibold">Rennen / Event</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800 text-gray-300">
            {#each data.durability.table as row}
              <tr 
                class="hover:bg-brand-emerald/10 cursor-pointer transition-colors group"
                on:click={() => openDurabilityItem(row)}
                on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openDurabilityItem(row)}
                tabindex="0"
                role="button"
              >
                <td class="py-2.5 px-2.5 sm:px-4 font-bold text-white whitespace-nowrap">
                  {row.duration}
                </td>
                <td class="py-2.5 px-2 sm:px-4 whitespace-nowrap">
                  <span class="font-bold text-brand-emerald">{row.watts} W</span>
                  <span class="text-[11px] text-gray-400 block">({row.wkg} W/kg)</span>
                </td>
                <td class="py-2.5 px-2 sm:px-4 whitespace-nowrap text-gray-300">
                  <span class="font-medium text-xs sm:text-sm">{row.kj_at_start.toLocaleString('de-DE')} kJ</span>
                </td>
                <td class="py-2.5 px-2.5 sm:px-4">
                  <span class="text-brand-emerald group-hover:underline transition-colors text-xs sm:text-sm font-medium line-clamp-2 leading-snug">
                    {row.race}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="p-2.5 bg-brand-dark/40 border-t border-gray-700 text-right">
        <p class="text-[11px] text-gray-400">Klicke auf einen Eintrag für GPS-Strecke, Leistungsdaten & .FIT-Download.</p>
      </div>
    </div>
    {/if}
  </section>

  {#if showActivityModal}
    <ActivityModal 
      filename={selectedActivityFile} 
      title={selectedActivityTitle} 
      subtitle={selectedActivitySubtitle} 
      onClose={() => showActivityModal = false} 
    />
  {/if}

  {#if showPhotoLightbox}
    <div 
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      on:click={() => showPhotoLightbox = false}
      on:keydown={(e) => e.key === 'Escape' && (showPhotoLightbox = false)}
      role="dialog"
      aria-modal="true"
      aria-label="Profilbild Großansicht"
      tabindex="-1"
    >
      <div class="relative max-w-lg w-full" on:click|stopPropagation on:keydown={() => {}} role="presentation">
        <img 
          src={data.profile.photo_url_large} 
          alt={data.profile.name}
          class="w-full h-auto rounded-2xl shadow-2xl border border-gray-700"
        />
        <button 
          on:click={() => showPhotoLightbox = false}
          class="absolute -top-3 -right-3 bg-brand-surface border border-gray-600 text-gray-300 hover:text-white w-9 h-9 rounded-full flex items-center justify-center text-xl hover:bg-white/10 transition-colors shadow-lg"
          aria-label="Schließen"
        >
          &times;
        </button>
      </div>
    </div>
  {/if}

  <footer class="border-t border-gray-700 pt-6 mt-4 text-center space-y-1">
    <p class="text-gray-500 text-xs">Stand: August 2026</p>
    <p class="text-gray-600 text-[11px]">{data.profile.name} · {data.profile.contact.email}</p>
  </footer>
  
</main>
