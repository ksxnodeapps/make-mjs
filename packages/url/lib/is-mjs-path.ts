interface Options {
  readonly modulePath: string
}

export const isMjsPath = (options: Options) => options.modulePath.endsWith('.mjs')
export default isMjsPath
