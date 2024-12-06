import { useEffect, useMemo, useState } from "react";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useAWSContext } from "@/contexts/aws-context.provider";
import { useAuthContext } from "@/contexts";
import { calculateProfileCompletion } from "@/utils/profile";
import { SelectItem } from "@/components/ui/select";
import { Platform } from "react-native";
import { NativeAssetItem, WebAssetItem } from "@/types/Asset";

const useEditProfile = () => {
  const {
    user,
    updateUser,
    verifyEmail,
  } = useAuthContext();
  const {
    uploadFile,
    uploadFileUri,
  } = useAWSContext();

  const [attachments, setAttachments] = useState<any[]>([]);
  const [nativeAssets, setNativeAssets] = useState<NativeAssetItem[]>([]);
  const [webAssets, setWebAssets] = useState<WebAssetItem[]>([]);
  const [content, setContent] = useState({
    about: '',
    socialMediaHighlight: '',
    collaborationGoals: '',
    audienceInsights: '',
    funFactAboutUser: '',
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [niches, setNiches] = useState<SelectItem[]>([]);
  const [processMessage, setProcessMessage] = useState('');
  const [processPercentage, setProcessPercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const contents: {
    content: string;
    defaultContent: string;
    key: string;
    title: string;
  }[] = useMemo(() => [
    {
      key: 'about',
      title: 'About Me',
      defaultContent: "Add something about yourself here",
      content: content.about,
    },
    {
      key: 'socialMediaHighlight',
      title: 'Social Media Highlight',
      defaultContent: "Brags about your social media to the brands",
      content: content.socialMediaHighlight,
    },
    {
      key: 'collaborationGoals',
      title: 'Collaboration Goals',
      defaultContent: "Write in brief what are you looking for in your next Collaboration",
      content: content.collaborationGoals,
    },
    {
      key: 'audienceInsights',
      title: 'Audience Insights',
      defaultContent: "Who are your usual audiences on your social media",
      content: content.audienceInsights,
    },
    {
      key: 'funFactAboutUser',
      title: 'Fun Fact About You',
      defaultContent: "Tell anything fun about yourself. A little personalisation helps in conversions",
      content: content.funFactAboutUser,
    },
  ], [content]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
      setNiches(user.profile!.category!.map((category) => ({ label: category, value: category })));
      // TODO: Fix this
      // @ts-ignore
      setContent(user?.profile?.content);
      // @ts-ignore
      setAttachments(user.profile?.attachments);
    }
  }, [user]);

  const handleAssetsUpdateNative = (items: NativeAssetItem[]) => {
    setNativeAssets(items);
  }

  const handleAssetsUpdateWeb = (items: WebAssetItem[]) => {
    setWebAssets(items);
  }

  const handleNicheSelect = (niche: SelectItem[]) => {
    setNiches(niche);
  }

  const uploadNewAssets = async () => {
    let uploadedAssets = [];

    if (Platform.OS === 'web') {
      for (const asset of webAssets) {
        if (typeof asset.url === 'string' && asset.url.includes('http')) {
          const attachment = attachments.find(attachment => (
            asset.url === attachment.imageUrl || asset.url === attachment.playUrl || asset.url === attachment.appleUrl
          ));

          uploadedAssets.push(attachment);
        } else if (asset.url instanceof File) {
          const uploadAsset = await uploadFile(asset.url as File);

          uploadedAssets.push(uploadAsset);
        } else {
          continue;
        }
      };
    } else {
      const filteredAssets = nativeAssets.filter(asset => asset.url !== '');
      for (const asset of filteredAssets) {
        if (asset.url.includes('http')) {
          const attachment = attachments.find(attachment => (
            asset.url === attachment.imageUrl || asset.url === attachment.playUrl || asset.url === attachment.appleUrl
          ));

          uploadedAssets.push(attachment);
        } else if (asset.type === 'video') {
          const uploadAsset = await uploadFileUri({
            id: asset.url,
            type: 'video',
            localUri: asset.url,
            uri: asset.url,
          });

          uploadedAssets.push(uploadAsset);
        } else {
          const uploadAsset = await uploadFileUri({
            id: asset.url,
            type: 'image',
            localUri: asset.url,
            uri: asset.url,
          });

          uploadedAssets.push(uploadAsset);
        }
      };
    }

    return uploadedAssets;
  }

  const handleSave = async () => {
    if (!user) {
      Toaster.error('User not found');
      return;
    };

    setIsProcessing(true);
    setProcessMessage('Saving profile attachments...');
    setProcessPercentage(20);

    // Upload assets to aws s3
    const uploadedAssets = await uploadNewAssets();

    setProcessMessage('Saved profile attachments...');
    setProcessPercentage(70);

    // Calculate profile completion
    const completionPercentage = calculateProfileCompletion({
      name,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      category: niches.map(niche => niche.value),
      content,
      attachments: uploadedAssets,
    });

    setProcessMessage('Saving profile...');
    setProcessPercentage(100);
    await updateUser(user?.id, {
      name,
      email,
      phoneNumber,
      profile: {
        category: niches.map(niche => niche.value),
        content,
        attachments: uploadedAssets,
        completionPercentage,
      },
    }).then(() => {
      Toaster.success('Profile saved successfully');
    }).catch((error) => {
      Toaster.error('Failed to save profile');
    }).finally(() => {
      setProcessPercentage(0);
      setProcessMessage('');
      setIsProcessing(false);
    });
  }

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
    user,
    verifyEmail,
  }
};

export default useEditProfile;
