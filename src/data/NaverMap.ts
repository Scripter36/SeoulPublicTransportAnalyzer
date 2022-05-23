import dateFormat from 'dateformat';
import fetch from 'node-fetch';
import proj4 from 'proj4';
import type {
  CoordsToAddrResponse,
  InstantSearchResponse,
  PointToPointResponse,
  SubwayMappingDataResponse
} from './NaverMapTypes';

export default class NaverMap {
  static crs = 'epsg:4326';
  static baseCoords = '37.5666103,126.9783881';
  static subwayMappingData: { a: string; b: string }[] = [];

  static async subwayidToPlaceid(subwayid: string) {
    const entry = this.subwayMappingData.find((data) => data.a === subwayid);
    if (entry != null) return entry.b;
    else {
      const response = await fetch(`https://map.naver.com/v5/api/subway/mappingdata`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
        }
      });
      const data = (await response.json()) as SubwayMappingDataResponse;
      this.subwayMappingData = data.message.result.dataList.data;
      const newEntry = this.subwayMappingData.find((data) => data.a === subwayid);
      if (newEntry == null) return '';
      return newEntry.b;
    }
  }

  static async coordsToAddr(coords: string) {
    // coords는 xxx.xxxxxxx,yy.yyyyyyy 형식의 string (소수점 7자리)
    const response = await fetch(
      `https://map.naver.com/v5/api/geocode?request=coordsToaddr&version=1.0&sourcecrs=${this.crs}&output=json&orders=addr,roadaddr&coords=${coords}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
        }
      }
    );
    const data = (await response.json()) as CoordsToAddrResponse;
    return data;
  }

  static async instantSearch(coords: string, query: string) {
    const params = new URLSearchParams({
      lang: 'ko',
      caller: 'pcweb',
      types: 'place,address',
      coords,
      query
    });

    const response = await fetch(`https://map.naver.com/v5/api/instantSearch?${params.toString()}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
      }
    });
    const data = (await response.json()) as InstantSearchResponse;
    return data;
  }

  static async pointToPoint(start: string, goal: string, departureTime: Date) {
    const params = new URLSearchParams({
      start,
      goal,
      crs: this.crs.toUpperCase(),
      departureTime: dateFormat(departureTime, 'yyyy-mm-dd') + 'T' + dateFormat(departureTime, 'HH:MM:ss'),
      mode: 'TIME',
      lang: 'ko',
      includeDetailOperation: 'true'
    });

    const response = await fetch(
      'https://map.naver.com/v5/api/transit/directions/point-to-point?' + params.toString(),
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53'
        }
      }
    );
    const data = (await response.json()) as PointToPointResponse;
    return data;
  }

  static parseDirectionsURL(url: string) {
    const paths = new URL(url).pathname.split('/').slice(1);
    if (paths[0] !== 'v5' || paths[1] !== 'directions' || paths.length < 4) throw new Error('Unknown URL');
    return paths.slice(2, 4).map((raw) => {
      // start, end
      const data = raw.split(','); // 순서대로 좌표1, 좌표2(epsg:3857), 이름, 번호, 종류
      const coords = proj4('EPSG:3857').inverse([parseFloat(data[0]), parseFloat(data[1])]);
      const name = data[2];
      const type = data[4];
      if (type === 'BUS_STATION') {
        return {
          type,
          coords,
          busId: data[3],
          name
        };
      } else if (type === 'SUBWAY_STATION') {
        return {
          type,
          coords,
          subwayId: data[3],
          name
        };
      } else {
        throw new Error(`Unsupported place type ${type}.`);
      }
    });
  }

  static async pointToPointByURL(url: string, departureTime: Date) {
    const params = await Promise.all(
      this.parseDirectionsURL(url).map(async (param) => {
        if (param.type === 'BUS_STATION') {
          return `${param.coords.map((v) => v.toFixed(7).toString()).join(',')},name=${param.name}`;
        } else {
          return `${param.coords.map((v) => v.toFixed(7).toString()).join(',')},placeid=${await this.subwayidToPlaceid(
            param.subwayId
          )},name=${param.name}`;
        }
      })
    );

    return await this.pointToPoint(params[0], params[1], departureTime);
  }
}
