// Package imports
import axios from "axios";
import { useEffect, useState, lazy, Suspense, startTransition } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// Components Imports
import formatDate from "../../utils/DateFormatting/FormatDate";
const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));
const FilterTableCard = lazy(() =>
  import("../../components/filterTableCard/FilterTableCard")
);

// Table Header Data


const AllTickets = () => {
  return <div>
    hello from all tickets
  </div>;
};

export default AllTickets;
