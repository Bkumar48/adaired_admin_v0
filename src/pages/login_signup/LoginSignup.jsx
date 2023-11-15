import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../utils/queryClient";

const LoginSignup = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleToggle = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const mutation = useMutation(
    (userData) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, userData),
    {
      onSuccess: (data) => {
        const token = data.token;
        sessionStorage.setItem("token", token);
        navigate("/dashboard");
      },
      onSettled: () => {
        queryClient.invalidateQueries('userData');
      }
    }
  );

  const handleSignIn = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <>
      <div
        className={`login__signup-wrapper ${
          isSignUpMode ? "sign-up-mode" : ""
        }`}
      >
        <div className={`login__signup-container`}>
          <div className="login__signup-innerbox">
            <div className="login__signup-forms-wrap">
              {/*** *** *** *** *** *** *** / SIGN IN FORM / *** *** *** *** *** *** ***/}
              <form action="" className="sign-in-form" onSubmit={handleSignIn}>
                <div className="login__signup-form-logo">
                  <img src={`/assets/images/logo.png`} alt="Logo" />
                </div>
                <div className="login__signup-form-heading">
                  <h2>Welcome back</h2>
                  <h6>Stay signed in and get special benefits.</h6>
                </div>
                <div className="actual-form">
                  <div className="input-wrap">
                    <input
                      type="email"
                      id="login_email"
                      required
                      autoComplete="off"
                      className="login__signup-input"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-wrap">
                    <input
                      type="password"
                      id="login_pass"
                      required
                      autoComplete="off"
                      className="login__signup-input"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="forgot_password">
                    <p>Forgot Password?</p>
                  </div>
                  <div className="input-wrap">
                    <button
                      className="login__signup-btn defbtn"
                      type="submit"
                      disabled={mutation.isLoading}
                    >
                      {mutation.isLoading ? "Signing In..." : "Sign In"}
                    </button>
                  </div>
                </div>
                <div className="login__signup-break">
                  <p>or</p>
                </div>
                <div className="signin__w__google api-signin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_56_51)">
                      <path
                        d="M27.7271 14.3225C27.7271 13.3708 27.6499 12.414 27.4853 11.4777H14.28V16.8689H21.8421C21.5283 18.6076 20.52 20.1457 19.0436 21.1231V24.6212H23.5551C26.2044 22.1828 27.7271 18.5819 27.7271 14.3225Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M14.28 28.0009C18.0559 28.0009 21.2402 26.7612 23.5602 24.6212L19.0487 21.1231C17.7935 21.9771 16.1731 22.4606 14.2852 22.4606C10.6328 22.4606 7.53596 19.9965 6.42481 16.6837H1.76929V20.2898C4.14592 25.0173 8.98663 28.0009 14.28 28.0009V28.0009Z"
                        fill="#34A853"
                      />
                      <path
                        d="M6.41966 16.6837C5.83322 14.9449 5.83322 13.0621 6.41966 11.3234V7.71729H1.76928C-0.216388 11.6732 -0.216388 16.3339 1.76928 20.2898L6.41966 16.6837V16.6837Z"
                        fill="#FBBC04"
                      />
                      <path
                        d="M14.28 5.54127C16.276 5.51041 18.2051 6.26146 19.6506 7.64012L23.6477 3.64305C21.1167 1.26642 17.7575 -0.0402103 14.28 0.000943444C8.98663 0.000943444 4.14592 2.98459 1.76929 7.71728L6.41966 11.3234C7.52567 8.00536 10.6276 5.54127 14.28 5.54127V5.54127Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_56_51">
                        <rect width="28" height="28" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Sign in with Google
                </div>
                <div className="signin__w__apple api-signin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="28"
                    viewBox="0 0 24 28"
                    fill="none"
                  >
                    <path
                      d="M19.6552 26.8766C18.1309 28.3542 16.4667 28.1209 14.8647 27.421C13.1693 26.7055 11.614 26.6744 9.82532 27.421C7.58561 28.3853 6.40354 28.1053 5.06593 26.8766C-2.52423 19.0532 -1.40437 7.1391 7.21232 6.7036C9.31206 6.81247 10.7741 7.85456 12.0028 7.94789C13.8382 7.5746 15.5957 6.5014 17.5555 6.64138C19.9041 6.82803 21.6772 7.76124 22.8437 9.44103C17.991 12.3496 19.1419 18.7421 23.5903 20.5307C22.7037 22.8638 21.5527 25.1813 19.6396 26.8922L19.6552 26.8766ZM11.8473 6.61028C11.614 3.14183 14.4292 0.279965 17.6643 0C18.1154 4.01283 14.0248 6.99912 11.8473 6.61028Z"
                      fill="black"
                    />
                  </svg>
                  Sign in with Apple
                </div>
                <div className="switch_to_signup">
                  <p>
                    Don't have an account?{" "}
                    <span onClick={handleToggle}>Sign Up</span>
                  </p>
                </div>
              </form>

              {/*** *** *** *** *** *** *** / SIGN UP FORM / *** *** *** *** *** *** ***/}
              <form action="" className="sign-up-form">
                <div className="login__signup-form-logo">
                  <img src={`/assets/images/logo.png`} alt="Logo" />
                </div>
                <div className="signup-form-heading">
                  <h2>Join Us Today!</h2>
                  <h6>Get special benefits and stay up-to-date.</h6>
                </div>
                <div className="actual-signup-form">
                  <div className="signup-input">
                    <input
                      type="text"
                      id="signup_name"
                      required
                      autoComplete="off"
                      className="login__signup-input"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="signup-input">
                    <input
                      type="email"
                      id="signup_email"
                      required
                      autoComplete="off"
                      className="login__signup-input"
                      placeholder="Email"
                    />
                  </div>
                  <div className="signup-input">
                    <input
                      type="text"
                      id="signup_phone"
                      required
                      autoComplete="off"
                      className="login__signup-input"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className=" signup-input">
                    <input
                      type="password"
                      id="signup_pass"
                      required
                      autoComplete="off"
                      className="login__signup-input"
                      placeholder="Password"
                    />
                  </div>
                  <div className="input-wrap">
                    <button className="login__signup-btn defbtn" type="submit">
                      Sign up
                    </button>
                  </div>
                </div>
                <div className="login__signup-break">
                  <p>or</p>
                </div>
                <div className="signin__w__google api-signin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_56_51)">
                      <path
                        d="M27.7271 14.3225C27.7271 13.3708 27.6499 12.414 27.4853 11.4777H14.28V16.8689H21.8421C21.5283 18.6076 20.52 20.1457 19.0436 21.1231V24.6212H23.5551C26.2044 22.1828 27.7271 18.5819 27.7271 14.3225Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M14.28 28.0009C18.0559 28.0009 21.2402 26.7612 23.5602 24.6212L19.0487 21.1231C17.7935 21.9771 16.1731 22.4606 14.2852 22.4606C10.6328 22.4606 7.53596 19.9965 6.42481 16.6837H1.76929V20.2898C4.14592 25.0173 8.98663 28.0009 14.28 28.0009V28.0009Z"
                        fill="#34A853"
                      />
                      <path
                        d="M6.41966 16.6837C5.83322 14.9449 5.83322 13.0621 6.41966 11.3234V7.71729H1.76928C-0.216388 11.6732 -0.216388 16.3339 1.76928 20.2898L6.41966 16.6837V16.6837Z"
                        fill="#FBBC04"
                      />
                      <path
                        d="M14.28 5.54127C16.276 5.51041 18.2051 6.26146 19.6506 7.64012L23.6477 3.64305C21.1167 1.26642 17.7575 -0.0402103 14.28 0.000943444C8.98663 0.000943444 4.14592 2.98459 1.76929 7.71728L6.41966 11.3234C7.52567 8.00536 10.6276 5.54127 14.28 5.54127V5.54127Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_56_51">
                        <rect width="28" height="28" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Sign up with Google
                </div>
                <div className="signin__w__apple api-signin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="28"
                    viewBox="0 0 24 28"
                    fill="none"
                  >
                    <path
                      d="M19.6552 26.8766C18.1309 28.3542 16.4667 28.1209 14.8647 27.421C13.1693 26.7055 11.614 26.6744 9.82532 27.421C7.58561 28.3853 6.40354 28.1053 5.06593 26.8766C-2.52423 19.0532 -1.40437 7.1391 7.21232 6.7036C9.31206 6.81247 10.7741 7.85456 12.0028 7.94789C13.8382 7.5746 15.5957 6.5014 17.5555 6.64138C19.9041 6.82803 21.6772 7.76124 22.8437 9.44103C17.991 12.3496 19.1419 18.7421 23.5903 20.5307C22.7037 22.8638 21.5527 25.1813 19.6396 26.8922L19.6552 26.8766ZM11.8473 6.61028C11.614 3.14183 14.4292 0.279965 17.6643 0C18.1154 4.01283 14.0248 6.99912 11.8473 6.61028Z"
                      fill="black"
                    />
                  </svg>
                  Sign up with Apple
                </div>
                <div className="switch_to_signup">
                  <p>
                    Already have an account?{" "}
                    <span onClick={handleToggle}>Sign In</span>
                  </p>
                </div>
              </form>
            </div>
            <div
              className="login__signup-carousel"
              style={{
                background: `url(/assets/images/login-signup-bg.png) no-repeat center center / cover`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
