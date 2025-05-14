/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { getBooks } from "@/services/book";
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false); // Track if modal is closed
  const { user, books, setBooks, setMeta, meta } = useContext(CommonContext);

  const columns: DataTableColumn[] = [
    {
      accessor: "id",
      title: "#",
      sortable: true,
      sortKey: "id",
    },
    {
      accessor: "name",
      title: "Name",
      sortable: true,
      sortKey: "name",
    },
    {
      accessor: "author",
      title: "Author",
      sortable: true,
    },
    {
      accessor: "publisher",
      title: "Publisher",
    },
    {
      accessor: "publicationYear",
      title: "Publication Year",
    },
    {
      accessor: "subject",
      title: "Subject",
    },
    {
      accessor: "createdAt",
      title: "Created At",
      sortable: true,
      render: ({ createdAt }) => (
        <span>{format(new Date(createdAt as string), "MMM dd, yyyy")}</span>
      ),
    },
  ];

  useEffect(() => {
    getBooks({ page, limit, setLoading, setMeta, setBooks, searchKey });
    if (isModalClosed) {
      getBooks({ page, limit, setLoading, setMeta, setBooks, searchKey });
      setIsModalClosed(false);
    }
  }, [isModalClosed, page, limit, searchKey, setLoading, setMeta, setBooks]);

  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="w-full smlg:w-11/12 flex flex-col">
        <Navbar />
        <div className=" flex flex-col px-2 xs:px-6 sm:px-14 pt-8">
          <span className="text-lg font-semibold">
            Hi👋, {user.firstName} {user.lastName}
          </span>
          <div className="w-full my-14">
            <div className="w-full justify-end sm:justify-between flex mb-6 items-center">
              <div>
                <span className="hidden sm:flex my-8 text-xl">
                  Books in PMS
                </span>
                {role === "ADMIN" ? (
                  <button
                    className="text-white bg-primary-blue rounded py-2 px-8 text-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Create book{" "}
                  </button>
                ) : null}
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
                    getBooks({
                      page,
                      limit,
                      setLoading,
                      setMeta,
                      setBooks,
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
              records={books as unknown as Record<string, unknown>[]}
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
    </div>
  );
};

export default Home;
