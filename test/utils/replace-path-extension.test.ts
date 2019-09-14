import { replacePathExtension } from '@make-mjs/utils'

it('"abc.def.ghi"', () => {
  expect(replacePathExtension('abc.def.ghi', '.newExt')).toBe('abc.def.newExt')
})

it('"abc.def."', () => {
  expect(replacePathExtension('abc.def.', '.newExt')).toBe('abc.def.newExt')
})

it('"abc.def"', () => {
  expect(replacePathExtension('abc.def', '.newExt')).toBe('abc.newExt')
})

it('"abcdef"', () => {
  expect(replacePathExtension('abcdef', '.newExt')).toBe('abcdef.newExt')
})
