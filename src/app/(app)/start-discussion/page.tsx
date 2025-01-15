"use client";
import { toast } from "@/hooks/use-toast";
import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface StartDiscussionForm {
  query: string;
  description: string;
}

const StartDiscussion = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isImageUpload, setIsImageUpload] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StartDiscussionForm>();

  const router = useRouter();
  const [isQuerySubmitting, setIsQuerySubmitting] = useState(false);
  const { data: session } = useSession();

  const onSubmit: SubmitHandler<StartDiscussionForm> = async (data) => {
    if (!session?.user?._id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a query.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsQuerySubmitting(true);
      const formData = {
        title: data.query,
        description: data.description,
        imgUrl,
        owner: session.user._id,
      };
      const generatedQuery = await axios.post("/api/create-query", formData);
      if (generatedQuery.status === 201) {
        toast({
          title: "Success",
          description: generatedQuery.data.message,
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Failure",
        description: "Could not add your query.",
        variant: "destructive",
      });
      console.log("Error while generating query: ", error);
    } finally {
      reset(); // Reset form fields
      setIsQuerySubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-2xl mx-4 p-8 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Start a Discussion
          </h1>
          <p className="text-gray-700 mt-2">
            Share your query to get insights!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Query Field */}
          <div>
            <label
              htmlFor="query"
              className="block text-sm font-medium text-gray-800"
            >
              Query
            </label>
            <textarea
              id="query"
              {...register("query", { required: "Query is required" })}
              rows={6}
              className="mt-2 p-4 block w-full rounded-md bg-white border border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm placeholder-gray-400"
              placeholder="Write your query here..."
            ></textarea>
            {errors.query && (
              <p className="text-sm text-red-600 mt-2">
                {errors.query.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-800"
            >
              Description
            </label>
            <input
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
              type="text"
              className="mt-2 p-4 block w-full rounded-md bg-white border border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm placeholder-gray-400"
              placeholder="Provide a brief description..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-2">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <UploadButton
            endpoint="imageUploader"
            onUploadBegin={()=> {
              setIsImageUpload(true)
            }}
            onClientUploadComplete={(res) => {
              setImgUrl(res[0]?.url);
              setIsImageUpload(false)
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            className="py-2 px-6 bg-gray-600 text-white font-medium rounded-md shadow-sm hover:bg-gray-800 transition"
          />

          {imgUrl && (
            <div className="mt-4">
              <img
                src={imgUrl}
                className="w-full h-40 object-cover rounded-md border border-gray-300"
                alt="Uploaded"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isQuerySubmitting || isImageUpload}
            className="w-full bg-black text-white font-semibold py-3 px-6 rounded-md shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Submitting..." : "Submit Query"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartDiscussion;
