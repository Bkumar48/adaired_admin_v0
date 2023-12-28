import { lazy, useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";
import { queryClient } from "../../../utils/QueryClient/queryClient";
import { useForm } from "react-hook-form";

import InputBox from "../../../components/FormInputEntryPoint/InputBox";
import Cards from "./../../../components/card/Cards";

// Set default headers for axios
axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  "Content-Type": "multipart/form-data",
};

const EditBlog = () => {
  const [loading, setLoading] = useState(false);
  const [blogCategories, setBlogCategories] = useState([]);
  const [error, setError] = useState(null);
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const fetchAllBlogsMutation = useMutation(
    () => {
      return axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/blogcategory/findCategory`
      );
    },
    {
      onSuccess: (data) => {
        setBlogCategories(data.data.data);
      },
      onError: (err) => setError(err),
    }
  );

  useEffect(fetchAllBlogsMutation.mutate, []);

  const editBlogMutation = useMutation(
    (data) =>
      axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/blog/updateBlog?id=${
          data.id
        }`,
        data
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("blogs");
        reset();
        setLoading(false);
      },
      onError: (err) => {
        setError(err);
        setLoading(false);
      },
    }
  );

  const onSubmit = (data) => {
    setLoading(true);
    editBlogMutation.mutate(data);
  };

  return (
    <>
      <Cards header="Add New Blog">
        <div className="add__blog-form form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputBox
              htmlFor="title"
              label="Title"
              name="title"
              control={control}
              placeholder="Enter Title"
              type="text"
              setValue={setValue}
              inputComponent={"forminput"}
              id="title"
              error={errors.title}
              defaultValue=""
              className="full-width-input"
            />
            <InputBox
              htmlFor="description"
              label="Description"
              name="description"
              control={control}
              placeholder="Enter Description"
              setValue={setValue}
              inputComponent={"richtext"}
              id="description"
              error={errors.description}
              defaultValue=""
              config={{
                readonly: false,
                height: 300,
              }}
              className="full-width-input"
            />
            <InputBox
              htmlFor="image"
              label="Image"
              name="image"
              control={control}
              placeholder="Upload Main Image"
              setValue={setValue}
              inputComponent="imageUploader"
              id="image"
              error={errors.mainImage}
              defaultValue=""
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
              htmlFor="category"
              label="Category"
              name="category"
              control={control}
              placeholder="Select Category"
              type="select"
              setValue={setValue}
              inputComponent={"forminput"}
              id="category"
              error={errors.category}
              defaultValue=""
              options={
                blogCategories &&
                blogCategories.map((item) => ({
                  value: item._id,
                  label: item.categoryName,
                }))
              }
              className="full-width-input"
            />
            <div className="form-btn-box">
              <button className="btn ">Cancel</button>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Adding Blog..." : "Add Blog"}
              </button>
            </div>
          </form>
        </div>
      </Cards>
    </>
  );
};

export default EditBlog;
