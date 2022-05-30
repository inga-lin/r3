import { createContext, useState, useContext, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
  BrowserRouter
} from "react-router-dom";
import { login, logout, authConfig } from './Functions/auth';
import axios from 'axios';

function App() {

  useEffect(() => {
    axios.get('http://localhost:3005/')
      .then(res => {
        console.log(res);
      })
  }, []);

  return (
    <BrowserRouter>
      <>
        <h1>Auth Example</h1>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<PublicPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminPage />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </>
    </BrowserRouter>
  );
}
export default App;

function Layout() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/admin">Admin Page</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}



function RequireAuth({ children }) {
  const [view, setView] = useState(<h2>Please wait...</h2>);

  useEffect(() => {
    axios.get('http://localhost:3005/login-check', authConfig())
      .then(res => {
        if ('ok' === res.data.msg) {
          setView(children);
        } else {
          setView(<Navigate to="/login" replace />);
        }
      })

  }, [children]);

  return view;
}

function LoginPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const doLogin = () => {
    axios.post('http://localhost:3005/login', { user, pass })
      .then(res => {
        console.log(res.data);
        if ('ok' === res.data.msg) {
          login(res.data.key);
          navigate('/admin/', { replace: true });
        }
      })
  }
  return (
    <div>
      <div>name: <input type="text" value={user} onChange={e => setUser(e.target.value)}></input></div>
      <div>password: <input type="password" value={pass} onChange={e => setPass(e.target.value)}></input></div>
      <button onClick={doLogin}>Login</button>
    </div>
  );
}

function LogoutPage() {
  useEffect(() => logout(), []);
  return (
    <Navigate to="/login" replace />
  )
}


function PublicPage() {
  useEffect(() => {
    axios.get('http://localhost:3005/admin/hello', authConfig())
      .then(res => {
        console.log(res)
      })

  }, []);
  return <h3>Public</h3>;
}

function AdminPage() {
  return (
    <>
      <h3>Admin</h3>
      <Link to="/logout">Logout</Link>
    </>
  );
}
