const config = {
  entry: {
    main: './src/index.tsx',
    inject: './src/background/injected/eventsManager.ts',
    background: './src/background/index.ts',
    init: './src/background/init.ts',
  },
}
module.exports = config
