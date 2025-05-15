/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { getAvailableSlots } from "@/services/slots"; // Make sure this exists
import { createSession } from "@/services/sessions"; // Should POST to /entry
import { ISlot } from "@/types"; // Adjust according to your types
import { CommonContext } from "@/context";

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
    slotId: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const { setSlots, slots, setMeta } = useContext(CommonContext);
  useEffect(() => {
    if (!isOpen) {
      setFormData({ plateNumber: "", slotId: "" });
      setErrors({});
    } else {
      // fetchSlots();
      setIsFetchingSlots(true);
      getAvailableSlots({
        page: page,
        limit: limit,
        setLoading: setIsFetchingSlots,
        setMeta,
        setSlots,
      });
    }
  }, [isOpen, setMeta, setSlots, page, limit]);

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
    if (!formData.plateNumber)
      newErrors.plateNumber = "Plate number is required";
    if (!formData.slotId) newErrors.slotId = "Slot selection is required";
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

          {/* Slot Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="slotId"
              className="block text-sm font-medium text-gray-700"
            >
              Select Slot
            </label>
            <select
              id="slotId"
              name="slotId"
              value={formData.slotId}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">-- Select a Slot --</option>
              {slots.map((slot: ISlot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.number || `Slot ${slot.id}`}
                </option>
              ))}
            </select>
            {errors.slotId && (
              <span className="text-red-500 text-sm">{errors.slotId}</span>
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
