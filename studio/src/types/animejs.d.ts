declare module 'animejs' {
  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    seek(time: number): void;
    finished: Promise<void>;
  }
  interface AnimeParams {
    targets: string | Element | Element[] | NodeListOf<Element>;
    [key: string]: unknown;
  }
  interface AnimeStatic {
    (params: AnimeParams): AnimeInstance;
    stagger(value: number | string): unknown;
    set(targets: string | Element | Element[], params: Record<string, unknown>): void;
    remove(targets: string | Element | Element[]): void;
  }
  const anime: AnimeStatic;
  export default anime;
}
