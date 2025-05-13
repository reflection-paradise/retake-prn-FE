import adminClient from "@/ultis/adminclient";
import {
  CreateAccountRequest,
  CreateAccountRespond,
} from "@/type/CreateAccount";

export const createAccount = async (
  data: CreateAccountRequest
): Promise<CreateAccountRespond> => {
  const formData = new FormData();

  for (const key in data) {
    const value = (data as any)[key];
    if (value !== undefined && key !== "imgFile") {
      formData.append(key, value);
    }
  }

  if (data.imgFile) {
    formData.append("imgFile", data.imgFile);
  }

  const response = await adminClient.post<CreateAccountRespond>(
    "account/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
