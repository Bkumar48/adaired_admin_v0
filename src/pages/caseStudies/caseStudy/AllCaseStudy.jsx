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

const AllCaseStudy = () => {
    const caseStudies = useQuery({
        queryKey:["caseStudies"],
        queryFn : async () =>{
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/case-studies/`
            )
        }
    })
  return (
    <div>
      
    </div>
  )
}

export default AllCaseStudy
