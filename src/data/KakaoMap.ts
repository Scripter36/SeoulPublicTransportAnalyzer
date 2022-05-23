import fetch from 'node-fetch';
import type {
  BusInfoResponse,
  getPubTransRouteParams,
  KakaoSearchResponse,
  PubTransRouteResponse
} from './KakaoMapTypes';

export default class KakaoMap {
  static CALLBACK = 'jQuery1810971505812370959_1653125770986';

  static async getPubTransRoute(params: getPubTransRouteParams) {
    const urlParams = new URLSearchParams({
      inputCoordSystem: 'WCONGNAMUL',
      outputCoordSystem: 'WCONGNAMUL',
      service: 'map.daum.net',
      callback: this.CALLBACK,
      ...params
    });

    const response = await fetch(`https://map.kakao.com/route/pubtrans.json?${urlParams.toString()}`);
    const text = await response.text();
    const data = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'))) as PubTransRouteResponse;
    return data;
  }

  static async getPubTransRouteByURL(url: string) {
    const searchParams = new URL(url).searchParams;
    const [sX, sY, eX, eY] = searchParams.get('rt').split(',');
    const sName = searchParams.get('rt1').replace(/\+/g, ' ');
    const eName = searchParams.get('rt2').replace(/\+/g, ' ');
    const [sid, eid] = searchParams.get('rtIds').split(',');

    return await this.getPubTransRoute({
      sX,
      sY,
      eX,
      eY,
      sName,
      eName,
      sid,
      eid
    });
  }

  static async getBusInfo(busline: string) {
    const urlParams = new URLSearchParams({
      output: 'json',
      callback: this.CALLBACK,
      busline
    });

    const response = await fetch(`https://map.kakao.com/bus/info.json?${urlParams.toString()}`);
    const text = await response.text();
    const data = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'))) as BusInfoResponse;
    return data;
  }

  static async search(query: string) {
    const urlParams = new URLSearchParams({
      callback: this.CALLBACK,
      q: query,
      msFlag: 'A',
      sort: '0'
    });

    const response = await fetch(`https://search.map.kakao.com/mapsearch/map.daum?${urlParams.toString()}`, {
      referrer: 'https://map.kakao.com/'
    });
    const text = await response.text();
    const data = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'))) as KakaoSearchResponse;
    return data;
  }
}
