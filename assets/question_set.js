function toggleAnswer(btn){const panel=btn.nextElementSibling;panel.classList.toggle('open');btn.textContent=panel.classList.contains('open')?'정답·해설 접기':'정답·해설';}function toggleEvidence(btn){const panel=btn.nextElementSibling;panel.classList.toggle('open');btn.textContent=panel.classList.contains('open')?btn.dataset.close:btn.dataset.open;}function collapseEvidence(btn){const panel=btn.closest('.evidence-panel');if(!panel)return;panel.classList.remove('open');const tg=panel.previousElementSibling;if(tg&&tg.classList.contains('evidence-toggle')){tg.textContent=tg.dataset.open;tg.scrollIntoView({block:'center',behavior:'smooth'});}}function showAll(){document.querySelectorAll('.answer-panel,.evidence-panel').forEach(e=>e.classList.add('open'));document.querySelectorAll('.toggle-answer').forEach(b=>b.textContent='정답·해설 접기');document.querySelectorAll('.evidence-toggle').forEach(b=>b.textContent=b.dataset.close);}function hideAll(){document.querySelectorAll('.answer-panel,.evidence-panel').forEach(e=>e.classList.remove('open'));document.querySelectorAll('.toggle-answer').forEach(b=>b.textContent='정답·해설');document.querySelectorAll('.evidence-toggle').forEach(b=>b.textContent=b.dataset.open);window.scrollTo({top:0,behavior:'smooth'});}function toggleAll(btn){var p=document.querySelectorAll('.answer-panel');var o=document.querySelectorAll('.answer-panel.open').length;if(o<p.length){showAll();btn.textContent='정답·해설 모두 접기';}else{hideAll();btn.textContent='정답·해설 모두 펼치기';}}

/* 테마 적용은 assets/theme.js 한 파일에서 관리한다. */

(function(){
  // 이 페이지의 이름(h1·탭 제목)은 자기 자신의 <meta name="page-title">에서만 읽는다 (단일 출처)
  var m = document.querySelector('meta[name="page-title"]');
  var pageName = m ? (m.getAttribute('content')||'').trim() : '';
  if (pageName){
    document.title = pageName;
    var h = document.querySelector('.hero h1') || document.querySelector('h1');
    if (h) h.textContent = pageName;
  }
  // 상단/하단 '돌아가기' 띠의 사이트 제목은 더 이상 여기서 채우지 않는다.
  // 그 문구는 pages.js의 암호화된 SITE_ENC 안에 있고,
  // 잠금 해제 후 unlock.js가 복호화해서 채운다.
})();

/* ============================================================
   비신탁 / 신탁 토글
   - 신탁 카드: <section class="q-card oracle">
   - 우상단 토글 버튼: <button class="oracle-fab" onclick="toggleOracle(this)">
   ============================================================ */
function toggleOracle(btn){
  var on = document.body.classList.toggle('oracle-on');
  btn.setAttribute('aria-pressed', String(on));
  btn.textContent = on ? btn.dataset.on : btn.dataset.off;   // ✦ 라벨은 HTML의 data-on/data-off, 아이콘은 CSS ::before 라 유지됨
}

/* 잠금 해제로 문항이 #decryptedContent 에 주입되면:
   - 신탁(.q-card.oracle) 카드가 하나도 없으면 토글 버튼을 자동으로 숨기고
   - 기본 상태로 초기화한다.
   (content 페이지는 별도 이벤트가 없어 MutationObserver 로 주입 시점을 감지) */
(function(){
  var dc = document.getElementById('decryptedContent');
  if(!dc) return;
  function sync(){
    var fab = document.querySelector('.oracle-fab');
    if(!fab) return;
    fab.style.display = dc.querySelector('.q-card.oracle') ? '' : 'none';
    document.body.classList.remove('oracle-on');
    fab.setAttribute('aria-pressed','false');
    fab.textContent = fab.dataset.off;
  }
  if(!dc.hidden && dc.querySelector('.oracle-fab')) sync();
  new MutationObserver(function(){
    if(!dc.hidden && dc.querySelector('.oracle-fab')) sync();
  }).observe(dc, {childList:true, attributes:true, attributeFilter:['hidden']});
})();

/* ============================================================
   하단 이전/다음 신탁 내비게이션 (#pagerNav)
   - pages.js의 PAGE_NUMBERS 순서를 그대로 따른다.
   - 이웃 페이지 제목은 그 파일의 pageMetaPayload를 복호화해 읽는다
     (index.html이 목차 제목을 읽는 방식과 동일).
   - 맨 앞/맨 뒤면 화살표와 함께 '처음/마지막'을 정중히 안내한다.
   ============================================================ */
