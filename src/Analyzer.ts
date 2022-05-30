import { DirectionsResponseData, TravelMode } from '@googlemaps/google-maps-services-js';
import dateFormat from 'dateformat';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PubTransRouteResponse } from './data/KakaoMapTypes.js';
import { PointToPointResponse } from './data/NaverMapTypes.js';
import { SubwayState } from './data/SeoulSubway.js';
import { MapData } from './MapDownloader.js';
import { TransitData } from './TransitDownloader.js';
import { fileTimeToDate } from './Utils.js';

export interface TransitRouteItem {
  type: 'BUS' | 'SUBWAY';
  name: string;
  begin: string;
  beginNext?: string;
  end: string;
  endNext?: string;
  destination: string[];
}

export interface WalkingRouteItem {
  type: 'WALKING';
  time: number;
}

export type RouteItem = TransitRouteItem | WalkingRouteItem;

export default class Analyzer {
  static transitDataList;
  static async analyzeMap(mapFilePath: string, transitDirectory: string, routes: RouteItem[]) {
    const mapData = JSON.parse((await fs.readFile(mapFilePath)).toString()) as MapData;
    const mapTime = fileTimeToDate(path.basename(mapFilePath, path.extname(mapFilePath)));
    const transits = (await fs.readdir(transitDirectory)).sort();
    const start = transits.findIndex((transitFile) => {
      if (fileTimeToDate(transitFile) >= mapTime) return true;
      return false;
    });
    if (start == -1) return { naver: -1, kakao: -1, google: -1, calculated: -1 };
    const transitRoutes = routes.filter(
      (route) => route.type === 'BUS' || route.type === 'SUBWAY'
    ) as TransitRouteItem[];
    console.log(`start: ${transits[start]}`);
    const times = {
      naver: this.getExpectedTimeFromNaver(mapData.naver, transitRoutes, mapTime),
      kakao: this.getExpectedTimeFromKakao(mapData.kakao, transitRoutes),
      google: this.getExpectedTimeFromGoogle(mapData.google, transitRoutes)
    };
    console.log('times:', times);

    // 경로 분석

    let transitIndex = start;
    let routeId = 0;
    const startTime = fileTimeToDate(transits[start]).getTime();
    let currentTime = startTime;
    const transitStatus: {
      id: string;
      startTime: number;
    }[] = routes.map(() => undefined);

    if (this.transitDataList == null) {
      this.transitDataList = [];
      for (let i = 0; i < transits.length; i++) {
        this.transitDataList.push(JSON.parse((await fs.readFile(path.join(transitDirectory, transits[i]))).toString()));
      }
    }
    while (routeId < routes.length && transitIndex < this.transitDataList.length) {
      currentTime = fileTimeToDate(transits[transitIndex]).getTime();
      const transitData = this.transitDataList[transitIndex] as TransitData;
      if (routes[routeId].type === 'SUBWAY') {
        const route = routes[routeId] as TransitRouteItem;
        if (transitStatus[routeId] == null) {
          // 승차하지 않음
          const trains = transitData.subway.data.filter(
            (train) => train.line.toString() === route.name.at(0) && route.destination.includes(train.destination)
          );

          const availableTrain = trains.find(
            (train) => train.location === route.begin && train.state == SubwayState.ARRIVAL
          );

          // 탈 수 있으면 탄다
          if (availableTrain != null) {
            transitStatus[routeId] = { id: availableTrain.id, startTime: currentTime };
            console.log(
              `[${dateFormat(fileTimeToDate(transits[transitIndex]), 'HH:MM:ss')}] ${availableTrain.id} 열차 승차`
            );
          }
        } else {
          // 승차함. 내릴 수 있는지 확인한다.
          const currentTrain = transitData.subway.data.find((train) => train.id === transitStatus[routeId].id);
          if (
            currentTrain != null &&
            currentTrain.location === route.end &&
            currentTrain.state === SubwayState.ARRIVAL
          ) {
            // 내림
            routeId++;
            console.log(
              `[${dateFormat(fileTimeToDate(transits[transitIndex]), 'HH:MM:ss')}] ${currentTrain.id} 열차 하차`
            );
          }
        }
      } else if (routes[routeId].type === 'BUS') {
        const route = routes[routeId] as TransitRouteItem;
        const buses = transitData[route.name].data.outBusPosByRtid.msgBody.itemList;
        if (buses != null) {
          // 결과가 없는 경우 null
          if (transitStatus[routeId] == null) {
            // 승차하지 않음

            const availableBus = buses.find((bus) => bus.lastStnId === route.begin && bus.stopFlag === '1');

            // 탈 수 있으면 탄다
            if (availableBus != null) {
              transitStatus[routeId] = { id: availableBus.plainNo, startTime: currentTime };
              console.log(
                `[${dateFormat(fileTimeToDate(transits[transitIndex]), 'HH:MM:ss')}] ${availableBus.plainNo} 버스 승차`
              );
            }
          } else {
            // 승차함. 내릴 수 있는지 확인한다.
            const currentBus = transitData[route.name].data.outBusPosByRtid.msgBody.itemList.find(
              (bus) => bus.plainNo === transitStatus[routeId].id
            );
            if (currentBus != null && currentBus.lastStnId === route.end && currentBus.stopFlag == '1') {
              // 내림
              routeId++;
              console.log(
                `[${dateFormat(fileTimeToDate(transits[transitIndex]), 'HH:MM:ss')}] ${currentBus.plainNo} 버스 하차`
              );
            }
          }
        }
      } else if (routes[routeId].type === 'WALKING') {
        const route = routes[routeId] as WalkingRouteItem;
        if (transitStatus[routeId] == null) {
          transitStatus[routeId] = { id: '', startTime: currentTime };
          console.log(`[${dateFormat(fileTimeToDate(transits[transitIndex]), 'HH:MM:ss')}] 환승 시작`);
        } else if (currentTime - transitStatus[routeId].startTime > route.time) {
          console.log(`[${dateFormat(fileTimeToDate(transits[transitIndex]), 'HH:MM:ss')}] 환승 완료`);
          routeId++;
        }
      }
      transitIndex++;
    }

    return { ...times, calculated: (currentTime - startTime) / 60000 };
  }

