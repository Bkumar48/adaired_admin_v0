import React from "react";
import Cards from "../../components/card/Cards";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import InputBox from "../../components/FormInputEntryPoint/InputBox";

axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  "Content-Type": "multipart/form-data",
};

const AddJob = () => {
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (formData) => {
      console.log(formData);
      return axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/career/createJob`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },

    onSuccess: () => {
      reset();
    },
  });

  return (
    <div>
      <Cards header="Add New Job">
        <div className="add__job-form card-inner">
          <form action="" onSubmit={handleSubmit(mutation.mutate)}>
            <InputBox
              htmlFor="jobName"
              label="Job Name"
              name="jobName"
              control={control}
              placeholder="Enter Job Name"
              setValue={setValue}
              inputComponent="forminput"
              type="text"
              id="jobName"
              errors={errors}
              rules={{ required: "Job Name is required" }}
              className="full-width-input"
              defaultValue=""
            />

            <InputBox
              htmlFor="jobDescription"
              label="Job Description"
              name="jobDescription"
              control={control}
              placeholder="Enter Job Description"
              setValue={setValue}
              inputComponent="forminput"
              type="textarea"
              id="jobDescription"
              errors={errors}
              className="full-width-input"
              defaultValue=""
            />

            <InputBox
              htmlFor="experienceRequired"
              label="Experience Required"
              name="experienceRequired"
              control={control}
              placeholder="Enter Experience Required"
              setValue={setValue}
              inputComponent="forminput"
              type="text"
              id="experienceRequired"
              errors={errors}
              className="full-width-input"
              defaultValue=""
            />

            <InputBox
              htmlFor="openings"
              label="Openings"
              name="openings"
              control={control}
              placeholder="Enter Openings"
              setValue={setValue}
              inputComponent="forminput"
              type="number"
              id="openings"
              min="0"
              errors={errors}
              className="full-width-input"
              defaultValue=""
            />

            <InputBox
              htmlFor="description"
              label="Description"
              name="description"
              control={control}
              placeholder="Enter Description"
              setValue={setValue}
              inputComponent="richtext"
              id="description"
              errors={errors}
              className="full-width-input"
              defaultValue=""
            />
            <div className="form-btn-box">
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Cards>
    </div>
  );
};

export default AddJob;
