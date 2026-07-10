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
  "iv": "si5pxspr8ttdA5Xj",
  "data": "PxIXVquaHGeoM2IkF9zgd8JliQ17fj8ErBskj5aCLzBGulDNxV2EmLvpAqnstXPyDxoWDS4OAAg890QGPQ+sCd8jeXXVwqiK54J7ouPfxET/LGUybtsFz7Qx92ulzrFFUtXOZ47Kxl+qrCwSAbH3qcf8aNjjYPi53u/sTldMbGwovfe6DBc/VzLioHBD/dPJXgys9cexhRrz3E10WwwR83NGUt4arK3EhjZvB1YoTeKbTMJ31ngUTupwh0NW1VGUO3+xn26k2Mf2xjwYe1fE4dA9CYu8oqJtZ+ot9zcMRzB+pUELHgQ26rvPj+N4feHXWlI6D3rf5R18p6l0MkyiCTejgutwtrRXygAJDe5Ku7RthsWfgyiU6lfy1XpAXUSRmC+RinE23d0sD4UUBlojPdqKC0DZBUALtWroN4FsCOkDGMz5A7DcN+evxPQzMnHrtjlXOAgaFnT8KrTOGvXGtFB4XXzBjgMuZti+pEP9tfl9Nv4egTlguUsERlWQ6rViUk5lwrWMhWUp73OwUyzE+8dxqLBnHh4+F0PYw5FMb5aha5RPLqvoIH8UkRtDcyFCYjWMWNoG+8eakLwNgHXB5arpe2yipMizExhd/S2GaZI86Mzt6L43tfWVc2CE1/gN20dF1m7E/KCNRrgCuxamkfbaxQqnA4Bju0xD3dswc13QfXqqvTTK8VFfFecyqVQW6UQkKRz/XZhdaTPh4WNLvQw+if2Esuh76BxG/e6JRTLoDYlTtx5Ju/PB6rYgXjNSq0l0kuIU1zJIaX08YqatklCkU+hYNpSvUReEmT1q8im0uLH9c6CLkLR2nNsWUUKygGlyIo0eiW+mNB7NLmuid3hP6wmBcg2kqfHA4UVILe1rPkCSZJbvOpUV/Cz+pJ9eUFvCDgJ0DyZadN8nNomJrTmFl3Aj77x0+GPzM74S7i/nmkkg8L0CpT/Udu+hDtnMcpMjtju26L9CbGK2GM1e9sLgbu6NcFVxISVp3pPvQM3J+GiziVKSO8qY84mRE36BfwtOWWck+RL5xkZTO0PCE8URz5tgLrU23y3Q12VlZ/yRO1Dv0K5SVqQf5HNMmy6kE+b6bgSeIQ/LcKjFCn53BsrfIswsue8FTVSUv4KNIn23RzE6TLo3zgijDqgi6BoJBA8+xp8ZIeEX4gD/bglVyhxgMEY1+crNl2a1R2VNcJnJ3uaLJgLZnjOkyw5+NXhiCtn4f9668Ax+vfY1WnrAA0EJETAnicaku7FSpnlfT8Iybsac3mnkBSdFfMybuvF+tA4LKReMiMHfqhw4xtBFFTvzE6x43o94Aa+JSW762H6QNoAy0s9ElOp3Jr/znVBPgZsbY8FQUg/tY/weYsOEYCLjhK0V2QPeIn6NVTUIje/I8ttWVNlsa57De1/TRSMeLe1ij85ClhK7r3t6FpFLiLJgI8GlMzJ4urT84i9kF2NVO+EKn7KcUDJHFGBOuGCMVOP8omJXidbWoiPDOjRAcM8h3OsyDouf1QkSzZBlnmSvsAIX+Q5PDGtw2lB40n3hvBSzCTe89yAJaSbXwca8DTHIDli7iauAp0qjmmcy3VGNGovQMiUgR5RaWQiOvzBxba8MSTietl4AxRXfisdI3ywKoy5Zs3ow9LkZruRxz0VtP4e6x6vLXLU="
}
;

// 파일명 접두어 — index.html과 assets/question_set.js가 이 값을 읽는다.
// 파일명 규칙이 바뀌면 여기 한 곳만 고친다.
window.FILE_PREFIX = 'ortho';

window.PAGE_NUMBERS = [
  100, 200, 300, 400, 500,
  600, 700, 800, 900, 1000,
  1100, 1200, 1300, 1400, 1500,
  1600, 1700, 1800, 1850, 1900, 2000,
  2100, 2200, 2300, 2400, 2500,
  2600, 2700, 2800, 2900, 3000,
  3100, 3200, 3300, 3400, 3500
];