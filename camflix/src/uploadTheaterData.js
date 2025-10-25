import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import theaterData from "./theaterData.json"; // your JSON file

export async function uploadTheaterData() {
  try {
    for (const cityObj of theaterData) {
      const cityRef = doc(collection(db, "cities"), cityObj.city);
      await setDoc(cityRef, cityObj);
      console.log(`✅ Uploaded data for ${cityObj.city}`);
    }
    console.log("🎉 All data uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading data:", error);
  }
}
