import dateFormat from 'dateformat';
import Downloader from './Downloader';

const getGCD = (a: number, b: number) => {
  while (a % b !== 0) {
    const c = a % b;
    a = b;
    b = c;
  }
  return b;
};

export default class Scheduler {
  mapLoadInterval: number; // 예상 도착 시간 포함 지도 데이터 불러오는 간격. 밀리세컨드
  transitDataLoadInterval: number; // 실시간 대중교통 정보 불러오는 간격. 밀리세컨드
  downloaders: Downloader[];

  timer: NodeJS.Timer | null;
  UITimer: NodeJS.Timer | null;

  progress = 0;
  mapProgress = 0;
  mapMax = 0;
  transitProgress = 0;
  transitMax = 0;
  interval = 0;
  enabledTimeRanges: { begin?: number; end?: number }[];

  statistics = {
    transit: 0,
    lastTransit: new Date(),
    map: 0,
    lastMap: new Date(),
    time: 0
  };

  constructor(
    params: Partial<{
      mapLoadInterval: number;
      transitDataLoadInterval: number;
      downloaders: Downloader[];
      enabledTimeRanges: { begin?: number; end?: number }[];
    }>
  ) {
    this.mapLoadInterval = params.mapLoadInterval;
    this.transitDataLoadInterval = params.transitDataLoadInterval;
    this.downloaders = params.downloaders ?? [];
    this.enabledTimeRanges = params.enabledTimeRanges;
  }

  static makeTime(hours: number, minutes: number, seconds: number) {
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  init() {
    this.interval = getGCD(this.mapLoadInterval, this.transitDataLoadInterval);
    this.mapMax = this.mapLoadInterval / this.interval;
    this.transitMax = this.transitDataLoadInterval / this.interval;
    this.progress = 0;
    this.mapProgress = 0;
    this.transitProgress = 0;
    this.statistics = {
      transit: 0,
      lastTransit: new Date(),
      map: 0,
      lastMap: new Date(),
      time: 0
    };
  }

  start() {
    this.stop();
    this.resume();
  }

  pause() {
    if (this.timer != null) clearInterval(this.timer);
    if (this.UITimer != null) clearInterval(this.UITimer);
  }

  resume() {
    this.pause();
    this.timer = setInterval(() => {
      this.statistics.time += this.interval / 1000;
      const now = new Date();
      const nowTime = Scheduler.makeTime(now.getHours(), now.getMinutes(), now.getSeconds());
      if (
        this.enabledTimeRanges.length > 0 &&
        !this.enabledTimeRanges.some((range) => {
          return (range.begin == null || nowTime >= range.begin) && (range.end == null || nowTime <= range.end);
        })
      )
        return;
      this.transitProgress++;
      this.mapProgress++;
      if (this.transitProgress >= this.transitMax) {
        this.downloaders[0].loadTransitData(this.statistics.time);
        this.statistics.transit++;
        this.statistics.lastTransit = new Date();
        this.transitProgress = 0;
      }
      if (this.mapProgress >= this.mapMax) {
        this.downloaders.forEach((downloader, i) =>
          setTimeout(
            () => downloader.loadMap(this.statistics.time + ((i + 1) * this.transitDataLoadInterval) / 1000),
            (i + 1) * this.transitDataLoadInterval
          )
        );
        this.statistics.map++;
        this.statistics.lastMap = new Date();
        this.mapProgress = 0;
      }
    }, this.interval);
    this.UITimer = setInterval(() => {
      process.stdout.write(
        '\x1Bc========== SeoulPublicTransportAnalyzer ==========\n' +
          `대중교통 정보: ${this.statistics.transit}회 수집 ${
            this.statistics.transit > 0
              ? `(마지막 수집 시간: ${dateFormat(this.statistics.lastTransit, 'yyyy-mm-dd HH:MM:ss')})`
              : ''
          }\n` +
          `지도 정보: ${this.statistics.map}회 수집 ${
            this.statistics.map > 0
              ? `(마지막 수집 시간: ${dateFormat(this.statistics.lastMap, 'yyyy-mm-dd HH:MM:ss')})`
              : ''
          }\n` +
          `데이터 수집 시간: ${
            this.enabledTimeRanges.length === 0
              ? '항상'
              : this.enabledTimeRanges
                  .map(
                    (range) =>
                      `${range.begin == null ? '00:00:00' : dateFormat(new Date(range.begin), 'UTC:HH:MM:ss')}~${
                        range.end == null ? '24:00:00' : dateFormat(new Date(range.end), 'UTC:HH:MM:ss')
                      }`
                  )
                  .join(', ')
          }\n` +
          `흐른 시간: ${this.statistics.time}초`
      );
    }, 1000);
  }

  stop() {
    this.pause();
    this.init();
  }
}
