import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "",
  profileimg:"",
  relation: "",
  age: "",
  location: "",
  cause: "",
  amount: "",
  phone: "",
  bloodGroup: '',
  hospitalName: '',
  hospitalLocation: '',
  medication: '',
  description: '',
  document: [], // updated to support multiple files
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData(state, action) {
      return { ...state, ...action.payload };
    },
    resetFormData() {
      return initialState;
    },
    addDocument(state, action) {
      state.document.push(action.payload); // add a single file
    },
    setDocuments(state, action) {
      state.document = action.payload; // replace entire array
    },
    removeDocument(state, action) {
      state.document = state.document.filter((_, i) => i !== action.payload);
    }
  },
});

export const { setFormData, resetFormData, addDocument, setDocuments, removeDocument } = formSlice.actions;
export default formSlice.reducer;
