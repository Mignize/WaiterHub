import { useDispatch } from 'react-redux';
import { logout } from '@/redux/modules/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <button
      className="ml-4 p-2 rounded-full border border-zinc-600 hover:bg-zinc-800 transition flex items-center group"
      title="Logout"
      onClick={() => {
        dispatch(logout());
        navigate('/login');
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-zinc-400 group-hover:text-red-500 transition"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-6-3h12m0 0l-3-3m3 3l-3 3"
        />
      </svg>
      <span className="sr-only">Logout</span>
    </button>
  );
}
