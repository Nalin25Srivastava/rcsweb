import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    services: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

export const fetchServices = createAsyncThunk('services/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await fetch('/api/services');
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return thunkAPI.rejectWithValue(data.message);
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = servicesSlice.actions;
export default servicesSlice.reducer;
