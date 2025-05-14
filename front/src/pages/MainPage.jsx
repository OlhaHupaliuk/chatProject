import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const MainPage = () => {
   const location = useLocation();

    useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Прибрати token з URL (опціонально)
      window.history.replaceState({}, '', '/chat');
    }
  }, [location]);
  return (
    <div className='d-flex'>
        <Sidebar />
        <ChatArea />
    </div>
  )
}

export default MainPage