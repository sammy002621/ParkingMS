import React from "react";
import { format } from "date-fns";
import { SessionDetailsProps } from "@/types";

const PaymentFeeModal: React.FC<SessionDetailsProps> = ({
  isOpen,
  onClose,
  data,
  onProceed,
}) => {
  if (!isOpen || !data) return null;

  const { id, plateNumber, entryTime, exitTime, paymentStatus, isExited } =
    data;
  const showExitButton = paymentStatus === "PAID" && !isExited;

  const formatTime = (time?: string | null) =>
    time ? format(new Date(time), "yyyy-MM-dd HH:mm:ss") : "N/A";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Session Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-lg"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <Detail label="Plate Number" value={plateNumber} />
          <Detail label="Entry Time" value={formatTime(entryTime)} />
          <Detail label="Exit Time" value={formatTime(exitTime)} />
          <div className="flex gap-3 pt-2">
            <Badge
              label={paymentStatus}
              color={paymentStatus === "PAID" ? "green" : "red"}
            />
            <Badge
              label={isExited ? "Exited" : "Active"}
              color={isExited ? "gray" : "blue"}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Close
          </button>

          {showExitButton && (
            <button
              onClick={() => onProceed(id)}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Exit Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface DetailProps {
  label: string;
  value: string;
}

const Detail: React.FC<DetailProps> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

interface BadgeProps {
  label: string;
  color: "green" | "red" | "blue" | "gray";
}

const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color]}`}
    >
      {label}
    </span>
  );
};

export default PaymentFeeModal;
