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
  "iv": "WsjAGVUJdqhQI0xx",
  "data": "kfnEr1rPhYwqfExvZkkWwXQY4gZpADRhilgwE6D3BYyl6ZeVmDvi9MwWXuCE+zG6PtNiVJsBGx0iyT6tMaz4Y06VoRWjJKyVi/hn2O5tor2ZeZoFvlJXoXw9PMV5ZM5NG0zl/590NOG3oF87oXtr15MOY4CjaYTq6o2ohEEj5CZEgj3J95SuHb5/YmRdYEhm8A4b+YFBA7k31zFLsqf/kvxtbERosB+FYJwx+lhvoFzdD5gexixEg8PdLbtP4A8lqp3qyOh6JbgKUzbcGca/pG3z5aAvIY6HVwG8zJ8rLy7kAJF3gyYN0q/SAzBo/Qh98ca738SOxQ7zqqNONU1DWd+M+gUa/hdiRLgyYBkCI1xAIhvxl45B0AOBS+ZHS8G2LQLPRL4XVp3aDs1daZxaKVwt7CfDiVt5gNPUbn7d0W/XiM4OZe20BOq8cv7AvY6/dYkXoGPthFm7gu8FyefaCZGqnp9yBnIKZSy7V/TwUNwSdFHZf7Jpgrpkh3fCbnyzmapOZTDYFQLbWpoCYtnJZPZUlN7UIIV0iDpCQTvXyB46SKHZq3J2uUt1CYOOZacdyCMm/g5op2bH9+1eZ4psCLbLSXpa4TsNSvCCagLcaKQjQEotRaIiDIpk9uZYlmD/6VoL/ctjCTWAJkklwH+Y3Fq3m/q4x8DhrxHCO9TV9QFkXz5xuHPUFMXfFVcBrIr4tawdLYa7jlepXdgsdCCT8FsgRWO6PvkCJP8VA0NxiJmnh6hC13tDTVgeOsK2EUpagKrO0T+9xnKJgdXYb1LMY5q5AQeZJOuiRVtPW9VddxdnfGl/8b4Fwu5cmEZx3ePAxizpJYVYckLCktu9f0gCLyvZ28IWHpUBwguXycqe9v2blE7CVQ0m/n4LhY2l3EmgA2+NVlqLwH3BdE/QkUNjInU+94y2q5GGS1MDtL/IP0jBHMdQQ/qm4ukYG2kuvmCVhyusv4+nNgoEKjk4u+EatDjoxrlhCDHExjagE9BVqObA5WWzjNwF1Neodrap/e2aKLVrTjTp9dHxCin0/E7BQSoGpfIirJQCLj7IdU0B1wQVA2mghAO6lpIJXXTMUnA6iTRXxHt3NjudT86N0vbf7a6LlmHQvIgSngrtVepq62zmweYb3/pZZd6wIFq5PGI9mX7NQdkitar1FFOQDff8HAMDYUkZ0mv8t5HDWLgDtWAtmDSq5Ql3cyzyaJI48B6YA/PvDy705cqYkaHNOKAx/w0sZ3ulpd3nFdIS5VcW6e6GSRF9u1iXMytxs5CnQfNmGmDret4UnSLfgJYf5x2BJIpAdYN2GsXZuky5wieKu/P8i42E8OHrgfc8ssacKbsgJs9Kb78e9c9ttQaXiMq68m3bwEZoFlGAyKR/A8/h7Bha/nehSLifWhnfQriGuXDbbOyoEH4G1Yv8uaMw8FriImzdtMTfJLhfKgrMM6yrfWzxEfxqfQWKMoSwPUG2VGdFNTA1/uTvPn90bt85GBpiO/4Q+KFFIlN4hGajd7dV50ZqHkOo37azWGbp14oT0ZkWg8BEi73O6KIOJc/ZILW4QXWpdc8HfilJJuT6aCaxh+INSal1kyZqDUIM0AvyphweCb3+CeWtWkCFIvsdI+Xk/ak+wQNQmLhH95s="
}
;

// 파일명 접두어 — index.html과 assets/question_set.js가 이 값을 읽는다.
// 파일명 규칙이 바뀌면 여기 한 곳만 고친다.
window.FILE_PREFIX = 'ortho';

window.PAGE_NUMBERS = [
  100, 200, 300, 400, 500,
  600, 700, 800, 900, 1000,
  1100, 1200, 1300, 1400, 1500,
  1600, 1700, 1800, 1900, 2000,
  2100, 2200, 2300, 2400, 2500,
  2600, 2700, 2800, 2900, 3000,
  3100, 3200, 3300, 3400, 3500
];