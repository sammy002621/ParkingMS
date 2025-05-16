import React from "react";
import { Modal } from "@mantine/core";
import { IVehicle } from "@/types";
import {
  FaCar,
  FaPalette,
  FaRegIdCard,
  FaIndustry,
  FaLayerGroup,
} from "react-icons/fa";

interface ViewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: IVehicle;
}

const ViewVehicleModal: React.FC<ViewVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  if (!vehicle) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-xl font-semibold text-primary-blue">
          Vehicle Details
        </h2>
      }
      centered
      size="lg"
      radius="md"
      overlayProps={{
        blur: 3,
        backgroundOpacity: 0.5,
      }}
    >
      <div className="space-y-4 mt-4">
        <div className="flex items-center gap-3">
          <FaRegIdCard className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Plate Number:</strong>{" "}
            {vehicle.plateNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaCar className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Vehicle Type:</strong>{" "}
            {vehicle.vehicleType}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaLayerGroup className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Model:</strong> {vehicle.model}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaPalette className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Color:</strong> {vehicle.color}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaIndustry className="text-primary-blue" />
          <p>
            <strong className="text-gray-600">Manufacturer:</strong>{" "}
            {vehicle.maker}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewVehicleModal;