(function () {
  var nav = document.getElementById('pagerNav');
  if (!nav) return;

  // 파일명 접두어 — pages.js의 window.FILE_PREFIX 한 곳에서 관리한다.
  var FILE_PREFIX = window.FILE_PREFIX || 'ortho';

  function pad4(n){ n = String(n); while (n.length < 4) n = '0' + n; return n; }
  function fileOf(num){ return FILE_PREFIX + pad4(num) + '.html'; }
  function esc(s){ return String(s).replace(/[&<>]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }

  // 현재 페이지 번호 = 파일명 orthoNNNN.html 에서 추출
  var fname = (location.pathname.split('/').pop() || '');
  var mnum = fname.match(new RegExp('^' + FILE_PREFIX + '0*(\\d+)\\.html?$', 'i'));
  var current = mnum ? parseInt(mnum[1], 10) : NaN;

  var nums = (window.PAGE_NUMBERS || []).slice().sort(function (a, b) { return a - b; });
  var idx = nums.indexOf(current);
  if (idx === -1) { nav.style.display = 'none'; return; } // 목록에 없는 페이지면 숨김

  var prevNum = idx > 0 ? nums[idx - 1] : null;
  var nextNum = idx < nums.length - 1 ? nums[idx + 1] : null;

  // 이웃 페이지 제목: 한 번 읽으면 세션 동안 캐시 (fetch + 복호화 반복 방지)
  var TITLE_CACHE_KEY = 'sok-pager-titles-v1';
  function readTitleCache(){
    try { return JSON.parse(sessionStorage.getItem(TITLE_CACHE_KEY) || '{}'); } catch (e) { return {}; }
  }
  function writeTitleCache(cache){
    try { sessionStorage.setItem(TITLE_CACHE_KEY, JSON.stringify(cache)); } catch (e) {}
  }

  // index가 이미 만들어 둔 목차 캐시(sok-index-toc-v1)에 제목이 있으면
  // 이웃 페이지를 내려받을 필요 자체가 없다.
  function readIndexTocName(num){
    try {
      var obj = JSON.parse(sessionStorage.getItem('sok-index-toc-v1') || 'null');
      if (obj && Array.isArray(obj.pages)){
        for (var i = 0; i < obj.pages.length; i++){
          if (obj.pages[i] && obj.pages[i].n === num && obj.pages[i].name) return String(obj.pages[i].name);
        }
      }
    } catch (e) {}
    return '';
  }

  async function neighborName(num){
    // 제목의 단일 출처: pages.js의 TOC_ENC에 있으면 그 값을 쓴다.
    if (window.SOK_LOCK && window.SOK_LOCK.titleOf) {
      try { var t = await window.SOK_LOCK.titleOf(num); if (t) return t; } catch (e) {}
    }
    var fromToc = readIndexTocName(num);
    if (fromToc) return fromToc;

    var cache = readTitleCache();
    if (typeof cache[num] === 'string') return cache[num];

    var nm = '';
    try {
      var res = await fetch(fileOf(num));
      if (!res.ok) return '';
      var doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      var m = doc.querySelector('meta[name="page-title"]');
      nm = (m && m.getAttribute('content')) ? m.getAttribute('content').trim() : '';
      if (!nm && window.SOK_LOCK && window.SOK_LOCK.decryptStoredPayload){
        var pe = doc.getElementById('pageMetaPayload');
        if (pe){
          try {
            var raw = window.SOK_LOCK.parsePayloadText ? window.SOK_LOCK.parsePayloadText(pe.textContent) : JSON.parse(pe.textContent);
            var meta = JSON.parse(await window.SOK_LOCK.decryptStoredPayload(raw));
            if (meta && meta.title) nm = String(meta.title).trim();
          } catch (e) {}
        }
      }
      if (!nm){ var h = doc.querySelector('h1'); if (h) nm = h.textContent.trim(); }
    } catch (e) { return ''; }

    if (nm){ cache = readTitleCache(); cache[num] = nm; writeTitleCache(cache); }
    return nm;
  }

  function titleSpan(name){ return name ? '<span class="pager-title">' + esc(name) + '</span>' : ''; }

  function linkHTML(side, num, name){
    var href = fileOf(num);
    if (side === 'prev'){
      return '<a class="pager prev" href="' + href + '">' +
               '<span class="pager-arrow">←</span>' +
               '<span class="pager-text"><span class="pager-kicker">이전</span>' + titleSpan(name) + '</span>' +
             '</a>';
    }
    return '<a class="pager next" href="' + href + '">' +
             '<span class="pager-text"><span class="pager-kicker">다음</span>' + titleSpan(name) + '</span>' +
             '<span class="pager-arrow">→</span>' +
           '</a>';
  }

  function edgeHTML(side, label){
    if (side === 'prev'){
      return '<span class="pager is-edge prev" aria-disabled="true">' +
               '<span class="pager-arrow">←</span>' +
               '<span class="pager-text"><span class="pager-kicker">이전</span>' +
               '<span class="pager-title">' + esc(label) + '</span></span>' +
             '</span>';
    }
    return '<span class="pager is-edge next" aria-disabled="true">' +
             '<span class="pager-text"><span class="pager-kicker">다음</span>' +
             '<span class="pager-title">' + esc(label) + '</span></span>' +
             '<span class="pager-arrow">→</span>' +
           '</span>';
  }

  async function build(){
    // unlock.js(SOK_LOCK)가 이 스크립트 뒤에 로드되므로,
    // 문서 파싱(=모든 스크립트 실행)이 끝난 뒤에 시작한다.
    if (document.readyState === 'loading') {
      await new Promise(function (res) { document.addEventListener('DOMContentLoaded', res, { once: true }); });
    }
    var names = await Promise.all([
      (prevNum != null) ? neighborName(prevNum) : Promise.resolve(''),
      (nextNum != null) ? neighborName(nextNum) : Promise.resolve('')
    ]);
    var left  = (prevNum != null) ? linkHTML('prev', prevNum, names[0]) : edgeHTML('prev', '여기가 처음입니다');
    var right = (nextNum != null) ? linkHTML('next', nextNum, names[1]) : edgeHTML('next', '여기가 마지막입니다');
    nav.innerHTML = left + right;
  }

  build();
})();