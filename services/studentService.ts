import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { StudentRecord, ProficiencyLevel } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const subscribeToStudents = (callback: (students: StudentRecord[]) => void) => {
  if (!auth.currentUser) return () => {};

  const q = query(
    collection(db, 'students'),
    where('ownerId', '==', auth.currentUser.uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const students: StudentRecord[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudentRecord));
    callback(students);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'students');
  });
};

export const addStudentRecord = async (name: string, score: number, level: ProficiencyLevel) => {
  if (!auth.currentUser) throw new Error("User must be authenticated");

  try {
    await addDoc(collection(db, 'students'), {
      name,
      score,
      level,
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'students');
  }
};

export const deleteStudentRecord = async (studentId: string) => {
  try {
    await deleteDoc(doc(db, 'students', studentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `students/${studentId}`);
  }
};
