import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import Cards from "../../../components/card/Cards";
import InputBox from "./../../../components/FormInputEntryPoint/InputBox";
import { useState } from "react";

axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  "Content-Type": "multipart/form-data",
};

const AddCaseStudy = () => {
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const fetchCategories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/case-studies-category/getCaseStudiesCategory/all`
      );
      const data = await response.data.result;
      return data;
    },
  });

  const CategoryData = fetchCategories.data || [];

  const mutation = useMutation({
    mutationFn: (data) => {
      console.log(data);
      return axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/case-studies/createCaseStudy`,
        data
      );
    },
    onSuccess: () => {
      // Reset the form after successful submission
      reset();
    },
  });

  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchCategoryData = (slug) => {
    return axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/case-studies-category/getCaseStudiesCategory/${slug}`
    );
  };

  const {
    data: categoryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categorData"],
    queryFn: fetchCategoryData,
    enabled: false,
  });

  const handleCategoryChange = async (selectedCategory) => {
    setValue("category", selectedCategory);
    try {
      const data =
        categoryData?.result ||
        (await fetchCategoryData(selectedCategory)).data.result;
      setSelectedCategory(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return console.log("Loading...");
  }
  if (error) {
    return console.log("Error");
  }

  return (
    <div className="case-study">
      <Cards header="Add Case Study">
        <div className="card-inner">
          <form
            action=""
            onSubmit={handleSubmit(mutation.mutate)}
            encType="multipart/form-data"
          >
            <InputBox
              htmlFor="category"
              label="Category"
              name="category"
              control={control}
              placeholder="Select Category"
              setValue={setValue}
              inputComponent="forminput"
              type="select"
              id="category"
              errors={errors}
              defaultValue=""
              options={CategoryData.map((service) => ({
                value: service.slug,
                label: service.categoryName,
              }))}
              className="full-width-input"
              closeMenuOnSelect="true"
              onChange={(e) => {
                handleCategoryChange(e.value);
              }}
            />

            <InputBox
              htmlFor="colorScheme"
              label="Color Scheme"
              name="colorScheme"
              control={control}
              placeholder="Select Color Scheme"
              setValue={setValue}
              inputComponent="forminput"
              type="color"
              id="colorScheme"
              errors={errors}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="cardImage"
              label="Card Image"
              name="cardImage"
              control={control}
              placeholder="Select Card Image"
              setValue={setValue}
              inputComponent="imageUploader"
              id="cardImage"
              errors={errors}
              defaultValue=""
              className="full-width-input"
            />

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
              className="full-width-input"
            />

            <InputBox
              htmlFor="subHeading"
              label="Sub Heading"
              name="subHeading"
              control={control}
              placeholder="Enter Sub Heading"
              type="text"
              setValue={setValue}
              inputComponent={"forminput"}
              id="subHeading"
              error={errors.subHeading}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="caseStudyName"
              label="Case Study Name"
              name="caseStudyName"
              control={control}
              placeholder="Enter Case Study Name"
              type="text"
              setValue={setValue}
              inputComponent={"forminput"}
              id="caseStudyName"
              error={errors.caseStudyName}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="caseStudyDescription"
              label="Case Study Description"
              name="caseStudyDescription"
              control={control}
              placeholder="Enter Case Study Description"
              type="textarea"
              setValue={setValue}
              inputComponent={"forminput"}
              id="caseStudyDescription"
              error={errors.caseStudyDescription}
              defaultValue=""
              className="full-width-input"
              rows={15}
            />

            <InputBox
              htmlFor="caseStudyImage"
              label="Case Study Image"
              name="caseStudyImage"
              control={control}
              placeholder="Select Case Study Image"
              setValue={setValue}
              inputComponent="imageUploader"
              id="caseStudyImage"
              errors={errors}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="aboutProjectDescription"
              label="About Project Description"
              name="aboutProjectDescription"
              control={control}
              placeholder="Enter About Project Description"
              type="textarea"
              setValue={setValue}
              inputComponent={"forminput"}
              id="aboutProjectDescription"
              error={errors.aboutProjectDescription}
              defaultValue=""
              className="full-width-input"
              rows={15}
            />

            <div className="two-columns">
              <InputBox
                htmlFor="challengesDescription"
                label="Challenges Description"
                name="challengesDescription"
                control={control}
                placeholder="Enter Challenges Description"
                type="textarea"
                setValue={setValue}
                inputComponent={"forminput"}
                id="challengesDescription"
                error={errors.challengesDescription}
                defaultValue=""
                className="full-width-input"
                rows={15}
              />
              <InputBox
                htmlFor="challengesImage"
                label="Challenges Image"
                name="challengesImage"
                control={control}
                placeholder="Select Challenges Image"
                setValue={setValue}
                inputComponent="imageUploader"
                id="challengesImage"
                errors={errors}
              />
            </div>

            <div className="two-columns">
              <InputBox
                htmlFor="solutionsImage"
                label="Solutions Image"
                name="solutionsImage"
                control={control}
                placeholder="Select Solutions Image"
                setValue={setValue}
                inputComponent="imageUploader"
                id="solutionsImage"
                errors={errors}
              />
              <InputBox
                htmlFor="solutionsDescription"
                label="Solutions Description"
                name="solutionsDescription"
                control={control}
                placeholder="Enter Solutions Description"
                type="textarea"
                setValue={setValue}
                inputComponent={"forminput"}
                id="solutionsDescription"
                error={errors.solutionsDescription}
                defaultValue=""
                className="full-width-input"
                rows={15}
              />
            </div>

            <InputBox
              htmlFor="challengesAndSolutions"
              label="Challenges And Solutions"
              name="challengesAndSolutions"
              control={control}
              inputComponent="accordion"
              setValue={setValue}
              id="challengesAndSolutions"
              defaultValue=""
              addButtonText="Add New Point"
              className="full-width-input"
              placeholder={"Challenge"}
            />

            <InputBox
              htmlFor="technologiesUsedTitle"
              label="Technologies Used Title"
              name="technologiesUsedTitle"
              control={control}
              placeholder="Enter Technologies Used Title"
              type="text"
              setValue={setValue}
              inputComponent={"forminput"}
              id="technologiesUsedTitle"
              error={errors.technologiesUsedTitle}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="technologiesUsedDescription"
              label="Technologies Used Description"
              name="technologiesUsedDescription"
              control={control}
              placeholder="Enter Technologies Used Description"
              type="textarea"
              setValue={setValue}
              inputComponent={"forminput"}
              id="technologiesUsedDescription"
              error={errors.technologiesUsedDescription}
              defaultValue=""
              className="full-width-input"
              rows={15}
            />

            <InputBox
              htmlFor="technologiesUsed"
              label="Technologies Used"
              name="technologiesUsed"
              control={control}
              placeholder="Technology Name"
              inputComponent="forminput"
              type="select"
              setValue={setValue}
              id="technologiesUsed"
              error={errors.technologiesUsed}
              defaultValue={[]} // Set default value to an empty array
              multiple={true}
              className="full-width-input"
              closeMenuOnSelect="false"
              options={selectedCategory?.technologies?.map((service) => ({
                value: service._id,
                label: service.title,
              }))}
              onChange={(e) => {
                setValue(
                  "technologiesUsed",
                  e.map((item) => item.value)
                );
                console.log(e);
              }}
            />

            <InputBox
              htmlFor="goalsTitle"
              label="Goals Title"
              name="goalsTitle"
              control={control}
              placeholder="Enter Goals Title"
              type="text"
              setValue={setValue}
              inputComponent={"forminput"}
              id="goalsTitle"
              error={errors.goalsTitle}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="goalsDescription"
              label="Goals Description"
              name="goalsDescription"
              control={control}
              placeholder="Enter Goals Description"
              type="textarea"
              setValue={setValue}
              inputComponent={"forminput"}
              id="goalsDescription"
              error={errors.goalsDescription}
              defaultValue=""
              className="full-width-input"
              rows={15}
            />

            <div className="two-columns">
              <InputBox
                htmlFor="objectives"
                label="Objectives"
                name="objectives"
                control={control}
                inputComponent="accordion"
                setValue={setValue}
                id="objectives"
                addButtonText="Add New Point"
                className="full-width-input"
                placeholder={"Objective"}
              />
              <InputBox
                htmlFor="stratergy"
                label="Stratergy"
                name="stratergy"
                control={control}
                inputComponent="accordion"
                setValue={setValue}
                id="stratergy"
                addButtonText="Add New Point"
                className="full-width-input"
                placeholder={"Stratergy"}
              />
            </div>

            <InputBox
              htmlFor="goalImage"
              label="Goal Image"
              name="goalImage"
              control={control}
              placeholder="Select Goal Image"
              setValue={setValue}
              inputComponent="imageUploader"
              id="goalImage"
              errors={errors}
            />

            <InputBox
              htmlFor="growthBox"
              label="Growth Box"
              name="growthBox"
              control={control}
              setValue={setValue}
              inputComponent="accordionWithoutRichtext"
              id="growthBox"
              errors={errors}
            />

            <InputBox
              htmlFor="resultDescription"
              label="Result Description"
              name="resultDescription"
              control={control}
              placeholder="Enter Result Description"
              type="textarea"
              setValue={setValue}
              inputComponent={"forminput"}
              id="resultDescription"
              error={errors.resultDescription}
              defaultValue=""
              className="full-width-input"
              rows={15}
            />

            <InputBox
              htmlFor="resultBox"
              label="Result Box"
              name="resultBox"
              control={control}
              setValue={setValue}
              inputComponent="growthBox"
              id="resultBox"
              errors={errors}
            />

            <InputBox
              htmlFor="resultFinalDescription"
              label="Result Final Description"
              name="resultFinalDescription"
              control={control}
              placeholder="Enter Result Final Description"
              type="textarea"
              setValue={setValue}
              inputComponent={"forminput"}
              id="resultFinalDescription"
              error={errors.resultFinalDescription}
              defaultValue=""
              className="full-width-input"
              rows={15}
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

export default AddCaseStudy;
