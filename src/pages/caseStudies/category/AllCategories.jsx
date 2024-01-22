import axios from "axios";
import Table from "../../../components/table/Table";
import Cards from "../../../components/card/Cards";
import Loader from "../../../components/loader/Loader";
import { useQuery, useMutation } from "@tanstack/react-query";
import ActionButtons from "../../../components/actionButtons/ActionButtons";

// Set default headers for axios
axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${sessionStorage.getItem("token")}`;

const AllCategories = () => {
  const mutation = useMutation({
    mutationFn: (slug) => {
      return axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/case-studies-category/deleteCaseStudiesCategory/${slug}`
      );
    },
    onSuccess: async () => {
      // Refetch the data after successful deletion
      await categoriesQuery.refetch();
    },
  });

  const categoriesQuery = useQuery({
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

  if (categoriesQuery.isLoading) return <Loader />;
  if (categoriesQuery.error)
    return "An error has occurred: " + categoriesQuery.error.message;

  const categoriesData = categoriesQuery.data;

  return (
    <div>
      <Cards
        header="Case Study Categories"
        addnew={"/add-case-study-category"}
        addnewText="Add New Category"
      >
        <Table
          limit="10"
          headData={["No.", "Category Name", "Slug", "Technologies", "Actions"]}
          renderHead={(item, index) => <th key={index}>{item}</th>}
          bodyData={categoriesData}
          renderBody={(item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.categoryName}</td>
              <td>{item.slug}</td>
              <td>
                {item.technologies.map((tech, techIndex) => (
                  <div key={techIndex}>{tech.title}</div>
                ))}
              </td>
              <td>
                <ActionButtons
                  edit_link={`/edit-case-study-category/${item._id}`}
                  delete_function={() => mutation.mutate(item.slug)}
                />
              </td>
            </tr>
          )}
        />
      </Cards>
    </div>
  );
};

export default AllCategories;
