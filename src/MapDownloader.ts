import { DirectionsResponseData, LatLng } from '@googlemaps/google-maps-services-js';
import NaverMap from './data/NaverMap.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import dateFormat from 'dateformat';
import KakaoMap from './data/KakaoMap.js';
import GoogleMap from './data/GoogleMap.js';
import Downloader from './Downloader.js';
import { PointToPointResponse } from './data/NaverMapTypes.js';
import { PubTransRouteResponse } from './data/KakaoMapTypes.js';

export interface MapData {
  naver: PointToPointResponse;
  kakao: PubTransRouteResponse;
  google: DirectionsResponseData;
  time: number;
  realTime: number;
}

export default class MapDownloader implements Downloader {
  private _naverURL: string;
  kakaoURL: string;
  googleData: { origin: LatLng; destination: LatLng };
  savePath: string;

  constructor(
    params: Partial<{
      naverURL: string;
      kakaoURL: string;
      googleData: { origin: LatLng; destination: LatLng };
      savePath: string;
    }>
  ) {
    this.kakaoURL = params.kakaoURL;
    this.googleData = params.googleData;
    this.naverURL = params.naverURL;
    this.savePath = params.savePath;
  }

  async load(time?: number) {
    const results = {
      naver: await NaverMap.pointToPointByURL(this.naverURL, new Date()),
      kakao: await KakaoMap.getPubTransRouteByURL(this.kakaoURL),
      google: await GoogleMap.directions(this.googleData.origin, this.googleData.destination),
      time,
      realTime: Date.now()
    };
    try {
      await fs.stat(this.savePath);
    } catch (e) {
      await fs.mkdir(this.savePath);
    }
    await fs.writeFile(
      path.join(this.savePath, `map_${dateFormat(new Date(time), 'yyyymmdd_HHMMss')}.json`),
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
}
