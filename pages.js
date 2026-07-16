/* ============================================================
   사이트 설정

   ▣ 페이지 목록 관리 방법
     페이지 목록은 아래 PAGE_NUMBERS 배열에서 직접 관리한다.
     배열에는 파일명의 숫자를 앞의 0 없이 숫자로 적는다.

       예)
       window.PAGE_NUMBERS = [
         1,     // ortho0001.html
         101,   // ortho0101.html
         151,   // ortho0151.html
         300,   // ortho0300.html
         5000   // ortho5000.html
       ];

     목차(index)에는 번호순으로 표시된다.
     가운데 빠진 번호가 있어도 된다.

   ▣ 새 페이지 추가하는 법
     1) 파일을 orthoNNNN.html 이름으로 올린다.
        예) ortho0001.html, ortho0151.html, ortho3050.html

     2) pages.js의 PAGE_NUMBERS 배열에 해당 번호를 추가한다.
        예) ortho3050.html을 추가했다면 3050을 추가한다.

     3) 페이지 제목은 아래 TOC_ENC 한 곳에만 적는다. (단일 출처)
        페이지 파일의 pageMetaPayload에는 eyebrow·subtitle만 둔다.

   ▣ 페이지 제목(TOC_ENC) 관리 — 제목의 단일 출처
     번호→제목 JSON을 SITE_ENC와 같은 방식으로 암호화해 둔다.

       복호화된 평문 JSON 형태:
         { "100": "제목", "151": "제목", ... }

     바꾸는 법: toc.json을 수정하고 동일한 비밀번호로 암호화해
     아래 TOC_ENC에 붙여 넣는다.
          python tools/encrypt_fragment.py toc.json --password <비밀번호>

     index 목차 · 이전/다음 페이저 · 문항 페이지 h1이 모두 이 값을 읽는다.
     맵에 번호가 없으면 예전 방식(그 페이지의 pageMetaPayload title)으로
     폴백하므로 기존에 만든 페이지도 그대로 동작한다.

   ▣ 목차(index) 화면의 제목·강조어·라벨·태그라인은 평문으로 두지 않는다.
     아래 SITE_ENC는 그 네 문구를 담은 JSON을 index 비밀번호와 동일한 방식
     (PBKDF2 → AES-GCM)으로 암호화한 것이다.

       복호화된 평문 JSON 형태:
         { "title": "...", "highlight": "...", "eyebrow": "...", "tagline": "..." }

     잠금 해제 후 세션에 passphrase가 있을 때 unlock.js가 복호화하여 채운다.

   ▣ 문구 바꾸는 법
     1) 새 JSON을 파일로 저장한다. 예) site.json
          {"title":"...","highlight":"...","eyebrow":"...","tagline":"..."}

     2) 문항과 같은 도구로 암호화한다. 이때 동일한 비밀번호를 사용해야 한다.
          python tools/encrypt_fragment.py site.json --password <비밀번호>

     3) 출력된 salt/iv/data를 아래 SITE_ENC에 붙여 넣는다.
   ============================================================ */

window.SITE_ENC = 
{
  "kdf": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "cipher": "AES-GCM",
  "salt": "5M0C/GJq63f9MDopdTfI6A==",
  "iv": "rvkdWt2R7R2hlQsr",
  "data": "BxNKP1ZMiMcVIqz9+fpVWDM4uSh1cNCR4f3cWkvKIWY4gRsgAwjI2pgtjMhyT49N8dx5s5QxYg9k3KbKIYh1gSURvy1iIDnXc8MK2m8qesZSigR70vvlBVLZmcFMqGOr/f8wMBIDti59eaoU1Z72+iXlmFq3KkciXAEAAytglT2mptWKQGl65Rv0cqAtmOZAI+yLsdYVb8uYaMsBpLOC250ZQyt2zry7CMoegOG8Y1v8cH7F0E6x3TyYIWIo1Qmp/mESMhE="
}
;

