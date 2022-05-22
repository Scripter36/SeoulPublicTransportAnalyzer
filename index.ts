import proj4 from 'proj4';
import GoogleMap from './src/GoogleMap.js';
import SeoulSubwayCrawler from './src/SeoulSubway.js';

SeoulSubwayCrawler.loadTrainInfo().then(console.log).catch(console.error);

// 상봉역 7호선 -> 건대입구역 7호선
const origin = proj4('EPSG:3857').inverse([14147112.171709511, 4522499.12257681]);
const destination = proj4('EPSG:3857').inverse([14145489.745790947, 4514767.868262075]);
GoogleMap.directions(
  {
    lat: origin[1],
    lng: origin[0]
  },
  {
    lat: destination[1],
    lng: destination[0]
  }
)
  .then((response) => {
    console.log(response.routes[0].legs);
  })
  .catch(console.error);
