export interface getPubTransRouteParams {
  sX: string;
  sY: string;
  sName: string;
  sid: string;
  eX: string;
  eY: string;
  eName: string;
  eid: string;
}

export interface Start {
  x: number;
  y: number;
  code: string;
  region: string;
  name: string;
  confirmId: string;
}

export interface End {
  x: number;
  y: number;
  code: string;
  region: string;
  name: string;
  confirmId: string;
}

export interface NumberOfRoutes {
  total: number;
  bus: number;
  subway: number;
  busAndSubway: number;
}

export interface Distance {
  value: number;
  text: string;
  html: string;
}

export interface Time {
  value: number;
  text: string;
  html: string;
}

export interface WalkingDistance {
  value: number;
  text: string;
  html: string;
}

export interface WalkingTime {
  value: number;
  text: string;
  html: string;
}

export interface Fare {
  value: number;
  text: string;
  html: string;
}

export interface Boundary {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface RoadView {
  id: number;
  tilt: number;
  pan: number;
  zoom: number;
  x: number;
  y: number;
  signX: number;
  signY: number;
  dir: string;
  fileName: string;
}

export interface StartLocation {
  type: string;
  id: string;
  name: string;
  action: string;
  actionName: string;
  x: number;
  y: number;
  roadView: RoadView;
  subwayId: string;
  realTime?: boolean;
  displayId: string;
}

export interface RoadView2 {
  id: number;
  tilt: number;
  pan: number;
  zoom: number;
  x: number;
  y: number;
  signX: number;
  signY: number;
  dir: string;
  fileName: string;
}

export interface EndLocation {
  type: string;
  id: string;
  name: string;
  action: string;
  actionName: string;
  x: number;
  y: number;
  roadView: RoadView2;
  subwayId: string;
  realTime?: boolean;
  subwayExit: string;
  displayId: string;
}

export interface Vehicle {
  type: string;
  id: string;
  subType: string;
  subTypeName: string;
  name: string;
  visible: boolean;
  upDownType: string;
  direction: string;
  name1: string;
  runningCountPerHour?: number;
  runningTimeGrade: string;
  startOrder?: number;
  idx: string;
}

export interface Summary {
  infomation: string;
  startLocation: StartLocation;
  endLocation: EndLocation;
  vehicles: Vehicle[];
  intervalCost: number;
}

export interface RoadView3 {
  id: number;
  tilt: number;
  pan: number;
  zoom: number;
  x: number;
  y: number;
  signX: number;
  signY: number;
  fileName: string;
  dir: string;
}

export interface StartLocation2 {
  name: string;
  confirmId: string;
  x: number;
  y: number;
  roadView: RoadView3;
  type: string;
  id: string;
  subwayId: string;
  realTime?: boolean;
  displayId: string;
}

export interface Distance2 {
  value: number;
  text: string;
  html: string;
}

export interface Time2 {
  value: number;
  text: string;
  html: string;
}

export interface RoadView4 {
  id: number;
  tilt: number;
  pan: number;
  zoom: number;
  x: number;
  y: number;
  signX: number;
  signY: number;
  dir: string;
  fileName: string;
}

export interface EndLocation2 {
  type: string;
  id: string;
  name: string;
  x: number;
  y: number;
  roadView: RoadView4;
  subwayId: string;
  confirmId: string;
  realTime?: boolean;
  displayId: string;
}

export interface PolylineStart {
  x: number;
  y: number;
}

export interface PolylineEnd {
  x: number;
  y: number;
}

export interface RoadView5 {
  id: number;
  tilt: number;
  pan: number;
  zoom: number;
  x: number;
  y: number;
  signX: number;
  signY: number;
  dir: string;
  fileName: string;
}

export interface Node {
  type: string;
  id: string;
  name: string;
  x: number;
  y: number;
  roadView: RoadView5;
  subwayId: string;
  realTime?: boolean;
  displayId: string;
}

export interface Vehicle2 {
  type: string;
  id: string;
  subType: string;
  subTypeName: string;
  name: string;
  visible: boolean;
  upDownType: string;
  direction: string;
  name1: string;
  runningCountPerHour?: number;
  runningTimeGrade: string;
  startOrder?: number;
  idx: string;
}

export interface Step {
  information: string;
  action: string;
  actionName: string;
  startLocation: StartLocation2;
  type: string;
  distance: Distance2;
  time: Time2;
  endLocation: EndLocation2;
  polylineStart: PolylineStart;
  polylineEnd: PolylineEnd;
  polyline: string;
  subwayExit: string;
  subwayElevator?: boolean;
  walkingGuide?: boolean;
  nodes: Node[];
  vehicles: Vehicle2[];
  direction: string;
  runningCountPerHour?: number;
  runningTimeGrade: string;
  intervalCost?: number;
}

export interface Route {
  ranking: number;
  type: string;
  distance: Distance;
  time: Time;
  walkingDistance: WalkingDistance;
  walkingTime: WalkingTime;
  transfers: number;
  fare: Fare;
  boundary: Boundary;
  recommended: boolean;
  shortestTime: boolean;
  leastTransfer: boolean;
  summaries: Summary[];
  steps: Step[];
}

export interface InLocal {
  status: string;
  start: Start;
  end: End;
  numberOfRoutes: NumberOfRoutes;
  routes: Route[];
}

export interface PubTransRouteResponse {
  in_local_status: string;
  inter_local_status: string;
  inter_local?: unknown;
  in_local: InLocal;
  mkey: string;
}

export interface BusLocation {
  sectionOrder: number;
  sectionDist: number;
  sectionOffsetDist: number;
  sectionMovingTime: number;
  sectionMovingSpeed: number;
  vehicleId: string;
  vehicleNumber: string;
  lastVehicle: boolean;
  collectDateTime: string;
  collectStatus: string;
  firstVehicle: boolean;
  vehicleType: number;
}

export interface BusStop {
  id: string;
  masterId: string;
  name: string;
  x: number;
  y: number;
  readableItsId: string;
  realTime: boolean;
  virtual: boolean;
  turningPoint: boolean;
  nextLinkSpeed: number;
  order: number;
  orderIdx: string;
}

export interface FirstLastTime {
  startPointFirstTime: string;
  startPointLastTime: string;
  dayType: number;
}

export interface Interval {
  nonPeakInterval: number;
  peakInterval: number;
  dayType: number;
}

export interface BusDetailInfo {
  turningPoint: string;
  startPoint: string;
  turningPointBusLine: string;
  startPointBusLine: string;
  firstLastTimes: FirstLastTime[];
  intervals: Interval[];
}

export interface Bound {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface DayTypeMap {
  1: string;
  2: string;
  3: string;
  4: string;
}

export interface BusInfoResponse {
  id: string;
  name: string;
  hcode: string;
  hcodeName: string;
  hname: string;
  routeDetailName: string;
  type: string;
  startPoint: string;
  endPoint: string;
  interval: string;
  first: string;
  last: string;
  path: string;
  itsCode: number;
  realTime: boolean;
  cpCodeServiceName: string;
  realtimeState: string;
  realtimeMessage: string;
  busLocations: BusLocation[];
  busStops: BusStop[];
  busDetailInfo: BusDetailInfo;
  bound: Bound;
  dayTypeMap: DayTypeMap;
}

export interface GuideMessage {
  bunji: string;
  cidx: number;
  keyword: string;
  region?: unknown;
  sidx: number;
  type: string;
}

export interface BusStop {
  DOCID: string;
  BUSSTOP_NAME: string;
  STOP_ID: string;
  STOP_BUS_TYPE: string;
  wx: number;
  wy: number;
  lon: number;
  lat: number;
  RGN_D1_NAME: string;
  RGN_D2_NAME: string;
  RGN_D3_NAME: string;
  roadview: string;
  direction: string;
  distance: string;
  v_landmark: string;
  realtime: string;
}

export interface Bus {
  DOCID: string;
  BUS_NAME: string;
  BUS_TYPE_ID: string;
  START_POINT: string;
  END_POINT: string;
  wx: number;
  wy: number;
  lon: number;
  lat: number;
  BUS_INTERVAL_TIME: string;
  BUS_FIRST_TIME: string;
  BUS_LAST_TIME: string;
  RGN_D1_NAME: string;
  RGN_D2_NAME: string;
  BUS_HCODE: string;
  v_landmark: string;
  realtime: string;
  bus_schedule_info: string;
}

export interface KakaoSearchResponse {
  addr_count: number;
  page_count: number;
  query: string;
  org_query: string;
  guide_message: GuideMessage[];
  region_depth: string;
  region_type: string;
  sort: number;
  page: number;
  mng_type: string;
  is_franchise: string;
  is_category: string;
  highway_yn: string;
  oil_yn: string;
  lpg_yn: string;
  mrank_type: string;
  exposure_level: string;
  bus_recommend: string;
  bus_recommend_top: string;
  category_depth: string;
  analysis: string;
  sn_query: string;
  samename: unknown[];
  search_center_radius: string;
  point?: unknown;
  trans_map_type: string;
  trans_map_str: string;
  oil_type?: unknown;
  oil_sort_type?: unknown;
  oil_sort_value?: unknown;
  oil_station_type?: unknown;
  address_retry: string;
  address_extra_match_yn: string;
  address: unknown[];
  place: unknown[];
  busStop: BusStop[];
  filter?: unknown;
  place_totalcount: number;
  bus_cnt: number;
  busStop_cnt: number;
  cate_id: string;
  srcid: string;
  tile_search: string;
  target: string;
  cateLink: string;
  cateGroupList: unknown[];
  bus: Bus[];
  premium: unknown[];
  map_plus?: unknown;
}
