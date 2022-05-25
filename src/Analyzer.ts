import { DirectionsResponseData, TravelMode } from '@googlemaps/google-maps-services-js';
import dateFormat from 'dateformat';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PubTransRouteResponse } from './data/KakaoMapTypes.js';
import { PointToPointResponse } from './data/NaverMapTypes.js';
import SeoulSubwayCrawler, { SubwayState } from './data/SeoulSubway.js';
import { MapData } from './MapDownloader.js';
import { TransitData } from './TransitDownloader.js';

export interface RouteItem {
  type: 'BUS' | 'SUBWAY';
  name: string;
  begin: string;
  end: string;
  destination: string[];
}

function fileTimeToDate(fileName: string) {
  const splited = fileName.split('_');
  const year = parseInt(splited[1].substring(0, 4), 10);
  const month = parseInt(splited[1].substring(4, 6), 10);
  const day = parseInt(splited[1].substring(6, 8), 10);
  const hours = parseInt(splited[2].substring(0, 2), 10);
  const minutes = parseInt(splited[2].substring(2, 4), 10);
  const seconds = parseInt(splited[2].substring(4, 6), 10);

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

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
    console.log(`start: ${transits[start]}`);
    const times = {
      naver: this.getExpectedTimeFromNaver(mapData.naver, routes),
      kakao: this.getExpectedTimeFromKakao(mapData.kakao, routes),
      google: this.getExpectedTimeFromGoogle(mapData.google, routes)
    };
    console.log('times:', times);

    // 경로 분석

    let transitId = start;
    let routeId = 0;
    let totalTime = 0;
    const transitStatus: string[] = routes.map(() => undefined);

    if (this.transitDataList == null) {
      this.transitDataList = [];
      for (let i = 0; i < transits.length; i++) {
        this.transitDataList.push(JSON.parse((await fs.readFile(path.join(transitDirectory, transits[i]))).toString()));
      }
    }
    while (routeId < routes.length && transitId < this.transitDataList.length) {
      const transitData = this.transitDataList[transitId] as TransitData;
      if (routes[routeId].type === 'SUBWAY') {
        if (transitStatus[routeId] == null) {
          // 승차하지 않음
          const trains = transitData.subway.data.filter(
            (train) =>
              train.line.toString() === routes[routeId].name.at(0) &&
              routes[routeId].destination.includes(train.destination)
          );

          const availableTrain = trains.find(
            (train) => train.location === routes[routeId].begin && train.state == SubwayState.ARRIVAL
          );

          // 탈 수 있으면 탄다
          if (availableTrain != null) {
            transitStatus[routeId] = availableTrain.id;
            console.log(`${availableTrain.id} 열차 승차`);
            totalTime -= fileTimeToDate(transits[transitId]).getTime();
          }
        } else {
          // 승차함. 내릴 수 있는지 확인한다.
          const currentTrain = transitData.subway.data.find((train) => train.id === transitStatus[routeId]);
          if (
            currentTrain != null &&
            currentTrain.location === routes[routeId].end &&
            currentTrain.state === SubwayState.ARRIVAL
          ) {
            // 내림
            routeId++;
            console.log(`${currentTrain.id} 열차 하차`);
            totalTime += fileTimeToDate(transits[transitId]).getTime();
            console.log(`소요 시간: ${totalTime / 1000 / 60}분`);
          }
        }
      }
      transitId++;
    }
  }

  static getExpectedTimeFromNaver(data: PointToPointResponse, routes: RouteItem[]) {
    for (const paths of [data.paths /*, data.staticPaths */]) {
      // staticPath는 나중에 출발이므로?
      for (const path of paths) {
        for (const leg of path.legs) {
          let routeId = 0;
          let time = 0;
          const filteredSteps = leg.steps.filter((step) => step.type !== 'WALKING');
          if (filteredSteps.length !== routes.length) continue;
          for (const step of filteredSteps) {
            if (step.type === 'WALKING') continue;
            if (step.type !== routes[routeId].type) break;
            if (step.routes.every((route) => route.name !== routes[routeId].name)) break;
            routeId++;
            time += step.duration;
          }
          if (routeId === routes.length) {
            // match
            return filteredSteps.length !== leg.steps.length ? time : path.duration;
          }
        }
      }
    }
    return -1;
  }

  static getExpectedTimeFromKakao(data: PubTransRouteResponse, routes: RouteItem[]) {
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

  static getExpectedTimeFromGoogle(data: DirectionsResponseData, routes: RouteItem[]) {
    for (const route of data.routes) {
      for (const leg of route.legs) {
        let routeId = 0;
        let time = 0;
        const filteredSteps = leg.steps.filter((step) => step.travel_mode.toLowerCase() !== TravelMode.walking);
        if (filteredSteps.length !== routes.length) continue;
        for (const step of filteredSteps) {
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
