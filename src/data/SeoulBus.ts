import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { getBusPosByRtidResponse } from './SeoulBusTypes';

export enum SubwayState {
  DEPARTURE,
  ARRIVAL,
  MOVING,
  APPROACH
}

const initTime = Date.now();

export default class SeoulBusCrawler {
  static async getBusPosByRtid(routeId: string) {
    const params = new URLSearchParams({
      busRouteId: routeId,
      callback: `jQuery21309659545822266942_${initTime}`,
      _: Date.now().toString()
    });

    const response = await fetch(
      `https://apiweb.bus.go.kr:444/api/rest/buspos/getBusPosByRtid.jsonp?${params.toString()}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
        }
      }
    );
    const text = await response.text();
    const data = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'))) as getBusPosByRtidResponse;
    return data;
  }

  static async getBusId(query: string) {
    const params = new URLSearchParams({
      searchType: 'A1',
      searchCode: 'N',
      searchName: `2,${query}`,
      imagesType: 'T1',
      imsiReq: `2,${query}`,
      mnuNm: '1',
      strBusNumber: '',
      gpsX: '',
      gpsY: ''
    });
    const response = await fetch('https://bus.go.kr/searchResult6.jsp', {
      method: 'POST',
      body: params,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
      }
    });
    const $ = cheerio.load(await response.text());
    const searchParams = new URLSearchParams($('#introflash').attr('src').split('?')[1]);
    return searchParams.get('strbusid');
  }
}
