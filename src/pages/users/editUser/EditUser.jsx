import { lazy, Suspense, useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { queryClient } from "../../../utils/QueryClient/queryClient";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import InputBox from "../../../components/FormInputEntryPoint/InputBox";
import Cards from "./../../../components/card/Cards";

const Loader = lazy(() => import("../../../components/loader/Loader"));

const EditUser = ({ userId }) => {
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const fetchUser = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/user/${userId}`
    );
    return response.data;
  };

  const { data: user, isLoading } = useQuery(["user", userId], fetchUser);

  useEffect(() => {
    // Populate form fields with user data when user data is available
    if (user) {
      setValue("name", `${user.firstName} ${user.lastName}`);
      setValue("email", user.email);
      setValue("contact", user.contact);
      setValue("role", user.roleType);
      setValue("status", user.status ? "active" : "inactive");
    }
  }, [user, setValue]);

  const editUser = useMutation(
    (userData) =>
      axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${userId}`,
        userData
      ),
    {
      onSuccess: () => {
        // Reset the form to its default values after successful edit
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
        console.log("Edit User Error:", error.response.data.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries("userData");
      },
    }
  );

  const onSubmit = (data) => {
    try {
      const [firstName, lastName] = data.name.split(" ");
      const userData = {
        firstName,
        lastName,
        email: data.email,
        contact: data.contact,
        roleType: data.role,
        status: data.status === "active" ? true : false,
      };
      editUser.mutate(userData);
    } catch (error) {
      console.error("Edit User Error:", error.response.data.message);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="col-6">
        <Cards header="Edit User">
          <div className="edit__user-form form">
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
              {/* Additional input fields for password, contact, role, and status */}
              {/* ... */}
              <div className="form__button">
                <button type="button" className="btn btn__cancel">
                  Cancel
                </button>
                <button className="btn btn__submit" type="submit">
                  Edit User
                </button>
              </div>
            </form>
          </div>
        </Cards>
      </div>
    </>
  );
};

export default EditUser;
