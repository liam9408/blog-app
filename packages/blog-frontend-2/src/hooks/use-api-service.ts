/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { ApiContext } from "../contexts/api-context";

export const useApi = () => useContext(ApiContext) as any;
