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
