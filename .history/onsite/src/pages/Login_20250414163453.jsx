import GoogleLogin from '../components/Auth/GoogleLogin';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <h1>Login ke Onsite</h1>
      <p>Login untuk mengakses editor dan fitur lanjutan.</p>
      <GoogleLogin />
    </div>
  );
};

export default Login;