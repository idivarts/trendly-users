import {
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";
import { updateDoc, doc } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";

import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";

interface ContractContextProps {
  updateContract: (
    contractId: string,
    contract: Partial<IContracts>
  ) => Promise<void>;
}

const ContractContext = createContext<ContractContextProps>({
  updateContract: () => Promise.resolve(),
});

export const useContractContext = () => useContext(ContractContext);

export const ContractContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const updateContract = async (
    contractId: string,
    contract: Partial<IContracts>,
  ) => {
    const contractRef = doc(FirestoreDB, "contracts", contractId);

    await updateDoc(contractRef, {
      ...contract,
    });
  }

  return (
    <ContractContext.Provider
      value={{
        updateContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};