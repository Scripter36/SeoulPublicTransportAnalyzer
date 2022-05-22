import Downloader from './src/Downloader.js';
import Scheduler from './src/Scheduler.js';

// 테스트: 마들역 7호선 -> 숭실대입구역 7호선

const downloaders = [
  new Downloader({
    // 마들역 7호선 -> 숭실대입구역 7호선
    naverURL:
      'https://map.naver.com/v5/directions/14147112.171709511,4522499.12257681,%EC%83%81%EB%B4%89%EC%97%AD%207%ED%98%B8%EC%84%A0,720,SUBWAY_STATION/14145489.745790947,4514767.868262075,%EA%B1%B4%EB%8C%80%EC%9E%85%EA%B5%AC%EC%97%AD%207%ED%98%B8%EC%84%A0,727,SUBWAY_STATION/-/transit?c=14145463.6747662,4514705.3378391,17,0,0,0,dh',
    kakaoURL:
      'https://map.kakao.com/?map_type=TYPE_MAP&target=traffic&rt=512730%2C1157103%2C489747%2C1110241&rt1=%EB%A7%88%EB%93%A4%EC%97%AD+7%ED%98%B8%EC%84%A0&rt2=%EC%88%AD%EC%8B%A4%EB%8C%80%EC%9E%85%EA%B5%AC%EC%97%AD+7%ED%98%B8%EC%84%A0&rtIds=SES2714%2CSES2740&rtTypes=SUBWAYSTATION%2CSUBWAYSTATION&transitOption=3',
    googleData: {
      origin: { lat: 37.665375, lng: 127.057614 },
      destination: { lat: 37.496374, lng: 126.953504 }
    },
    savePath: './data/1/',
    busList: ['5511', '506', '501', '101', '5513']
  }),
  new Downloader({
    // 노원역 4호선 -> 사당역 4호선 -> 사당역 2호선 -> 신림역 2호선
    naverURL:
      'https://map.naver.com/v5/directions/14144634.44474734,4530994.84536482,%EB%85%B8%EC%9B%90%EC%97%AD%204%ED%98%B8%EC%84%A0,411,SUBWAY_STATION/14129749.459223453,4506819.02515188,%EC%8B%A0%EB%A6%BC%EC%97%AD%202%ED%98%B8%EC%84%A0,230,SUBWAY_STATION/-/transit?c=14129739.2623581,4518279.9710163,11,0,0,0,dh',
    kakaoURL:
      'https://map.kakao.com/?map_type=TYPE_MAP&target=traffic&rt=513997%2C1154645%2C484466%2C1106901&rt1=%EB%85%B8%EC%9B%90%EC%97%AD+4%ED%98%B8%EC%84%A0&rt2=%EC%8B%A0%EB%A6%BC%EC%97%AD+2%ED%98%B8%EC%84%A0&rtIds=SES0411%2CSES0230&rtTypes=SUBWAYSTATION%2CSUBWAYSTATION&transitOption=3',
    googleData: {
      origin: { lat: 37.654527, lng: 127.060551 },
      destination: { lat: 37.484269, lng: 126.929676 }
    },
    savePath: './data/2/',
    busList: []
  }),
  new Downloader({
    // 숭실대입구역(20165, 봉현초등학교방면) -> (5511) -> 관악사삼거리(21286, 공동기기원방면)
    naverURL:
      'https://map.naver.com/v5/directions/14132391.29337896,4508503.119864998,%EC%88%AD%EC%8B%A4%EB%8C%80%EC%9E%85%EA%B5%AC%EC%97%AD,104130,BUS_STATION/14132722.691503052,4503565.999946183,%EA%B4%80%EC%95%85%EC%82%AC%EC%82%BC%EA%B1%B0%EB%A6%AC,166719,BUS_STATION/-/transit?c=14132289.4137810,4504708.8522427,15,0,0,0,dh',
    kakaoURL:
      'https://map.kakao.com/?map_type=TYPE_MAP&target=traffic&rt=489588%2C1110379%2C490430%2C1100319&rt1=%EC%88%AD%EC%8B%A4%EB%8C%80%EC%9E%85%EA%B5%AC%EC%97%AD&rt2=%EA%B4%80%EC%95%85%EC%82%AC%EC%82%BC%EA%B1%B0%EB%A6%AC&rtIds=BS30355%2CBS22128&rtTypes=BUSSTOP%2CBUSSTOP&transitOption=3',
    googleData: {
      origin: { lat: 37.496226, lng: 126.953415 },
      destination: { lat: 37.461058, lng: 126.956516 }
    },
    savePath: './data/3/',
    busList: []
  }),
  new Downloader({
    // 봉천사거리.봉천중앙시장(21131) -> (506/501) -> 서울신문사(02137) -> (101) 고려대학교앞(06175)
    naverURL:
      'https://map.naver.com/v5/directions/14132479.792374145,4506642.098538736,%EB%B4%89%EC%B2%9C%EC%82%AC%EA%B1%B0%EB%A6%AC.%EB%B4%89%EC%B2%9C%EC%A4%91%EC%95%99%EC%8B%9C%EC%9E%A5,104156,BUS_STATION/14141453.256526988,4521423.921166711,%EA%B3%A0%EB%A0%A4%EB%8C%80%ED%95%99%EA%B5%90%EC%95%9E,111416,BUS_STATION/-/transit?c=14132903.7637868,4514033.0962093,12,0,0,0,dh',
    kakaoURL:
      'https://map.kakao.com/?map_type=TYPE_MAP&target=traffic&rt=489863%2C1106516%2C507665%2C1135725&rt1=%EB%B4%89%EC%B2%9C%EC%82%AC%EA%B1%B0%EB%A6%AC.%EB%B4%89%EC%B2%9C%EC%A4%91%EC%95%99%EC%8B%9C%EC%9E%A5&rt2=%EA%B3%A0%EB%A0%A4%EB%8C%80%ED%95%99%EA%B5%90%EC%95%9E&rtIds=11210571013%2C11060551014&rtTypes=BUSSTOP%2CBUSSTOP&transitOption=0',
    googleData: {
      origin: { lat: 37.48296, lng: 126.95421 },
      destination: { lat: 37.588258, lng: 127.034819 }
    },
    savePath: './data/4/',
    busList: []
  }),
  new Downloader({
    // 구로디지털단지역 2호선 -> 서울대입구역 2호선 -> 서울대입구역(21330) -> (5513) -> 농생대(21272)
    naverURL:
      'https://map.naver.com/v5/directions/14126620.84719861,4506957.010904409,%EA%B5%AC%EB%A1%9C%EB%94%94%EC%A7%80%ED%84%B8%EB%8B%A8%EC%A7%80%EC%97%AD%202%ED%98%B8%EC%84%A0,232,SUBWAY_STATION/14131922.415683735,4503001.120367473,%EB%86%8D%EC%83%9D%EB%8C%80,110334,BUS_STATION/-/transit?c=14127614.8411958,4505293.6993785,13,0,0,0,dh',
    kakaoURL:
      'https://map.kakao.com/?map_type=TYPE_MAP&target=traffic&rt=478215%2C1107182%2C488767%2C1099382&rt1=%EA%B5%AC%EB%A1%9C%EB%94%94%EC%A7%80%ED%84%B8%EB%8B%A8%EC%A7%80%EC%97%AD+2%ED%98%B8%EC%84%A0&rt2=%EB%86%8D%EC%83%9D%EB%8C%80&rtIds=SES0232%2C16210731015&rtTypes=SUBWAYSTATION%2CBUSSTOP&transitOption=3',
    googleData: {
      origin: { lat: 37.485215, lng: 126.901594 },
      destination: { lat: 37.457002, lng: 126.949203 }
    },
    savePath: './data/5/',
    busList: []
  })
];

const scheduler = new Scheduler({
  mapLoadInterval: 1000 * 60 * 5, // 5분
  transitDataLoadInterval: 1000 * 10, // 10초
  downloaders,
  enabledTimeRanges: [
    {
      begin: Scheduler.makeTime(6, 30, 0),
      end: Scheduler.makeTime(24, 0, 0)
    },
    {
      begin: Scheduler.makeTime(0, 0, 0),
      end: Scheduler.makeTime(1, 0, 0)
    }
  ]
});

scheduler.start();
