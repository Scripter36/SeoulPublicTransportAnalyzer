export default interface Downloader {
  load(time: number): Promise<unknown>;
}
