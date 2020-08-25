#! /usr/bin/env node
const process = require('process')
const fsx = require('fs-extra')
const { traverse } = require('fs-tree-utils')
const places = require('@tools/places')
const [command] = process.argv.slice(2)
const IGNORED_DIRECTORIES = ['.git', 'node_modules']
const CHOSEN_EXT = '.tmpjs'

async function main() {
  const list = await traverse(places.packages, {
    stat: fsx.lstat,
    deep: param => !IGNORED_DIRECTORIES.includes(param.item),
  })

  function help() {
    console.info('Usage')
    console.info('$ change-output-extensions help|rename|cleanup')
    console.info()
  }

  if (command === 'help') {
    help()
  } else if (command === 'rename') {
    for (const param of list) {
      if (!param.item.endsWith('.js')) continue
      if (!param.stats.isFile()) continue
      const oldPath = param.path
      const newPath = oldPath.replace(/\.js$/, CHOSEN_EXT)
      await fsx.rename(oldPath, newPath)
    }
  } else if (command === 'cleanup') {
    for (const param of list) {
      if (!param.item.endsWith(CHOSEN_EXT)) continue
      if (!param.stats.isFile()) continue
      await fsx.remove(param.path)
    }
  } else if (command === undefined) {
    help()
    return 1
  } else {
    console.info('Invalid command:', command)
    console.info()
    help()
    return 1
  }

  return 0
}

main().then(
  status => process.exit(status),
  error => {
    console.error(error)
    process.exit(-1)
  },
)
