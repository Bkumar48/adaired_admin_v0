import axios from "axios";
import { lazy, useCallback, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../utils/QueryClient/queryClient.js";
import { useForm } from "react-hook-form";
const FormInput = lazy(() =>
  import("../../components/FormFields/FormInput/FormInput.jsx")
);

const InputBox = lazy(() =>
  import("../../components/FormFields/FormInputEntryPoint/InputBox.jsx")
);

const LoginSignup = (props) => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const navigate = useNavigate();

  const handleToggle = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  //   *** *** *** Signin Mutation *** *** ***
  const signin = useMutation(
    (userData) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, userData),
    {
      onSuccess: (data) => {
        const token = data.data.token;
        props.setIsUserLoggedIn(true);
        sessionStorage.setItem("token", token);
        navigate("/");
      },
      onError: (error) => {
        console.log("Signin Error:", error.response.data.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries("userData");
      },
    }
  );

  const handleSignIn = useCallback(
    async (data) => {
      console.log(data);
      reset();
    },
    [reset]
  );

  //   *** *** *** Signup Mutation *** *** ***

  const signup = useMutation(
    (userData) =>
      axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
        userData
      ),
    {
      onSuccess: () => {
        setIsSignUpMode(false);
      },
      onError: (error) => {
        console.log("Signin Error:", error.response.data.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries("userData");
      },
    }
  );

  // const handleSignUp = (e) => {
  //   e.preventDefault();
  //   try {
  //     // Show loading state
  //     const firstName =
  //       user.name.split(" ").length > 1 ? user.name.split(" ")[0] : user.name;
  //     const lastName =
  //       user.name.split(" ").length > 1 ? user.name.split(" ")[1] : "";
  //     signup.mutate({
  //       firstName,
  //       lastName,
  //       email: user.email,
  //       contact: user.contact,
  //       password: user.password,
  //     });
  //     console.log({
  //       firstName,
  //       lastName,
  //       email: user.email,
  //       contact: user.contact,
  //       password: user.password,
  //     });
  //   } catch (error) {
  //     // Handle API error
  //     console.error("Sign Up Error:", error);
  //   }
  // };

  const handleSignUp = useCallback(
    async (data) => {
      const firstName =
        data.name.split(" ").length > 1 ? data.name.split(" ")[0] : data.name;
      const lastName =
        data.name.split(" ").length > 1 ? data.name.split(" ")[1] : "";
      signup.mutate({
        firstName,
        lastName,
        email: data.email,
        contact: data.contact,
        password: data.password,
      });
      console.log({
        firstName,
        lastName,
        email: data.email,
        contact: data.contact,
        password: data.password,
      });
      reset();
    },
    [reset, signup]
  );

  return (
    <>
      <div
        className={`login__signup-wrapper ${
          isSignUpMode ? "sign-up-mode" : ""
        }`}
      >
        <div className={`login__signup-container`}>
          <div className={`login__signup-innerbox `}>
            <div className="login__signup-forms-wrap">
              {/*** *** *** *** *** *** *** / SIGN IN FORM / *** *** *** *** *** *** ***/}
              <form
                action=""
                className="sign-in-form"
                onSubmit={handleSubmit(handleSignIn)}
              >
                <div className="login__form-logo">
                  <img src={`/assets/images/logo.png`} alt="Logo" />
                </div>
                <div className="heading">
                  <h2>Welcome back</h2>
                  <h6>Stay signed in and get special benefits.</h6>
                </div>
                <div className="actual-form">
                  <div className="input-wrap">
                    <InputBox
                      name="email"
                      control={control}
                      placeholder="Email"
                      type="email"
                      setValue={setValue}
                      inputComponent="forminput"
                      id="email"
                      errors={errors}
                      defaultValue=""
                      className="full-width-input"
                    />
                  </div>

                  <div className="input-wrap">
                    <InputBox
                      name="password"
                      control={control}
                      placeholder="Password"
                      type="password"
                      setValue={setValue}
                      inputComponent="forminput"
                      id="password"
                      errors={errors}
                      defaultValue=""
                      className="full-width-input"
                    />
                  </div>
                  <div className="forgot_password">
                    <p>Forgot Password?</p>
                  </div>
                  <div className="input-wrap">
                    <button
                      className="login__signup-btn defbtn"
                      type="submit"
                      disabled={signin.isLoading}
                    >
                      {signin.isLoading ? "Signing In..." : "Sign In"}
                    </button>
                  </div>
                </div>

                <div className="login__signup-break">
                  <p>or</p>
                </div>
                <button className="signin__w__google api-signin" type="button">
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
                </button>
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
                <div className="switch_form">
                  <p>
                    Don't have an account?{" "}
                    <span onClick={handleToggle}>Sign Up</span>
                  </p>
                </div>
              </form>

              {/*** *** *** *** *** *** *** / SIGN UP FORM / *** *** *** *** *** *** ***/}
              <form
                action=""
                className="sign-up-form"
                onSubmit={handleSubmit(handleSignUp)}
              >
                <div className="login__signup-form-logo">
                  <img src={`/assets/images/logo.png`} alt="Logo" />
                </div>
                <div className="heading">
                  <h2>Join Us Today!</h2>
                  <h6>Get special benefits and stay up-to-date.</h6>
                </div>
                <div className="actual-form">
                  <div className="input-wrap">
                    <InputBox
                      name="name"
                      control={control}
                      placeholder="Full Name"
                      type="text"
                      setValue={setValue}
                      inputComponent="forminput"
                      id="name"
                      errors={errors}
                      defaultValue=""
                      className="full-width-input"
                    />
                  </div>
                  <div className="input-wrap">
                    <InputBox
                      name="email"
                      control={control}
                      placeholder="Email"
                      type="email"
                      setValue={setValue}
                      inputComponent="forminput"
                      id="signup_email"
                      errors={errors}
                      defaultValue=""
                      className="full-width-input"
                    />
                  </div>
                  <div className="input-wrap">
                    <InputBox
                      name="contact"
                      control={control}
                      placeholder="Contact Number"
                      type="tel"
                      setValue={setValue}
                      inputComponent="forminput"
                      id="contact"
                      errors={errors}
                      defaultValue=""
                      className="full-width-input"
                      onBlur={(e) => {
                        setValue("contact", e.target.value);
                      }}
                    />
                  </div>
                  <div className="input-wrap">
                    <InputBox
                      name="password"
                      control={control}
                      placeholder="Password"
                      type="password"
                      setValue={setValue}
                      inputComponent="forminput"
                      id="signup_password"
                      errors={errors}
                      defaultValue=""
                      className="full-width-input"
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
                    <path
                      d="M27.73 14.32C27.73 13.37 27.65 12.41 27.49 11.48H14.28V16.87H21.84C21.53 18.61 20.52 20.15 19.04 21.12V24.62H23.56C26.20 22.18 27.73 18.58 27.73 14.32Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M14.28 28C18.06 28 21.24 26.76 23.56 24.62L19.05 21.12C17.79 21.98 16.17 22.46 14.29 22.46C10.63 22.46 7.54 20 6.42 16.68H1.77V20.29C4.15 25.02 8.99 28 14.28 28Z"
                      fill="#34A853"
                    />
                    <path
                      d="M6.42 16.68C5.83 14.94 5.83 13.06 6.42 11.32V7.72H1.77C-0.22 11.67 -0.22 16.33 1.77 20.29L6.42 16.68Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M14.28 5.54C16.28 5.51 18.21 6.26 19.65 7.64L23.65 3.64C21.12 1.27 17.76 -0.04 14.28 0C8.99 0 4.15 2.98 1.77 7.72L6.42 11.32C7.53 8.01 10.63 5.54 14.28 5.54Z"
                      fill="#EA4335"
                    />
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
                <div className="switch_form">
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
