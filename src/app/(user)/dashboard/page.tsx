"use client";
import { useEffect, useState } from "react";
import {
  fetchAccounts,
  PaginationMeta,
  searchAccountsByGmail,
} from "@/ultis/getAccountService";
import { GetAllAccountRequest } from "@/type/GetAllAccount";
import { banUser } from "@/ultis/banUser";
import { toast } from "react-toastify";

const AccountList = () => {
  const [accounts, setAccounts] = useState<GetAllAccountRequest[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [searchEmail, setSearchEmail] = useState("");
  const [searchInput, setSearchInput] = useState(""); // để nhập trước rồi nhấn tìm
  const pageSize = 10;

  const loadAccounts = async () => {
    try {
      const roleId = selectedRoles.length > 0 ? selectedRoles[0] : 0;

      let result;
      if (searchEmail.trim() !== "") {
        result = await searchAccountsByGmail(searchEmail, pageIndex, pageSize);
      } else {
        result = await fetchAccounts(pageIndex, pageSize, roleId);
      }

      setAccounts(result.accounts);
      setPagination(result.pagination);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách tài khoản.");
      console.error("Error fetching accounts:", err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [pageIndex, selectedRoles, searchEmail]);

  const handlePageClick = (page: number) => {
    if (page !== pageIndex) {
      setPageIndex(page);
    }
  };

  const handleBanClick = (id: number) => {
    setSelectedAccountId(id);
  };

  const confirmBan = async () => {
    if (selectedAccountId == null) return;

    const isSuccess = await banUser(selectedAccountId);
    if (isSuccess) {
      toast.success("User đã bị ban thành công!");
      await loadAccounts();
    } else {
      toast.error("Không thể ban user. Vui lòng thử lại.");
    }

    setSelectedAccountId(null);
  };

  const cancelBan = () => {
    setSelectedAccountId(null);
  };

  const filteredAccounts =
    selectedRoles.length === 0
      ? accounts.filter((acc) => acc.roleId !== 1)
      : accounts.filter(
          (acc) => selectedRoles.includes(acc.roleId) && acc.roleId !== 1
        );

  return (
    <div className="p-6 relative">
      <h1 className="text-xl font-bold mb-4">Danh sách tài khoản</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <label className="block mb-1 font-medium">
            Chọn vai trò hiển thị:
          </label>
          <select
            value={
              selectedRoles.length === 0 ? "all" : String(selectedRoles[0])
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setSelectedRoles([]);
              } else {
                setSelectedRoles([Number(value)]);
              }
              setPageIndex(1);
            }}
            className="border p-2 rounded w-full sm:w-64"
          >
            <option value="all">Tất cả</option>
            <option value="2">Manager</option>
            <option value="3">Staff</option>
            <option value="4">Owner</option>
            <option value="5">Customer</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block mb-1 font-medium">Tìm theo Gmail:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nhập gmail cần tìm..."
              className="border p-2 rounded flex-grow"
            />
            <button
              onClick={() => {
                setSearchEmail(searchInput.trim());
                setPageIndex(1);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tìm
            </button>
            {searchEmail && (
              <button
                onClick={() => {
                  setSearchEmail("");
                  setSearchInput("");
                  setPageIndex(1);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Xóa tìm
              </button>
            )}
          </div>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Họ tên</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">SĐT</th>
            <th className="py-2 px-4 border-b">Vai trò</th>
            <th className="py-2 px-4 border-b">Trạng thái</th>
            <th className="py-2 px-4 border-b">Ban</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((acc) => (
            <tr key={acc.accountId}>
              <td className="py-2 px-4 border-b">{acc.accountId}</td>
              <td className="py-2 px-4 border-b">{acc.fullName}</td>
              <td className="py-2 px-4 border-b">{acc.email}</td>
              <td className="py-2 px-4 border-b">{acc.phoneNumber || "-"}</td>
              <td className="py-2 px-4 border-b">
                {acc.roleId === 2
                  ? "Manager"
                  : acc.roleId === 3
                  ? "Staff"
                  : acc.roleId === 5
                  ? "Customer"
                  : acc.roleId === 4
                  ? "Owner"
                  : acc.roleId === 1
                  ? "Admin"
                  : "-"}
              </td>
              <td className="py-2 px-4 border-b">
                {acc.isActive ? "✔️" : "❌"}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className={`px-3 py-1 rounded hover:bg-red-700 ${
                    acc.roleId === 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white"
                  }`}
                  disabled={acc.roleId === 1}
                  onClick={() => handleBanClick(acc.accountId)}
                >
                  Ban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              className={`px-3 py-1 rounded ${
                pagination.currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {selectedAccountId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Xác nhận ban tài khoản
            </h2>
            <p className="text-center mb-6">
              Bạn có chắc chắn muốn ban tài khoản có ID{" "}
              <b>{selectedAccountId}</b>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmBan}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Xác nhận
              </button>
              <button
                onClick={cancelBan}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;
