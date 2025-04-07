import SubmitBtn from "@/components/ui/submit-btn";
import Heading from "@/features/shared/table/components/table-heading";
import useCustomise from "@/lib/hooks/useCustomise";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Form = ({
  type,
  editData,
  close,
}: {
  type: "edit" | "new";
  editData?: any;
  close: () => void;
}) => {
  const { register, handleSubmit, formState } = useForm();
  const { createTIPS, updateTIPS, refetchTips, isCreatingTips, isEditingTips } =
    useCustomise();

  // State for the files (images and videos)
  const [files, setFiles] = useState<{ images: File[]; videos: File[] }>({
    images:
      type === "edit"
        ? editData?.media?.filter((file: any) => file.type === "IMAGE")
        : [],
    videos:
      type === "edit"
        ? editData?.media?.filter((file: any) => file.type === "VIDEO")
        : [],
  });

  const [initialFiles, setInitialFiles] = useState<{
    images: File[];
    videos: File[];
  }>({
    images:
      type === "edit"
        ? editData?.media?.filter((file: any) => file.type === "IMAGE")
        : [],
    videos:
      type === "edit"
        ? editData?.media?.filter((file: any) => file.type === "VIDEO")
        : [],
  });

  const [uploadingImage, setUploadingImage] = useState({
    uploading: false,
    new: false,
  });

  // Handle image changes (adding or removing images)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploadingImage({
      uploading: false,
      new: true,
    });
    const newImages = Array.from(e.target.files as FileList);
    setFiles((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages], // Add new images
    }));
  };

  // Handle video changes (adding or removing videos)
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploadingImage({
      uploading: false,
      new: true,
    });

    const newVideos = Array.from(e.target.files as FileList);
    // Filter out the already existing videos
    setFiles((prev) => ({
      ...prev,
      videos: [
        ...prev.videos.filter(
          (video) =>
            !initialFiles.videos.some((initial) => initial.name === video.name)
        ),
        ...newVideos, // Add new videos
      ],
    }));
  };

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleVideoButtonClick = () => {
    videoInputRef.current?.click();
  };

  const { errors } = formState;

  // Handle file uploads
  const uploadFile: any = async () => {
    if (!uploadingImage.new) return;
    try {
      const formData = new FormData();

      const newFiles = [
        ...files.images.filter(
          (file) =>
            !initialFiles.images.some((initial) => initial.name === file.name)
        ),
        ...files.videos.filter(
          (file) =>
            !initialFiles.videos.some((initial) => initial.name === file.name)
        ),
      ];

      if (newFiles.length) {
        newFiles.forEach((file) => formData.append("files", file));

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        return result;
      }

      return { success: true, files: [] }; // If no new files, return empty response
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.message || "File Upload failed");
      return { success: false, files: [] }; // If no new files, return empty response
    } finally {
      setUploadingImage({ ...uploadingImage, uploading: false });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      toast.loading(
        type === "edit" ? "Editing File upload..." : "Uploading new files..."
      );

      let medias: any[] = [];

      try {
        setUploadingImage({ ...uploadingImage, uploading: true });

        // Upload new files (images/videos)
        const media = await uploadFile();

        if (!media.success) {
          toast.remove();
          toast.error("File Upload failed");
          setUploadingImage({ ...uploadingImage, uploading: false });

          return;
        }
        if (media.success) {
          // Combine new files with existing files
          medias = [
            ...initialFiles.images.map((file: any) => ({
              type: "IMAGE",
              url: file.url, // Existing image URLs
            })),
            ...initialFiles.videos.map((file: any) => ({
              type: "VIDEO",
              url: file.url, // Existing video URLs
            })),
            ...media.files.map((med: any) => ({
              type: med.type?.includes("video") ? "VIDEO" : "IMAGE",
              url: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${med.filename}`,
            })),
          ];

          toast.remove();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUploadingImage({ ...uploadingImage, uploading: false });
      }

      // Upload the combined media
      toast.loading(type === "edit" ? "Editing Data..." : "Creating Data...");
      if (type === "edit") {
        await updateTIPS({
          id: editData?._id,
          payload: { ...data, media: medias }, // Combine media files (existing + uploaded)
        });
      } else {
        await createTIPS({ ...data, media: medias }); // Combine media files (existing + uploaded)
      }

      toast.remove();
      toast.success(
        type === "edit" ? "Edit Successful" : "Tips Created successfully"
      );
      refetchTips();
      close();
    } catch (error: any) {
      toast.remove();
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-4 bg-white rounded-md gap-5"
    >
      <Heading
        name={type === "edit" ? "Edit Question" : "Create New Question"}
      />
      <div className="mb-4 mt-8">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Tip Question
        </label>
        <input
          type="text"
          id="question"
          {...register("question", { required: "Enter a valid question" })}
          className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          defaultValue={type === "edit" ? editData?.question : ""}
        />
        {errors.question && (
          <p className="text-red-500 text-xs italic">
            {errors.question.message?.toString()}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Tip Answer
        </label>
        <textarea
          id="answer"
          rows={4}
          cols={4}
          {...register("answer", {
            required: "Describe the the answer",
          })}
          className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          defaultValue={type === "edit" ? editData?.answer : ""}
        />
        {errors.answer && (
          <p className="text-red-500 text-xs italic">
            {errors?.answer?.message?.toString()}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="Category"
        >
          Category
        </label>
        <select
          id=""
          className="w-full border border-gray-500 py-3 rounded-md"
          {...register("category", {
            required: "Select a category",
          })}
          defaultValue={type === "edit" ? editData?.category : ""}
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="general">General</option>
          <option value="customer">Customer</option>
          <option value="contractor">Contractor</option>
        </select>

        {errors.category && (
          <p className="text-red-500 text-xs italic">
            {errors.category.message?.toString()}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="Category"
        >
          Medias
        </label>
        <div className="flex flex-col gap-3">
          <input
            type="file"
            accept="image/*,"
            multiple
            className="hidden"
            ref={imageInputRef}
            onChange={(e) => handleImageChange(e)}
          />
          <input
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            ref={videoInputRef}
            onChange={(e) => handleVideoChange(e)}
          />

          <div className="flex gap-2">
            {files?.images?.map((file: any, index) => (
              <div key={index} className="relative shadow-lg">
                {file instanceof File ? (
                  <Image
                    src={URL.createObjectURL(file)} // Create an object URL only for File objects
                    alt="Uploaded File"
                    width={40}
                    height={20}
                  />
                ) : (
                  <Image
                    src={file?.url} // Use the URL if it's already a URL (for previously uploaded files)
                    alt={file?.name || "Uploaded File"}
                    width={40}
                    height={20}
                  />
                )}

                <button
                  className="border-gray-800 bg-gray-800 text-white h-5 w-5 items-center justify-center rounded-full absolute top-[-4px] right-[-4px]"
                  onClick={(e) => {
                    e.preventDefault();
                    setFiles((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }));
                  }}
                >
                  <span>x</span>
                </button>
              </div>
            ))}

            {files?.videos?.map((file: any, index) => (
              <div key={index} className="relative shadow-lg">
                {file instanceof File ? (
                  <video width="150" height="100" controls>
                    <source src={URL.createObjectURL(file)} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <video width="150" height="100" controls>
                    <source src={file?.url} type={file?.type} />
                    Your browser does not support the video tag.
                  </video>
                )}

                <button
                  className="border-gray-800 bg-gray-800 text-white h-5 w-5 flex items-center justify-center rounded-full absolute top-[-4px] right-[-4px]"
                  onClick={(e) => {
                    e.preventDefault();
                    setFiles((prev) => ({
                      ...prev,
                      videos: prev.videos.filter((_, i) => i !== index),
                    }));
                  }}
                >
                  <span>x</span>
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="border-gray-800 border bg-transparent rounded-xl justify-center items-center gap-3 text-gray-800 px-4 py-2 flex "
              onClick={(e) => {
                e.preventDefault();
                handleImageButtonClick();
              }}
            >
              <Image
                src="/uploadIcon.png"
                height={28}
                width={28}
                alt="Upload icon"
              />
              <span>Select Image</span>
            </button>
            <button
              className="border-gray-800 bg-blue-400 justify-center rounded-xl  items-center gap-3 text-white px-4 py-2 flex "
              onClick={(e) => {
                e.preventDefault();
                handleVideoButtonClick();
              }}
            >
              <Image
                src="/uploadIcon.png"
                height={28}
                width={28}
                alt="Upload icon"
              />
              <span>Select Video</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <SubmitBtn
          isSubmitting={
            isCreatingTips || isEditingTips || uploadingImage.uploading
          }
        >
          Submit
        </SubmitBtn>
      </div>
    </form>
  );
};
