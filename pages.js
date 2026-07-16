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
  "iv": "WMCQ+HRyIjfnBHVr",
  "data": "Gz75tKt9Iev4NJWcn4xhAgeleaQXi34o/RUMr+yQ9XbwTqPV62kcv/DFD3MH+OuL2KGuXYmNMfftIYQG9dNSzArtnDgvB3ouAHhESXjjn1gZ+ZlF5VbFdYTftdrS/vbAtTNO9GgSgsq6mz8FwsGSqO5tOiQvZyxlH/7ZwIJo4fGDuZcSayczqIrzMAz/xuoROBQiw9AgjCY+8Wu5YuPUitSCpLQ8it1lrXewwymb4nZtJd+RVVFcEfkGYGqmcQAyY55K+u9UYdOXq71in9zK2iFxuFnMoqUUpU8dAK/XGYuZ/o/D4gJfYCdGAlY2xnTUCaNANUw8J4lfsZo3HgEYHfEgxgD38pCtwjLFppk3Nigo3cHEbMj+p3ctURo4rewl9jNe52+ixamBRkeAXYN0YQVPt5nSrDDe40uiLWTE2IWN8R3OHKX4tPq+QdNIf+6f2IOwFKZUG4wSQwbfbsMC3fywLrCg0WIblK0w20dvwZg+tJcuqcjoPNp4Oed9b1AuBCHjhGOexitrkKxdV/RnPML+8+5bx0ZxmChjWgTHCtgqaHpaHpcB7cEgUqae7IhEJPcaTDXkvfIhFZGxzrO7F35eJG17WL4oFuqrZslqRmx0WECjkhAL6uKiz1xxJ4TG3P+rTOL8yotO4v1zS2XIrCFsfbPnz6rAUEMJbereqY3JQ6lPeDPQizf5lGw8O2YA0GFPRh8sQCLadeU4aynqRdNPght9ZvUGyvC8NhIrFylGZ3uiG7lbPFYQ13AbyaPsFLdv8v1xPU+MK4FCAngDqmnz7ANbw9+OtgAoXcsmRD6izo7hS9w4Xn9MZ8djkh8bdRFzJP6IW6C6VSeiyXpz561Ia96kKfjbQqNy7u7GrblL0lxkz42nPwkoS85+fmTKneOD/zfNsfodjFyBOlKmiumwuxFvsmzHCIeGNevcXKSIbp2XGAL70r3BkDcCjCpksOspQud0eNGUu1GnfTRFsHvhrH6/ffZBl2RWfjNgpTWplnnuE9U4rZWcV55x9kz+u1X9ZtfF8cU9GjeQXCXw2uetZ0guLCRriaWZD5KmcjUmi6Lo0zcA8TXzu/gWDbptw2YJNsONed3HibGrZjMzACNHK/WQ+KIY7Txla/6OfGqSX0dokE7W+Yhebun8B0XeO3KWzswfJvVxqy9TpmdwT23V8Ts+VeQSXg4xYb2U49BnBK0QTyAgVZR40SvvMS9LmYuNHuuWv5kFgQEyoSGayMcaJES7HjXOjNrVgys/sIGYoWgauIyM9DbLJium+DTA8/JT8+z9khFdKnSQJ8AAZ2feDv5GShdFEl3GccW7XbsXQm3Pq06dDo0L8Ss52A7EGYuc6SWqTYkPozLCLA6keczxJIZd3kGDkfcuTB/4hFLpQuuAEEiZkKJayDcdR8hVP1J9o5Jp/JfcDaqlg/8F7MTdNX2sznfhObubsnsgmbYaVAf5MWgDgo83vot4OXhQ1NkTrOtzbqkIN/NCq/+bAaWGBBu1Yyk0DiXINvUCvJqTZ2M3tEXR8FP2aOqMz4F+Xiyx7uOP1buTrh0NDxAp5c0Cpmxnen352ha048IFn0gHHOVGV1zmSwAOYuvnL1VM7duBDKGPDS2X4zUGE+93L0U="
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
  "iv": "ma5Env+5u4Ww1uMW",
  "data": "ogt3TPkc5dN7QfKNQxopwx+RuI153VEuocR8UvIqhE8ghY6btbnCETJVbN7Cskob/5QTCp+/a47YtWJ2aEu/S1FxKmyIPwuIUUIeOvPxcaSJAeool4D81EC8Fv6nlcwN4rbY5/s0Fr0H/sHmOnsKD025QoRLvTkVMXaOj8s54lC7HIFGLBT/yCB6ErvbNIQ616ctFyxJHL8FSJ/ayXEIyty3tp/dGCeF6WifNDEcgF7V+DXLmNreBhRCTpvOVEdQuj9ggekzKjsHTF4zGJO04sPN6mUaRGj0hXAqPYq0JzQFvzPLF0uqVggutOUjtXDp3+qAIhOTCIzVbNqfUBZSFhPnbmJ6WbIPw5PD5fMOL8MRrkDTUDPve4H24N7LOf/PrF8VfvvKRjLYG2N8kZ8Pf7zo8UX8+mCUwsChhFi0NQKJSC46mNv/BVmh3HPr5K+OEinHtjXWQY8WVwMjYykbU8Iku4MfH7HFPrwEZW+H7ZlIpUdNxyuztBWYAMUHx0OlEn2Vb5SLl+Jf5JlKNonxf7x82gWaSBLRfHT81VAeMS9HBUDMUBj5eX5YM0vrEyF8p1LPOckWvcHhPgUKjSqtCNO0K3ynPp/HtrKkMKJo0xjJGT07Tj1DhKqx/0Hf6D2MQ5uf55P2N+lmZLvjFtkzTPd+tAqbCYCu57PknJ35zN13+OcLCpXVhjh2tvoWsyGFZbuoxOeWWbGGg4fgf6hZ6VXw+mK2UEQVV0PlJqWnii8ppOA8F31w2AO0KxuABwh+YyfWfKZl2Lsr+5JUetWNxVSg+9gl5ylLUbe0bD6+OkLfisWjj2CVv2a1vpFpB16Tv+CwJhcfNwz8scYvlkBkvdSgWurCeJ8Y5dXqiw4QpeeXXTq7Qfabiex0sN9G68lW8mr3GNVNcGo6/gSxXksXxRxBqEF6nyL8kR3+4yqsXYYEK8i+VuWWfMKIoJV32zTE72I4fjMQFUXBzA=="
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