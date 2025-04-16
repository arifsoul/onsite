import GoogleLogin from '../components/Auth/GoogleLogin';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <h1>Login ke Onsite</h1>
      <GoogleLogin />
    </div>
  );
};

export default Login;