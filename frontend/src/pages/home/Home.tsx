/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import PaymentFeeModal from "@/components/PaymentModal";
import SessionDetails from "@/components/SessionDetails";
import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { createPayment } from "@/services/payment";
import {
  exitSession,
  getPaymentFee,
  getSessionDetails,
  getSessions,
  getUserSessions,
} from "@/services/sessions";
import { PaymentFee, PaymentFeePayload } from "@/types";
import { format } from "date-fns";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";

const Home: React.FC = () => {
  const PAGE_SIZES = [5, 10, 15, 20];
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<any>();
  const [feeDetails, setFeeDetails] = useState<PaymentFee | null>(null);
  const { user, sessions, setSessions, setMeta, meta } =
    useContext(CommonContext);

  const handleGetPaymentFee = (sessionId: string) => {
    getPaymentFee({
      sessionId,
      setLoading,
      setFeeDetails,
      setFeeModalOpen,
      setMeta,
    });
  };
  const handleView = (sessionId: string) => {
    getSessionDetails({
      sessionId,
      setLoading,
      setSessionDetails,
      setSessionModalOpen,
      setMeta,
    });
  };
  const handleExit = (sessionId: string) => {
    exitSession({
      sessionId,
      setLoading,
      setSessionModalOpen,
      setMeta,
    });
  };
  const handleProceedToPayment = (data: PaymentFeePayload) => {
    createPayment({ paymentData: data, setLoading, setFeeModalOpen });
  };
  const columns: DataTableColumn[] = [
    {
      accessor: "slot.number",
      title: "Parking Slot ",
      // sortable: true,
      sortKey: "id",
    },
    {
      accessor: "name",
      title: "Entry time",
      // sortable: true,
      sortKey: "name",
      render: ({ createdAt }) => (
        <span>
          {format(new Date(createdAt as string), "MMM dd, yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      accessor: "exitTime",
      title: "Exit time",
      // sortable: true,
      render: ({ exitTime }: any) =>
        exitTime ? (
          <span>{format(new Date(exitTime), "MMM dd, yyyy , hh:mm a")}</span>
        ) : (
          <span className="text-gray-500 italic">Still in parking</span>
        ),
    },
    {
      accessor: "paymentStatus",
      title: "status",
      render: ({ paymentStatus }) => (
        <span
          className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
            paymentStatus === "PAID" ? "bg-green-600" : "bg-yellow-500"
          }`}
        >
          {paymentStatus === "PAID" ? "Paid" : "Not paid yet"}
        </span>
      ),
    },
    {
      accessor: "payment.amount",
      title: "Amount",
      render: ({ payment }: any) => {
        const amount = payment?.amount;
        return typeof amount === "number" ? (
          <span>${amount.toFixed(2)}</span>
        ) : (
          <span className="text-red-500 italic">Not paid</span>
        );
      },
    },
    {
      accessor: "plateNumber",
      title: "car plate number",
    },
    {
      accessor: "isExited",
      title: "Parking Status",
      render: ({ isExited, paymentStatus }) => {
        if (isExited) {
          return <span className="text-yellow-400">Exited</span>;
        } else if (paymentStatus === "PAID") {
          return <span className="text-green-600">Paid – Can Exit now </span>;
        } else {
          return <span className="text-red-600">In Parking – Unpaid</span>;
        }
      },
    },

    {
      accessor: "subject",
      title: "Action",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row.id as string)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            View
          </button>
          {!row.paymentStatus || row.paymentStatus === "PENDING" ? (
            <button
              onClick={() => handleGetPaymentFee(row.id as string)}
              className="bg-green-500 text-white px-5 py-1 rounded"
            >
              Get paymentFee
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;
  useEffect(() => {
    if (role === "ADMIN") {
      getSessions({ page, limit, setLoading, setMeta, setSessions, searchKey });
    } else {
      getUserSessions({
        page,
        limit,
        setLoading,
        setMeta,
        setSessions,
        searchKey,
      });
    }
    if (isModalClosed || feeModalOpen || sessionModalOpen) {
      if (role === "ADMIN") {
        getSessions({
          page,
          limit,
          setLoading,
          setMeta,
          setSessions,
          searchKey,
        });
      } else {
        getUserSessions({
          page,
          limit,
          setLoading,
          setMeta,
          setSessions,
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
    setSessions,
    role,
    feeModalOpen,
    sessionModalOpen,
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
                  your recently sessions
                </span>
                <button
                  className="text-white bg-primary-blue rounded py-2 px-8 text-lg"
                  onClick={() => setIsModalOpen(true)}
                >
                  Enter in parking
                </button>
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
                    getSessions({
                      page,
                      limit,
                      setLoading,
                      setMeta,
                      setSessions,
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
              records={sessions as unknown as Record<string, unknown>[]}
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsModalClosed(true);
        }}
        loading={loading}
        setIsLoading={setLoading}
      />
      <PaymentFeeModal
        isOpen={feeModalOpen}
        onClose={() => setFeeModalOpen(false)}
        data={feeDetails}
        onProceed={handleProceedToPayment}
      />
      <SessionDetails
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        data={sessionDetails}
        onProceed={handleExit}
      />
    </div>
  );
};

export default Home;
