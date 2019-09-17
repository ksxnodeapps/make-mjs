interface Options {
  readonly modulePath: string
}

export const isMjsUrl = (options: Options) => options.modulePath.endsWith('.mjs')
export default isMjsUrl
