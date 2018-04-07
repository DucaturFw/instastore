import * as express from "express"
import * as agent from "superagent"
import { isOpReturn, splitOpReturn } from "./blockchain";

export let app = express()

app.get("/txs", (req, res) =>
{
	let addr = `3MQTRzttkMtsMEy9dRq4Sf1xiSsWKgQkyH` // navalny
	// addr = `1E7Ej41tpkWCCHPGtaRiVGndCVtz5Ym8XE` // op_return test
	getTransactions(addr, (err, txs) =>
	{
		res.json({ txs })
	})
})

interface ITransaction
{
	info: blinfo.rawaddr.Tx
	tx: blinfo.rawaddr.Out | blinfo.rawaddr.Out[]
	op_return?: string | { data: string, length: number }
}

function getTransactions(addr: string, callback: (error, txs: ITransaction[]) => void)
{
	let url = `https://blockchain.info/rawaddr/`
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