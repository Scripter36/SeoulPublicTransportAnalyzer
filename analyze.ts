import Analyzer from './src/Analyzer.js';
import * as fs from 'fs/promises';
import * as path from 'path';

fs.readdir('./data/1').then(async (mapFiles) => {
  for (const mapFile of mapFiles) {
    await Analyzer.analyzeMap(path.join('./data/1', mapFile), './data/transit/', [
      {
        name: '7호선',
        type: 'SUBWAY',
        begin: '마들',
        end: '숭실대입구',
        destination: ['석남(거북시장)']
      }
    ]);
  }
});
