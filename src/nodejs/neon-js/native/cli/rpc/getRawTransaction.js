// RPC getRawTransaction CLI that calls native/modules/rpc/getRawTransaction from CLI
// Main Dependency: neon-js
// This talks to an RPC node on the given netowrk and returns a transaction

// IMPORTANT OPTIMIZATION NOTE: As of /NEO:2.8.0/, the only difference in the return value of getRawTransaction versus getBlock is three fields more in the former:
// blockhash, confirmations, and blocktime.  Don't make the extra RPC call to getRawTransaction if you don't need to.

// TODO: extension? Get nth transaction

require('module-alias/register')


const program     = require('commander')
const _           = require('underscore')

const neon        = require('@cityofzion/neon-js')
const dbg         = require('nodejs_util/debug')
const netUtil     = require('nodejs_util/network')
const getNodesBy  = require('nodejs_rpc-over-https/v2.9.0/client/module/getNodesBy')

var cfg           = require('nodejs_config/config.js')
var config        = cfg.load('nodejs_config/nodejs.config.json')

const command = require('nodejs_neon-js/native/modules/rpc/getRawTransaction')

let nodes = []
let defly = false
let arg

function print(msg) {
  console.log(msg);
}

program
  .version('0.2.0')
  .usage('')
  .option('-D, --Debug', 'Debug')
  .option('-n, --node [node]', 'Set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-h, --hash [hash]', 'Specify the hash of the transaction to fetch, if no hash is provided, will get the most recent')
  .option('-x, --xstr', 'Return hexstring transactoin value instead of default json', 1)
  .option('-t, --time', 'Only return time field of results')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .on('--help', function(){
    print('OPTIMIZATION NOTE: \n\nAs of /NEO:2.8.0/, the only difference in the return value of getRawTransaction versus getBlock is three fields more in the former: blockhash, confirmations, and blocktime. Don\'t make the extra RPC call to getRawTransaction if you don\'t need to.')
  })
  .parse(process.argv)

if (program.Debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netUtil.debug()
}

if (program.hash) arg = program.hash

if (!program.node) {
  // get a node from the list and try it
  let net = netUtil.resolveNetworkId(program.Net)

  nodes = cfg.getNodes(net)

  if (defly) dbg.logDeep('config nodes: ', nodes)

  let options = {
    net: net,
    order: 'asc',
    nodes: nodes
  }

  getNodesBy.tallest(options).then(rankedNodes => {
    if (defly) dbg.logDeep('sorted nodes: ', rankedNodes)
    nodes = rankedNodes
    commandWrapper(nodes)
  }).catch (error => {
      console.log('neon-js.getNodesByTallest(): ' + error.message)
  })

} else {
  nodes.push({ "url": program.node })
  commandWrapper(nodes)
}

function commandWrapper(nodelist) {
  let runtimeArgs = {
    'Debug': defly,
    'node': nodelist[0].url,
    'hash': program.hash,
    'time': program.time ? program.time : false,
    'human': program.Human ? program.Human : false,
    'xstr': program.xstr ? program.xstr : 0,
  }

  if (defly) dbg.logDeep('runtimeArgs: ', runtimeArgs)

  command.run(runtimeArgs).then((r) => {
    dbg.logDeep(' ', r)
  })
  .catch (error => {
    console.log(__filename + ': ' + error.message)
  })
}
