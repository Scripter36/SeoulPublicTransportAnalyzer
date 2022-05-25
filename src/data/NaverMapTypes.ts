export interface Coords {
  center: { crs: string; x: number; y: number };
}

export interface CoordsToAddrResponse {
  status: {
    code: number;
    name: string;
    message: string;
  };
  results?: {
    name: 'addr' | 'roadaddr';
    code: {
      id: string;
      type: string;
      mappingId: string;
    };
    region: Record<
      'area0' | 'area1' | 'area2' | 'area3' | 'area4',
      {
        name: string;
        coords: Coords;
      }
    >;
    land: {
      type: string;
      number1: string;
      number2: string;
      addition0: { type: string; value: string };
      addition1: { type: string; value: string };
      addition2: { type: string; value: string };
      addition3: { type: string; value: string };
      addition4: { type: string; value: string };
      name: string;
      coords: Coords;
    };
  }[];
}

export interface ServiceDay {
  id: number;
  name: string;
}

export interface Context {
  engineVersion: string;
  engineUrl?: unknown;
  start: string;
  goal: string;
  departureTime: Date;
  currentDateTime: Date;
  serviceDay: ServiceDay;
  recommendDirectionsType: string;
  uuid?: unknown;
}

export interface Fare {
  routes: unknown[][];
  fare: number;
  tripIdx: number;
}

export interface Info {
  walk: string;
  etc: string;
  subway?: unknown;
}

export interface AlarmTime {
  alarmDepartureTime?: unknown;
  alarmArrivalTime?: unknown;
}

export interface Type {
  id: number;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
}

export interface Operation {
  type: string;
  name: string;
  shortName: string;
}

export interface Type2 {
  code: string;
  desc: string;
}

export interface Platform {
  status: string;
  type: Type2;
  door: string;
  doors: string[];
}

export interface Message {
  date: string;
  intervalCount: string;
}

export interface BusInterval {
  message: Message;
}

export interface Flag {
  typeCode: string;
  typeName: string;
  symbol: string;
  shortMessage: string;
  longMessage: string;
}

export interface Route {
  id: number;
  name: string;
  longName: string;
  type: Type;
  realtime: boolean;
  useInterval: boolean;
  operationType: string;
  operation: Operation;
  color?: unknown;
  platform: Platform;
  headsign: string;
  busInterval: BusInterval;
  flag: Flag;
}

export interface Platform2 {
  id: number;
  name: string;
}

export interface Crossover {
  id: number;
  name: string;
}

export interface Door {
  id: number;
  name: string;
}

export interface Restroom {
  id: number;
  name: string;
}

export interface LostCenter {
  url: string;
  tel: string;
}

export interface Aux {
  platform: Platform2;
  crossover: Crossover;
  door: Door;
  restroom: Restroom;
  facilities: string[];
  disabledFacilities: string[];
  lostCenter: LostCenter;
}

export interface Station {
  id: number;
  placeId: string;
  name: string;
  longName?: unknown;
  displayName: string;
  displayCode: string;
  stop: boolean;
  realtime: boolean;
  aux: Aux;
}

export interface Congestion {
  code: string;
  desc: string;
}

export interface Item {
  status: string;
  plateNo: string;
  lowFloor: boolean;
  remainingTime: number;
  remainingStop: number;
  remainingSeat?: number;
  congestion: Congestion;
  last: boolean;
}

export interface Arrival {
  status: string;
  stationId: number;
  routeId: number;
  items: Item[];
}

export interface Point {
  x: number;
  y: number;
}

export interface From {
  exit: string;
  name: string;
}

export interface To {
  exit: string;
  name: string;
}

export interface Upwa {
  from: From;
  to: To;
}

export interface Step2 {
  cross?: unknown;
  distance: number;
  duration: number;
  eye: number[];
  junc?: unknown;
  lat: number;
  lng: number;
  lookAt: number[];
  path: string;
  poi?: unknown;
  road: string;
  turn: number;
  turnDesc: string;
  turnInfo: string;
  upwa: Upwa;
}

export interface Summary {
  distance: number;
  duration: number;
}

export interface Leg2 {
  steps: Step2[];
  summary: Summary;
}

export interface Way {
  lat: number;
  lng: number;
  multiEntrance: boolean;
  name: string;
}

export interface Summary2 {
  bound: number[][];
  crosswalk: number;
  distance: number;
  dupOptions: unknown[];
  duration: number;
  facilityDesc?: unknown;
  option: string;
  overpass: number;
  stair: number;
  stepCount: number;
  underpass: number;
  ways: Way[];
}

export interface Walkpath {
  legs: Leg2[];
  summary: Summary2;
}

export interface Step {
  type: string;
  instruction: string;
  info: Info;
  departureTime: Date;
  arrivalTime: Date;
  alarmTime: AlarmTime;
  distance: number;
  duration: number;
  tripIdx?: number;
  headsign: string;
  wayType: string;
  routes: Route[];
  stations: Station[];
  arrivals: Arrival[];
  points: Point[];
  walkpath: Walkpath;
  shutdown: boolean;
  lastTrip: boolean;
  firstTrip: boolean;
  departureCity?: unknown;
  stationIdAsOptional?: unknown;
}

export interface Path {
  idx: number;
  mode: string;
  type: string;
  optimizationMethod: string;
  labels: string[];
  departureTime: Date;
  arrivalTime: Date;
  alarmDepartureTime?: unknown;
  alarmArrivalTime?: unknown;
  duration: number;
  intercityDuration: number;
  walkingDuration: number;
  waitingDuration: number;
  distance: number;
  shutdown: boolean;
  fare: number;
  fares: Fare[];
  legs: {
    steps: Step[];
  }[];
  transferCount: number;
  directionsType: string;
  pathLabels: {
    labelCode: string;
    labelText: string;
  }[];
  vehicleTypes: string[];
}

export interface StaticPath {
  idx: number;
  mode: string;
  type: string;
  optimizationMethod: string;
  labels: string[];
  departureTime: Date;
  arrivalTime: Date;
  duration: number;
  intercityDuration: number;
  walkingDuration: number;
  waitingDuration: number;
  distance: number;
  shutdown: boolean;
  fare: number;
  fares: Fare[];
  legs: {
    steps: Step[];
  }[];
  transferCount: number;
  directionsType: string;
  pathLabels: {
    labelCode: string;
    labelText: string;
  }[];
  vehicleTypes: string[];
}

export interface PointToPointResponse {
  status: string;
  context: Context;
  paths: Path[];
  staticPaths: StaticPath[];
}

export interface Place {
  type: string;
  id: string;
  title: string;
  x: string;
  y: string;
  dist: number;
  totalScore: number;
  sid: string;
  ctg: string;
  cid: string;
  jibunAddress: string;
  roadAddress: string;
  subwayID: string;
  subwayLane: string;
  theme: {
    type: string;
    id: string;
  };
}

export interface InstantSearchResponse {
  meta: {
    model: string;
    query: string;
    requestId: string;
  };
  ac: string[];
  place: Place[];
  address: unknown[];
  bus: unknown[];
  menu: unknown[];
  all: {
    place: Place;
    address?: unknown;
    bus?: unknown;
  }[];
}

export interface SubwayMappingDataResponse {
  message: {
    '@type': string;
    '@service': string;
    '@version': string;
    result: {
      dataList: {
        data: { a: string; b: string }[];
      };
    };
  };
}
