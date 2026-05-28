import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/settings/';

// Get settings
export const fetchSettings = createAsyncThunk('settings/fetchSettings', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update settings
export const updateSettings = createAsyncThunk('settings/updateSettings', async (settingsData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(API_URL, settingsData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        settings: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: '',
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.settings = action.payload;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.settings = action.payload;
                state.message = 'Settings updated successfully';
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = settingsSlice.actions;
export default settingsSlice.reducer;
