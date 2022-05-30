import Analyzer from './src/Analyzer.js';
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx/xlsx.mjs';
import { fileTimeToDate } from './src/Utils.js';
import dateFormat from 'dateformat';
XLSX.set_fs(fs);

function selectMinValueExceptMinus(a: number, b: number) {
  if (a < 0) return b;
  if (b < 0) return a;
  return Math.min(a, b);
}

(async () => {
  const workbook = XLSX.utils.book_new();
  await fsPromises.readdir('./data/1').then(async (mapFiles) => {
    const data = [];
    for (const mapFile of mapFiles) {
      data.push({
        ...(await Analyzer.analyzeMap(path.join('./data/1', mapFile), './data/transit/', [
          {
            name: '7호선',
            type: 'SUBWAY',
            begin: '마들',
            end: '숭실대입구',
            destination: ['석남(거북시장)']
          }
        ])),
        time: dateFormat(fileTimeToDate(mapFile), 'yyyy-mm-dd HH:MM:ss')
      });
    }
    fsPromises.writeFile('./result_1.json', JSON.stringify(data));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['시간', '네이버', '카카오', '구글', '계산'],
        ...data.map((line) => [line.time, line.naver, line.kakao, line.google, line.calculated])
      ]),
      '1'
    );
  });

  await fsPromises.readdir('./data/2').then(async (mapFiles) => {
    const data = [];
    for (const mapFile of mapFiles) {
      data.push({
        ...(await Analyzer.analyzeMap(path.join('./data/2', mapFile), './data/transit/', [
          {
            name: '4호선',
            type: 'SUBWAY',
            begin: '노원',
            end: '사당',
            destination: ['오이도', '사당', '안산', '남태령']
          },
          {
            type: 'WALKING',
            time: 2
          },
          {
            name: '2호선',
            type: 'SUBWAY',
            begin: '사당',
            end: '서울대입구',
            destination: ['내선순']
          }
        ])),
        time: dateFormat(fileTimeToDate(mapFile), 'yyyy-mm-dd HH:MM:ss')
      });
    }
    fsPromises.writeFile('./result_2.json', JSON.stringify(data));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['시간', '네이버', '카카오', '구글', '계산'],
        ...data.map((line) => [line.time, line.naver, line.kakao, line.google, line.calculated])
      ]),
      '2'
    );
  });

  await fsPromises.readdir('./data/3').then(async (mapFiles) => {
    const data = [];
    for (const mapFile of mapFiles) {
      data.push({
        ...(await Analyzer.analyzeMap(path.join('./data/3', mapFile), './data/transit/', [
          {
            name: '5511',
            type: 'BUS',
            begin: '119000072',
            beginNext: '',
            end: '120000184',
            endNext: '',
            destination: []
          }
        ])),
        time: dateFormat(fileTimeToDate(mapFile), 'yyyy-mm-dd HH:MM:ss')
      });
    }
    fsPromises.writeFile('./result_3.json', JSON.stringify(data));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['시간', '네이버', '카카오', '구글', '계산'],
        ...data.map((line) => [line.time, line.naver, line.kakao, line.google, line.calculated])
      ]),
      '3'
    );
  });

  await fsPromises.readdir('./data/4').then(async (mapFiles) => {
    const data = [];
    for (const mapFile of mapFiles) {
      const data_506 = await Analyzer.analyzeMap(path.join('./data/4', mapFile), './data/transit/', [
        {
          name: '506',
          type: 'BUS',
          begin: '120000032',
          beginNext: '',
          end: '101000039',
          endNext: '',
          destination: []
        },
        {
          name: '101',
          type: 'BUS',
          begin: '101000039',
          beginNext: '',
          end: '105000089',
          endNext: '',
          destination: []
        }
      ]);
      const data_501 = await Analyzer.analyzeMap(path.join('./data/4', mapFile), './data/transit/', [
        {
          name: '501',
          type: 'BUS',
          begin: '120000032',
          beginNext: '',
          end: '101000039',
          endNext: '',
          destination: []
        },
        {
          name: '101',
          type: 'BUS',
          begin: '101000039',
          beginNext: '',
          end: '105000089',
          endNext: '',
          destination: []
        }
      ]);

      data.push({
        kakao: selectMinValueExceptMinus(data_501.kakao, data_506.kakao),
        naver: selectMinValueExceptMinus(data_501.naver, data_506.naver),
        google: selectMinValueExceptMinus(data_501.google, data_506.google),
        calculated: Math.min(data_501.calculated, data_506.calculated),
        time: dateFormat(fileTimeToDate(mapFile), 'yyyy-mm-dd HH:MM:ss')
      });
    }
    fsPromises.writeFile('./result_4.json', JSON.stringify(data));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['시간', '네이버', '카카오', '구글', '계산'],
        ...data.map((line) => [line.time, line.naver, line.kakao, line.google, line.calculated])
      ]),
      '4'
    );
  });

  await fsPromises.readdir('./data/5').then(async (mapFiles) => {
    const data = [];
    for (const mapFile of mapFiles) {
      data.push({
        ...(await Analyzer.analyzeMap(path.join('./data/5', mapFile), './data/transit/', [
          {
            name: '2호선',
            type: 'SUBWAY',
            begin: '구로디지털단지',
            end: '서울대입구',
            destination: ['외선순']
          },
          {
            type: 'WALKING',
            time: 2
          },
          {
            name: '5513',
            type: 'BUS',
            begin: '120000228',
            end: '120000170',
            destination: []
          }
        ])),
        time: dateFormat(fileTimeToDate(mapFile), 'yyyy-mm-dd HH:MM:ss')
      });
    }
    fsPromises.writeFile('./result_5.json', JSON.stringify(data));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['시간', '네이버', '카카오', '구글', '계산'],
        ...data.map((line) => [line.time, line.naver, line.kakao, line.google, line.calculated])
      ]),
      '5'
    );
  });

  XLSX.writeFile(workbook, './result.xlsx');
})();
