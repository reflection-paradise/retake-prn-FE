"use client";

import React, { useEffect, useState } from "react";
import {
  getAllBots,
  createBot,
  activateBot,
  deactivateBot,
  deleteBot,
} from "@/ultis/botservice";
import { GetBotRequest } from "@/type/CreateBot";
import { toast } from "react-toastify";

const ChatBotList: React.FC = () => {
  const [bots, setBots] = useState<GetBotRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [newBot, setNewBot] = useState({
    key: "",
    baseUrl: "",
    context: "",
    isDefault: false,
  });

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await getAllBots();
        setBots(data);
      } catch (error) {
        console.error("Error fetching bots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleCreate = async () => {
    const { key, baseUrl, context } = newBot;
    if (!key.trim() || !baseUrl.trim() || !context.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      await createBot(newBot);
      toast.success("Tạo bot thành công!");
      setShowModal(false);
      setNewBot({ key: "", baseUrl: "", context: "", isDefault: false });
      const updatedBots = await getAllBots();
      setBots(updatedBots);
    } catch (err) {
      toast.error("Tạo bot thất bại. Vui lòng thử lại.");
      console.error("Lỗi khi tạo bot:", err);
    }
  };
  const handleDelete = async () => {
    if (deleteTargetId === null) return;

    try {
      await deleteBot(deleteTargetId);
      toast.success("Xóa bot thành công!");
      setDeleteTargetId(null);
      const updatedBots = await getAllBots();
      setBots(updatedBots);
    } catch (error) {
      toast.error("Xóa bot thất bại!");
      console.error(error);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateBot(id);
      toast.success("Hủy kích hoạt bot thành công!");
      const updatedBots = await getAllBots();
      setBots(updatedBots);
    } catch (error) {
      toast.error("Hủy kích hoạt thất bại!");
      console.error("Lỗi khi hủy kích hoạt bot:", error);
    }
  };
  const handleActivate = async (id: number) => {
    try {
      await activateBot(id);
      toast.success("Kích hoạt bot thành công!");
      const updatedBots = await getAllBots();
      setBots(updatedBots);
    } catch (error) {
      toast.error("Kích hoạt bot thất bại!");
      console.error("Lỗi khi kích hoạt bot:", error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewBot({
      ...newBot,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (loading) return <div className="p-4">Loading bots...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách Bot</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-black"
          onClick={() => setShowModal(true)}
        >
          Tạo Bot
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Key</th>
              <th className="py-2 px-4 border-b">Base URL</th>
              <th className="py-2 px-4 border-b">Context</th>
              <th className="py-2 px-4 border-b">Đang hoạt động?</th>
              <th className="py-2 px-4 border-b">Kích hoạt</th>
              <th className="py-2 px-4 border-b">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((bot) => (
              <tr key={bot.chatBotId} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{bot.chatBotId}</td>
                <td className="py-2 px-4 border-b">{bot.key ?? "N/A"}</td>
                <td className="py-2 px-4 border-b">{bot.baseUrl ?? "N/A"}</td>
                <td className="py-2 px-4 border-b">{bot.context ?? "N/A"}</td>
                <td className="py-2 px-4 border-b">
                  {bot.isDefault ? "✅" : "❌"}
                </td>
                <td className="py-2 px-4 border-b">
                  {bot.isDefault ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-semibold">
                        Đã chọn
                      </span>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                        onClick={() => handleDeactivate(bot.chatBotId)}
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handleActivate(bot.chatBotId)}
                    >
                      Chọn
                    </button>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => setDeleteTargetId(bot.chatBotId)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Tạo Bot Mới</h2>
            <div className="space-y-3">
              <input
                name="key"
                placeholder="Key"
                value={newBot.key}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="baseUrl"
                placeholder="Base URL"
                value={newBot.baseUrl}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="context"
                placeholder="Context"
                value={newBot.context}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-400"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa bot</h2>
            <p>Bạn có chắc chắn muốn xóa bot này không?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotList;
