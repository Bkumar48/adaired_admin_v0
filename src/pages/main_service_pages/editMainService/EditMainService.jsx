import React, { useState, useCallback, Suspense, useMemo, lazy } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

// Lazy-loaded components
const JoditEditor = lazy(() => import("jodit-react"));
const Loader = lazy(() => import("../../../components/loader/Loader"));
const FormInput = lazy(() => import("../../../components/FormFields/FormInput/FormInput"));
const Cards = lazy(() => import("../../../components/card/Cards"));

const AddMainServices = lazy(() => import("../addMainService/AddMainServices"));


const EditMainService = () => {
  return (
    <div>
      
    </div>
  )
}

export default EditMainService
