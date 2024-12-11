import { useState } from "react";
import { ScrollView } from "react-native";
import Select, { SelectItem } from "@/components/ui/select";
import SelectGroup from "@/components/ui/select/select-group";
import { MultiRangeSlider } from "@/components/ui/multislider";
import { Selector } from "@/components/ui/select/selector";
import { faDollarSign, faVideo } from "@fortawesome/free-solid-svg-icons";
import ContentWrapper from "./content-wrapper";
import { SearchAdd } from "@/shared-uis/components/search-add";
import { useTheme } from "@react-navigation/native";
import { BRAND_INDUSTRIES, LANGUAGES } from "@/constants/ItemsList";
import { useAuthContext } from "@/contexts";
import { includeSelectedItems } from "@/utils/items-list";

const Preferences: React.FC = () => {
  const {
    user,
  } = useAuthContext();

  const theme = useTheme();

  const [preferredCollaborationType, setPreferredCollaborationType] = useState({
    label: 'Barter & Paid Both',
    value: 'Barter & Paid Both',
  });
  const [goal, setGoal] = useState({
    label: 'Long Term',
    value: 'Long Term',
  });
  const [contentWillingToPost, setContentWillingToPost] = useState<SelectItem[]>([]);
  const [preferredVideoType, setPreferredVideoType] = useState({
    label: 'Integrated Video',
    value: 'Integrated Video',
  });
  const [budgetForPaidCollabs, setBudgetForPaidCollabs] = useState([0, 100]);
  const [maximumMonthlyCollabs, setMaximumMonthlyCollabs] = useState([0, 100]);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'English',
    'Hindi',
    'Marwadi',
  ]);

  const [selectedBrandIndustries, setSelectedBrandIndustries] = useState<string[]>([
    'Fashion',
    'Lifestyle',
    'Food',
    'Travel',
    'Health',
  ]);

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
              icon: faVideo,
              label: 'Barter & Paid Both',
              value: 'Barter & Paid Both',
            },
            {
              icon: faDollarSign,
              label: 'Just Paid Collabs',
              value: 'Just Paid Collabs',
            },
          ]}
          onSelect={(value) => {
            setPreferredCollaborationType({
              label: value,
              value,
            });
          }}
          selectedValue={preferredCollaborationType.value}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Preferred Brand Industry"
        description="Specifying the industry will help us match better with relevant brands."
      >
        <SearchAdd
          buttonLabel="Add Brand Industry"
          initialItemsList={includeSelectedItems(BRAND_INDUSTRIES, selectedBrandIndustries)}
          onSelectedItemsChange={setSelectedBrandIndustries}
          selectedItems={selectedBrandIndustries}
          theme={theme}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Budget for Paid Collabs"
        description="This budget would help us understand your need hence show better suggestions."
        rightText={`$${budgetForPaidCollabs[0]}-${budgetForPaidCollabs[1]}`}
      >
        <MultiRangeSlider
          containerStyle={{
            paddingHorizontal: 16,
          }}
          sliderLength={336}
          maxValue={100}
          minValue={0}
          onValuesChange={(values) => {
            setBudgetForPaidCollabs(values);
          }}
          values={budgetForPaidCollabs}
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
          selectedItem={goal}
          onValueChange={(value) => {
            setGoal(value);
          }}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Maximum Monthly Collabs"
        description="Limit your monthly collab to have a good balance between your own content to campaign contents."
        rightText={`${maximumMonthlyCollabs[0]}-${maximumMonthlyCollabs[1]}`}
      >
        <MultiRangeSlider
          containerStyle={{
            paddingHorizontal: 16,
          }}
          sliderLength={336}
          maxValue={100}
          minValue={0}
          onValuesChange={(values) => {
            setMaximumMonthlyCollabs(values);
          }}
          values={maximumMonthlyCollabs}
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
          value={contentWillingToPost}
          multiselect
          onSelect={(item) => {
            setContentWillingToPost(item);
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
          selectedItem={preferredVideoType}
          onValueChange={(value) => {
            setPreferredVideoType(value);
          }}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Language Used for content creation"
        description="Which language do you create your content in? Is it local language or maybe mix og multiple languages"
      >
        <SearchAdd
          buttonLabel="Add Language"
          initialItemsList={includeSelectedItems(LANGUAGES, selectedLanguages)}
          onSelectedItemsChange={setSelectedLanguages}
          selectedItems={selectedLanguages}
          theme={theme}
        />
      </ContentWrapper>
    </ScrollView>
  );
};

export default Preferences;
