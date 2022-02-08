const devices = [
  {
    id: 'f4cbac48-2cee-4f15-984b-460e44d4e0e0',
    name: 'iPhone XR, XS Max',
    width: 414,
    height: 896,
    visible: false,
    userAgent: 'iPhone',
  },
  {
    id: '89ff6995-f859-4c2a-ae90-7b47cd5e6da5',
    name: 'iPhone XS, X',
    width: 375,
    height: 812,
    visible: false,
    userAgent: 'iPhone',
  },
  {
    id: '32932498-0a43-47e1-9d0d-b23a71fdd87c',
    name: 'iPhone 8 Plus, 7 Plus, 6S Plus',
    width: 414,
    height: 736,
    visible: false,
    userAgent: 'iPhone',
  },
  {
    id: 'ef0590d0-baef-421d-aa2f-ed9c64fc0e48',
    name: 'iPhone 8, 7, 6S, 6',
    width: 375,
    height: 667,
    visible: false,
    userAgent: 'iPhone',
  },
  {
    id: 'a9ffaba5-ebbc-4344-ac20-f474b10b1aca',
    name: 'Galaxy S9 Plus, S8 Plus',
    width: 412,
    height: 846,
    visible: false,
    userAgent: 'Samsung Phone',
  },
  {
    id: '50b9a238-6ab3-4866-aa8f-63746ed44270',
    name: 'Galaxy S9, Note 8, S8',
    width: 360,
    height: 740,
    visible: false,
    userAgent: 'Samsung Phone',
  },
  {
    id: '37d820f8-057c-46c8-a682-4e178e094504',
    name: 'Pixel 3, 3 XL',
    width: 393,
    height: 786,
    visible: false,
    userAgent: 'Google Pixel',
  },
  {
    id: 'e6f99d1f-3579-4cbf-b966-5d9bb4976b03',
    name: 'Medium Screen',
    width: 1024,
    height: 800,
    visible: false,
    userAgent: 'Google Chrome',
  },
  {
    id: '757b4eb8-9530-4169-9ec5-0231d7cf2be2',
    name: 'Large Screen',
    width: 688,
    height: 1031,
    visible: true,
    userAgent: 'Google Chrome',
  },
  {
    id: 'a336db06-0b91-48cd-89d7-6609d11665d4',
    name: 'Galaxy Note 3',
    width: 360,
    height: 640,
    userAgent:
      'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  },
  {
    id: '967bf536-16be-4e8f-85bd-c60d29e1a975',
    name: 'Galaxy Note 9',
    width: 414,
    height: 846,
    userAgent:
      'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/67.0.3396.87 Mobile Safari/537.36',
  },
  {
    id: '9ed81deb-f28d-4989-acde-4febce2c5eff',
    name: 'Galaxy S5',
    width: 360,
    userAgent:
      'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    height: 640,
  },
  {
    id: '8b81f619-6e4a-4df8-a345-5768056a9f0b',
    name: 'Galaxy S9/S9+',
    width: 360,
    userAgent:
      'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/67.0.3396.87 Mobile Safari/537.36',
    height: 740,
  },
  {
    id: 'b3835320-eacf-407e-b858-a7ed86cf1364',
    name: 'LG Optimus L70',
    width: 384,
    userAgent:
      'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; LGMS323 Build/KOT49I.MS32310c) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/67.0.3396.87 Mobile Safari/537.36',
    height: 640,
  },
  {
    id: 'faab73a3-e87f-4832-a158-754e94ca43e4',
    name: 'Microsoft Lumia 550',
    width: 360,
    userAgent:
      'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 550) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263',
    height: 640,
  },
  {
    id: '3db1c6fd-12d5-420b-9d6d-184bcbb7ecfa',
    name: 'Microsoft Lumia 950',
    width: 360,
    userAgent:
      'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263',
    height: 640,
  },
  {
    id: '83937866-17f1-4545-ab65-fb39a058a29f',
    name: 'Nexus 5X',
    width: 412,
    userAgent:
      'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 5X Build/OPR4.170623.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    height: 732,
  },
  {
    id: '65733d64-2911-48fb-98c9-3488e0595917',
    name: 'Nexus 6P',
    width: 412,
    userAgent:
      'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    height: 732,
  },
  {
    id: '52292e51-c788-47ea-a8ca-85abb267a074',
    name: 'Nokia 8110 4G',
    width: 240,
    height: 320,
    userAgent:
      'Mozilla/5.0 (Mobile; Nokia 8110 4G; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5',
  },
  {
    id: 'e0cf70bc-ddf2-486c-ac1d-89a49ef78504',
    name: 'Pixel 2',
    width: 411,
    userAgent:
      'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    height: 731,
  },
  {
    id: '03370883-d017-4e73-b817-a399d60d2020',
    name: 'Pixel 2 XL',
    width: 411,
    userAgent:
      'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    height: 823,
  },
  {
    id: '0b54d37c-9b32-4894-a81c-32042120add6',
    name: 'iPhone 5/SE',
    width: 320,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
    height: 568,
  },
  {
    id: '8109b6cb-c192-4543-acde-e2d4d5e0fffc',
    name: 'iPhone 6/7/8',
    width: 375,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    height: 667,
  },
  {
    id: 'e406d3a9-489c-41e2-9ba4-192fb0a87f62',
    name: 'iPhone 6/7/8 Plus',
    width: 414,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    height: 736,
  },
  {
    id: 'ad6154e2-cebb-4e72-9adb-fdef4f7686ca',
    name: 'iPhone X/XS',
    width: 375,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1',
    height: 812,
  },
  {
    id: '02b0f88c-5d8f-4a28-b461-1d9fee1ecfba',
    name: 'iPhone XR',
    width: 414,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1',
    height: 896,
  },
  {
    id: '46d80c57-3792-46d2-822d-3069414339bc',
    name: 'iPhone XS Max',
    width: 414,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1',
    height: 896,
  },
  {
    id: '8ce37d37-0bd3-4dce-9440-0eafeb4f2450',
    name: 'Kindle Fire HDX',
    width: 800,
    height: 1280,
    userAgent:
      'Mozilla/5.0 (Linux; U; en-us; KFAPWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.13 Safari/535.19 Silk-Accelerated=true',
  },
  {
    id: '1169e6f9-63d8-464a-96cb-127bc5f97119',
    name: 'Nexus 10',
    width: 800,
    userAgent:
      'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 10 Build/MOB31T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    height: 1280,
  },
  {
    id: '390040ea-de20-4652-843e-6a6dafe0e900',
    name: 'Nexus 7',
    width: 600,
    userAgent:
      'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    height: 960,
  },
  {
    id: '7d4d2798-e8a8-4cf5-8932-6e2ea6b9d5a4',
    name: 'iPad',
    width: 768,
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
    height: 1024,
  },
  {
    id: 'b11c2aaf-8ceb-42b7-8152-816fe6c6fe16',
    name: 'iPad Mini',
    width: 768,
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
    height: 1024,
  },
  {
    id: '670d5de6-a4cb-47ca-957e-ea1f8facd29d',
    name: 'iPad Pro (10.5-inch)',
    width: 834,
    height: 1112,
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1',
  },
  {
    id: '8e14b669-deaf-43d0-ad62-66ffb257ad83',
    name: 'iPad Pro (12.9-inch)',
    width: 1024,
    height: 1366,
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1',
  },
  {
    id: '23da0cd9-3051-45ec-a54d-360bbc01b749',
    name: 'Laptop 1',
    width: 1440,
    height: 900,
    userAgent: 'Google Chrome',
  },
  {
    id: '63d16243-4f7f-49dd-93bc-20755a0b75bf',
    name: 'Laptop 2',
    width: 1280,
    height: 800,
    userAgent: 'Google Chrome',
  },
  {
    id: '0bb11fe7-b50c-49cf-8b80-8c7f9a65470c',
    name: 'Laptop 3',
    width: 1280,
    height: 950,
    userAgent: 'Google Chrome',
  },
]

export default devices