window.TOC_ENC = 
{
  "kdf": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "cipher": "AES-GCM",
  "salt": "5M0C/GJq63f9MDopdTfI6A==",
  "iv": "fDxVHNsgCOY2UCAf",
  "data": "wrI2eCXwn+0rfxyDS5utz77bz8w/Xy8bkAl6wcOsDKU2xJQniFdinPhzhJ8puSpG9JH5RTDWXUJQGg8RODZgQ0b1tA/SxCIZiigrQ/IYihBQ0U7CiZK7zWf9qXWSa03k/bjEs7EHvN1u6eSAm2OwYWD9Q0MnbyIgx9s8DIoypyKzx6yg975m+GVNbox6UfdG35827mC/37/uqMLIXooKtX6+i/SrLwjK3XvfWH1bQjJWA4MHV5EMiyhDa9tGQl8kP5WAOmh5eeIEgjD1sF5P3WMu//ipAJxfTEs2pxY0SAQaIylqjTw45bXC56F5TUmpmAiAyJIgNtk0iaz1gHEJdtKRLvm3Zkt+Ufbp6/vXlL4xDkGw647LnHQyLYuLYQHtLvImsmJuvUC+f9xagw3PVTWdU0ybExNg9bH9i47nUM61SAB4MmCVkqJh0qHnJoizVEFXR71uGN1dq/nPjYnJcVo50QrSOnpPObC1dkKR9QxnEzEv4RA4tDXKn3+FYsgIcYSvpA6ZgeBr99vhg3UF9ln5f8fOpZJ6JMmRsda/JzvQg4jDfShyisP4hXf4iBDo+lW5SQYRQalIxvn1tVd+pgwe4fWvp7hBHmo88/KZ2Un1dIhB2zXLua4gWcM2EgWfXwjgX+Qzo9gT6EJS833g9AMXLwS5cOetQ/uwFHUpNtYcha4t7BeS1EZYUHzpQNaj3ZKFaWjuFE+2l9PZLzeIybVXjBP7HBGT4ahVEnHkzCRW4vkLB0r3tahUn4xl0Y4V7hjsN4tCa3sDkUf9c5JGhiHZ2w5cSQyoy9N4UVMwSdzxrB0qC/LZ5hEZC3HdeognJ11ZpKZlwQet76WkKOPQQW3GuqHE6MNZ1qR0ec8UVthHrn1wyhPQifIqWHg4gc5mR7xn5kOGcqgV6ZuS7xBcPDLExU/A+37tFZU9+CYX3mw6A2kSKzMAJIf7Kl+Hz9oFkg5N1bt2y2twWJh2hfwRvrtC8WgiGbT+SkS7CVYYdh3kMV8wWIzuW5IGRivrhpMYch2S+PbiIIGkd8JpW2Y/72ah/lSdJnK86tQ9sSworBrmWD7obCnKf2UAM68aLmyqJVeFWbY5KvCBU+OzwQxjsYQqrGjboOzf1ZfKhjMvZbpEo88xHE4MGgtKcD8el6Ieo81WUPyWcMgcW0Z9sdlsVJLJsfzWUBXzPsXbLD12uacwwyPi40EYAjo/FjhSRhMf+JqXJhO029vu+vEmppU2SRTmh2fRRc0LnD1rDq21odW1Vnv+9Bi174Yzq3+1H2Um2xn6xZHWyCUiDK3Cy/xMkdY7acp+89OB6x/1TQazWIh85A/Y8vw/3hNhhk4B+g0dlnvZuT8H2jR8E0TRusj1aIgaINQOhxDJvVLofWu5ZEgIhymExSeVFKYtm13sQL0keai5bV4x0knShAHxGE9KATc+rd2A6eGiPZ2fs80F+IdOW0bbar2oN+BzgcrAv5LXhA+Hp78Bgg+SisrGOdKi8UJXwDUWt8lQajaM/bRc6/qYOgdEDYFZcFRVyqiguwtsFRWln7D3472c4PV8Gq40NHpaFv2Y59QETE+BrmPV4R9/SF3Lt3bZze4dgqCkiLgAsBuSku+YyTwDacBYHoqP7A=="
}
;

