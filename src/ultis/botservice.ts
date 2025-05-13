// services/chatbotApi.ts

import adminClient from "./adminclient";
import { GetBotRequest } from "@/type/CreateBot";
import { CreateBotRequest } from "@/type/CreateBot";

export const getAllBots = async (): Promise<GetBotRequest[]> => {
  const response = await adminClient.get<GetBotRequest[]>("/chatbot");
  return response.data;
};

export const createBot = async (data: CreateBotRequest): Promise<void> => {
  await adminClient.post("/chatbot/create", data);
};

export const activateBot = async (id: number) => {
  const payload = { isDefault: true };
  const response = await adminClient.put(`/chatbot/banned/${id}`, payload);
  return response.data;
};

export const deactivateBot = async (id: number) => {
  const payload = { isDefault: false };
  const response = await adminClient.put(`/chatbot/banned/${id}`, payload);
  return response.data;
};

export const deleteBot = async (id: number) => {
  const response = await adminClient.delete(`/chatbot/delete/${id}`);
  return response.data;
};
