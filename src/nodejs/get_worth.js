// Get the price of a symbol at a given amount on either binance or cmc

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const cmc     = require('nodejs_market/coinmarketcap/get_price')
const binance = require('nodejs_exchange/binance/binance-api.js')
var cfg       = require('nodejs_config/config')

var config    = cfg.load('nodejs_config/neoscan.config.json')

function print(msg) {
  console.log(msg);
}

var address, exchange, get_price

program
  .version('0.1.0')
  .usage('-s <symbol> -a <amount> -x [exchange]')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --amount <amount>', 'Specify the amount of symbol for which to find value')
  .option('-s, --symbol <symbol>', 'Specify the symbol to look its value')
  .option('-x, --exchange [exchange]', 'Specify exchange or api to use to query prices - defaults to coinmarketcap', 'cmc')
  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.symbol || !program.amount) {
  program.help()
}

if (program.exchange) {
  exchange = program.exchange
  if(exchange === 'binance') get_price = binance.get_price
  else get_price = cmc.get_price
}

if (program.debug) {
  print('DEBUGGING');
}


get_price(program.symbol).then(result => {
  if(result) print('usd value: '+ result + '\n' + 'net worth for amount: ' + result * program.amount)
})
