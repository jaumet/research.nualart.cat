(function () {
  'use strict';

  const data = window.GLOTOLICI_DATA || [];
  const embedMode = new URLSearchParams(location.search).get('embed') === '1';
  const staticStoryMedia = window.matchMedia('(max-width: 700px)');
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
      title:'Glotolici · Atles de gentilicis i glotònims', description:'Comparativa mundial entre gentilicis i glotònims en català.', eyebrow:'Glotolici · comparativa mundial', heading:'Quan un poble i una llengua comparteixen nom?', lede:'Explora les relacions entre gentilicis, glotònims, territoris i llengües. Cada quadrat és un cas documentat.', language:'Llengua', aboutButton:'Sobre les dades', groupBy:'Agrupa per', colorBy:'Color per', sortByColor:'Ordena els ítems per color', search:'Cerca', searchPlaceholder:'Territori, llengua, gentilici…', continent:'Continent', match:'Coincidència', certainty:'Certesa', all:'Totes', reset:'Neteja', empty:'No hi ha casos que compleixin aquests filtres.', aboutTitle:'Sobre les dades', aboutP1:'El conjunt és una primera versió exploratòria. Les etiquetes <strong>[DUBTOS]</strong> i <strong>[PENDENT]</strong> identifiquen dades que encara requereixen revisió o una font específica.', aboutP2:'La unitat de la visualització és una relació territori–llengua, no necessàriament un estat. Per això també s’hi inclouen territoris autònoms, regions i pobles.', cases:'casos', territories:'territoris', languages:'llengües', matches:'coincidències', of:'de', case:'Cas', sources:'Fonts', warning:'Conté dades dubtoses', pending:'Pendent', yes:'Sí', no:'No', close:'Tanca', summaryLabel:'Resum del conjunt de dades', controlsLabel:'Controls de visualització', legendLabel:'Llegenda de colors', areaLabel:'Visualització dels casos', storyEyebrow:'Deu lectures de les dades', storyTitle:'Què ens explica la relació entre els noms dels pobles i de les llengües?', storyIntro:'Desplaça’t pels deu casos. Cada lectura conserva la configuració exacta de la visualització i pren el cas territori–llengua com a unitat d’anàlisi.', storyCase:'Lectura', storyOpen:'Obre aquesta visualització',
      fields:{continent:'Continent',subregió_geogràfica:'Subregió geogràfica',coincidència_gentilici_glotònim:'Coincidència gentilici–glotònim',relacio_formal:'Relació formal',oficialitat:'Oficialitat',llengua_endògena_del_territori:'Llengua endògena',llengua_introduïda_per_colonització:'Introduïda per colonització',estat_postcolonial:'Estat postcolonial',unitat_poble_territori_llengua:'Unitat poble–territori–llengua',grau_de_certesa:'Grau de certesa',unitat_analitzada:'Territori o unitat',tipus_unitat:'Tipus d’unitat',llengua:'Llengua',codi_llengua:'Codi de llengua',gentilici_catala:'Gentilici català',glotonim_catala:'Glotònim català',gentilici_local:'Gentilici local',glotonim_local:'Glotònim local',estatus_llengua_al_territori:'Estatus al territori',abast_geografic_llengua:'Abast geogràfic',llengua_majoritària:'Llengua majoritària',context_politic_o_colonial:'Context polític o colonial',origen_historic_dels_noms:'Origen històric dels noms',observacions:'Observacions'}
    },
    en: {
      title:'Glotolici · Atlas of demonyms and language names', description:'Worldwide comparison of Catalan demonyms and language names.', eyebrow:'Glotolici · worldwide comparison', heading:'When do a people and a language share a name?', lede:'Explore the relationships between demonyms, language names, territories and languages. Each square represents a documented case.', language:'Language', aboutButton:'About the data', groupBy:'Group by', colorBy:'Color by', sortByColor:'Sort items by color', search:'Search', searchPlaceholder:'Territory, language, demonym…', continent:'Continent', match:'Match', certainty:'Certainty', all:'All', reset:'Reset', empty:'No cases match these filters.', aboutTitle:'About the data', aboutP1:'This dataset is a first exploratory version. The labels <strong>[DUBTOS]</strong> (uncertain) and <strong>[PENDENT]</strong> (pending) identify data that still require review or a specific source.', aboutP2:'The visualization unit is a territory–language relationship, not necessarily a state. It therefore also includes autonomous territories, regions and peoples.', cases:'cases', territories:'territories', languages:'languages', matches:'matches', of:'of', case:'Case', sources:'Sources', warning:'Contains uncertain data', pending:'Pending', yes:'Yes', no:'No', close:'Close', summaryLabel:'Dataset summary', controlsLabel:'Visualization controls', legendLabel:'Color legend', areaLabel:'Case visualization', storyEyebrow:'Ten readings of the data', storyTitle:'What does the relationship between the names of peoples and languages tell us?', storyIntro:'Scroll through ten cases. Each reading preserves the exact visualization settings and uses the territory–language case as its unit of analysis.', storyCase:'Reading', storyOpen:'Open this visualization',
      fields:{continent:'Continent',subregió_geogràfica:'Geographic subregion',coincidència_gentilici_glotònim:'Demonym–language name match',relacio_formal:'Formal relationship',oficialitat:'Official status',llengua_endògena_del_territori:'Endogenous language',llengua_introduïda_per_colonització:'Introduced through colonization',estat_postcolonial:'Postcolonial state',unitat_poble_territori_llengua:'People–territory–language unity',grau_de_certesa:'Degree of certainty',unitat_analitzada:'Territory or unit',tipus_unitat:'Unit type',llengua:'Language',codi_llengua:'Language code',gentilici_catala:'Catalan demonym',glotonim_catala:'Catalan language name',gentilici_local:'Local demonym',glotonim_local:'Local language name',estatus_llengua_al_territori:'Status in the territory',abast_geografic_llengua:'Geographic scope',llengua_majoritària:'Majority language',context_politic_o_colonial:'Political or colonial context',origen_historic_dels_noms:'Historical origin of the names',observacions:'Notes'}
    }
  };
  const storyCases = [
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=continent&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim',
      ca:{title:'La coincidència és sobretot europea, no universal', paragraphs:[
        'Només 123 dels 428 casos presenten coincidència entre gentilici i glotònim: un 28,7%. Europa arriba a 57 coincidències de 97 casos —58,8%—, seguida d’Àsia amb 35 de 90 —38,9%— i Oceania amb 11 de 35 —31,4%.',
        'La coincidència és molt baixa a les Amèriques —8 de 66, un 12,1%— i a l’Àfrica —12 de 135, un 8,9%—. La sincronització nominal no sembla universal, sinó un resultat històric i polític especialment habitual en determinades configuracions europees.'
      ]},
      en:{title:'The match is mainly European, not universal', paragraphs:[
        'Only 123 of 428 cases show a match between demonym and language name: 28.7%. Europe reaches 57 matches out of 97 cases —58.8%—, followed by Asia with 35 out of 90 —38.9%— and Oceania with 11 out of 35 —31.4%.',
        'Matches are scarce in the Americas —8 of 66, or 12.1%— and Africa —12 of 135, or 8.9%. Nominal synchronization appears less like a linguistic universal than a historical and political outcome common to particular European configurations.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=subregi%C3%B3_geogr%C3%A0fica&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim',
      ca:{title:'Europa oriental i meridional formen el principal nucli de coincidència', paragraphs:[
        'L’escala subregional revela contrastos amagats per la divisió continental. Europa oriental presenta 14 coincidències de 17 casos —82,4%— i Europa meridional, 22 de 31 —71%—. També destaca l’Àsia oriental, amb 6 de 9 casos.',
        'No hi ha cap coincidència a l’Àfrica central —0 de 21—, al Carib —0 de 18— ni als principals grups d’Amèrica Central. Abans de publicar conclusions quantitatives caldria normalitzar categories duplicades com «Amèrica Central» i «Amèrica central».'
      ]},
      en:{title:'Eastern and Southern Europe form the main matching core', paragraphs:[
        'The subregional scale reveals contrasts hidden by continental divisions. Eastern Europe has 14 matches in 17 cases —82.4%— and Southern Europe 22 in 31 —71%. East Asia also stands out, with 6 in 9.',
        'There are no matches in Central Africa —0 of 21—, the Caribbean —0 of 18— or the main Central American groups. Duplicate labels such as “Amèrica Central” and “Amèrica central” should be normalized before publishing quantitative conclusions.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=relacio_formal&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim',
      ca:{title:'La classificació binària exclou divuit coincidències d’arrel', paragraphs:[
        'Els 123 casos coincidents es divideixen entre «coincidència exacta» —62— i «forma idèntica» —61—. En canvi, 18 casos que comparteixen una arrel o una derivació transparent es classifiquen com a no-coincidents, com <em>rom–romaní</em>, <em>dom–domari</em>, <em>kongo–kikongo</em> i <em>nahua–nàhuatl</em>.',
        '«Coincidència» significa identitat formal estricta, no parentiu morfològic. Si aquests 18 casos s’incloguessin en una categoria més àmplia, la proporció passaria del 28,7% al 32,9%.'
      ]},
      en:{title:'The binary classification excludes eighteen root matches', paragraphs:[
        'The 123 matching cases split into “exact match” —62— and “identical form” —61—. Another 18 cases share a root or transparent derivation but count as non-matches, including <em>rom–Romani</em>, <em>Dom–Domari</em>, <em>Kongo–Kikongo</em> and <em>Nahua–Nahuatl</em>.',
        'Here, “match” means strict formal identity rather than morphological kinship. Including those 18 cases in a broader category would raise the proportion from 28.7% to 32.9%.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=llengua_end%C3%B2gena_del_territori&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim',
      ca:{title:'L’endogeneïtat és gairebé necessària, però no suficient', paragraphs:[
        'Cap dels 124 casos amb llengua no endògena presenta coincidència. Entre els 25 casos mixtos només n’hi ha un. Pràcticament totes les coincidències —122 de 123— corresponen a llengües considerades endògenes del territori.',
        'Però només 122 dels 279 casos endògens coincideixen —43,7%—. L’arrelament territorial sembla gairebé necessari, mentre que el multilingüisme, la construcció estatal, els exònims i la morfologia en determinen el resultat.'
      ]},
      en:{title:'Endogeneity is almost necessary, but not sufficient', paragraphs:[
        'None of the 124 cases with a non-endogenous language matches. Only one of the 25 mixed cases does. Nearly every match —122 of 123— therefore involves a language considered endogenous to the territory.',
        'Yet only 122 of 279 endogenous cases match —43.7%. Territorial rootedness appears almost necessary, while multilingualism, state formation, exonyms and morphology shape the final outcome.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=llengua_introdu%C3%AFda_per_colonitzaci%C3%B3&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim',
      ca:{title:'Cap llengua plenament introduïda per colonització no coincideix', paragraphs:[
        'Els 117 casos classificats com a llengua introduïda per colonització són tots no-coincidents. Entre els 35 casos d’introducció parcial només n’hi ha un de coincident; entre els set casos mixtos, també només un. Entre les llengües no introduïdes hi ha 121 coincidències de 269 casos —45%.',
        'L’associació és molt forta, tot i que no prova causalitat. Els estats que adopten la llengua d’una potència colonial tendeixen a desacoblar el nom polític de la comunitat i el nom de la llengua oficial.'
      ]},
      en:{title:'No fully colonially introduced language matches', paragraphs:[
        'All 117 cases classified as languages introduced through colonization are non-matches. Only one of 35 partly introduced cases matches, as does one of seven mixed cases. Among non-introduced languages, 121 of 269 cases match —45%.',
        'The association is exceptionally strong, although it does not establish causality. States adopting a colonial power’s language tend to uncouple the political community’s name from that of its official language.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=estat_postcolonial&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim',
      ca:{title:'L’estat postcolonial és l’entorn principal del desacoblament', paragraphs:[
        'Entre els 254 casos d’estats postcolonials només 25 coincideixen —9,8%—. En els estats no postcolonials la proporció puja a 37 de 75 —49,3%— i, en les unitats no sobiranes, a 61 de 99 —61,6%.',
        'Els estats postcolonials solen reunir territoris plurilingües sota un gentilici estatal nou i mantenir llengües administratives anteriors. Pobles o territoris no sobirans poden conservar més fàcilment una identitat nominal comuna.'
      ]},
      en:{title:'The postcolonial state is the main setting for decoupling', paragraphs:[
        'Only 25 of 254 cases in postcolonial states match —9.8%. The proportion rises to 37 of 75 —49.3%— in non-postcolonial states and 61 of 99 —61.6%— in non-sovereign units.',
        'Postcolonial states often gather multilingual territories under a new state demonym while retaining earlier administrative languages. Non-sovereign peoples or territories may more easily preserve a shared nominal identity.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=unitat_poble_territori_llengua&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim',
      ca:{title:'La «unitat poble–territori–llengua» reprodueix gairebé exactament la coincidència', paragraphs:[
        'Els 102 casos amb unitat alta coincideixen tots. Els 176 casos amb unitat baixa no coincideixen en cap cas. La categoria parcial queda entremig: 21 coincidències entre 150 casos —14%.',
        'L’associació és perfecta als extrems, fet que obliga a revisar si les variables són independents. Si la semblança nominal ja intervé en l’assignació de la unitat, la figura mostraria circularitat en la codificació més que no pas una relació històrica.'
      ]},
      en:{title:'“People–territory–language unity” almost exactly reproduces matching', paragraphs:[
        'All 102 high-unity cases match. None of the 176 low-unity cases does. The partial category lies between them, with 21 matches among 150 cases —14%.',
        'The association is perfect at both extremes, so the variables’ independence needs review. If nominal similarity informed the unity rating, the figure may reveal circular coding rather than a historical relationship.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=oficialitat&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim&continent=Europa',
      ca:{title:'A Europa, les llengües territorials coincideixen més que les cooficials estatals', paragraphs:[
        'Les llengües «reconegudes o protegides» coincideixen en 15 de 19 casos —78,9%— i les cooficials regionals, en 5 de 6 —83,3%—. L’excepció regional són les Illes Balears: <em>balear</em> no coincideix amb <em>català</em>.',
        'Els cinc casos de cooficialitat estatal són no-coincidents: les tres llengües de Bèlgica i les dues de Finlàndia. Una llengua pot identificar fortament un territori propi sense donar nom al conjunt d’un estat plurilingüe.'
      ]},
      en:{title:'In Europe, territorial languages match more often than state co-official ones', paragraphs:[
        '“Recognized or protected” languages match in 15 of 19 cases —78.9%— and regional co-official languages in 5 of 6 —83.3%. The regional exception is the Balearic Islands: <em>balear</em> does not match <em>Catalan</em>.',
        'All five state co-official cases are non-matches: Belgium’s three languages and Finland’s two. A language can strongly identify its territory without naming the whole multilingual state.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=llengua_introdu%C3%AFda_per_colonitzaci%C3%B3&color=coincid%C3%A8ncia_gentilici_glot%C3%B2nim&continent=%C3%80frica',
      ca:{title:'A l’Àfrica, el colonialisme és determinant, però no ho explica tot', paragraphs:[
        'Cap dels 53 casos africans amb llengua introduïda colonialment presenta coincidència. Entre els 18 casos d’introducció parcial només n’hi ha un. Això explica una part important de les només 12 coincidències africanes entre 135 casos.',
        'Però entre els 63 casos amb llengua no introduïda només 11 coincideixen —17,5%—. També hi intervenen les fronteres estatals plurilingües, les llengües franques regionals i la diferència entre identitat estatal i etnolingüística.'
      ]},
      en:{title:'In Africa, colonialism is decisive, but does not explain everything', paragraphs:[
        'None of the 53 African cases with a colonially introduced language matches. Only one of the 18 partly introduced cases does. This accounts for much of Africa’s mere 12 matches among 135 cases.',
        'Yet only 11 of 63 cases with a non-introduced language match —17.5%. Multilingual state borders, regional lingua francas and the divide between state and ethnolinguistic identity also matter.'
      ]}
    },
    {
      url:'https://research.nualart.cat/area-glocolici/?lang=ca&group=continent&color=llengua_end%C3%B2gena_del_territori&match=No',
      ca:{title:'Els casos no coincidents amaguen mecanismes continentals diferents', paragraphs:[
        'A Europa, 36 dels 40 casos no coincidents tenen llengües endògenes —90%—; a l’Àsia són 38 de 55 —69,1%—. Aquí el desacoblament no es pot atribuir principalment a una llengua exterior.',
        'El patró s’inverteix a les Amèriques, amb 40 de 58 llengües no endògenes —69%—, i a Oceania, amb 15 de 24 —62,5%—. L’Àfrica queda gairebé dividida. Un mateix resultat formal pot provenir de processos històrics molt diferents.'
      ]},
      en:{title:'Non-matching cases conceal different continental mechanisms', paragraphs:[
        'In Europe, 36 of 40 non-matching cases involve endogenous languages —90%—; in Asia, 38 of 55 —69.1%. Decoupling there cannot mainly be attributed to an outside language.',
        'The pattern reverses in the Americas, with 40 of 58 non-endogenous cases —69%—, and Oceania, with 15 of 24 —62.5%. Africa is nearly split. The same formal outcome can arise from very different historical processes.'
      ]}
    }
  ];
  const palette = ['#005f73','#0a9396','#94d2bd','#e9d8a6','#ee9b00','#ca6702','#bb3e03','#9b2226','#6d597a','#355070','#52796f','#7f5539'];
  const browserLanguages = navigator.languages || [navigator.language || 'en'];
  const defaultState = Object.freeze({
    lang: browserLanguages.some((lang) => String(lang).toLowerCase().startsWith('ca')) ? 'ca' : 'en',
    group: 'continent',
    color: 'coincidència_gentilici_glotònim',
    sortByColor: true,
    query: '',
    continent: '',
    match: '',
    certainty: ''
  });
  const state = { ...defaultState };
  const queryKeys = { lang:'lang', group:'group', color:'color', sortByColor:'sort', query:'q', continent:'continent', match:'match', certainty:'certainty' };
  let storyObserver;

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
    document.body.classList.toggle('embed-mode', embedMode);
    readUrl();
    bindControls();
    if (!embedMode) staticStoryMedia.addEventListener('change', renderStory);
    setLanguage(state.lang);
  }

  function readUrl() {
    const params = new URLSearchParams(location.search);
    const validFields = new Set(fields);
    if (['ca','en'].includes(params.get('lang'))) state.lang = params.get('lang');
    if (validFields.has(params.get('group'))) state.group = params.get('group');
    if (validFields.has(params.get('color'))) state.color = params.get('color');
    if (params.has('sort')) state.sortByColor = params.get('sort') !== '0';
    state.query = params.get('q') || '';
    if (unique('continent').includes(params.get('continent'))) state.continent = params.get('continent');
    if (['Sí','No'].includes(params.get('match'))) state.match = params.get('match');
    if (unique('grau_de_certesa').includes(params.get('certainty'))) state.certainty = params.get('certainty');
  }

  function syncUrl() {
    const params = new URLSearchParams();
    if (embedMode) params.set('embed', '1');
    if (state.lang !== defaultState.lang) params.set(queryKeys.lang, state.lang);
    if (state.group !== defaultState.group) params.set(queryKeys.group, state.group);
    if (state.color !== defaultState.color) params.set(queryKeys.color, state.color);
    if (state.sortByColor !== defaultState.sortByColor) params.set(queryKeys.sortByColor, '0');
    if (state.query !== defaultState.query) params.set(queryKeys.query, state.query);
    ['continent','match','certainty'].forEach((key) => {
      if (state[key] !== defaultState[key]) params.set(queryKeys[key], state[key]);
    });
    const search = params.toString();
    const url = `${location.pathname}${search ? `?${search}` : ''}${location.hash}`;
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
    renderSummary(); renderStory(); render();
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
      Object.assign(state, defaultState, { lang: state.lang });
      document.querySelectorAll('.controls input, .controls select').forEach((el) => { el.value = ''; });
      $('#sort-by-color').checked = state.sortByColor;
      $('#group-by').value = state.group; $('#color-by').value = state.color; render();
    });
    dialog('#detail'); dialog('#about');
    $('#about-open').addEventListener('click', () => $('#about').showModal());
    window.addEventListener('popstate', () => {
      Object.assign(state, defaultState);
      readUrl(); setLanguage(state.lang);
    });
  }

  function dialog(id) {
    $(id).querySelector('.close').addEventListener('click', () => $(id).close());
    $(id).addEventListener('click', (e) => { if (e.target === $(id)) $(id).close(); });
  }

  function renderStory() {
    if (embedMode) return;
    const steps = $('#story-steps');
    if (!steps) return;
    if (storyObserver) storyObserver.disconnect();
    const staticLayout = staticStoryMedia.matches;
    steps.innerHTML = storyCases.map((item, index) => {
      const copy = item[state.lang];
      const config = Object.fromEntries(new URL(item.url).searchParams);
      config.lang = state.lang;
      const embedAttributes = Object.entries(config).map(([name, value]) => `${name}="${escapeHTML(value)}"`).join(' ');
      return `<article class="story-step${index === 0 ? ' is-active' : ''}" data-story-index="${index}">
        <p class="story-number">${t('storyCase')} ${index + 1} / ${storyCases.length}</p>
        <h3>${copy.title}</h3>
        ${copy.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        ${staticLayout ? `<glotolici-embed class="story-inline-embed" ${embedAttributes} label="${escapeHTML(copy.title)}"></glotolici-embed>` : ''}
        <a href="${item.url}" target="_blank" rel="noopener">${t('storyOpen')} ↗</a>
      </article>`;
    }).join('');

    if (staticLayout) {
      steps.querySelectorAll('.story-step').forEach((step) => step.classList.add('is-active'));
      return;
    }

    const storyEmbed = $('#story-embed');
    const caption = $('#story-caption');
    const activate = (index) => {
      const item = storyCases[index];
      const copy = item[state.lang];
      steps.querySelectorAll('.story-step').forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
      const config = Object.fromEntries(new URL(item.url).searchParams);
      storyEmbed.setAttribute('label', copy.title);
      storyEmbed.configure({ ...config, lang:state.lang });
      caption.textContent = `${index + 1}. ${copy.title}`;
    };
    activate(0);

    storyObserver = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) activate(Number(current.target.dataset.storyIndex));
    }, { rootMargin:'-38% 0px -38% 0px', threshold:[0, .25, .5, .75, 1] });
    steps.querySelectorAll('.story-step').forEach((step) => storyObserver.observe(step));
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
