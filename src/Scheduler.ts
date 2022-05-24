import dateFormat from 'dateformat';
import Downloader from './Downloader.js';
import MapDownloader from './MapDownloader.js';
import TransitDownloader from './TransitDownloader.js';
import { sleep } from './Utils.js';

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
  transitLoading = false;
  mapLoading = false;
  enabledTimeRanges: { begin?: number; end?: number }[];

  statistics = {
    transit: 0,
    lastTransit: new Date(),
    map: 0,
    lastMap: new Date(),
    time: 0,
    errors: []
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
    this.transitLoading = false;
    this.mapLoading = false;
    this.statistics = {
      transit: 0,
      lastTransit: new Date(),
      map: 0,
      lastMap: new Date(),
      time: 0,
      errors: []
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
      if (!this.transitLoading && this.transitProgress >= this.transitMax) {
        this.transitLoading = true;
        Promise.all(
          this.downloaders
            .filter((downloader) => downloader instanceof TransitDownloader)
            .map(async (downloader) => {
              await downloader.load(this.statistics.time);
            })
        )
          .then(() => {
            this.statistics.transit++;
            this.statistics.lastTransit = new Date();
            this.transitProgress = 0;
          })
          .catch((e) => {
            this.statistics.errors.push(e);
          })
          .finally(() => (this.transitLoading = false));
      }
      if (!this.mapLoading && this.mapProgress >= this.mapMax) {
        this.mapLoading = true;
        Promise.all(
          this.downloaders
            .filter((downloader) => downloader instanceof MapDownloader)
            .map(async (downloader, i) => {
              await sleep((i + 1) * this.transitDataLoadInterval);
              await downloader.load(this.statistics.time + ((i + 1) * this.transitDataLoadInterval) / 1000);
            })
        )
          .then(() => {
            this.statistics.map++;
            this.statistics.lastMap = new Date();
            this.mapProgress = 0;
          })
          .catch((e) => {
            this.statistics.errors.push(e);
          })
          .finally(() => (this.mapLoading = false));
      }
    }, this.interval);
    this.UITimer = setInterval(() => {
      process.stdout.write(
        '\x1Bc========== SeoulPublicTransportAnalyzer ==========\n' +
          `대중교통 정보: ${this.statistics.transit}회 수집 (${
            this.statistics.transit > 0
              ? `마지막 수집 시간: ${dateFormat(this.statistics.lastTransit, 'yyyy-mm-dd HH:MM:ss')}, `
              : ''
          }수집 간격: ${this.transitDataLoadInterval / 1000}초)\n` +
          `지도 정보: ${this.statistics.map}회 수집 (${
            this.statistics.map > 0
              ? `마지막 수집 시간: ${dateFormat(this.statistics.lastMap, 'yyyy-mm-dd HH:MM:ss')}, `
              : ''
          }수집 간격: ${this.mapLoadInterval / 1000}초)\n` +
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
          `흐른 시간: ${this.statistics.time}초\n` +
          `오류: ${this.statistics.errors.length}회 발생\n` +
          (this.statistics.errors.length > 0
            ? `마지막 오류: ${this.statistics.errors[this.statistics.errors.length - 1]}`
            : '')
      );
      if (this.statistics.errors.length > 10) {
        console.log('너무 많은 오류가 발생하여 프로그램을 중단합니다. 에러:');
        this.statistics.errors.forEach((e) => console.error(e));
        process.exit(1);
      }
    }, 1000);
  }

  stop() {
    this.pause();
    this.init();
  }
}
