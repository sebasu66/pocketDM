import '@testing-library/jest-dom'

// Mock Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInAnonymously: jest.fn(),
  GoogleAuthProvider: jest.fn(() => ({
    setCustomParameters: jest.fn(),
  })),
  signInWithRedirect: jest.fn(),
  getRedirectResult: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => 'mocked-collection'),
  doc: jest.fn(() => 'mocked-doc-ref'),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(() => 'mocked-query'),
  where: jest.fn(() => 'mocked-where'),
  addDoc: jest.fn(),
  writeBatch: jest.fn(),
}))

jest.mock('@/lib/firebase/config', () => ({
  auth: {},
  db: {},
}))
