import * as express from "express"
import * as agent from "superagent"

export let app = express()

app.get("/txs", (req, res) =>
{
	let addr = `3MQTRzttkMtsMEy9dRq4Sf1xiSsWKgQkyH`
	getTransactions(addr, (err, txs) =>
	{
		res.json({ txs })
	})
})

interface ITransaction
{
	info: blinfo.rawaddr.Tx
	tx: blinfo.rawaddr.Out | blinfo.rawaddr.Out[]
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
		
		let txs = obj.txs.map(tx => ({tx: tx.out.filter(o => o.addr == addr), info: Object.assign({}, tx, { inputs: undefined, out: undefined })}))
		
		return callback(undefined, txs)
	})
}