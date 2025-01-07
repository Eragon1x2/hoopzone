import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    fetch('http://localhost:4000/api/v1/posts').then(res => res.json()).then(data => setPosts(data)).catch(err => console.log(err));
  },[])
  return (
    <>
     
    </>
  )
}

export default App
