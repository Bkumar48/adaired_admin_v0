import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { queryClient } from "../../utils/QueryClient/queryClient.js";

const IMAGE_PATH = "/assets/images/logo.png";
const BG_IMAGE_PATH = "/assets/images/login-signup-bg.png";

const InputBox = React.lazy(() =>
  import("../../components/FormInputEntryPoint/InputBox.jsx")
);

const AuthForm = ({
  onSubmit,
  control,
  setValue,
  errors,
  onToggle,
  formType,
}) => {
  return (
    <form className={`auth-form ${formType}`} onSubmit={onSubmit}>
      <div className="login__form-logo">
        <img src={IMAGE_PATH} alt="Logo" />
      </div>
      <div className="heading">
        {formType === "sign-in" ? (
          <>
            <h2>Welcome back</h2>
            <h6>Stay signed in and get special benefits.</h6>
          </>
        ) : (
          <>
            <h2>Join Us Today!</h2>
            <h6>Get special benefits and stay up-to-date.</h6>
          </>
        )}
      </div>
      <div className="actual-form">
        <div className="input-wrap">
          <InputBox
            name={formType === "sign-in" ? "email" : "name"}
            control={control}
            placeholder={formType === "sign-in" ? "Email" : "Full Name"}
            type={formType === "sign-in" ? "email" : "text"}
            setValue={setValue}
            inputComponent="forminput"
            id={formType === "sign-in" ? "email" : "name"}
            errors={errors}
            defaultValue=""
            className="full-width-input"
          />
        </div>

        {formType === "sign-up" && (
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
        )}

        <div className="input-wrap">
          <InputBox
            name="password"
            control={control}
            placeholder="Password"
            type="password"
            setValue={setValue}
            inputComponent="forminput"
            id={formType === "sign-in" ? "password" : "signup_password"}
            errors={errors}
            defaultValue=""
            className="full-width-input"
          />
        </div>

        {formType === "sign-up" && (
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
        )}

        {formType === "sign-in" && (
          <div className="forgot_password">
            <p>Forgot Password?</p>
          </div>
        )}
      </div>
      <button className="login__signup-btn defbtn" type="submit">
        {formType === "sign-in" ? "Sign In" : "Sign Up"}
      </button>
      <div className="login__signup-break">
        <p>or</p>
      </div>
      <button className="signin__w__google api-signin" type="button">
        {/* Google SVG and text */}
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
      </button>
      <button type="button" className="signin__w__apple api-signin">
        {/* Apple SVG and text */}
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
      </button>
      <div className="switch_form">
        <p>
          {formType === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span onClick={onToggle}>
            {formType === "sign-in" ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </form>
  );
};

const LoginSignup = (props) => {
  const navigate = useNavigate();
  const { control, setValue, handleSubmit } = useForm();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [delayedFormType, setDelayedFormType] = useState(
    isSignUpMode ? "sign-up" : "sign-in"
  );

  // const signin = useMutation((userData) => {
  //   axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, userData),
  //     {
  //       onSuccess: (data) => {
  //         const token = data.data.token;
  //         props.setIsUserLoggedIn(true);
  //         console.log(data);
  //         sessionStorage.setItem("token", token);
  //         navigate("/");
  //       },
  //       onError: (error) => {
  //         console.log("Signin Error:", error.response.data.message);
  //       },
  //       onSettled: () => {
  //         queryClient.invalidateQueries("userData");
  //       },
  //     };
  // });

  const signin = useMutation((userData) =>
  axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, userData)
, {
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
});


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDelayedFormType(isSignUpMode ? "sign-up" : "sign-in");
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [isSignUpMode]);

  const signInHandleSubmit = useCallback(
    (data) => {
      // console.log("Sign In Data:", data);
      try {
        signin.mutate(data);
      } catch (error) {
        console.error("Sign In Error:", error.response.data.message);
      }
    },
    [signin]
  );

  const signUpHandleSubmit = useCallback((data) => {
    console.log("Sign Up Data:", data);
  }, []);

  const handleToggle = useCallback(() => {
    setIsSignUpMode((prevMode) => !prevMode);
  }, []);

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
              <AuthForm
                onSubmit={handleSubmit(
                  isSignUpMode ? signUpHandleSubmit : signInHandleSubmit
                )}
                control={control}
                setValue={setValue}
                onToggle={handleToggle}
                errors={{}}
                formType={delayedFormType}
              />
            </div>
            <div
              className="login__signup-carousel"
              style={{
                background: `url(${BG_IMAGE_PATH}) no-repeat center center / cover`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
