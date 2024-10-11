import react, {useState} from 'react'

const Login = () => {

    const [state,setState] = useState('Sign Up')

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [name,setName] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()
    }



  return (
    <form className=''>
        <div className=''>
            <p className=''>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
            <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>
            {
              state === "Sign Up" && <div className=''>
                <p>Full Name</p>
                <input className="" type='text' onChange={(e) => setName(e.target.value)} value={name}  />
              </div>
            }
  
            <div className=''>
                <p>Email</p>
                <input className='' type='email' onChange={(e) => setEmail(e.target.value)} value={email}  />
            </div>
            <div className=''>
                <p>Password</p>
                <input className='' type='password' onChange={(e) => setPassword(e.target.value)} value={password}  />
            </div>
            <button className=''>{state === 'Sign Up' ? "Create Account" : "Login"}</button>
            {
                state === 'Sign Up'
                ? <p>Already have an account? <span onClick={('Login')}className="text-primary underline cursor-pointer">Login here</span></p>
                : <p>Create an new account? <span onClick={('Sign Up')} className="text-primary underline cursor-pointer">click here</span></p>
            }
        </div>

    </form>
  )
}

export default Login