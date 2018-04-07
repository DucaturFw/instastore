import * as express from "express"
import * as agent from "superagent"
import { isOpReturn, splitOpReturn } from "./blockchain";
import { wallet_address } from "./config";

export let app = express()

app.all('*', function(req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')

    next()
})

let ADDR = `1DMCGx8KScwVeeDbLiAR8WdJfA6gChKkY7`
// ADDR = `3MQTRzttkMtsMEy9dRq4Sf1xiSsWKgQkyH` // navalny
ADDR = `1E7Ej41tpkWCCHPGtaRiVGndCVtz5Ym8XE` // op_return test
ADDR = `mqs15Gf9bC2Wq3Gx8TEAD9t7z7zVhXnum7`

ADDR = wallet_address

function _err(res, err)
{
	res.json({ error: err })
}
app.get("/txs", (req, res) =>
{
	let addr = ADDR
	getTransactions(addr, (err, txs) =>
	{
		if (err)
			return _err(res, err)
		
		res.json({ txs })
	})
})
app.get("/orders", (req, res) =>
{
	let addr = ADDR
	getOrders((err, orders) =>
	{
		if (err)
			return _err(res, err)
		
		getTransactions(addr, (err, txs) =>
		{
			if (err)
				return _err(res, err)
			
			let fos = mergeOrdersTransactions(orders, txs)
			res.json({ orders: fos })
		})
	})
})

interface ITransaction
{
	info: blinfo.rawaddr.Tx
	tx: blinfo.rawaddr.Out | blinfo.rawaddr.Out[]
	op_return?: { data: string, length: number }
}
interface IOrder
{
	hash: string
	data
}
interface IFullOrder
{
	order: IOrder
	tx: ITransaction
}

function getTransactions(addr: string, callback: (error, txs: ITransaction[]) => void)
{
	let url = `https://testnet.blockchain.info/rawaddr/`
	agent.get(`${url}${addr}`, (err, res) =>
	{
		if (err)
			return callback(err, undefined)
		
		let obj = res.body as blinfo.rawaddr.RootObject
		
		if (!obj || !obj.txs)
			return callback("invalid blockchain.info response", undefined)
		
		let txs = obj.txs.map(tx => ({
			tx: tx.out.filter(o => o.addr == addr),
			info: Object.assign({}, tx, { inputs: undefined, out: undefined }),
			op_return: splitOpReturn((tx.out.filter(isOpReturn)[0] || { script: "" }).script),
		}))
		
		return callback(undefined, txs)
	})
}
function getOrders(callback: (error, orders: IOrder[]) => void)
{
	/* let FAKE_ORDERS: IOrder[] = [
		{data: {timestamp: 1523117058, amount: 5}, hash: "6f6d6e69000000000000001f000000029b927000"}
	]
	return setTimeout(() => callback(undefined, FAKE_ORDERS), 50) */
	
	
	let url = `http://34.207.88.113:3000/get_orders`
	agent.get(`${url}`, (err, res) =>
	{
		if (err)
			return callback(err, undefined)
		
		return callback(undefined, res.body)
	})
}
function mergeOrdersTransactions(orders: IOrder[], txs: ITransaction[]): IFullOrder[]
{
	txs = txs.filter(tx => tx.op_return) // discard txs without op_return data (can't be matched to any order)
	
	// console.log(txs.map(tx => tx.op_return.data))
	
	return orders.map(o => ({
		order: o,
		tx: txs.filter(tx => tx.op_return.data == o.hash)[0]
	}))
}