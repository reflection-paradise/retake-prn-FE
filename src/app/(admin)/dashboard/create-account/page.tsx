"use client";
import React, { useState } from "react";
import { CreateAccountRequest } from "@/type/CreateAccount";
import { createAccount } from "@/ultis/accountService";
import { toast } from "react-toastify";

const CreateAccountForm: React.FC = () => {
  const initialFormData: CreateAccountRequest = {
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    roleId: 0,
    isActive: true,
  };

  const [formData, setFormData] =
    useState<CreateAccountRequest>(initialFormData);
  const [imgFile, setImgFile] = useState<File | undefined>(undefined);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "fullName":
        return /^[a-zA-ZÀ-ỹ\s'.-]+$/.test(value) ? "" : "Họ tên không hợp lệ";
      case "address":
        return /^[\w\sÀ-ỹ.,-]*$/.test(value) ? "" : "Địa chỉ không hợp lệ";
      case "phoneNumber":
        return /^[0-9\b]+$/.test(value) ? "" : "Số điện thoại chỉ được chứa số";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    setFormData((prev) => ({
      ...prev,
      [name]: name === "roleId" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImgFile(undefined);
    setImgPreview(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateField(key, value as string);
      if (errorMsg) newErrors[key] = errorMsg;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    const requestData: CreateAccountRequest = {
      ...formData,
      imgFile: imgFile,
    };

    try {
      await createAccount(requestData);
      toast.success("Tạo tài khoản thành công.");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Tạo tài khoản thất bại");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "900px",
        margin: "0 auto",
        gap: "20px",
        padding: "40px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "30px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Tạo tài khoản cho nhân viên
      </h2>

      <div>
        <input
          type="text"
          name="fullName"
          placeholder="Họ tên"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        {errors.fullName && (
          <span style={{ color: "red", fontSize: "14px" }}>
            {errors.fullName}
          </span>
        )}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Số điện thoại"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        {errors.phoneNumber && (
          <span style={{ color: "red", fontSize: "14px" }}>
            {errors.phoneNumber}
          </span>
        )}
      </div>

      <div>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && (
          <span style={{ color: "red", fontSize: "14px" }}>
            {errors.address}
          </span>
        )}
      </div>

      <select
        name="roleId"
        onChange={handleChange}
        value={formData.roleId}
        required
      >
        <option value="">Chọn vai trò</option>
        <option value="2">Shopmanager</option>
        <option value="3">Staff</option>
      </select>

      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imgPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgPreview}
            alt="Preview"
            style={{
              marginTop: "10px",
              maxWidth: "200px",
              borderRadius: "4px",
            }}
          />
        )}
      </div>

      <button
        type="submit"
        style={{
          padding: "10px 20px",
          fontWeight: "bold",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        }}
      >
        Tạo tài khoản
      </button>
    </form>
  );
};

export default CreateAccountForm;
