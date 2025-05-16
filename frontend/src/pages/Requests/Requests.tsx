/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmDialog from "@/components/ConfirmDialog";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { RequestStatus } from "@/enums";
import {
  deleteRequest,
  getSlotRequests,
  getUserRequests,
  updateRequestStatus,
} from "@/services/slot-request";

import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";

const Requests: React.FC = () => {
  const PAGE_SIZES = [5, 10, 15, 20];
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [statusChanged2, setStatusChanged2] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, slotRequests, setRequests, setMeta, meta } =
    useContext(CommonContext);
  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;

  const handleRequestApprove = (requestId: string) => {
    updateRequestStatus({
      id: requestId,
      status: "APPROVED",
      setLoading,
      setStatusChanged,
    });
  };
  const handleDelete = (id: string) => {
    deleteRequest({
      id,
      setLoading,
      setIsModalClosed,
    });
  };
  const handleRequestRejection = (requestId: string) => {
    updateRequestStatus({
      id: requestId,
      status: "REJECTED",
      setLoading,
      setStatusChanged: setStatusChanged2,
    });
  };
  const columns: DataTableColumn[] = [
    {
      accessor: "vehicle.plateNumber",
      title: "Plate number ",
      sortKey: "id",
    },
    {
      accessor: "vehicle.vehicleType",
      title: "request type",
    },
    {
      accessor: "vehicle.model",
      title: "model",
    },

    {
      accessor: "slot.location",
      title: "Parking Slot Location",
      render: ({ slot }: any) => slot?.location ?? "Not Assigned",
    },
    {
      accessor: "slot.number",
      title: "Parking Slot number",
      render: ({ slot }: any) => slot?.number ?? "Not slot yet",
    },
    {
      accessor: "slot.size",
      title: "Parking Slot Size",
      render: ({ slot }: any) => slot?.size ?? "Not Specified",
    },
    {
      accessor: "status",
      title: "Status",
      render: ({ status }: any) => {
        let bgColor = "";

        switch (status?.toUpperCase()) {
          case "APPROVED":
            bgColor = "text-green-600";
            break;
          case "REJECTED":
            bgColor = "text-red-600";
            break;
          case "PENDING":
            bgColor = "text-yellow-500";
            break;
          default:
            bgColor = "bg-gray-400";
            break;
        }

        return (
          <span
            className={`px-3 py-1 rounded-full  text-sm font-semibold ${bgColor}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessor: "",
      title: "Actions",
      render: (request: any) => {
        return (
          <div className="flex gap-2">
            {role == "USER" && request.status == RequestStatus.PENDING && (
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
                  onConfirm={() => handleDelete(request.id)}
                  message="Are you sure you want to delete this request?"
                />
              </>
            )}

            {role === "ADMIN" && request.status == RequestStatus.PENDING && (
              <>
                <button
                  onClick={() => handleRequestApprove(request.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRequestRejection(request.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (role === "ADMIN") {
      getSlotRequests({
        page,
        limit,
        setLoading,
        setMeta,
        setRequests,
        searchKey,
      });
    } else {
      getUserRequests({
        page,
        limit,
        setLoading,
        setMeta,
        setRequests,
        searchKey,
      });
    }
    if (isModalClosed || statusChanged) {
      if (role === "ADMIN") {
        getSlotRequests({
          page,
          limit,
          setLoading,
          setMeta,
          setRequests,
          searchKey,
        });
      } else {
        getUserRequests({
          page,
          limit,
          setLoading,
          setMeta,
          setRequests,
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
    setRequests,
    role,
    statusChanged,
    statusChanged2,
  ]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Home</title>
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
                  your requests
                </span>
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
                    getSlotRequests({
                      page,
                      limit,
                      setLoading,
                      setMeta,
                      setRequests,
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
              records={slotRequests as unknown as Record<string, unknown>[]}
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

      {/* <EditRequestModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        request={selectedRequest}
        setIsModalClosed={setIsModalClosed}
        setLoading={setLoading}
      /> */}
    </div>
  );
};

export default Requests;
