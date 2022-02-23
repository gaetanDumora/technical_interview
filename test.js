import axios from 'axios'

const PORT = process.env.PORT || 4000
const documents = {
    "movements": [
        {
            "id": 1,
            "date": new Date("2022.02.21"),
            "wording": "paper",
            "amount": 100
        },
        {
            "id": 2,
            "date": new Date("2022.02.19"),
            "wording": "scissor",
            "amount": 50
        },
        {
            "id": 3,
            "date": new Date("2022.02.20"),
            "wording": "coffee",
            "amount": 500
        },
        {
            "id": 3,
            "date": new Date("2022.02.18"),
            "wording": "coffee",
            "amount": 500
        },
        {
            "id": 4,
            "date": new Date("2022.01.17"),
            "wording": "stone",
            "amount": 10
        },
        {
            "id": 5,
            "date": new Date("2022.01.04"),
            "wording": "movies",
            "amount": 25
        },
        {
            "id": 6,
            "date": new Date("2022.01.05"),
            "wording": "cheese",
            "amount": 25
        },
        {
            "id": 7,
            "date": new Date("2022.01.04"),
            "wording": "oreo",
            "amount": 5
        }
    ],
    "balances": [
        { "date": new Date("2022.02.28"), "amount": 800 },
        { "date": new Date("2022.01.30"), "amount": 65 }]
}
try {
    await axios.post(`http://localhost:${PORT}/movements/validation`, documents,{
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
} catch (error) {
    console.log(error)
}
