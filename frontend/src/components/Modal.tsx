/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { createSession } from "@/services/sessions"; // Should POST to /entry

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  loading,
  setIsLoading,
}) => {
  const [formData, setFormData] = useState({
    plateNumber: "",
  });

  const [errors, setErrors] = useState<any>({});
  useEffect(() => {
    if (!isOpen) {
      setFormData({ plateNumber: "" });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: any = {};

    const plate = formData.plateNumber.trim().toUpperCase();

    // Valid formats: RAD123B, RAB456C, GR1234, CD101, CM305
    const platePattern = /^(R[A-Z]{2}\d{3}[A-Z]|GR\d{4}|C[DM]\d{3})$/;

    if (!plate) {
      newErrors.plateNumber = "Plate number is required";
    } else if (!platePattern.test(plate)) {
      newErrors.plateNumber =
        "Invalid Rwandan plate. Examples: RAD123B, GR1234, CD101";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      await createSession({ sessionData: formData, setLoading: setIsLoading });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-1/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Enter Parking</h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Plate Number */}
          <div className="mb-4">
            <label
              htmlFor="plateNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Plate Number
            </label>
            <input
              id="plateNumber"
              name="plateNumber"
              type="text"
              value={formData.plateNumber}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Enter plate number"
            />
            {errors.plateNumber && (
              <span className="text-red-500 text-sm">{errors.plateNumber}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white py-2 px-4 rounded ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin" size={20} />
              ) : (
                "Enter Parking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
