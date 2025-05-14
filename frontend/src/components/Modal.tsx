/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBook } from "@/services/book";
import { IBook } from "@/types";
import React, { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";

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
  // Ensure hooks are always called
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    publisher: "",
    publicationYear: "",
    subject: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form data when modal is closed
      setFormData({
        name: "",
        author: "",
        publisher: "",
        publicationYear: "",
        subject: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const onSubmit = async (formData: IBook) => {
    await createBook({ bookData: formData, setLoading: setIsLoading });
    onClose();
  };
  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Book name is required";
    if (!formData.author) newErrors.author = "Author is required";
    if (!formData.publisher) newErrors.publisher = "Publisher is required";
    if (!formData.publicationYear)
      newErrors.publicationYear = "Publication year is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (isNaN(Number(formData.publicationYear)))
      newErrors.publicationYear = "Publication year must be a valid number";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-1/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create a New Book</h2>
          <button onClick={onClose} className="text-red-500">
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Book Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Enter book name"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Enter author's name"
            />
            {errors.author && (
              <span className="text-red-500 text-sm">{errors.author}</span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="publisher"
              className="block text-sm font-medium text-gray-700"
            >
              Publisher
            </label>
            <input
              id="publisher"
              name="publisher"
              type="text"
              value={formData.publisher}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Enter publisher's name"
            />
            {errors.publisher && (
              <span className="text-red-500 text-sm">{errors.publisher}</span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="publicationYear"
              className="block text-sm font-medium text-gray-700"
            >
              Publication Year
            </label>
            <input
              id="publicationYear"
              name="publicationYear"
              type="text"
              value={formData.publicationYear}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Enter publication year"
            />
            {errors.publicationYear && (
              <span className="text-red-500 text-sm">
                {errors.publicationYear}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Enter subject"
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">{errors.subject}</span>
            )}
          </div>
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
                "Create Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
