import * as fs from 'fs/promises';
import * as path from 'path';
import dateFormat from 'dateformat';
import SeoulSubwayCrawler from './data/SeoulSubway.js';
import SeoulBusCrawler from './data/SeoulBus.js';
import Downloader from './Downloader.js';
import { sleep } from './Utils.js';

export default class TransitDownloader implements Downloader {
  private _busList: string[];
  private _busIdList: string[];
  private busPromise: Promise<void> | null;
  savePath: string;

  constructor(
    params: Partial<{
      busList: string[];
      savePath: string;
    }>
  ) {
    this.savePath = params.savePath;
    this.busList = params.busList ?? [];
  }

  async load(time?: number) {
    if (this.busPromise != null) await this.busPromise;
    const results = {
      subway: {
        data: await SeoulSubwayCrawler.loadTrainInfo(),
        time,
        realTime: Date.now()
      }
    };
    await Promise.all(
      this._busIdList.map(async (v, i) => {
        await sleep(i * 1000);
        results[this._busList[i]] = {
          data: await SeoulBusCrawler.getBusPosByRtid(this._busIdList[i]),
          time: time == null ? undefined : time + i,
          realTime: Date.now()
        };
      })
    );
    await fs.writeFile(
      path.join(this.savePath, `transit_${dateFormat(new Date(), 'yyyymmdd_HHMMss')}.json`),
      JSON.stringify(results)
    );
  }

  set busList(busList: string[]) {
    this._busList = busList;
    this.busPromise = (async () => {
      this._busIdList = [];
      for (let i = 0; i < busList.length; i++) {
        const busId = await SeoulBusCrawler.getBusId(busList[i]);
        console.log(`${busList[i]} 버스 id: ${busId}`);
        this._busIdList.push(busId);
        if (i != busList.length - 1) await sleep(1000);
      }
      this.busPromise = null;
    })();
  }

  get busList() {
    return this._busList;
  }
}
