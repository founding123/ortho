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
  "iv": "qR7lWPvrVifd7fTu",
  "data": "z/66/8mSEj9LXv3XV72kmxtDvu7UlID5QpPz4MTaed4lAkFXofvSNZkiXeE3yA9VppVJLloET0Fu0uYDdj1kQ2X/7AjnoYSYlgzHkHUaBoczwdtFNk04XpFLGOD0WIe67zUEAvhhihF4NFHyD3rJ6327ZRY7xFGuxL6UieVLVurTfaovJ20DGt3WDIGaSPw0AnY701CbcbpumgG/5bUmNaI9w2ncsKIgSB2cAFY0KyWzzIYzy9rZfsC7i8+VqU/XePTIS2NZpD0L0rHvlmTeBNhKMjyd5Rlvhvo3jIMfq/JQdH+GqO+wEw1wfP/fdNoVE22O6rXfW3/HOe+FtvLxwm9uH4cQ/AG5C2MrsR+P+i+magASrU55PDirIXXTFmdTw9ZdMtFQt1AMRvsyW/5e1vVI487aMUxlIrtySTptT4pP0MTzm5u7HuDCi/0WJ0IrF3zTxt2cbYTTD0Twj6FrPMPfFupkTkKY3VW65fpOIprfy7D1NTKocj5BufaaOqzCIVO4GmLaPBBlztqjg/FmE/ybiAC2VXsHwt4iLy7gi+3DUDboFC/6UmEvFPaeqJZyttIkG10VnM29RAUdRVgdB7Bv29fQt+x5NuNZdwWGsQk5WubNdJDA6v7S+fsshYLbaqbzxFkUBr/7GhPqELhZUwj1XTwwM3wjTcAt0YbuRsVBwrChEtmKFRZMnYqJrccz46kT60dReu9MtKx5b/TuQ80ocw8Jjq0FAXik+AWg1k++6WPtdJtPFTUh7Wqt0k2fqvAqaGXpve6ADU8ImgIEDi2fwDE2H6uCLa0sdtbooa7q4KoFzmv8xuMbwPJf82/IiaHgmpNSk+ZJ8AJ2+VYd4dGZL30Aytg7Ob6RUeXBEdHcSUAo5Tj2QQ/BTi3A1RbXLZcyI74LfzXz3QGc2Mo+HacEIQGC76pDjFG08dhGPw2moFTJg6bEarO5Z9p1w3jiUWGrszxkUSva9yJi7j6W7uDp6qo6AExwqSpiMiX8UBP/jruJ+gyZRjd1Gm7PIwZrPo88ye6YOEg64N/59TihD2cGxvkLg7ookU86RdqqPZxhhL9G1ZMWAP7LWs5HQpxn19uiYDLWJKPIJb42wT3I/Et1gXC+WGXF15iJIhnG/DTh9Ev20cqsKTXNv7V6dzrDe5V8S1LH2S4vYQYEToNLxMKFZtZbwFvq49uRg1+d+aNuTSkVA7uyH1YAaIPf7HrMUwsk4XZRHOHvgmbRALgC/gaDT/Prb3r7ahr4AYqB8FQxRK4/AgXEJA4vuctuegEgRq/D502wZBJDAQlKG+p9lKPPj/pteHaQcXdx148UWNAylOl9C15ZidJI5uzQkTkiHeG9RTQR1gBWPS1EajlVskxTWqxnzvyeYhZxcpVCSArMerQE7eElfM3Eyoskwmrt8DKcA8vrcfC/lV+fLzZRGvL84tKpWq1/Tg/0mBLocutV324y0tO9xfM0v8OlL3hWOaEo4A9yM0HtakvNJ9mMxvAo7jSj8mgv8NX+JMpNma0A3U/Cdx6Fn9ddX4hMadeFBLZZNxHjq3aKGI8BLEMaSJsIAX1cKgl1VAiv2L80pFOrOy+V2JhOYNrMd5QsJDR8Lvuh+1cDK2hJFJN7OaPRuBM3nR6Vb10GR/G+k+/a0wi1HE6xep6fuDE/X7cLWeQT8xPILrktnmq4uogr"
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
  "iv": "vXNFLV3i7/oHpyX+",
  "data": "CwlQrxAwJeVeP8myWO+Qiiz42YGk9P+ioZSyqJQ1OYG24djG0Akof4Vk8ppkOxLBVxUWC8X/Wj/tgwENt1SCT7LlGnvumnOWX0l7e8GnLnIY8qUQdsoApFGIUS5/wJK+GD4vym9T9CYNTmn1dp3cclBkMzC2rf4shl54bIFgxIu0qjvR/abIOONORzGz5myjF1TGcjPy80Ugg9P5Hn3+iolzbNKtC9WU2tdJegGiryg7nw4tkCWnxKN2xOs9PSMYGcHKiidqbWyE75KuQqhVoFax8BDOWFl2E8GzIjvsCKaJo+ck9hLFA6sBXxPdY/yWC9a1ixLgQEyq7alXWw7WnHr9WPb+HzOX+YazD3kJ+9NAsK07aU3bZVmmJU1OkYSzcqH/r/F4dLAORR8jgWVuEMaenZt+F8neQGTnN3Ptvls8m0AcmQEYkVDrEjtKhdDXMzPzclNx4axwiFYF6uUBl3ubMF8IZAB0a/TEgOwyZOBARxkqbsD+miuVVBJts/cQomVn9q4f/yet7GGPiyhZMN4bS2sW3h/0P4H7SZwdoW8VXMeexLzu+FjBnO/yG0Np479vL+Lzehe4ENlFv0TiEwbGEXlOT5WI30HNgfSZ01dNdEoLqZ/a2YopATBN7hs5opvxnmao5I7CY5FZaTwU6QhZ95nVgbXUyCmzGq4QoZd8UbGgVJ3QowYZBCd4jlTjA3pgmu0y0zgx7qdPjQfNAwzmpOOg/4ISMDoXzK/pPAh7yhinshSwO1cP9KJGaTdaz+9MHF33M1f8SgRUR//qEGB4KIVpeHfbEbpqBtqrt1UqVYFNV1/gHCSk9jSoaobjtBpkmQwRpfBcfk3K1Nd/jlkuN5o8sh4qY44HNGNKAlw9gJPtCVKMNNspbk5d6oLhxktSvvdpwoUMdxXXdMriB2VEB6rpYR0P4txaNW/TIC/ff2uwduM="
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
  2600, 2700, 2800, 2900, 3000,
  3100, 3200, 3300, 3400, 3500
];