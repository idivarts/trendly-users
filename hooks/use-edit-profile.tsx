import { SelectItem } from "@/components/ui/select";
import { useAuthContext } from "@/contexts";
import { useAWSContext } from "@/contexts/aws-context.provider";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { NativeAssetItem, WebAssetItem } from "@/types/Asset";
import { calculateProfileCompletion } from "@/utils/profile";
import { useEffect, useMemo, useState } from "react";
import useProcess from "./use-process";

interface UseEditProfileProps {
  unsavedChanges?: boolean;
  setUnsavedChanges?: React.Dispatch<React.SetStateAction<boolean>>;
}

const useEditProfile = ({
  unsavedChanges,
  setUnsavedChanges,
}: UseEditProfileProps) => {
  const { user, updateUser, verifyEmail } = useAuthContext();
  const { uploadNewAssets } = useAWSContext();

  const {
    isProcessing,
    processMessage,
    processPercentage,
    setIsProcessing,
    setProcessMessage,
    setProcessPercentage,
  } = useProcess();

  const [attachments, setAttachments] = useState<any[]>([]);
  const [nativeAssets, setNativeAssets] = useState<NativeAssetItem[]>([]);
  const [webAssets, setWebAssets] = useState<WebAssetItem[]>([]);
  const [content, setContent] = useState({
    about: "",
    socialMediaHighlight: "",
    collaborationGoals: "",
    audienceInsights: "",
    funFactAboutUser: "",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timeCommitment, setTimeCommitment] = useState({
    label: "Full Time",
    value: "Full Time",
  });
  const [niches, setNiches] = useState<SelectItem[]>([]);

  const contents: {
    content: string;
    defaultContent: string;
    key: string;
    title: string;
  }[] = useMemo(
    () => [
      {
        key: "about",
        title: "About Me",
        defaultContent: "Add something about yourself here",
        content: content.about,
      },
      {
        key: "socialMediaHighlight",
        title: "Social Media Highlight",
        defaultContent: "Brags about your social media to the brands",
        content: content.socialMediaHighlight,
      },
      {
        key: "collaborationGoals",
        title: "Collaboration Goals",
        defaultContent:
          "Write in brief what are you looking for in your next Collaboration",
        content: content.collaborationGoals,
      },
      {
        key: "audienceInsights",
        title: "Audience Insights",
        defaultContent: "Who are your usual audiences on your social media",
        content: content.audienceInsights,
      },
      {
        key: "funFactAboutUser",
        title: "Fun Fact About You",
        defaultContent:
          "Tell anything fun about yourself. A little personalisation helps in conversions",
        content: content.funFactAboutUser,
      },
    ],
    [content]
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setNiches(
        user.profile?.category?.map((category) => ({
          label: category,
          value: category,
        })) || []
      );
      // TODO: Fix this
      // @ts-ignore
      setContent(user?.profile?.content);
      // @ts-ignore
      setAttachments(user.profile?.attachments);

      setTimeCommitment({
        label: user.profile?.timeCommitment || "Full Time",
        value: user.profile?.timeCommitment || "Full Time",
      });
    }
  }, [user]);

  const handleAssetsUpdateNative = (items: NativeAssetItem[]) => {
    setNativeAssets(items);
    if (nativeAssets.length !== 0 && setUnsavedChanges) setUnsavedChanges(true);
  };

  const handleAssetsUpdateWeb = (items: WebAssetItem[]) => {
    setWebAssets(items);
    setUnsavedChanges && setUnsavedChanges(true);
  };

  const handleNicheSelect = (niche: SelectItem[]) => {
    setNiches(niche);
    setUnsavedChanges && setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!user) {
      Toaster.error("User not found");
      return;
    }

    setIsProcessing(true);
    setProcessMessage("Saving profile attachments...");
    setProcessPercentage(20);

    // Upload assets to aws s3
    const uploadedAssets = await uploadNewAssets(
      attachments,
      nativeAssets,
      webAssets
    );

    setProcessMessage("Saved profile attachments...");
    setProcessPercentage(70);

    // Calculate profile completion
    const completionPercentage = calculateProfileCompletion({
      name,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      category: niches.map((niche) => niche.value),
      content,
      attachments: uploadedAssets,
    });

    setProcessMessage("Saving profile...");
    setProcessPercentage(95);
    await updateUser(user?.id, {
      name,
      email,
      phoneNumber,
      profile: {
        category: niches.map((niche) => niche.value),
        content,
        attachments: uploadedAssets,
        timeCommitment: timeCommitment.value,
        completionPercentage,
      },
    })
      .then(() => {
        Toaster.success("Profile saved successfully");
        setUnsavedChanges && setUnsavedChanges(false);
      })
      .catch((error) => {
        Toaster.error("Failed to save profile");
      })
      .finally(() => {
        setProcessPercentage(0);
        setProcessMessage("");
        setIsProcessing(false);
      });
  };

  return {
    contents,
    email,
    handleAssetsUpdateNative,
    handleAssetsUpdateWeb,
    handleNicheSelect,
    handleSave,
    isProcessing,
    name,
    nativeAssets,
    niches,
    phoneNumber,
    processMessage,
    processPercentage,
    setEmail,
    setName,
    setPhoneNumber,
    setTimeCommitment,
    timeCommitment,
    user,
    verifyEmail,
  };
};

export default useEditProfile;
