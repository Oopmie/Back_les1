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

app.post('/api/auth/register', async (req, res) => {
    const { name_user, password, age_user } = req.body

    if (!name_user || !password || !age_user) {
        return res.status(400).json({ error: 'Заполни все поля' })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await pool.query(
            'INSERT INTO users (name_user, password, age_user, role) VALUES ($1, $2, $3, $4) RETURNING id, name_user, role',
            [name_user, hashedPassword, age_user, 'user']
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('ОШИБКА:', error)
        res.status(500).json({ error: error.message })
    }
})



const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})