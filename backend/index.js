require('dotenv').config()
const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

app.get('/api/main', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM countries')
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ error: `Server error ${error.message}` })
    }
})

app.post("/api/form", async (req, res) => {
    try {
        const { name, code } = req.body
        const result = await pool.query(
            'INSERT INTO countries (name, code) VALUES ($1,$2) RETURNING *',
            [name, code]
        )
        res.json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: `Server error ${error.message}` })
    }
})




const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})