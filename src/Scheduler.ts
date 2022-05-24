import dateFormat from 'dateformat';
import Downloader from './Downloader.js';
import MapDownloader from './MapDownloader.js';
import TransitDownloader from './TransitDownloader.js';
import { sleep } from './Utils.js';

export default class Scheduler {
  mapLoadInterval: number; // 예상 도착 시간 포함 지도 데이터 불러오는 간격. 밀리세컨드
  transitLoadInterval: number; // 실시간 대중교통 정보 불러오는 간격. 밀리세컨드
  downloaders: Downloader[];

  timer: NodeJS.Timer | null;
  UITimer: NodeJS.Timer | null;

  lastMapExecuteTime = 0;
  lastTransitExecuteTime = 0;
  enabledTimeRanges: { begin?: number; end?: number }[];

  statistics = {
    transit: 0,
    lastTransit: new Date(),
    map: 0,
    lastMap: new Date(),
    begin: new Date(),
    errors: []
  };

  constructor(
    params: Partial<{
      mapLoadInterval: number;
      transitLoadInterval: number;
      downloaders: Downloader[];
      enabledTimeRanges: { begin?: number; end?: number }[];
    }>
  ) {
    this.mapLoadInterval = params.mapLoadInterval;
    this.transitLoadInterval = params.transitLoadInterval;
    this.downloaders = params.downloaders ?? [];
    this.enabledTimeRanges = params.enabledTimeRanges;
  }

  static makeTime(hours: number, minutes: number, seconds: number) {
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  init() {
    this.lastMapExecuteTime = Math.floor(Date.now() / this.mapLoadInterval) * this.mapLoadInterval;
    this.lastTransitExecuteTime = Math.floor(Date.now() / this.transitLoadInterval) * this.transitLoadInterval;
    this.statistics = {
      transit: 0,
      lastTransit: new Date(),
      map: 0,
      lastMap: new Date(),
      begin: new Date(),
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
      const now = new Date();
      const nowTime = Scheduler.makeTime(now.getHours(), now.getMinutes(), now.getSeconds());
      if (
        this.enabledTimeRanges.length > 0 &&
        !this.enabledTimeRanges.some((range) => {
          return (range.begin == null || nowTime >= range.begin) && (range.end == null || nowTime <= range.end);
        })
      ) {
        this.lastMapExecuteTime = Math.floor(Date.now() / this.mapLoadInterval) * this.mapLoadInterval;
        this.lastTransitExecuteTime = Math.floor(Date.now() / this.transitLoadInterval) * this.transitLoadInterval;
        return;
      }

      const time = now.getTime();
      if (time - this.lastMapExecuteTime >= this.mapLoadInterval) {
        this.lastMapExecuteTime = Math.floor(time / this.mapLoadInterval) * this.mapLoadInterval;
        Promise.all(
          this.downloaders
            .filter((downloader) => downloader instanceof MapDownloader)
            .map(async (downloader, i) => {
              await sleep((i + 1) * this.transitLoadInterval);
              await downloader.load(this.lastMapExecuteTime + (i + 1) * this.transitLoadInterval);
            })
        )
          .then(() => {
            this.statistics.map++;
            this.statistics.lastMap = new Date(this.lastMapExecuteTime);
          })
          .catch((e) => {
            this.statistics.errors.push(e);
            this.lastMapExecuteTime -= this.mapLoadInterval;
          });
      }
      if (time - this.lastTransitExecuteTime >= this.transitLoadInterval) {
        this.lastTransitExecuteTime = Math.floor(time / this.transitLoadInterval) * this.transitLoadInterval;
        Promise.all(
          this.downloaders
            .filter((downloader) => downloader instanceof TransitDownloader)
            .map(async (downloader) => {
              await downloader.load(this.lastTransitExecuteTime);
            })
        )
          .then(() => {
            this.statistics.transit++;
            this.statistics.lastTransit = new Date(this.lastTransitExecuteTime);
          })
          .catch((e) => {
            this.statistics.errors.push(e);
            this.lastTransitExecuteTime -= this.transitLoadInterval;
          });
      }
    }, 10);
    this.UITimer = setInterval(() => {
      process.stdout.write(
        '\x1Bc========== SeoulPublicTransportAnalyzer ==========\n' +
          `대중교통 정보: ${this.statistics.transit}회 수집 (${
            this.statistics.transit > 0
              ? `마지막 수집 시간: ${dateFormat(this.statistics.lastTransit, 'yyyy-mm-dd HH:MM:ss')}, `
              : ''
          }수집 간격: ${this.transitLoadInterval / 1000}초)\n` +
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
          `흐른 시간: ${dateFormat(new Date(Date.now() - this.statistics.begin.getTime()), 'UTC:HH:MM:ss')}\n` +
          `오류: ${this.statistics.errors.length}회 발생\n` +
          (this.statistics.errors.length > 0
            ? `마지막 오류: ${this.statistics.errors[this.statistics.errors.length - 1]}`
            : '')
      );
      if (this.statistics.errors.length > 25) {
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
