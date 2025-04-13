import apiClient from "./apiClient";
import { Rule } from "../../types/policy.types";

export const updateRule = async (ruleId: number, data: Partial<Rule>) => {
  const response = await apiClient.patch(`/rules/${ruleId}`, data);
  return response.data as Rule;
};

export const createRule = async (policyId: number, data: Partial<Rule>) => {
  const ruleData = {
    ...data,
    policy_id: policyId
  };
  
  const response = await apiClient.post('/rules/', ruleData);
  return response.data as Rule;
};