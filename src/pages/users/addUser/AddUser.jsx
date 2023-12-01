import { lazy, Suspense, useState, useCallback } from "react";
import axios from "axios";
import { useMutation } from "react-query";
import { queryClient } from "../../../utils/QueryClient/queryClient";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import InputBox from "../../../components/FormInputEntryPoint/InputBox";
import Cards from "./../../../components/card/Cards";

const Loader = lazy(() => import("../../../components/loader/Loader"));

const AddUser = () => {
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const adduser = useMutation(
    (userData) =>
      axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
        userData
      ),
    {
      onSuccess: () => {
        reset({
          name: "",
          email: "",
          password: "",
          contact: "",
          role: "",
          status: "",
        });
      },
      onError: (error) => {
        console.log("Signin Error:", error.response.data.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries("userData");
      },
    }
  );

  const onSubmit = (data) => {
    try {
      const firstName =
        data.name.split(" ").length > 1 ? data.name.split(" ")[0] : data.name;
      const lastName =
        data.name.split(" ").length > 1 ? data.name.split(" ")[1] : "";
      const userData = {
        firstName,
        lastName,
        email: data.email,
        password: data.password,
        contact: data.contact,
        // role: data.role,
        status: data.status === "active" ? true : false,
      };
      adduser.mutate(userData);
    } catch (error) {
      console.error("Sign In Error:", error.response.data.message);
    }
  };

  return (
    <>
      <div className="col-6">
        <Cards header="Add New User">
          <div className="add__user-form form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputBox
                htmlFor="name"
                label="Full Name"
                name="name"
                control={control}
                placeholder="Enter Full Name"
                type="text"
                setValue={setValue}
                inputComponent={"forminput"}
                id="name"
                error={errors.name}
                defaultValue=""
                className="full-width-input"
              />
              <InputBox
                htmlFor="email"
                label="Email"
                name="email"
                control={control}
                placeholder="Enter Email"
                type="email"
                setValue={setValue}
                inputComponent={"forminput"}
                id="email"
                error={errors.email}
                defaultValue=""
                className="full-width-input"
              />
              <InputBox
                htmlFor="password"
                label="Password"
                name="password"
                control={control}
                placeholder="Enter Password"
                type="password"
                setValue={setValue}
                inputComponent={"forminput"}
                id="password"
                error={errors.password}
                defaultValue=""
                className="full-width-input"
              />
              <InputBox
                htmlFor="contact"
                label="Contact"
                name="contact"
                control={control}
                placeholder="Enter Phone"
                type="tel"
                setValue={setValue}
                inputComponent={"forminput"}
                id="contact"
                error={errors.phone}
                defaultValue=""
                className="full-width-input"
                onBlur={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9+]/g, "");
                  setValue("contact", e.target.value);
                }}
              />
              <InputBox
                htmlFor="role"
                label="Role"
                name="role"
                control={control}
                placeholder="Enter Role"
                type="select"
                setValue={setValue}
                inputComponent={"forminput"}
                id="role"
                error={errors.role}
                defaultValue=""
                className="full-width-input"
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "user", label: "User" },
                ]}
              />
              <InputBox
                htmlFor="status"
                label="Status"
                name="status"
                control={control}
                placeholder="Enter Status"
                type="select"
                setValue={setValue}
                inputComponent={"forminput"}
                id="status"
                error={errors.status}
                defaultValue=""
                className="full-width-input"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
              <div className="form__button">
                <button type="button" className="btn btn__cancel">
                  Cancel
                </button>
                <button className="btn btn__submit" type="submit">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </Cards>
      </div>
    </>
  );
};

export default AddUser;
