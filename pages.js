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
  "iv": "t1IWH/52na8Gfs0U",
  "data": "VptUuwbAug/AAojMLYO5XnD3aBV21rhDbdnybSPMEhhj7mjvTXzQDnMPuwWeyeSaoeUkgJguuw6shBIU8r5gx8tLBZnXSVOiKkKhj78nRDbAELUDi8iRwWDuUhWnvQ3IAysD0B+Ryo0ya8GizUbLdgh6x1sd+7CyOGtdULPkiIFM0cCgm7+vxO0i/qiD24MY1MdwArQos22EuYkrsk9k3YjkU+uMtSux9xH8Hyx24D4ZB3jRDIuwG1oIUqCbA6HShE9MZZE="
}
;

window.TOC_ENC = 
{
  "kdf": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "cipher": "AES-GCM",
  "salt": "5M0C/GJq63f9MDopdTfI6A==",
  "iv": "SiJcICrIG4FA6KTD",
  "data": "RRSUTHJUiXncwVmawFuuU7CO3IYYTyRPymC3gzzb2dmzrbUvCrzEPahfAbqyZOn4Kj6DBkUFLxjfKOGCZfAfyTetdOntwI9nelvfTmNgQJWmQIShzxK+UJ34IVZuacFZMhnzVy+D+w2ybrg5v7JHCN8GtxeALks/F2xF6QE22sj9STCqiK5qgn+klh/JaAGa6DQsXW2iZJzJqK+nhSW3uYaeJRd/vyiWW0AafbICP3Xznf+fHs65jQnGBHYhiY/1NTYNVW8vZ1eW2B9pV4AR6RXifJS+oRFNgFV+xEzld5yBpA1U/CY3ivm6R50Ak5+4eTYvYwonOWnaYY+9P+LR1npjSLKuU+6THUesEp3ngpT6Jl6Y8BHsI7W6IiBuh5V14Ty41CLGa7wft4UA1NDbXMtNR/g72hpgV/Rjsl/zJq+x20alH8Hz3AxOebsGa8NkNH0kyhfexTuP0nb4VwIv31Vt3r0LytKrL7nmF2KU3A9EweeurEvRaisNmW5uTHtSgiQHXuEYE7lGUCQvG2RgOmkyGWNozT2hTQU9PQytPYrWnsqo4zJIHgSTLDFP1tyJiWGmQ7id0nX83mcHXmGM1/YRtWP8j9Rmo6sQb5x7sQn1dorpJC+F6MUJXSS0QX1UN8XgA4N5Im2gLCAoTacSaLJcKvASD9G4+LTw5EFw1T1b2kGgHjY7GjcADUGdrggg198nclVCAe8F820nb5prZtekTucWt0I5340NOHmXej06xRrmP84Yqnq1HRhf+6ZQ3TGX9TmRRlYjFUUxBfy6qd7zryZO/rnGOIVLHLLhJNOVh5kaNen7Ig5y2fP5v1mn7E7Sg4xQpDfczVSd7Y2MgIDuIHOeQpfhd8Kb/4m9oX7PoOyhmsFObcjU9xV15z5RuJjiszWQ1lYXRvaude9+JfpKK2ZqKjaHsSXloggDxtMPOv9jzOTx+zo2h/+QvPAv7mZet+Sc8GAvThd0tia1ZWrO11ZTgYFr+hAwCE5AAybQ0KNpbNJQ84x3qib+GBkh2Q+jFGZjyQ3zmLNfAEkIISVmQQ+ZG4ispaChTb7tJIrTaAZZtNaETyKsrTfaxvEureew68WBAJTX/yRjny/oV/j3+JoP/S84vEKijjFGQ70hcb5+KVme3OvZKpgbjvbLXP3N8/IP0EugNKDoGPlR4Kfinppr6EVywd9dsAA5OVInPVzaKNdEJzg6xVXcEY4WGT8H09COndl5VybqGZMd56yzBoyNWuqWoFf8dRvyO6es9ukVPxJVZBOkAheZq2D9x0wnV/EGJMFoe0AnFYq9wF3oMNW1JYB6SAI8pp+yWBKlL4yjiYE31Myopf65DwzfesiIsn+Cp53JKOHyjcbtry4kjhN67SWHz5x9uzYMlAmEbigme9Xk0+m7DwKTK/L/7hu7Wpksxri9kjtq/OuPF3hDzFe+SQXvw4M7qyG/nZxrVq3UDPN/gPeCxYmD4YesJBCTzVKojqf+xZ3ieTEhiXHxfg4i2t5hQgq6KbYy1fy41fZHhkv2Hrp1NwXJgipl9R+PcypMWgEDdBpM01btZ58oGC+X99xnlgWJRhh7ZZFB3UwEK7zahFcOu/DB1WGwJganup8nwF+2tDsD2JSCXz8yfPob2GLUSD2eR+hXQ4A="
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