import process from 'process'
import yargs from 'yargs'
import main from '../index'

const {
  _: directories,
  knownMjsPackages = []
} = yargs
  .usage('make-mjs [options] <directories>')
  .option('knownMjsPackages', {
    type: 'array',
    describe: 'Names of packages that should support mjs'
  })
  .env('MAKE_MJS')
  .help()
  .argv

main({
  directories,
  knownMjsPackages: knownMjsPackages.map(x => String(x)),
  console,
  process
}).catch((error: any) => {
  console.error(error)
  process.exit(-1)
})
