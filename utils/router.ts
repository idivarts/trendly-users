import { Console } from "@/shared-libs/utils/console";
import { Href, router } from "expo-router";

export const resetAndNavigate = (newPath: Href) => {
  try {
    router.dismissAll();
  } catch (e) {
    Console.log("resetAndNavigate - dismissAll failed", e)
  }

  router.replace(newPath);
};
