import { useEffect, useState } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";
import Select from "@/components/ui/select";
import SelectGroup from "@/components/ui/select/select-group";
import { MultiRangeSlider } from "@/components/ui/multislider";
import { Selector } from "@/components/ui/select/selector";
import { faGift, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@react-navigation/native";
import { BRAND_INDUSTRIES, INITIAL_BRAND_INDUSTRIES, INITIAL_LANGUAGES, LANGUAGES } from "@/constants/ItemsList";
import { includeSelectedItems } from "@/utils/items-list";
import { User } from "@/types/User";
import ContentWrapper from "@/components/ui/content-wrapper";
import { IPreferences } from "@/shared-libs/firestore/trendly-pro/models/users";
import { MultiSelectExtendable } from "@/shared-uis/components/multiselect-extendable";

interface PreferencesProps {
  user: User;
  onSave: (user: User) => void;
}

const Preferences: React.FC<PreferencesProps> = ({
  user,
  onSave,
}) => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();

  const [preferences, setPreferences] = useState<IPreferences>({
    budgetForPaidCollabs: user.preferences?.budgetForPaidCollabs || [0, 100],
    contentCategory: user.preferences?.contentCategory || [],
    contentWillingToPost: user.preferences?.contentWillingToPost || ['Post'],
    goal: user.preferences?.goal || 'Long Term',
    maximumMonthlyCollabs: user.preferences?.maximumMonthlyCollabs || [0, 100],
    preferredBrandIndustries: user.preferences?.preferredBrandIndustries || ['Fashion', 'Lifestyle', 'Food', 'Travel', 'Health'],
    preferredCollaborationType: user.preferences?.preferredCollaborationType || 'Barter & Paid Both',
    preferredLanguages: user.preferences?.preferredLanguages || ['English', 'Hindi', 'Bengali'],
    preferredVideoType: user.preferences?.preferredVideoType || 'Integrated Video',
  });

  const handleOnSave = () => {
    const updatedUser = {
      ...user,
      preferences,
    };
    onSave(updatedUser);
  }

  useEffect(() => {
    handleOnSave();
  }, [preferences]);

  return (
    <ScrollView
      style={{
        padding: 16,
        flex: 1,
      }}
      contentContainerStyle={{
        paddingBottom: 80,
        gap: 46,
      }}
    >
      <ContentWrapper
        title="Preferred Collaboration Type"
        description="Recommended to select Barter and Paid collabs both if you don't want to miss on interesting collabs to grow your reach."
      >
        <Selector
          options={[
            {
              icon: faGift,
              label: 'Barter & Paid Both',
              value: 'Barter & Paid Both',
            },
            {
              icon: faHandHoldingDollar,
              label: 'Just Paid Collabs',
              value: 'Just Paid Collabs',
            },
          ]}
          onSelect={(value) => {
            setPreferences({
              ...preferences,
              preferredCollaborationType: value,
            });
          }}
          selectedValue={preferences.preferredCollaborationType}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Preferred Brand Industry"
        description="Specifying the industry will help us match better with relevant brands."
      >
        <MultiSelectExtendable
          buttonLabel="Add Brand Industry"
          initialItemsList={includeSelectedItems(BRAND_INDUSTRIES, preferences.preferredBrandIndustries || [])}
          initialMultiselectItemsList={includeSelectedItems(INITIAL_BRAND_INDUSTRIES, preferences.preferredBrandIndustries || [])}
          onSelectedItemsChange={(value) => {
            setPreferences({
              ...preferences,
              preferredBrandIndustries: value.map((value) => value),
            });
          }}
          selectedItems={preferences.preferredBrandIndustries || []}
          theme={theme}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Budget for Paid Collabs"
        description="This budget would help us understand your need hence show better suggestions."
        rightText={`$${preferences?.budgetForPaidCollabs?.[0]}-${preferences.budgetForPaidCollabs?.[1]}`}
      >
        <MultiRangeSlider
          containerStyle={{
            paddingHorizontal: 8,
          }}
          sliderLength={Platform.OS === "web" ? dimensions.width - 48 : 352}
          maxValue={100}
          minValue={0}
          onValuesChange={(values) => {
            setPreferences({
              ...preferences,
              budgetForPaidCollabs: values,
            });
          }}
          values={preferences.budgetForPaidCollabs || [0, 100]}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Match with Brands looking for"
        description="What kind of relation you are looking for with the brands."
      >
        <SelectGroup
          items={[
            { label: 'Long Term', value: 'Long Term' },
            { label: 'Short Term', value: 'Short Term' },
            { label: 'One Time', value: 'One Time' },
          ]}
          selectedItem={{
            label: preferences.goal || 'Long Term',
            value: preferences.goal || 'Long Term',
          }}
          onValueChange={(item) => {
            setPreferences({
              ...preferences,
              goal: item.value,
            });
          }}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Maximum Monthly Collabs"
        description="Limit your monthly collab to have a good balance between your own content to campaign contents."
        rightText={`${preferences.maximumMonthlyCollabs?.[0] || 0}-${preferences.maximumMonthlyCollabs?.[1] || 100}`}
      >
        <MultiRangeSlider
          containerStyle={{
            paddingHorizontal: 8,
          }}
          sliderLength={Platform.OS === "web" ? dimensions.width - 48 : 352}
          maxValue={100}
          minValue={0}
          onValuesChange={(values) => {
            setPreferences({
              ...preferences,
              maximumMonthlyCollabs: values,
            });
          }}
          values={preferences.maximumMonthlyCollabs || [0, 100]}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Content Willing to Post"
        description="Which content format are you willing to post on your social media account for promotions."
      >
        <Select
          items={[
            { label: 'Post', value: 'Post' },
            { label: 'Reels', value: 'Reels' },
            { label: 'Stories', value: 'Stories' },
            { label: 'Videos', value: 'Videos' },
            { label: 'Live', value: 'Live' },
          ]}
          selectItemIcon={true}
          value={preferences?.contentWillingToPost?.map((item) => ({
            label: item,
            value: item,
          })) || []}
          multiselect
          onSelect={(item) => {
            setPreferences({
              ...preferences,
              contentWillingToPost: item.map((item) => item.value),
            });
          }}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Video Type (preferred)"
        description={`What is your preferred type of video creations.${"\n"}Integrated Video - Means your video will be focusing on your content with just a short note about campaign${"\n"}Dedicated Video - Videos like beauty product reviews or GRWM of an cloth or accessories`}
      >
        <SelectGroup
          items={[
            { label: 'Integrated Video', value: 'Integrated Video' },
            { label: 'Dedicated Video', value: 'Dedicated Video' },
          ]}
          selectedItem={{
            label: preferences.preferredVideoType || 'Integrated Video',
            value: preferences.preferredVideoType || 'Integrated Video',
          }}
          onValueChange={(item) => {
            setPreferences({
              ...preferences,
              preferredVideoType: item.value,
            });
          }}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Language Used for content creation"
        description="Which language do you create your content in? Is it local language or maybe mix og multiple languages"
      >
        <MultiSelectExtendable
          buttonLabel="Add Language"
          initialItemsList={includeSelectedItems(LANGUAGES, preferences.preferredLanguages || [])}
          initialMultiselectItemsList={INITIAL_LANGUAGES}
          onSelectedItemsChange={(value) => {
            setPreferences({
              ...preferences,
              preferredLanguages: value.map((value) => value),
            });
          }}
          selectedItems={preferences.preferredLanguages || []}
          theme={theme}
        />
      </ContentWrapper>
    </ScrollView>
  );
};

export default Preferences;
