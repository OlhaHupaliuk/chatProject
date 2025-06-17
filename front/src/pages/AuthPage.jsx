import '../styles/AuthPage.css'
import axios from 'axios';
import { useForm } from "react-hook-form"
import useChatStore from '../store/chatStore'
import { useNavigate } from 'react-router-dom';
const AuthPage = () => {
  const { register, handleSubmit, watch, formState: { errors }} = useForm();
  const { login } = useChatStore();
  const navigate = useNavigate();
   const onSubmit = async (data) => {
    try {
      const result = await axios.post('http://localhost:5000/auth', data)
      console.log(result);
      if(result.status === 200 || result.status === 201){
        login(result.data.token)
        navigate('/chat')
      }
    }catch(error){
      console.log(error); 
    }
   }
   const handleOAuth = async () => {
      window.location.href = 'http://localhost:5000/auth/google';
   }
  return (
    <div className='authPage'>
        <form className='authPage__form col-lg-3 col-md-5 col-sm-8' action=""
        onSubmit={handleSubmit(onSubmit)}>
            <button onClick={handleOAuth} className='col-12 outh__btn fs-5'>
              <img height={38} src="src/assets/google-icon.svg"
              alt="" />Sign in with Google</button>
            <span>OR</span>
            <input className='authPage__input fs-5' 
              {...register("email")}
              type="email" placeholder='Enter your email'/>
              {errors.email ? <p className='errors'>{errors.email}</p> : ('')}
            <input className='authPage__input fs-5' 
              {...register("password")}
              type="password" placeholder='Enter your password'/>
            <button type='submit' className='authPage__submitBtn col-12 fs-5'>Authorizate</button>
        </form>
    </div>
  )
}

export default AuthPage