import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc, runTransaction } from "firebase/firestore";

export async function getNextUserId(): Promise<string> {
  const counterRef = doc(db, "counters", "users");

  const nextId = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let newNumber = 1;

    if (!counterDoc.exists()) {
      // Initialize the counter if it doesn't exist
      transaction.set(counterRef, { lastUserNumber: 1 });
    } else {
      const last = counterDoc.data().lastUserNumber || 0;
      newNumber = last + 1;
      transaction.update(counterRef, { lastUserNumber: newNumber });
    }

    return newNumber;
  });

  // Format like USER001, USER002, etc.
  return `USER${String(nextId).padStart(3, "0")}`;
}
