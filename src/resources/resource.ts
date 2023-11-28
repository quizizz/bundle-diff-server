export default interface Resource {
  load(): Promise<void>;
}
