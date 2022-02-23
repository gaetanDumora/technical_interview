import { createServer, IncomingMessage, ServerResponse } from 'http'
import { Balance, BalanceChecker } from './models/Balance-model.js'
import { exec } from 'child_process'

const PORT = process.env.PORT || 4000
const balance = new Balance()
const controllingManagement = new BalanceChecker()

interface IBankingFormat {
    id: number,
    date: Date,
    wording: string,
    amount: number
}
interface ICheckPoint {
    date: Date,
    amount: number
}
interface Post {
    movements: IBankingFormat[]
    balances: ICheckPoint[]
}

const server = createServer((request: IncomingMessage, response: ServerResponse) => {

    let template = ''
    switch (request.url) {
        case '/movements/validation':
            if (request.method === 'POST') {
                response.writeHead(202, { 'Content-Type': 'application/json' })
                let requestBody = ''
                request.on('data', chunk => requestBody += chunk)
                request.on('end', () => {
                    const documents: Post = JSON.parse(requestBody)
                    balance.movements = documents.movements
                    controllingManagement.submit(balance, documents.balances)
                    response.end()
                })
            }
            if (request.method === 'GET') {
                response.writeHead(200, { 'Content-Type': 'text/html' })
                if (balance.movements.length > 0) {
                    for (const { amount, date, id, wording } of balance.movements) {
                        template += `<div>
                            <p>${wording}</p>
                            <p>date: ${date}</p>
                            <p>amount: ${amount}</p>`
                        balance.duplicatesMovements.map(({ id }) => id).includes(id) ?
                            template += `<p>duplicate: <b>True</b></p><hr></div>`
                            : template += `<p>duplicate: False</p><hr></div>`
                    }
                    template += `<h3>Total: ${balance.computeBalance()}</h3>
                    <a href="/movements/checkpoint">-->CHECKPOINT</a>`
                    response.end(template)
                } else {
                    response.end(`<h3>No movements recorded...</h3>`)
                }
            }
            break
        case '/movements/checkpoint':
            response.writeHead(200, { 'Content-Type': 'text/html' })
            for (const { date, discrepancy, id } of controllingManagement.discrepanciesPruned) {
                template += `<div>
                        <p>balance_date: ${date}</p>
                        <p>discrepancy: ${discrepancy}</p>
                        <p>movements_probably_increminated: </p>`
                for (const i of id) {
                    template += `<li>movement_id: ${i}</li>`
                }
                template += `<hr></div>`
            }
            controllingManagement.isCorrectBalance() ?
                template += `<h3>Balance is correct</h3>`
                : template += `<h3>Balance is not correct</h3><br><a href="/movements/validation">=>BACK MOVEMENTS</a>`
            response.end(template)
            break
        default: {
            response.writeHead(418, { 'Content-Type': 'application/json' })
            response.end({
                "reasons": [
                    { "message": "I prefer coffee..." },
                    { "message": "or I'm running outside..." },
                    { "message": "or server is on fire" }
                ]
            })
        }
    }
})
server.listen(PORT, () => {
    exec("node test.js")
})