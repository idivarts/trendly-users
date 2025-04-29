import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
;

import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";

interface BrandContextProps {
  getBrandById: (brandId: string) => Promise<IBrands>;
}

const BrandContext = createContext<BrandContextProps>({
  getBrandById: async () => ({} as IBrands),
});

export const useBrandContext = () => useContext(BrandContext);

export const BrandContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const getBrandById = async (brandId: string) => {
    const brandRef = doc(FirestoreDB, "brands", brandId);
    const brandSnap = await getDoc(brandRef);

    return brandSnap.data() as IBrands
  }

  return (
    <BrandContext.Provider
      value={{
        getBrandById,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};
