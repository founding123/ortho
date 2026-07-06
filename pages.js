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
  "iv": "1u4hmySs+Dc6Cgnc",
  "data": "DQ+cRmDBZhWmnPgRSNX13+DJl9/N0hm5i/UcX0c8ehQQwkYsNnqauQJm9e8nSToCl1n5/w+Br2Ph6OUWql4BSja3MdDDUcvAxN5di8b/sJB9zUaiExqr69PydPI8EpxTb1yxDXcAj/kABfeg+Jx5MjnnrzKSs6qx4I8w0u4Dg636pQ7IiZ8ms3Hcl5WMWQJcCJr5KD5eDOqfRPh3IM//ZL7f5yAsBg9Nw0r3edY2HszKYCzw4IGZAuo0Zf6kVKmkcCBBd1H4QuQooHy1uzxfQKWvqigAqr04cBlynmSEx9Pyr+yjDO54BLV3lVHUwx2ypgHedmPLAOUR6J3U+85Q4JtjnD/eA2UCFzohOGuW6nhrOJgA2Jbss4H00dVZNoF+tDvCotIwP3F/R7x96U03BbqVFxO+rn8XtMESrDwXm9RdS8LTrId54X2tyXNafLTCOvVgkNhE/s7IesXfXrbVx/fCXfO0AAYVT8A1bs5dSk3lfwgFt+5KX5vtvlOyLLX2ITqSsVfe/SvY3aEzUVDtaL8lQTjCrfXAC7DKgUn83rkP0PxpeqZeWh8u4siqceaGr6NnORx00sbEsGI+4exkVx4ib0UBvbH4btd3ueEIR9RE8Vys5F1UsdjxtflZtcDG0NbQ/6KbQIE4XlDI1MKqZ3aYHWXK3VXNypjxxO53eAo5Tt0Tb6aqumgeRH8ZHP3kac5l0/nuVlacVQedZyN9y75n7hBG7XW/31DM0cowBIoLTdaK0AUJSc9zqG8kw7xelmjZaG6fT9gaKHsst2fqhaNI1+hQi/RcJncDQpov/Pyb+cCrVR/tzmJMZe/G/8trQIXp5h7ceNGbMr9nR9iHUzRyhf39W4U5oukg0YvlRLP8MWI5l5j3t5wtijg3Tdfgw7I1Bmanao1QomksfG7hF85w3WFLLVlf1EzOFnTiLYq6zAN10exlMUKBX1SNulDVsb+1J7aRzJFz/LUHiZxWO28OR/HebFOf9la0If8qX5IuGGBvDunjdNd5WurFv0Rw8edGXophRfsdraw7Ri6c3qzoQCBxCD3ElMDwomhbh2ZiVZvbJnGzt9pKLgUB0zUfOcua4hKRxeyySgfkfZtTPoeg2XGvBvB5WPnUOnoqcMkr9tPvfQ6UjNHOJ0Qk+XhnyEYNttjxeePxl75i+tar0qYZuAXZ+mFlTscyVLfqDbok1BJzeEoIcVDQK9e8tm9AcjgqPq7tdCbw5O5XZEb+HzvjAXYOnIuZoPU0PfquGWxUzWnV5GMGiPhh8b8Yv95tmLoYx083vljpbmdET3rcM/aEzLlQyoHm4GJb10FPEwfL1gXxtIJ27AappzoGvMIFbhacGKy4+aSFmWN0TB2cSpS43Us6rZ+QINDWF+MKH1RBUTDJflJU/S719zvlV14zG+eZrAzCYvhO04ICOKm7KFEqdagaJRaeM61rglSG4SV+LLupFufe3cU1H0Y3K/UylLXXtuQBE2hJ41Vp56dDgwNz54z62qZTTiNZKb4jq8E9JabXOD6epWR4t4dpDwTCwUdK8Iv1Q8AUQHP7plxtCR6Ds6xSfdbaLZZAYUT82vcPt2F9nOjugn2z4zQB7Op0CJcawdCeF0qc4TJdCoVi9PIeDMyDHaWuZkhcZcn7zyitxSzwKIZZnCsjZbd8WicpfUAErNxe3V2cfBC/0JdkCHWcg2q+Q84i"
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