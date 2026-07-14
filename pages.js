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
  "iv": "stzk9igDQfsksPJW",
  "data": "gmRtHlNnh+2DJiRyToTGqLNTxqqg2i4yEpa0SDuZkdUbm9+Qd++mMS5Iu5JEyHlaGGO0J8Db50QEuZZh8MhAsN+I6pwXRbhi2i5KO9rSHidduXHNAgTWixgadP5PTBfQvTqwGOByRjaX1TsbxGAE3fZBa1vRQMIacu2ji7X1VNM5o0YCa68iQWRxwW5uPF37E4NQ8ptMEjPKwNdB+Y9VyTgEk34/p3QZdV82RYGTZxIrxPy+mtKe49+VZ0GoSm38V3MtrQF1LL5p3+5qJyoVWnG3aP5zNjECOwScBEator0gquMkZRvtoQ0xvFbBtmoqKdfCugMhbpu+sC9vtkIgeBNxq5mwwe5McDK2VV2crnCMCYbOOMjf+fBdjHuVtcp33vET7E6KPSj1waczrUiHrvPQKIPoObMFgi7f/cY9jbbasPKkL5fEdHZjRVzwk3c5Cw3nUecjGjXONYlerv9Ou6u/5CCp/BkX8uSl6nOIRO7FdcamW+KbpZYbBshE/DBktfahQ7bP0I5oQ44KoReriDKEkekX8Qkyw+lKYo882KSs4DGydXz0GR7nEwCDS+e40T1bsd+igY1swRyiiqlJ3Je7LVQp1Vra1xvwynhthMjt7ZQKnZcGx3WAGSvZJDo1itpu4qScGYv8ph+WkktLlhJ9JLArwJ4RUB8B4wa0o29wBkWXv1HrnM1cRvQobG5eRC7wwwCeD6V3k4MCeHxN/QpzGeUODqTEqzpI2D8+oSrgpEDFkGwgSLQcrfybv5kccKuZt6WL6vMqT0AIs7seTCYHD/6x/soFWaFPMhpNLCgoAhaH1tPXTXIVdP54eXy7xiQCxJnQCszypNrP4bwjWErXKLGAAUH6xWzxQV+VVqcE0zzSL9ND4Qf2DUOna0syN981/YZCJ8WVPGy4Rxfq2zMmXr3I17ai9Q9pHlmCmr7rv2uOZ1LCrTxoJ6UVqUtRlYbo9NwykcGe/DmXsuXxyyPYjE94vVLApBguaD+IijKOCcXkI6CYa+IXmeETrioGnEzWdO6omTwlV51BPPzNcWBIfckP3t1OO1XRRWYZFTVpWOnzjtb21xeL54JDvEjoB5YfzRYvOEW+mqxc/m13jCVCChbgthezsn3URPodIq50oJWcMAY4IDBUi2JSY6+dlQJR1JeJm2n4u+vXSw4Z0st5WPxPEdj1YMR6aqRu1FlFk6N24T+fVOuH1la6jlI6uC+a+2XbxtmRE9XsjxD315Uanf31K0yFBF9+bLXpetMeiGzBI0+ViP8lJKI3VNGQA3oHLUPfNC9U8oYe2bSmFts0iwqw4AmpuB33FReGBysci2BUj0vqip/LgVj4rLZD2SwCzhavhlrR5dXrhsjLvlxWMD8+rBMBnlbOiC/jw5qf3Wmj8Rkh9Naof2QHp992sdUi9lrDIJO2Dr+rCu15Hn2rpo4yhQtlyzB9XrqY2s1N83dZjFXOPtpbwGrQbQXe5uN0n83+ruKeOScaPYdjG4lUzSzt3D/ioI5006eOCgJN3z9bFdIJpxgkrki5zukSvP2hhuZ2Yv546RUtiSvp8UMSa/CcVm42S3ueUBHmT+6Y/eXldNTSh33O63TcFCEXfXCC9biGbJN/PZrd7j2k+5OADSeqFUApeAr6IY5HqsJhrnkEPHDLMX/5kXH+VQJlACrz"
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
  "iv": "ZqgRYy4CyUv5AQjr",
  "data": "PH9FQtdkM6echvjvXFQrxqnc0fNA+bkNe47qzP2RliVgPy6Ez3++Rle6A6pVJ8SQy9uKT25C6qWnvZZpnsM5JPG2ZDXdsnYYGKZ1CfHj6eafX0a5JqXfWWoWpwDyWm0U7K4geD3hm+9oe80+s2qVpNH4bXmIA06OvGg69WYp8SshbkhN6KEipSaVMtBdgIhodfU3K7WXSmgOwxp57n7K6G7aMvI4sLSeLPznrPLxC+5q4n/OBDBTab1K6I8RTx6fEjjGaI1uOsFDp39e8FrzitlEiKUnoPdSLpZU+yKPBUA9CNpmYG55+NWJVTspeRIsdbhlvjR0/+Z/C+EAPWfkCazTWeDPCLPNBkGo6IvScKBHNM0qiwuP1avMPkoftpdlnjICl4eJHWGJ1IX0vvjGltFhGECHt6/HM9eJG3U0HG8I9ef8E708owXcyeDxeA5erDm/puOZUxynkRproMe9/NjVZNnZxDIBhnpSA6a7OmDoiBPEyvSZEEMf5VxGbSRMnw4DMYb6HvouhwxEU5/kOMqdphBSZDb4RP7Ifs+cqB9Mmbn+zrr73vdtoZoYWVkQYTcUJRpBR4ybYX/AmY5aLpgdVHYoR6S/5pjs1oDM7Ck6htb3DeRh7huqCpCy4NP/32bzvMqtWUX+bgaT3vBouUGT3tZtKwOR8I4OjoHyWJLSqg6vBCBSHm86vGGrnRc24ovSSC7RHE2axxfvctT8wEBg2nJ5ikB1TFzESdhrD5iXiVpUi6BqayQdT25KAlxP+joncdQ3gN0GPU/SbV58Yrxf0C5mlURKrYLvZgQb774Ia9jKU7lDTcKoTv8P+vMOQAXg/dJA8RJOt3EUyQdMfmp6wb8Oh4oTLgFlLmhoOQXqoQPRGOuIQ3u4HiLN7ZIQ02RyPaNiflu2DHT7Z8zb6cot/aHONLfwU0zC5Dikg/GeIKFiCIdieOHBya+O"
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
  3100, 3200, 3300, 3400, 3500
];