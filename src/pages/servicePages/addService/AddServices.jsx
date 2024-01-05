import React, {
  useState,
  useCallback,
  Suspense,
  useMemo,
  lazy,
  useEffect,
} from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

// Lazy-loaded components
const Loader = lazy(() => import("../../../components/loader/Loader"));
const Cards = lazy(() => import("../../../components/card/Cards"));
const InputField = lazy(() =>
  import("../../../components/FormInputEntryPoint/InputField")
);

// Set default headers for axios
axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  "Content-Type": "multipart/form-data",
};

const InputBox = React.memo((props) => {
  return (
    <div className="input-box">
      <label htmlFor={props.htmlFor}>{props.label}</label>
      <Controller
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue}
        render={({ field }) => (
          <Suspense fallback={<Loader />}>
            <InputField {...props} field={field} />
          </Suspense>
        )}
      />
    </div>
  );
});

const AddServices = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [isChildService, setIsChildService] = useState(false);
  const [mainServices, setMainServices] = useState([]);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/admin/services/`,
          data
        );
        reset({
          isChildService: false,
          parentService: "",
          serviceTitle: "",
          serviceDescription: "",
          serviceImage: "",
          serviceDescriptionII: "",
          serviceHeadingII: "",
          serviceDescriptionIII: "",
          fourPoints: [],
          ourProcessSubHeading: "",
          ourProcessImageI: "",
          ourProcessImageII: "",
          combinedSection: "",
          serviceHeadingIII: "",
          serviceDescriptionIV: "",
          serviceNote: "",
          LastSectionText: "",
          LastSectionImage: "",
        });
      } catch (error) {
        setError(`Something went wrong: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [reset]
  );

  const handleChildChange = useCallback(
    async (e) => {
      // setIsChildService(e.target.checked);
      if (e.target.checked) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/v1/admin/services/?allParent=true`
          );
          setMainServices(response.data.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        setMainServices([]);
      }
    },
    [setMainServices]
  );

  return (
    <div className="add__service">
      <Cards header="Add New Service">
        <div className="add__service-form">
          {error && <div className="error-message">{error}</div>}
          <form
            action=""
            onSubmit={handleSubmit(handleFormSubmit)}
            encType="multipart/form-data"
          >
            <InputBox
              htmlFor="isChildService"
              label="Is Child Service"
              name="isChildService"
              control={control}
              placeholder="Is Child Service"
              inputComponent="forminput"
              setValue={setValue}
              type="checkbox"
              id="isChildService"
              errors={errors}
              defaultValue={false}
              onChange={handleChildChange}
            />

            {mainServices.length > 0 && (
              <InputBox
                htmlFor="parentService"
                label="Parent Service"
                name="parentService"
                control={control}
                placeholder="Parent Service"
                setValue={setValue}
                inputComponent="forminput"
                type="select"
                id="parentService"
                errors={errors}
                defaultValue=""
                options={mainServices.map((service) => ({
                  value: service._id,
                  label: service.serviceTitle,
                }))}
                className="full-width-input"
              />
            )}

            <InputBox
              htmlFor="serviceTitle"
              label="Service Title"
              name="serviceTitle"
              control={control}
              placeholder="Service Title"
              type="text"
              setValue={setValue}
              inputComponent="forminput"
              id="serviceTitle"
              errors={errors}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="serviceDescription"
              label="Service Description"
              name="serviceDescription"
              control={control}
              placeholder="Service Description"
              setValue={setValue}
              inputComponent="richtext"
              id="serviceDescription"
              errors={errors}
              defaultValue=""
              config={{
                readonly: false,
                height: 300,
              }}
            />

            <InputBox
              htmlFor="mainTwoPoints"
              label="Main Two Points"
              name="mainTwoPoints"
              control={control}
              setValue={setValue}
              inputComponent="accordion"
              id="mainTwoPoints"
              errors={errors}
              defaultValue={[]}
              onChange={(value) => setValue("mainTwoPoints", value)}
            />

            <InputBox
              htmlFor="serviceImage"
              label="Service Image"
              name="serviceImage"
              control={control}
              placeholder="Service Image"
              setValue={setValue}
              inputComponent="imageUploader"
              id="serviceImage"
              errors={errors}
              defaultValue=""
            />

            <InputBox
              htmlFor="serviceDescriptionII"
              label="Service Description II"
              name="serviceDescriptionII"
              control={control}
              placeholder="Service Description II"
              setValue={setValue}
              inputComponent="richtext"
              id="serviceDescriptionII"
              errors={errors}
              defaultValue=""
              config={{
                readonly: false,
                height: 300,
              }}
            />

            <InputBox
              htmlFor="serviceHeadingII"
              label="Service Heading II"
              name="serviceHeadingII"
              control={control}
              placeholder="Service Heading II"
              setValue={setValue}
              inputComponent="forminput"
              id="serviceHeadingII"
              errors={errors}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="serviceDescriptionIII"
              label="Service Description III"
              name="serviceDescriptionIII"
              control={control}
              placeholder="Service Description III"
              setValue={setValue}
              inputComponent="richtext"
              id="serviceDescriptionIII"
              errors={errors}
              defaultValue=""
              config={{
                readonly: false,
                height: 300,
              }}
            />

            <InputBox
              htmlFor="fourPoints"
              label="Four Points"
              name="fourPoints"
              control={control}
              type="text"
              placeholder="Four Points"
              setValue={setValue}
              inputComponent="dynamininput"
              id="fourPoints"
              errors={errors}
              defaultValue={[]}
              onChange={(value) => setValue("fourPoints", value)}
            />

            <InputBox
              htmlFor="ourProcessSubHeading"
              label="Our Process Sub Heading"
              name="ourProcessSubHeading"
              control={control}
              placeholder="Our Process Sub Heading"
              setValue={setValue}
              inputComponent="forminput"
              id="ourProcessSubHeading"
              errors={errors}
              defaultValue=""
              className="full-width-input"
            />

            <div className="two-columns">
              <InputBox
                htmlFor="ourProcessImageI"
                label="Our Process Image I"
                name="ourProcessImageI"
                control={control}
                placeholder="Our Process Image I"
                setValue={setValue}
                inputComponent="imageUploader"
                id="ourProcessImageI"
                errors={errors}
                defaultValue=""
              />
              <InputBox
                htmlFor="ourProcessImageII"
                label="Our Process Image II"
                name="ourProcessImageII"
                control={control}
                placeholder="Our Process Image II"
                setValue={setValue}
                inputComponent="imageUploader"
                id="ourProcessImageII"
                errors={errors}
                defaultValue=""
              />
            </div>

            <InputBox
              htmlFor="combinedSection"
              label="Combined Section"
              name="combinedSection"
              control={control}
              placeholder="Combined Section"
              setValue={setValue}
              inputComponent="combinedField"
              id="combinedSection"
              errors={errors}
              defaultValue=""
              config={{
                readonly: false,
                height: 300,
                placeholder: "Description",
              }}
            />

            <InputBox
              htmlFor="serviceHeadingIII"
              label="Service Heading III"
              name="serviceHeadingIII"
              control={control}
              placeholder="Service Heading III"
              setValue={setValue}
              inputComponent="forminput"
              id="serviceHeadingIII"
              errors={errors}
              defaultValue=""
              className="full-width-input"
            />

            <InputBox
              htmlFor="serviceDescriptionIV"
              label="Service Description IV"
              name="serviceDescriptionIV"
              control={control}
              placeholder="Service Description IV"
              setValue={setValue}
              inputComponent="richtext"
              id="serviceDescriptionIV"
              errors={errors}
              defaultValue=""
              config={{
                readonly: false,
                height: 300,
              }}
            />
            <InputBox
              htmlFor="serviceNote"
              label="Service Note"
              name="serviceNote"
              control={control}
              placeholder="Service Note"
              setValue={setValue}
              inputComponent="forminput"
              id="serviceNote"
              errors={errors}
              defaultValue=""
              className="full-width-input"
            />

            <div className="two-columns">
              <InputBox
                htmlFor="LastSectionText"
                label="Last Section Text"
                name="LastSectionText"
                control={control}
                placeholder="Last Section Text"
                setValue={setValue}
                inputComponent="richtext"
                id="LastSectionText"
                errors={errors}
                defaultValue=""
                config={{
                  readonly: false,
                  height: 300,
                }}
              />
              <InputBox
                htmlFor="LastSectionImage"
                label="Last Section Image"
                name="LastSectionImage"
                control={control}
                placeholder="Last Section Image"
                setValue={setValue}
                inputComponent="imageUploader"
                id="LastSectionImage"
                errors={errors}
                defaultValue=""
              />
            </div>

            <div className="form-btn-box">
              <button className="btn ">Cancel</button>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Adding Service..." : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </Cards>
    </div>
  );
});

InputBox.displayName = "InputBox";
AddServices.displayName = "AddMainServices";

export default AddServices;
