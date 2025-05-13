import adminClient from "./adminclient";

// Hàm ban người dùng (PUT request)
export const banUser = async (id: number): Promise<boolean> => {
  try {
    const response = await adminClient.put(`/account/banned/${id}`);

    // Kiểm tra phản hồi từ server
    if (response.status === 200 && response.data.status === true) {
      return true;
    } else {
      console.error("Failed to ban user:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("Error banning user:", error);
    return false;
  }
};
