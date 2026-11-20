import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userAge, setUserAge] = useState('')
  const [isError, setIsError] = useState(false)
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
  };
  const handleSubmits = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name_user: username,
        password: password,
        age_user: userAge,
      });

      setMessage(response.data.message || 'Регистрация успешна');
      setIsError(false);
      setUsername('');
      setPassword('');
      setUserAge('');

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Ошибка регистрации';
      setMessage(errorMsg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    setIsError(false);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login',{
        name_user: loginUsername,
        password:loginPassword,
      });

      const newToken //продолжить
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
        <input
          type="text"
          placeholder='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder='code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type='submit'>send</button>
      </form>

      <div className='App'>
        <div className="form-containerr">
          <h2>Регистрация</h2>
          <form action="" onSubmit={handleSubmits}>
            <input
              type="text"
              placeholder='логин'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder='пароль'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder='возраст'
              value={password}
              onChange={(e) => setUserAge(e.target.value)}
              required
            />
            <button type='submit'>send</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App