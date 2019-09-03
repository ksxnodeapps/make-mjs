export const isInternalModule = (path: string) => path.startsWith('./') || path.startsWith('../')
export default isInternalModule
