export interface ComMsgHeader {
  errMsg?: unknown;
  requestMsgID?: unknown;
  responseTime?: unknown;
  responseMsgID?: unknown;
  successYN?: unknown;
  returnCode?: unknown;
}

export interface MsgHeader {
  headerMsg: string;
  headerCd: string;
  itemCount: number;
}

export interface ItemList {
  busRouteId: string;
  busRouteNm: string;
  seq: string;
  section: string;
  station: string;
  arsId: string;
  stationNm: string;
  gpsX: string;
  gpsY: string;
  posX: string;
  posY: string;
  fullSectDist: string;
  direction: string;
  stationNo: string;
  routeType: string;
  beginTm: string;
  lastTm: string;
  trnstnid: string;
  sectSpd: string;
  transYn: string;
  detourAt: string;
}

export interface MsgBody {
  itemList: ItemList[];
}

export interface OutStationByRoute {
  comMsgHeader: ComMsgHeader;
  msgHeader: MsgHeader;
  msgBody: MsgBody;
}

export interface ComMsgHeader2 {
  requestMsgID?: unknown;
  serviceKey?: unknown;
  requestTime?: unknown;
  callBackURI?: unknown;
}

export interface MsgHeader2 {
  headerMsg: string;
}

export interface InStationByRoute {
  comMsgHeader: ComMsgHeader2;
  msgHeader: MsgHeader2;
  busRouteId: string;
}

export interface getBusPosByRtidResponse {
  outStationByRoute: OutStationByRoute;
  inStationByRoute: InStationByRoute;
}
