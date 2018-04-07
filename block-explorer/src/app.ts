console.log("hello")

import { app } from "./restapi"

const PORT = 8814
app.listen(PORT, () =>
{
	console.log(`listening on ${PORT}`)
	
})