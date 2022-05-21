import fetch from 'node-fetch';
import { getPubTransRouteParams, PubTransRouteResponse } from './KakaoMapTypes';

export class KakaoMapCrawler {
  static async getPubTransRoute(params: getPubTransRouteParams) {
    const urlParams = new URLSearchParams({
      inputCoordSystem: 'WCONGNAMUL',
      outputCoordSystem: 'WCONGNAMUL',
      service: 'map.daum.net',
      callback: 'jQuery1810971505812370959_1653125770986',
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
}
