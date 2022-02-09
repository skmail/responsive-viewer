export type Platform = {
  storage: {
    local: {
      get: (...args: any[]) => unknown
      set: (...args: any[]) => void
      remove: (...args: any[]) => void
    }
  }
  runtime: {
    sendMessage: (...args: any[]) => void
    getURL: (...args: any[]) => void
    onMessage: {
      addListener: (...args: any) => void
    }
  }
}
