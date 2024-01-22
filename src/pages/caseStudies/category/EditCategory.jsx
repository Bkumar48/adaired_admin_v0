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

const EditCategory = () => {
  return (
    <div>
      
    </div>
  )
}

export default EditCategory
