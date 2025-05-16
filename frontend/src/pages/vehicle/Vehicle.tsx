/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/Navbar";
import CreateVehicleModal from "@/components/vehicle/RegisteCarModal";
import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { createSlotRequest } from "@/services/slot-request";

import {
  deleteVehicle,
  getUserVehicles,
  getVehicles,
  updateVehicle,
} from "@/services/vehicle";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";
import ViewVehicleModal from "@/components/vehicle/ViewVehicle";
import EditVehicleModal from "@/components/vehicle/EditVehicleModal";
import ConfirmDialog from "@/components/ConfirmDialog";

const Vehicle: React.FC = () => {
  const PAGE_SIZES = [5, 10, 15, 20];
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const [isSlotRequested, setIsSlotRequested] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { user, vehicles, setVehicles, setMeta, meta } =
    useContext(CommonContext);

  const handleDelete = (id: string) => {
    deleteVehicle({
      id,
      setLoading,
      setIsModalClosed,
    });
  };
  const handleSlotRequest = (vehicleId: string) => {
    createSlotRequest({
      vehicleId,
      setLoading,
      setIsSlotRequested,
    });
  };

  const columns: DataTableColumn[] = [
    {
      accessor: "plateNumber",
      title: "Plate number ",
      sortKey: "id",
    },
    {
      accessor: "vehicleType",
      title: "vehicle type",
    },
    {
      accessor: "model",
      title: "model",
    },
    {
      accessor: "color",
      title: "color",
    },
    {
      accessor: "maker",
      title: "manufacturer",
    },

    {
      accessor: "",
      title: "Actions",
      render: (vehicle: any) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedVehicle(vehicle);
                setViewModalOpen(true);
              }}
              className="bg-primary-blue text-white px-4 py-2 rounded-md"
            >
              View
            </button>
            {role != "ADMIN" && (
              <>
                <button
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setEditModalOpen(true);
                  }}
                  className="bg-primary-blue text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>

                  <ConfirmDialog
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={() => handleDelete(vehicle.id)}
                    message="Are you sure you want to delete this vehicle?"
                  />
                </>
              </>
            )}
            {vehicle?.requests?.length < 1 && role != "ADMIN" && (
              <button
                onClick={() => handleSlotRequest(vehicle.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                request slot to park in
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;
  useEffect(() => {
    if (role === "ADMIN") {
      getVehicles({ page, limit, setLoading, setMeta, setVehicles, searchKey });
    } else {
      getUserVehicles({
        page,
        limit,
        setLoading,
        setMeta,
        setVehicles,
        searchKey,
      });
    }
    if (isModalClosed || isSlotRequested) {
      if (role === "ADMIN") {
        getVehicles({
          page,
          limit,
          setLoading,
          setMeta,
          setVehicles,
          searchKey,
        });
      } else {
        getUserVehicles({
          page,
          limit,
          setLoading,
          setMeta,
          setVehicles,
          searchKey,
        });
      }
      setIsModalClosed(false);
    }
  }, [
    isModalClosed,
    page,
    limit,
    searchKey,
    setLoading,
    setMeta,
    setVehicles,
    role,
    isSlotRequested,
  ]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Vehicle</title>
      </Helmet>
      <div className="w-full lg:w-11/12 flex flex-col">
        <Navbar />
        <div className=" flex flex-col px-2 xs:px-6 sm:px-14 pt-8">
          <span className="text-lg font-semibold">
            Hi👋, {user.firstName} {user.lastName}
          </span>
          <div className="w-full my-14">
            <div className="w-full justify-end sm:justify-between flex mb-6 items-center">
              <div>
                <span className="hidden sm:flex my-8 text-xl">
                  {role === "ADMIN"
                    ? " here all vehicles in system"
                    : " your Vehicles"}
                </span>
                {role != "ADMIN" && (
                  <button
                    className="text-white bg-primary-blue rounded py-2 px-8 text-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Register new Car
                  </button>
                )}
              </div>
              <div className="bg-white w-11/12 dsm:w-10/12 sm:w-5/12 plg:w-3/12 rounded-3xl flex items-center relative h-12 justify-between">
                <input
                  placeholder="Search here..."
                  type="text"
                  className="outline-0 rounded-3xl bg-inherit w-10/12 p-2 pl-6"
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <button
                  onClick={() => {
                    getVehicles({
                      page,
                      limit,
                      setLoading,
                      setMeta,
                      setVehicles,
                      searchKey,
                    });
                  }}
                  className="absolute top-1 mx-auto bottom-1 right-2 bg-primary-blue w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <BiSearch color="white" size={25} />
                </button>
              </div>
            </div>
            <DataTable
              records={vehicles as unknown as Record<string, unknown>[]}
              columns={columns}
              page={page}
              recordsPerPage={limit}
              loadingText={loading ? "Loading..." : "Rendering..."}
              onPageChange={(page) => setPage(page)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setLimit}
              withTableBorder
              borderRadius="sm"
              withColumnBorders
              styles={{ header: { background: "#f0f0f0cc" } }}
              striped
              totalRecords={meta?.total}
              highlightOnHover
              highlightOnHoverColor={"000"}
              noRecordsText="No records found"
              paginationActiveBackgroundColor={"#1967d2"}
            />
          </div>
        </div>
      </div>
      <CreateVehicleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsModalClosed(true);
        }}
        loading={loading}
        setIsLoading={setLoading}
      />
      <ViewVehicleModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        vehicle={selectedVehicle}
      />

      <EditVehicleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        vehicle={selectedVehicle}
        onSave={(update) => {
          updateVehicle({
            id: selectedVehicle.id,
            vehicleData: update,
            setLoading,
            setIsModalClosed,
          });
        }}
      />
    </div>
  );
};

export default Vehicle;
