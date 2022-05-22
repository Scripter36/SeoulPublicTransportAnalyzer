import { LatLng } from '@googlemaps/google-maps-services-js';
import NaverMap from './data/NaverMap.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import dateFormat from 'dateformat';
import KakaoMap from './data/KakaoMap.js';
import GoogleMap from './data/GoogleMap.js';
import SeoulSubwayCrawler from './data/SeoulSubway.js';

function sleep(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

export default class Downloader {
  private _naverURL: string;
  kakaoURL: string;
  googleData: { origin: LatLng; destination: LatLng };
  private _busList: string[];
  private _busIdList: string[];
  private busPromise: Promise<void> | null;
  savePath: string;

  constructor(
    params: Partial<{
      naverURL: string;
      kakaoURL: string;
      googleData: { origin: LatLng; destination: LatLng };
      busList: string[];
      savePath: string;
    }>
  ) {
    this.kakaoURL = params.kakaoURL;
    this.googleData = params.googleData;
    this.naverURL = params.naverURL;
    this.savePath = params.savePath;
    this.busList = params.busList ?? [];
  }

  async loadMap(time?: number) {
    const results = {
      naver: await NaverMap.pointToPointByURL(this.naverURL, new Date()),
      kakao: await KakaoMap.getPubTransRouteByURL(this.kakaoURL),
      google: await GoogleMap.directions(this.googleData.origin, this.googleData.destination),
      time,
      realTime: Date.now()
    };
    await fs.writeFile(
      path.join(this.savePath, `map_${dateFormat(new Date(), 'yyyymmdd_HHMMss')}.json`),
      JSON.stringify(results)
    );
  }

  async loadTransitData(time?: number) {
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
          data: await KakaoMap.getBusInfo(this._busIdList[i]),
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

  set naverURL(naverURL: string) {
    this._naverURL = naverURL;
    if (this.googleData == null && this._naverURL != null) {
      [this.googleData.origin, this.googleData.destination] = NaverMap.parseDirectionsURL(this._naverURL).map(
        (param) => ({
          lat: param.coords[1],
          lng: param.coords[0]
        })
      );
    }
  }

  get naverURL() {
    return this._naverURL;
  }

  set busList(busList: string[]) {
    this._busList = busList;
    this.busPromise = (async () => {
      this._busIdList = [];
      for (let i = 0; i < busList.length; i++) {
        const response = await KakaoMap.search(busList[i]);
        this._busIdList.push(response.bus.find((busResult) => busResult.BUS_NAME === busList[i]).DOCID);
        if (i != busList.length - 1) await sleep(1000);
      }
      this.busPromise = null;
    })();
  }

  get busList() {
    return this._busList;
  }
}
