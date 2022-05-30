export interface ComMsgHeader {
  requestMsgID?: unknown;
  serviceKey?: unknown;
  requestTime?: unknown;
  callBackURI?: unknown;
}

export interface MsgHeader {
  headerMsg: string;
}

export interface InBusPosByRtid {
  comMsgHeader: ComMsgHeader;
  msgHeader: MsgHeader;
  busRouteId: string;
}

export interface ComMsgHeader2 {
  errMsg?: unknown;
  requestMsgID?: unknown;
  responseTime?: unknown;
  responseMsgID?: unknown;
  successYN?: unknown;
  returnCode?: unknown;
}

export interface MsgHeader2 {
  headerMsg: string;
  headerCd: string;
  itemCount: number;
}

export interface ItemList {
  sectOrd: string;
  fullSectDist: string;
  sectDist: string;
  rtDist: string;
  stopFlag: string;
  sectionId: string;
  dataTm: string;
  tmX?: unknown;
  tmY?: unknown;
  posX: string;
  posY: string;
  gpsX: string;
  gpsY: string;
  vehId: string;
  plainNo: string;
  busType: string;
  lastStTm: string;
  nextStTm: string;
  lastStnId: string;
  lastStnOrd: string;
  lastStnOrd2: string;
  lastStnOrd3: string;
  trnstnid: string;
  isrunyn: string;
  islastyn: string;
  isFullFlag: string;
  congetion: string;
}

export interface MsgBody {
  itemList: ItemList[];
}

export interface OutBusPosByRtid {
  comMsgHeader: ComMsgHeader2;
  msgHeader: MsgHeader2;
  msgBody: MsgBody;
}

export interface getBusPosByRtidResponse {
  inBusPosByRtid: InBusPosByRtid;
  outBusPosByRtid: OutBusPosByRtid;
}
