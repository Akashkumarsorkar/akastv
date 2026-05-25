export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
  rawGroup: string;
  isHd: boolean;
  m3uSource: string;
}

export interface VisitorStats {
  count: number;
}