/* ============================================================
   ▣ 목차의 '교수별' 묶기

     index 목차 오른쪽 위 [번호순 | 교수별] 토글이 쓰는 정보다.
     교수 이름은 각 페이지 pageMetaPayload의 subtitle에서 읽는다.

       "subtitle":"20, 21: X; 22: 홍길동;"
                              ^^^^^^^^  '22:' 다음부터 ';'(또는 끝) 앞까지
                                        끝의 마침표·공백은 알아서 떼어낸다.

     ▸ 이름 뒤에 뭔가 더 붙여야 한다면 구분자를 하나 두면 된다.
       구분자부터 뒤는 이름에서 잘려 나간다.
         쓸 수 있는 구분자 :  (   [   ·   ,   /   |   그리고 전각 형태
         "22: 홍길동 (신규 강의);"  → 홍길동
       ('-'와 '.'은 구분자가 아니다. 'Kim Sung-ho', 'Prof. Kim'이 잘리므로.)

     그래서 아무것도 안 해도 '교수별' 버튼은 그냥 동작한다.
     다만 이 방식은 교수 이름을 알아내려고 orthoNNNN.html을 전부 한 번씩
     내려받아 복호화한다(세션당 1회, 결과는 세션 캐시에 저장).

   ▣ 교수 한 줄 평 (PROF_NOTE_ENC) — 아래에서 직접 적는다

     목차를 교수별로 묶으면 머리글에 이름과 함께 이 한 줄이 뜬다.

       홍길동   문제 다 알려줬음.                              3
       ────────────────────────────────────────────────────────
       [ 01 ] 하지 해부학              [ 03 ] 척추의 해부학
       ...

     한 줄 평은 '강의'가 아니라 '교수'에 붙는다. 홍길동 강의가 5개여도
     여기 한 번만 적으면 된다. ortho 파일들은 손대지 않아도 된다.

     · 키 = ortho 파일에서 뽑아낸 교수 이름. '홍길동.'처럼 마침표를 붙여
       적어도 같은 규칙으로 맞춰 주므로 그대로 복사해 붙여도 된다.
     · 안 적은 교수는 이름만 뜬다. 통째로 지워도 동작한다.
     · 내용이 내용이니만큼 SITE_ENC·TOC_ENC와 같은 방식으로 암호화한다.
          python tools/encrypt_fragment.py prof_note.json --password <비밀번호>
   ============================================================ */

window.PROF_NOTE_ENC =
{
  "kdf": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "cipher": "AES-GCM",
  "salt": "5M0C/GJq63f9MDopdTfI6A==",
  "iv": "a7f+97JWQtwz5+M7",
  "data": "A1FqXJocbEGDzzxbmpmr3NMPfzNyTmNzE9UU3EnoOlVHGXGHCFT0T0h7CJ7OMhXCOK4tv+NG1zkIZCoyLgDGYBobQ5hWGE1RykYzLM6dS/0VBBWhnyUWH+LTExQobfLki96tp+XsdZiGku/1s87gINdMu3Ij6l1lmyaJ95xRvhSASx2SRmhbGhPtg+pleJ5ztY3UzN43fJLsfuOtCnDQsBrdHJUS8x+8vj63RrPNpT9lNmCSCtgJHOOTwjp17DSpYunFjweALNxozGHShmljk14n9a0PINEeYW7zAaJX7t/q6BZMC4zvWG8pa1MH05mdrbSsW+PxvDHQBl3dXrpshQLShLrues7RaxduQ5mNmPoLcfkeT9Um+GTc3Uya8TiYttcX8MOHjJBvyyLOT4icToDQU1kgCC42uEQFqkDqPMcr5e0qg7h3QifnMhgflmmTz+mfxWMl4eFFr/VAWZcfr+A0DDnfBfzwNBwizfZTGIXe4CZDrHw4sXwWYfbiejL08YEyc/6UNpQbNd1xf6B/yr3riE5zTukeIWoJ8XsRlGcoSC0ZTLmcya74/yzl9FBTM0q06f/7Kj+1kB2OFOSt0J4JW/MzUrml4qHpshktU7P+exed5ZBlcewBQiAv8/wTh5y5TP8RYJ5wrRmuOrmVYy9fm6gc83vovtBEloz0HROuZKrxa9Pqx/DDjuD4QbAqDAXJNY2hpUEE4HPnhyQNeUM+VBY307TVdtDzhlPA4mU5YazLSKWHecdvLuSUoe/ka8SNito+Kgv5IRR67BMeso5gLiH4wwi9cXIUR7YDuqYjoWVoHLkSvm1tsOGk4np1upSEmhXwy26d/N/Zj5YUqkp+ClSNDxk9VHHC+v/AOGAe3vkSrDAM4Tvh91ZUH+84isrYMp64ydCnBTiI5TA903qD5OW8EKaqxaGCa7eHUrPnVVtK9b+eJdFRlv2kJfG127H1huI0vr61GA=="
}
;

// 파일명 접두어 — index.html과 assets/question_set.js가 이 값을 읽는다.
// 파일명 규칙이 바뀌면 여기 한 곳만 고친다.
window.FILE_PREFIX = 'ortho';

window.PAGE_NUMBERS = [
  50, 100, 200, 300, 400, 500,
  600, 700, 800, 900, 1000,
  1100, 1200, 1300, 1400, 1500,
  1600, 1700, 1800, 1850, 1900,
  2100, 2250, 2300, 2400, 2500,
  2700, 2800, 2900, 3000,
  3200, 3300, 3400, 3500
];