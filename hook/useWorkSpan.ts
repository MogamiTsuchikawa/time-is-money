import { axios } from "@/lib/axios";
import { WorkSpan } from "@prisma/client";
import { useEffect, useState } from "react";

type UseWorkSpan = () => {
  todayWorkSpans: WorkSpan[];
  doEngraving: () => Promise<boolean>;
};
export const useWorkSpan: UseWorkSpan = () => {
  const [todayWorkSpans, setTodayWorkSpans] = useState([]);

  const get = async () => {
    try {
      const res = await axios.get("/api/engrav");
      console.log(res.data);
      setTodayWorkSpans(res.data);
    } catch (e: any) {
      console.log("ERROR");
    }
  };
  useEffect(() => {
    get();
  }, []);
  const doEngraving = async () => {
    try {
      const res = await axios.post("/api/engrav");
      await get();
    } catch (e: any) {
      return false;
    }
    return true;
  };
  return {
    todayWorkSpans,
    doEngraving,
  };
};
