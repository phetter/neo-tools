// rpc getBlockCount in neon-js
// This Query returns the current block height.

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const neon      = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

let node = ''
let defly = false

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-n, --node [node]', 'set RPC node to use (be sure to preface with https://)')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  // TODO move all -n args to -N for network

  .parse(process.argv);

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
}

if (!program.node) {
  // get a node from the list and try it
  let net = program.Net.toLowerCase()

  if (net === 'mainnet' || net === 'main' || net === 'main_net') net = 'MainNet'
  else if (net === 'testnet' || net === 'test' || net === 'test_net') net = 'TestNet'
  else net = program.Net

  print('net: '+program.Net)
  print('net: '+net)

  dbg.logDeep('nets: ', cfg.get_nodes(net))

} else node = program.node

const client = neon.default.create.rpcClient(node)

// client.getBlockCount().then(response => {
//   dbg.logDeep('result:\n', response)
// })