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
  "iv": "CiUtLE4nhYDamrOC",
  "data": "el5uyWRBYJ/bEd3qM2AVWqUdAJvy1cKf3hbORrqndt5+rVWku0KyT7BrFjTBtjnHvr6aSHMtj2Er3Z8Gc/++KajDdoAriuy/07Scw8Od2R8Vv1aTh+G5WSj/rFHXKY80T7gKbH3OIdtLroMx0Y/O9s6VWH6SMf94pOW5mIRRGnqudxQNmOw1NRyiIXdZf6Un5Ltd6JmylVg21A1b10f6fz+aE3R411i9F0ioEQUwIykSTEBiebxgc0mdN3G36A/lwLEPT175q8rcsjYIezkd7Cqg84xiWykJZmVAWc+I0syG/8ipbdUWuCR9wRPamMu63qLjPAtS9sXl4n4cZCkEVXUDEZkbJoSnkgmGHZSyHGCDiCPbpEEfBUb/+5WNg69gCDACBipT+3hSEQJawfFwUB3QodGEG4RWEXA73p81JMN/amMGY/dwJw99x7sQMIfbJ49J0JiF5e14FhGhHmFFfqE/kMYA1Waxa7NRjkyztHth5mluaLqFotird9L6WPOP1RfAH2NBMJK1jVkEHd7HQcBhdHvlpvEhX+LGQexo86LzuFIEWZrYW0dNFws9DuYqnCUw1PoEUDWTxxh/4eEHkRLIn6CSGiDNMIqB9J3b/CUWyu+4Iroum6uyO8eSJW6opGvB0hpLD7woax7J8aNi+qIbrvxBA29JFt2SCy6/3ev17oGVsV5eHuZaDsXjMCzFDFQzDKgVMuHWcVo1DB3355+29vWRqwT8fz02KXdyCt5UFEo/eXBwaMB6Snu2a4hjTULFpJfmN7DTZwfA4+FLRnh3JwIfcx8dvmJUbHtZoDYc228xYPuG9zT50Es3AuvQgvKqOLSdeVYbZ56c/3oIsSdBeKAh1x8vChcEDQNXh7mQSPyAfV6uxfX5eNTMsb+uT2U0tyUjvfWkxETk+UkstnKeJu89kKjxm43Ftnq1hroqDrII5D06VRNwll29cMn3+KPDArrXObnABCyNTMFmHa42IUYpp4L9KjEsdxYaWzaX4v62PnxEA3ALXOC836Ma0vQKFvco5sJNl4F5DmbXmkCEF8DqgJFhhqFnEBhJzLeqDt7X44F3N9rSG57tio4KUhRCKJ+vRH83amXPu6IudMf4LOJhBvvf7ARqur8xaO/2Qmc4sMSmEsxbeoH2BLKlGxIF5C5H9ibYm34RNPYLnfa6V+kVP7TB406pDec8NltLSeIfgVbnkF5T18DWzsTd8F7PvXlLmE95CUIq80t89rUMFj9EAcm9hs//Xspt1/D7uGJHDDYvfQaY/NyoQyk9uxi9k5MW/c9lyyzbSDHmyt7Op+OcmWoHKJOxQ0aHwlfBBHHTDTkNsBrRnNzOMQft6AUBQ38VS+AvhwEqG3PWqlx0WHTLb/l6xsmIlrosktZouMbxuk68z7npA/O5mIDvwx1E9j225ldH5zsthPUAFQX0gw/JXMHSeiQdEoY5Yor+pdbdeo2/N6gsI5v8ZfNyGQygqA1SYknPCwTBOZ3o86W8t/pmT/+KzehmCGx6CjVJrGnsCk+XBPXksrI1OoAn8rVCkvcW1VVgc45klJwP3n7o24SkfGoQouxzbrdR4f6/bMJT0OqgU3y1JVvtlWcHKAdWcRU2o+bOs8fsSUr2h3ofK5FV7UI7tzMFtMj2YyE="
}
;

/* ============================================================
   ▣ 목차의 '교수별' 묶기

     index 목차 오른쪽 위 [번호순 | 교수별] 토글이 쓰는 정보다.
     교수 이름은 각 페이지 pageMetaPayload의 subtitle에서 읽는다.

       "subtitle":"20, 21: X; 22: 홍길동."
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
  "iv": "Yo7zVjfdLU3NJocm",
  "data": "Ies5RmjBUCMe6shwR5/jLJZ37mRNIL8n4qhUGSllc2m9EqzrNx0HsPZdU/KrggUhfK9wKXuZ8GvO3VxheNlTO380Afw3G4bYMbJ8XTDbjDL4vj22nAXveg6mZv7TAATq+rw50JsnauMlc/nVaSpYKrqlOTJ/+HMKNuvAGX1wgE5QlGY5kvucyq2RpAznedStYUHo7+nwCm/4wbE9w+3zxaMdWyw3xnsC4Jn4J3vKa2LICg5gHA1RdO+d6DSst4L+NTZeYxvakQ0pTzxc9yWvIcd2ChD+M9erCuBwlyVnoQolp+EnVJF4fvTz1LWbYZxSdIIrHA8f+BznbzsSfTG7iL3NlRuWNgKMkhEjHnvcIm3+cZRwzKdJLRYCx0xP7KiBuijwOfs+55SvTuvuGu8aMSZz4KHRyrA0m/4eJvyFNrF0V6ZXqGW3g1tXJlfJW+eSdTKSmBEvwNJ610ew2a1CpAJUUtuWffRZ2zTJrJ6fzuPUIsvj1qa7AQErl3UYsGPP+zHK4hgR08UeefBwGRabETZ5CUM2fYt4BU8cBwMMgEPHjH4GFDooKxZai20XvJPg+lRVJp1Q2g3I7ojm7Zs2qTvdTjsViLp1pOWiiE6b2ZemHkjedD/bUXQEg3rMNUnXcnrMv0SMbud7nKehh8rt2aMHuJrYcalYOdLr21Ct0VrO7UzIbOdORoDRSlLma9qopWKVGltPoJWp2V+gEX0frGrzEIdM9XwYAqckY0IvtXseCy6odXYIP7wF/nopNVreUCigOpHI7VSvymt3QNw3jDWNwkvB9Ctq8dnp2jo/ugYHDxI8k4b5+dGJxMbEEtFDGstAhuBQSJeOBy26RqUQpqa+thgz+up9Ah/vMBq2t/WItewIGsqKefAYgfIfnqFOyGZ1NRGPThw0VzWnwiuddrvsfYK+5w=="
}
;

// 파일명 접두어 — index.html과 assets/question_set.js가 이 값을 읽는다.
// 파일명 규칙이 바뀌면 여기 한 곳만 고친다.
window.FILE_PREFIX = 'ortho';

window.PAGE_NUMBERS = [
  100, 200, 300, 400, 500,
  600, 700, 800, 900, 1000,
  1100, 1200, 1300, 1400, 1500,
  1600, 1700, 1800, 1850, 1900,
  2100, 2250, 2300, 2400, 2500,
  2600, 2700, 2800, 2900, 3000,
  3100, 3200, 3300, 3400, 3500
];