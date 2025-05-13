import adminClient from "./adminclient";
import { GetAllAccountRequest } from "@/type/GetAllAccount";

export interface PaginationMeta {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Hàm lấy toàn bộ account theo role
export const fetchAccounts = async (
  pageIndex: number,
  pageSize: number,
  roleId?: number // thêm tham số roleId (tùy chọn)
): Promise<{
  accounts: GetAllAccountRequest[];
  pagination: PaginationMeta;
}> => {
  try {
    const { data } = await adminClient.get("/account", {
      params: {
        id: roleId ?? 0, // nếu không chọn role thì truyền 0
        "page-index": pageIndex,
        "page-size": pageSize,
      },
    });

    const accounts: GetAllAccountRequest[] = data?.data?.items || [];

    const pagination: PaginationMeta = {
      totalCount: data?.data?.totalCount || 0,
      pageSize: data?.data?.pageSize || pageSize,
      currentPage: data?.data?.currentPage || pageIndex,
      totalPages: data?.data?.totalPages || 1,
      hasPrevious: data?.data?.currentPage > 1,
      hasNext: data?.data?.currentPage < data?.data?.totalPages,
    };

    return { accounts, pagination };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return {
      accounts: [],
      pagination: {
        totalCount: 0,
        pageSize,
        currentPage: pageIndex,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      },
    };
  }
};

// Hàm tìm kiếm tài khoản theo Gmail (email)
export const searchAccountsByGmail = async (
  gmail: string,
  pageIndex: number,
  pageSize: number
): Promise<{
  accounts: GetAllAccountRequest[];
  pagination: PaginationMeta;
}> => {
  try {
    const { data } = await adminClient.get("/account/search", {
      params: {
        id: gmail,
        "page-index": pageIndex,
        "page-size": pageSize,
      },
    });

    const accounts: GetAllAccountRequest[] = data?.data?.items || [];

    const pagination: PaginationMeta = {
      totalCount: data?.data?.totalCount || 0,
      pageSize: data?.data?.pageSize || pageSize,
      currentPage: data?.data?.currentPage || pageIndex,
      totalPages: data?.data?.totalPages || 1,
      hasPrevious: data?.data?.currentPage > 1,
      hasNext: data?.data?.currentPage < data?.data?.totalPages,
    };

    return { accounts, pagination };
  } catch (error) {
    console.error("Error searching accounts:", error);
    return {
      accounts: [],
      pagination: {
        totalCount: 0,
        pageSize,
        currentPage: pageIndex,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      },
    };
  }
};
