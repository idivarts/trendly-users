import { getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseApp } from "./firebase";

const analyticsWeb = getAnalytics(FirebaseApp);

export default analyticsWeb;
