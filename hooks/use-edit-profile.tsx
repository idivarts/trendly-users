import { SelectItem } from "@/components/ui/select";
import { useAuthContext } from "@/contexts";
import { PersistentStorage } from "@/shared-libs/utils/persistent-storage";
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

  const {
    isProcessing,
    processMessage,
    processPercentage,
    setIsProcessing,
    setProcessMessage,
    setProcessPercentage,
  } = useProcess();

  // const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [nativeAssets, setNativeAssets] = useState<NativeAssetItem[]>([]);
  const [webAssets, setWebAssets] = useState<WebAssetItem[]>([]);
  const [content, setContent] = useState({
    about: "",
    socialMediaHighlight: "",
    collaborationGoals: "",
    audienceInsights: "",
    funFactAboutUser: "",
    influencerConectionGoals: ""
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timeCommitment, setTimeCommitment] = useState({
    label: "Full Time",
    value: "Full Time",
  });
  const [niches, setNiches] = useState<SelectItem[]>([]);
  const [location, setLocation] = useState(user?.location || "");

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
        key: "influencerConectionGoals",
        title: "Influencer Connection Goals",
        defaultContent:
          "Open to collabs or networking with other influencers? Mention what you are looking for.",
        content: content.influencerConectionGoals,
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
      setContent(user.profile?.content);
      setLocation(user.location || "");

      // setAttachments(user.profile?.attachments || [])

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

  const handleSave = async (showToast = true) => {
    if (!user) {
      Toaster.error("User not found");
      return;
    }

    setIsProcessing(true);
    // setProcessMessage("Saving profile attachments...");
    setProcessPercentage(20);

    const completionPercentage = calculateProfileCompletion({
      ...user,
      name,
      email,
      phoneNumber,
      location,
      profile: {
        ...user.profile,
        category: niches.map((niche) => niche.value),
        timeCommitment: timeCommitment.value,
      },
    });

    setProcessMessage("Saving profile...");
    setProcessPercentage(95);
    await updateUser(user?.id, {
      name,
      email,
      phoneNumber,
      location,
      profile: {
        ...user.profile,
        category: niches.map((niche) => niche.value),
        timeCommitment: timeCommitment.value,
        completionPercentage
        // attachments: attachments
      },
    })
      .then(() => {
        if (showToast)
          Toaster.success("Profile saved successfully");
        setUnsavedChanges && setUnsavedChanges(false);
        PersistentStorage.clear("matchmaking_influencers");
      })
      .catch((error) => {
        if (showToast)
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
    location,
    setLocation,
    // setAttachments
  };
};

export default useEditProfile;
