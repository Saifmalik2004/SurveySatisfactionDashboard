import { useQuery } from "@tanstack/react-query";

export const useSurveyData = () => {
  return useQuery({
    queryKey: ["survey-data"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8080/api/survey/responses");
      if (!res.ok) throw new Error("Failed to fetch survey responses");
      return res.json();
    },
  });
};

export const useCustomerData = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8080/api/survey/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    },
  });
};
