// Import necessary modules and components

import React, { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import Cards from "../../../components/card/Cards";
import InputBox from "./../../../components/FormInputEntryPoint/InputBox";

axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  "Content-Type": "multipart/form-data",
};

const AddCategory = React.memo(() => {
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => {
        console.log(data)
      return axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/case-studies-category/createCaseStudiesCategory`,
        data
      );
        // return console.log(data);
    },
  });

  return (
    <div className="case-study_category">
      <Cards header="Add Case Study Category">
        <div className="case-study_category-form">
          <form
            action=""
            encType="multipart/form-data"
            onSubmit={handleSubmit(mutation.mutate)}
          >
            <InputBox
              htmlFor="categoryName"
              label="Category Name"
              name="categoryName"
              control={control}
              placeholder="Enter Category Name"
              type="text"
              setValue={setValue}
              inputComponent={"forminput"}
              id="categoryName"
              error={errors.categoryName}
              defaultValue=""
              rules={{
                required: "Category Name is required",
              }}
              className="full-width-input"
            />
            {errors.categoryName && (
              <span className="error">{errors.categoryName.message}</span>
            )}
            <InputBox
              htmlFor="slug"
              label="Slug"
              name="slug"
              control={control}
              placeholder="Enter Slug"
              type="text"
              setValue={setValue}
              inputComponent={"forminput"}
              id="slug"
              error={errors.slug}
              defaultValue=""
              rules={{
                required: "Slug is required",
              }}
              className="full-width-input"
            />
            {errors.slug && (
              <span className="error">{errors.slug.message}</span>
            )}

            <button type="submit">Submit</button>
          </form>
        </div>
      </Cards>
    </div>
  );
});

AddCategory.displayName = "AddCategory";

export default AddCategory;
