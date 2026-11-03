import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/main')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  const handlForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/form', {
        name: String(name),
        code: String(code)
      })
      setMessage('Данные добавлены')
      setName('')
      setCode('')
    }
    catch (error) {
      setMessage("Ошибка:" + error.response?.data?.error)
    }
  }

  return (
    <>
      <div>
        {data.map((item) => (
          <ul key={item.id}>
            <li>{item.name}</li>
            <li>{item.code}</li>
          </ul>
        ))}
      </div>
      <form action="" onSubmit={handlForm}>
        <input type="text" placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder='code' value={code} onChange={(e) => setCode(e.target.value)} />
        <button type='submit'>send</button>
      </form>
    </>
  )
}

export default App