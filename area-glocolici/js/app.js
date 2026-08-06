(function () {
  'use strict';

  const data = window.GLOTOLICI_DATA || [];
  const $ = (selector) => document.querySelector(selector);
  const fields = ['continent','subregió_geogràfica','coincidència_gentilici_glotònim','relacio_formal','oficialitat','llengua_endògena_del_territori','llengua_introduïda_per_colonització','estat_postcolonial','unitat_poble_territori_llengua','grau_de_certesa'];
  const detailFields = [
    'unitat_analitzada','tipus_unitat','llengua','codi_llengua','gentilici_catala','glotonim_catala',
    'gentilici_local','glotonim_local','relacio_formal','oficialitat','estatus_llengua_al_territori',
    'abast_geografic_llengua','llengua_majoritària','llengua_endògena_del_territori',
    'llengua_introduïda_per_colonització','context_politic_o_colonial','origen_historic_dels_noms',
    'grau_de_certesa','observacions'
  ];
  const i18n = {
    ca: {
      title:'Glotolici · Atles de gentilicis i glotònims', description:'Comparativa mundial entre gentilicis i glotònims en català.', eyebrow:'Glotolici · comparativa mundial', heading:'Quan un poble i una llengua comparteixen nom?', lede:'Explora les relacions entre gentilicis, glotònims, territoris i llengües. Cada quadrat és un cas documentat.', language:'Llengua', aboutButton:'Sobre les dades', groupBy:'Agrupa per', colorBy:'Color per', sortByColor:'Ordena els ítems per color', search:'Cerca', searchPlaceholder:'Territori, llengua, gentilici…', continent:'Continent', match:'Coincidència', certainty:'Certesa', all:'Totes', reset:'Neteja', empty:'No hi ha casos que compleixin aquests filtres.', aboutTitle:'Sobre les dades', aboutP1:'El conjunt és una primera versió exploratòria. Les etiquetes <strong>[DUBTOS]</strong> i <strong>[PENDENT]</strong> identifiquen dades que encara requereixen revisió o una font específica.', aboutP2:'La unitat de la visualització és una relació territori–llengua, no necessàriament un estat. Per això també s’hi inclouen territoris autònoms, regions i pobles.', cases:'casos', territories:'territoris', languages:'llengües', matches:'coincidències', of:'de', case:'Cas', sources:'Fonts', warning:'Conté dades dubtoses', pending:'Pendent', yes:'Sí', no:'No', close:'Tanca', summaryLabel:'Resum del conjunt de dades', controlsLabel:'Controls de visualització', legendLabel:'Llegenda de colors', areaLabel:'Visualització dels casos',
      fields:{continent:'Continent',subregió_geogràfica:'Subregió geogràfica',coincidència_gentilici_glotònim:'Coincidència gentilici–glotònim',relacio_formal:'Relació formal',oficialitat:'Oficialitat',llengua_endògena_del_territori:'Llengua endògena',llengua_introduïda_per_colonització:'Introduïda per colonització',estat_postcolonial:'Estat postcolonial',unitat_poble_territori_llengua:'Unitat poble–territori–llengua',grau_de_certesa:'Grau de certesa',unitat_analitzada:'Territori o unitat',tipus_unitat:'Tipus d’unitat',llengua:'Llengua',codi_llengua:'Codi de llengua',gentilici_catala:'Gentilici català',glotonim_catala:'Glotònim català',gentilici_local:'Gentilici local',glotonim_local:'Glotònim local',estatus_llengua_al_territori:'Estatus al territori',abast_geografic_llengua:'Abast geogràfic',llengua_majoritària:'Llengua majoritària',context_politic_o_colonial:'Context polític o colonial',origen_historic_dels_noms:'Origen històric dels noms',observacions:'Observacions'}
    },
    en: {
      title:'Glotolici · Atlas of demonyms and language names', description:'Worldwide comparison of Catalan demonyms and language names.', eyebrow:'Glotolici · worldwide comparison', heading:'When do a people and a language share a name?', lede:'Explore the relationships between demonyms, language names, territories and languages. Each square represents a documented case.', language:'Language', aboutButton:'About the data', groupBy:'Group by', colorBy:'Color by', sortByColor:'Sort items by color', search:'Search', searchPlaceholder:'Territory, language, demonym…', continent:'Continent', match:'Match', certainty:'Certainty', all:'All', reset:'Reset', empty:'No cases match these filters.', aboutTitle:'About the data', aboutP1:'This dataset is a first exploratory version. The labels <strong>[DUBTOS]</strong> (uncertain) and <strong>[PENDENT]</strong> (pending) identify data that still require review or a specific source.', aboutP2:'The visualization unit is a territory–language relationship, not necessarily a state. It therefore also includes autonomous territories, regions and peoples.', cases:'cases', territories:'territories', languages:'languages', matches:'matches', of:'of', case:'Case', sources:'Sources', warning:'Contains uncertain data', pending:'Pending', yes:'Yes', no:'No', close:'Close', summaryLabel:'Dataset summary', controlsLabel:'Visualization controls', legendLabel:'Color legend', areaLabel:'Case visualization',
      fields:{continent:'Continent',subregió_geogràfica:'Geographic subregion',coincidència_gentilici_glotònim:'Demonym–language name match',relacio_formal:'Formal relationship',oficialitat:'Official status',llengua_endògena_del_territori:'Endogenous language',llengua_introduïda_per_colonització:'Introduced through colonization',estat_postcolonial:'Postcolonial state',unitat_poble_territori_llengua:'People–territory–language unity',grau_de_certesa:'Degree of certainty',unitat_analitzada:'Territory or unit',tipus_unitat:'Unit type',llengua:'Language',codi_llengua:'Language code',gentilici_catala:'Catalan demonym',glotonim_catala:'Catalan language name',gentilici_local:'Local demonym',glotonim_local:'Local language name',estatus_llengua_al_territori:'Status in the territory',abast_geografic_llengua:'Geographic scope',llengua_majoritària:'Majority language',context_politic_o_colonial:'Political or colonial context',origen_historic_dels_noms:'Historical origin of the names',observacions:'Notes'}
    }
  };
  const palette = ['#005f73','#0a9396','#94d2bd','#e9d8a6','#ee9b00','#ca6702','#bb3e03','#9b2226','#6d597a','#355070','#52796f','#7f5539'];
  const browserLanguages = navigator.languages || [navigator.language || 'en'];
  const state = { lang: browserLanguages.some((lang) => String(lang).toLowerCase().startsWith('ca')) ? 'ca' : 'en', group: 'continent', color: 'coincidència_gentilici_glotònim', sortByColor: false, query: '', continent: '', match: '', certainty: '' };
  const queryKeys = { lang:'lang', group:'group', color:'color', sortByColor:'sort', query:'q', continent:'continent', match:'match', certainty:'certainty' };

  const t = (key) => i18n[state.lang][key];
  const clean = (value) => String(value || '').replace(/\s*\[(?:DUBTOS|PENDENT)\]\s*/g, '').trim() || t('pending');
  const displayValue = (value) => state.lang === 'en' ? ({'Sí':'Yes','No':'No','Pendent':'Pending','Baix':'Low','Mitjà':'Medium','Àfrica':'Africa','Àsia':'Asia','Amèrica':'Americas','Europa':'Europe','Oceania':'Oceania'}[clean(value)] || clean(value)) : clean(value);
  const norm = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const unique = (field) => [...new Set(data.map((row) => row[field]))].sort((a, b) => a.localeCompare(b, 'ca'));
  const escapeHTML = (value) => String(value || '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function fillSelect(select, choices) {
    choices.forEach((value) => select.add(new Option(i18n[state.lang].fields[value], value)));
  }

  function initialize() {
    readUrl();
    bindControls();
    setLanguage(state.lang);
  }

  function readUrl() {
    const params = new URLSearchParams(location.search);
    const validFields = new Set(fields);
    if (['ca','en'].includes(params.get('lang'))) state.lang = params.get('lang');
    if (validFields.has(params.get('group'))) state.group = params.get('group');
    if (validFields.has(params.get('color'))) state.color = params.get('color');
    state.sortByColor = params.get('sort') === '1';
    state.query = params.get('q') || '';
    if (unique('continent').includes(params.get('continent'))) state.continent = params.get('continent');
    if (['Sí','No'].includes(params.get('match'))) state.match = params.get('match');
    if (unique('grau_de_certesa').includes(params.get('certainty'))) state.certainty = params.get('certainty');
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set(queryKeys.lang, state.lang);
    params.set(queryKeys.group, state.group);
    params.set(queryKeys.color, state.color);
    if (state.sortByColor) params.set(queryKeys.sortByColor, '1');
    if (state.query) params.set(queryKeys.query, state.query);
    ['continent','match','certainty'].forEach((key) => { if (state[key]) params.set(queryKeys[key], state[key]); });
    const url = `${location.pathname}?${params.toString()}${location.hash}`;
    history.replaceState(null, '', url);
  }

  function setLanguage(lang) {
    state.lang = lang; document.documentElement.lang = lang; document.title = t('title'); $('#language').value = lang;
    document.querySelector('meta[name="description"]').content = t('description');
    $('#summary').setAttribute('aria-label', t('summaryLabel')); $('.controls').setAttribute('aria-label', t('controlsLabel'));
    $('#legend').setAttribute('aria-label', t('legendLabel')); $('#area').setAttribute('aria-label', t('areaLabel'));
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $('#search').placeholder = t('searchPlaceholder');
    document.querySelectorAll('dialog .close').forEach((el) => el.setAttribute('aria-label', t('close')));
    [['#group-by',fields],['#color-by',fields]].forEach(([id,values]) => { $(id).innerHTML=''; fillSelect($(id),values); });
    $('#continent').innerHTML=''; $('#continent').add(new Option(t('all'),'')); unique('continent').forEach((value) => $('#continent').add(new Option(displayValue(value),value)));
    $('#match').innerHTML=''; $('#match').add(new Option(t('all'),'')); $('#match').add(new Option(t('yes'),'Sí')); $('#match').add(new Option(t('no'),'No'));
    $('#certainty').innerHTML=''; $('#certainty').add(new Option(t('all'),'')); unique('grau_de_certesa').forEach((value) => $('#certainty').add(new Option(displayValue(value),value)));
    $('#group-by').value=state.group; $('#color-by').value=state.color; $('#continent').value=state.continent; $('#match').value=state.match; $('#certainty').value=state.certainty;
    $('#search').value=state.query; $('#sort-by-color').checked=state.sortByColor;
    renderSummary(); render();
  }

  function bindControls() {
    $('#language').addEventListener('change', (e) => setLanguage(e.target.value));
    $('#group-by').addEventListener('change', (e) => { state.group = e.target.value; render(); });
    $('#color-by').addEventListener('change', (e) => { state.color = e.target.value; render(); });
    $('#sort-by-color').addEventListener('change', (e) => { state.sortByColor = e.target.checked; render(); });
    $('#search').addEventListener('input', (e) => { state.query = e.target.value; render(); });
    [['#continent','continent'],['#match','match'],['#certainty','certainty']].forEach(([id, key]) => {
      $(id).addEventListener('change', (e) => { state[key] = e.target.value; render(); });
    });
    $('#reset').addEventListener('click', () => {
      Object.assign(state, { group: 'continent', color: 'coincidència_gentilici_glotònim', sortByColor: false, query: '', continent: '', match: '', certainty: '' });
      document.querySelectorAll('.controls input, .controls select').forEach((el) => { el.value = ''; });
      $('#sort-by-color').checked = false;
      $('#group-by').value = state.group; $('#color-by').value = state.color; render();
    });
    dialog('#detail'); dialog('#about');
    $('#about-open').addEventListener('click', () => $('#about').showModal());
    window.addEventListener('popstate', () => {
      Object.assign(state, { group:'continent', color:'coincidència_gentilici_glotònim', sortByColor:false, query:'', continent:'', match:'', certainty:'' });
      readUrl(); setLanguage(state.lang);
    });
  }

  function dialog(id) {
    $(id).querySelector('.close').addEventListener('click', () => $(id).close());
    $(id).addEventListener('click', (e) => { if (e.target === $(id)) $(id).close(); });
  }

  function renderSummary() {
    const matches = data.filter((row) => row['coincidència_gentilici_glotònim'] === 'Sí').length;
    const values = [
      [data.length, t('cases')], [new Set(data.map((row) => row.codi_territori)).size, t('territories')],
      [new Set(data.map((row) => row.codi_llengua)).size, t('languages')],
      [`${(matches / data.length * 100).toLocaleString(state.lang, {maximumFractionDigits: 1})}%`, t('matches')]
    ];
    $('#summary').innerHTML = values.map(([number, label]) => `<article><strong>${number}</strong><span>${label}</span></article>`).join('');
  }

  function filteredData() {
    return data.filter((row) => {
      const haystack = norm([row.unitat_analitzada,row.llengua,row.gentilici_catala,row.glotonim_catala,row.gentilici_local,row.glotonim_local,row.codi_territori,row.codi_llengua].join(' '));
      return (!state.query || haystack.includes(norm(state.query))) && (!state.continent || row.continent === state.continent) &&
        (!state.match || row['coincidència_gentilici_glotònim'] === state.match) && (!state.certainty || row.grau_de_certesa === state.certainty);
    });
  }

  function render() {
    const rows = filteredData();
    const colorValues = [...new Set(rows.map((row) => clean(row[state.color])))].sort((a,b) => a.localeCompare(b,'ca'));
    const colors = Object.fromEntries(colorValues.map((value, i) => [value, palette[i % palette.length]]));
    const groups = new Map();
    rows.forEach((row) => { const key = clean(row[state.group]); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(row); });
    const area = $('#area'); area.innerHTML = '';
    [...groups.entries()].sort((a,b) => b[1].length - a[1].length || a[0].localeCompare(b[0],'ca')).forEach(([name, items]) => {
      const section = document.createElement('section'); section.className = 'group';
      section.innerHTML = `<h2>${escapeHTML(displayValue(name))} <span>${items.length}</span></h2><div class="nodes"></div>`;
      const nodes = section.querySelector('.nodes');
      items.sort((a,b) => {
        const byColor = state.sortByColor ? clean(a[state.color]).localeCompare(clean(b[state.color]), 'ca') : 0;
        return byColor || a.unitat_analitzada.localeCompare(b.unitat_analitzada,'ca') || a.llengua.localeCompare(b.llengua,'ca');
      }).forEach((row) => {
        const button = document.createElement('button'); button.className = 'node'; button.type = 'button';
        button.style.backgroundColor = colors[clean(row[state.color])];
        button.title = `${row.unitat_analitzada} · ${row.gentilici_catala} / ${row.glotonim_catala}`;
        button.setAttribute('aria-label', button.title); button.addEventListener('click', () => openDetail(row)); nodes.append(button);
      });
      area.append(section);
    });
    $('#result-count').innerHTML = `<strong>${rows.length}</strong> ${t('of')} ${data.length} ${t('cases')}`;
    $('#empty').hidden = rows.length !== 0;
    $('#legend').innerHTML = colorValues.map((value) => `<span><i style="background:${colors[value]}"></i>${escapeHTML(displayValue(value))}</span>`).join('');
    syncUrl();
  }

  function openDetail(row) {
    const warnings = Object.values(row).some((value) => String(value).includes('[DUBTOS]')) ? `<span class="status">${t('warning')}</span>` : '';
    const sources = [...new Set(`${row.fonts};${row.font_específica_del_cas}`.split(';').map((v) => v.trim()).filter((v) => /^https?:\/\//.test(v)))];
    $('#detail-content').innerHTML = `<p class="eyebrow">${t('case')} ${escapeHTML(row.id)} · ${escapeHTML(row.codi_territori)}</p><h2>${escapeHTML(row.gentilici_catala)} <span>↔</span> ${escapeHTML(row.glotonim_catala)}</h2>${warnings}<dl>${detailFields.map((key) => `<div><dt>${i18n[state.lang].fields[key]}</dt><dd>${escapeHTML(row[key])}</dd></div>`).join('')}</dl><h3>${t('sources')}</h3><ul class="sources">${sources.map((url) => `<li><a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(url)}</a></li>`).join('')}</ul>`;
    $('#detail').showModal();
  }

  initialize();
})();
