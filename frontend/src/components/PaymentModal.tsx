import React, { useState } from "react";
import { PaymentFeeModalProps } from "@/types";
import { PaymentMethod } from "@/enums";

const PaymentFeeModal: React.FC<PaymentFeeModalProps> = ({
  isOpen,
  onClose,
  data,
  onProceed,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    PaymentMethod.CARD
  );

  if (!isOpen || !data) return null;

  const handleProceedClick = () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    const payload = {
      sessionId: data.session,
      plateNumber: data.vehicle_plate_number,
      amount: Number(data.fee),
      method: selectedMethod,
    };
    onProceed(payload);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Payment Details
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>User:</strong> {data.user}
          </p>
          <p>
            <strong>Plate Number:</strong> {data.vehicle_plate_number}
          </p>
          <p>
            <strong>Parking Slot:</strong> {data.parkingSlot}
          </p>
          <p>
            <strong>Entry Time:</strong>{" "}
            {new Date(data.entryTime).toLocaleString()}
          </p>
          <p>
            <strong>Parking Hours:</strong> {data.parking_hours}
          </p>
          <p>
            <strong>Fee:</strong>${data.fee}
          </p>
        </div>

        <div className="mt-4">
          <label className="block font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={selectedMethod ?? ""}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="" disabled>
              Select method
            </option>
            <option value={PaymentMethod.CASH}>Cash</option>
            <option value={PaymentMethod.CARD}>Card</option>
            <option value={PaymentMethod.MOBILE_MONEY}>Mobile Money</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleProceedClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFeeModal;
