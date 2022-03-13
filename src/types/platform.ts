export type Platform = {
  storage: {
    local: {
      get(key: string): Promise<any>
      set(values: { [key: string]: any }): Promise<void>
      remove: (key: string) => Promise<void>
    }
  }
  runtime: {
    sendMessage: (...args: any[]) => void
    getURL: (...args: any[]) => string
    onMessage: {
      addListener: (...args: any) => void
    }
  }
}
