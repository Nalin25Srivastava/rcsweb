import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/services';

export const fetchServices = createAsyncThunk('services/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateService = createAsyncThunk('services/update', async ({ id, serviceData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${API_URL}/${id}`, serviceData, config);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const servicesSlice = createSlice({
    name: 'services',
    initialState: {
        services: [],
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ''
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
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
            })
            .addCase(updateService.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.services = state.services.map((service) => 
                    service.id === action.payload.id ? action.payload : service
                );
            })
            .addCase(updateService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = servicesSlice.actions;
export default servicesSlice.reducer;
