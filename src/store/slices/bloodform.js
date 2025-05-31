import { createSlice } from '@reduxjs/toolkit';



const initialState = {
              fullName:'',
          phoneNumber:'',
          email:'',
    bloodGroup:'',
    alternateMobileNumber:'',
    country:'',
    state:'',
    district:'',
    city:'',
    townOrVillage:'',
    pinCode:''
};

const blooddonorSlice = createSlice({
  name: 'blooddonorform',
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

export const { setFormData, resetFormData, addDocument, setDocuments, removeDocument } = blooddonorSlice.actions;
export default blooddonorSlice.reducer;
