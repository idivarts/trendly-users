import { AuthApp } from "@/utils/auth";
import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

interface AWSContextProps {
  getBlob: (fileUri: any) => Promise<Blob>;
  processMessage: string;
  processPercentage: number;
  setProcessMessage: (message: string) => void;
  setProcessPercentage: (percentage: number) => void;
  uploadFile: (file: File) => Promise<any>;
  uploadFiles: (files: File[]) => Promise<any[]>;
  uploadFileUri: (fileUri: any) => Promise<any>;
  uploadFileUris: (fileUris: any[]) => Promise<any[]>;
}

const AWSContext = createContext<AWSContextProps>(null!);

export const useAWSContext = () => useContext(AWSContext);

export const AWSContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [processMessage, setProcessMessage] = useState<string>("");
  const [processPercentage, setProcessPercentage] = useState<number>(0);

  const preUploadRequestUrl = (file: File): string => {
    const date = new Date().getTime();
    const baseUrl = 'https://be.trendly.pro/s3/v1/';
    const type = file.type.includes("video") ? "videos" : "images";
    const filename = `${date}.${file.type.split("/")[1]}`;

    return `${baseUrl}${type}?filename=${filename}`;
  }

  const getFileUrlFromPhotoUri = async (uri: string): Promise<string> => {
    if (Platform.OS !== "ios") return uri;

    if (uri.startsWith("ph://")) {
      try {
        // Extract asset ID from ph:// URI
        const assetId = uri.replace("ph://", "");
        const asset = await MediaLibrary.getAssetInfoAsync(assetId);

        if (!asset?.localUri) {
          throw new Error("Could not get local URI for video");
        }

        return asset.localUri;
      } catch (error) {
        console.error("Error converting ph:// URI:", error);
        throw new Error("Failed to access video file");
      }
    }

    return uri;
  };

  const getBlob = async (fileUri: any): Promise<Blob> => {
    if (fileUri.type === "video") {
      const actualFileUri = await getFileUrlFromPhotoUri(fileUri.id);

      const videoInfo = await FileSystem.getInfoAsync(actualFileUri);
      if (!videoInfo.exists) {
        throw new Error("Video file does not exist");
      }

      const response = await fetch(actualFileUri);
      const blog = await response.blob();

      // if (blog.size > FILE_SIZE) {
      //   Toaster.error("File size exceeds 10MB limit");
      //   return;
      // }

      return blog;
    } else {
      const response = await fetch(fileUri.id);
      const blob = await response.blob();

      return blob;
    }
  }

  const uploadFileUri = async (fileUri: any): Promise<any> => {
    const preUploadUrlResponse = await fetch(
      preUploadRequestUrl(fileUri),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AuthApp.currentUser?.uid}`,
        },
      }
    );

    const preUploadUrl = await preUploadUrlResponse.json();

    const uploadURL = preUploadUrl.uploadUrl;

    const blob = await getBlob(fileUri);

    const response = await fetch(uploadURL, {
      method: "PUT",
      headers: {
        "Content-Type": fileUri.type, // "image/jpeg" or "video/mp4"
      },
      body: blob,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    if (fileUri.type.includes("video")) {
      return {
        appleUrl: preUploadUrl.appleUrl,
        playUrl: preUploadUrl.playUrl,
        type: "video",
      };
    } else {
      return {
        imageUrl: preUploadUrl.imageUrl,
        type: "image",
      };
    }
  }

  const uploadFileUris = async (fileUris: any[]): Promise<any[]> => {
    try {
      const uploadedFiles: any[] = [];
      const totalProgress = 100 / fileUris.length;

      for (const fileUri of fileUris) {
        setProcessMessage(`Uploading ${fileUri}`);
        const result = await uploadFileUri(fileUri);
        setProcessPercentage((prev) => Math.ceil(Math.round((prev + totalProgress))));
        uploadedFiles.push(result);
      }

      setProcessMessage("Uploaded Successfully - Processing files");
      setProcessPercentage(100);

      return uploadedFiles;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload files");
    }
  }

  const uploadFile = async (file: File): Promise<any> => {
    try {
      // if (file.size > FILE_SIZE) {
      //   Toaster.error("File size limit exceeded");
      //   return;
      // }

      const preUploadUrlResponse = await fetch(
        preUploadRequestUrl(file),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AuthApp.currentUser?.uid}`,
          },
        },
      );

      const preUploadUrl = await preUploadUrlResponse.json();

      const response = await fetch(preUploadUrl.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      if (file.type.includes("video")) {
        return {
          appleUrl: preUploadUrl.appleUrl,
          playUrl: preUploadUrl.playUrl,
          type: "video",
        };
      } else {
        return {
          imageUrl: preUploadUrl.imageUrl,
          type: "image",
        };
      }
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error("Failed to upload file");
    }
  }

  const uploadFiles = async (
    files: File[],
  ): Promise<any[]> => {
    try {
      const uploadedFiles: any[] = [];
      const totalProgress = 100 / files.length;

      for (const file of files) {
        setProcessMessage(`Uploading ${file.name}`);
        const result = await uploadFile(file);
        setProcessPercentage((prev) => Math.ceil(Math.round((prev + totalProgress))));
        uploadedFiles.push(result);
      }

      setProcessMessage("Uploaded Successfully - Processing files");
      setProcessPercentage(100);

      return uploadedFiles;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload files");
    }
  };

  return (
    <AWSContext.Provider
      value={{
        getBlob,
        processMessage,
        processPercentage,
        setProcessMessage,
        setProcessPercentage,
        uploadFile,
        uploadFiles,
        uploadFileUri,
        uploadFileUris,
      }}
    >
      {children}
    </AWSContext.Provider>
  );
};