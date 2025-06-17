import { useNavigate } from 'react-router-dom'
import '../styles/Sidebar.css'
import useChatStore from '../store/chatStore'
import ChatList from './ChatList'
const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useChatStore();
  const token = localStorage.getItem('token');
  return (
    <div className='col-5 sidebar'>
        <div className='sidebar__header'>    
          <div className="sidebar__userInfo">
            <img className='sidebar__avatar avatar' src="src/assets/user-icon.svg" alt="user" />
            {token ? (
                <button className='sidebar__logout-button' 
                  onClick={()=>{logout(), navigate('/auth') }}>
                  Log out
                </button>
              ) : (
                <button className='sidebar__logout-button' 
                  onClick={()=> navigate('/auth')}>
                  Log in
                </button>
            )}

          </div>
          <div className="sidebar__search-container">
          <svg className='search-icon' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 11 10" fill="none">
            <path d="M10.6593 9.41162L8.09059 6.80593C8.75783 5.97811 9.0859 4.92181 9.00692 3.85551C8.92794 2.78921 8.44796 1.7945 7.66627 1.07712C6.88457 0.359736 5.86096 -0.0254241 4.80717 0.00130351C3.75338 0.0280311 2.75003 0.464602 2.00465 1.22071C1.25927 1.97683 0.828903 2.99463 0.802555 4.0636C0.776206 5.13257 1.1559 6.17092 1.86309 6.96388C2.57029 7.75683 3.55088 8.24372 4.60204 8.32384C5.6532 8.40395 6.6945 8.07117 7.51056 7.39431L10.0793 10L10.6593 9.41162ZM4.91643 7.50333C4.26739 7.50333 3.63292 7.30809 3.09326 6.94231C2.5536 6.57653 2.13298 6.05662 1.88461 5.44835C1.63623 4.84007 1.57124 4.17074 1.69786 3.525C1.82448 2.87926 2.13703 2.28611 2.59597 1.82055C3.05492 1.355 3.63965 1.03795 4.27622 0.909506C4.91279 0.78106 5.57262 0.846983 6.17226 1.09894C6.7719 1.3509 7.28442 1.77757 7.64501 2.325C8.0056 2.87244 8.19806 3.51604 8.19806 4.17444C8.19708 5.05701 7.85103 5.90315 7.23582 6.52722C6.6206 7.1513 5.78648 7.50234 4.91643 7.50333Z" fill="#a3a3a3"/>
          </svg>
            <input className="sidebar__search-bar" type="text" 
            placeholder='Search or start new chat'/>
          </div>
        </div>
      <ChatList />
    </div>
  )
}

export default Sidebar