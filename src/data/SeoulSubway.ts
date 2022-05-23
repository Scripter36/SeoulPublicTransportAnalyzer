import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export enum SubwayState {
  DEPARTURE,
  ARRIVAL,
  MOVING,
  APPROACH
}

export default class SeoulSubwayCrawler {
  static strToState(str: string) {
    switch (str) {
      case '출발':
        return SubwayState.DEPARTURE;
      case '도착':
        return SubwayState.ARRIVAL;
      case '이동':
        return SubwayState.MOVING;
      case '접근':
        return SubwayState.APPROACH;
    }
  }
  static async loadTrainInfo() {
    const response = await fetch('https://smapp.seoulmetro.co.kr:58443/traininfo/traininfoUserMap.do');
    const text = await response.text();
    const $ = cheerio.load(text);

    try {
      return [1, 2, 3, 4, 5, 6, 7, 8]
        .map((line) => {
          return $(`.${line}line`)
            .first()
            .find('.tip')
            .get()
            .map((element) => element.attributes.find((attr) => attr.name === 'title').value)
            .map((text) => {
              const data = text.split(/\s+/g);
              if (data.length !== 4) return null;
              return {
                line: line,
                id: data[0].substring(0, data[0].length - 2),
                location: data[1],
                state: this.strToState(data[2]),
                destination: data[3].substring(0, data[3].length - 1)
              };
            })
            .filter((item) => item != null);
          // trains 포맷: x열차 y (출발|도착|접근|이동) z행. y는 출발 / 도착은 해당 역, 이동 / 접근은 다음 역이 뜬다.
        })
        .flat();
    } catch (e) {
      console.log(`response: ${text}`);
      throw e;
    }
  }
}
