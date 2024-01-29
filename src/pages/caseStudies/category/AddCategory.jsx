import React from "react";
import { useMutation } from "@tanstack/react-query";
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
      console.log(data);
      return axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/case-studies-category/createCaseStudiesCategory`,
        data
      );
    },
    onSuccess: () => {
      // Reset the form after successful submission
      reset();
    },
  });

  return (
    <div className="case-study_category">
      <Cards header="Add Case Study Category">
        <div className="case-study_category-form card-inner">
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
            <InputBox
              htmlFor="technologies"
              label="Technologies"
              name="technologies"
              control={control}
              placeholder="Technology Name"
              inputComponent="pointersWithIcons"
              setValue={setValue}
              id="technologies"
              error={errors.technologies}
              defaultValue=""
              // rules={{
              //   required: "Technologies is required",
              // }}
              addButtonText="Add Technology"
              className="full-width-input"
            />
            {errors.technologies && (
              <span className="error">{errors.technologies.message}</span>
            )}
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
});

AddCategory.displayName = "AddCategory";

export default AddCategory;
