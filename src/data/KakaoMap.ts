import fetch from 'node-fetch';
import type {
  BusInfoResponse,
  getPubTransRouteParams,
  KakaoSearchResponse,
  PubTransRouteResponse
} from './KakaoMapTypes';

export default class KakaoMap {
  static CALLBACK = 'jQuery1810971505812370959_' + Date.now();

  static async getPubTransRoute(params: getPubTransRouteParams) {
    const urlParams = new URLSearchParams({
      inputCoordSystem: 'WCONGNAMUL',
      outputCoordSystem: 'WCONGNAMUL',
      service: 'map.daum.net',
      callback: this.CALLBACK,
      ...params
    });

    const response = await fetch(`https://map.kakao.com/route/pubtrans.json?${urlParams.toString()}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
      }
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'))) as PubTransRouteResponse;
      return data;
    } catch (e) {
      console.log('response: ', response);
      throw e;
    }
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

    const response = await fetch(`https://map.kakao.com/bus/info.json?${urlParams.toString()}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
      }
    });
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
      referrer: 'https://map.kakao.com/',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
      }
    });
    const text = await response.text();
    const data = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'))) as KakaoSearchResponse;
    return data;
  }
}