  static getExpectedTimeFromNaver(data: PointToPointResponse, routes: TransitRouteItem[], currentTime: Date) {
    for (const paths of [data.paths /*, data.staticPaths */]) {
      // staticPath는 나중에 출발이므로?
      for (const path of paths) {
        for (const leg of path.legs) {
          let routeId = 0;
          let time = 0;
          const filteredSteps = leg.steps.filter((step) => step.type !== 'WALKING');
          if (filteredSteps.length !== routes.length) continue;
          for (let i = 0; i < leg.steps.length; i++) {
            const step = leg.steps[i];
            if (step.type === 'WALKING') {
              if (i !== 0 && i !== leg.steps.length - 1) time += step.duration;
              continue;
            }
            if (step.type !== routes[routeId].type) break;
            if (step.routes.every((route) => route.name !== routes[routeId].name)) break;
            routeId++;
            time += step.duration;
          }
          if (routeId === routes.length) {
            // match
            return (
              (filteredSteps.length !== leg.steps.length ? time : path.duration) +
              (new Date(path.departureTime).getTime() -
                new Date(dateFormat(currentTime, 'yyyy-mm-dd') + 'T' + dateFormat(currentTime, 'HH:MM:ss')).getTime()) /
                60000
            );
          }
        }
      }
    }
    return -1;
  }

  static getExpectedTimeFromKakao(data: PubTransRouteResponse, routes: TransitRouteItem[]) {
    for (const route of data.in_local.routes) {
      let routeId = 0;
      if (route.summaries.length !== routes.length) continue;
      for (const summary of route.summaries) {
        if (
          summary.vehicles.every(
            (vehicle) => vehicle.type !== routes[routeId].type || vehicle.name !== routes[routeId].name
          )
        )
          break;
        routeId++;
      }
      if (routeId === routes.length) {
        return route.time.value / 60;
      }
    }
    return -1;
  }

  static getExpectedTimeFromGoogle(data: DirectionsResponseData, routes: TransitRouteItem[]) {
    for (const route of data.routes) {
      for (const leg of route.legs) {
        let routeId = 0;
        let time = 0;
        const filteredSteps = leg.steps.filter((step) => step.travel_mode.toLowerCase() !== TravelMode.walking);
        if (filteredSteps.length !== routes.length) continue;
        for (let i = 0; i < leg.steps.length; i++) {
          const step = leg.steps[i];
          if (step.travel_mode.toLowerCase() === TravelMode.walking) {
            if (i !== 0 && i !== leg.steps.length - 1) time += step.duration.value / 60;
            continue;
          }
          if (step.transit_details.line.short_name !== routes[routeId].name) break;
          routeId++;
          time += step.duration.value / 60;
        }
        if (routeId === routes.length) {
          return filteredSteps.length !== leg.steps.length ? time : leg.duration.value / 60;
        }
      }
    }
    return -1;
  }
}
