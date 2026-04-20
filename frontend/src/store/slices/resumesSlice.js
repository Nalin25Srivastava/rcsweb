import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

export const submitResume = createAsyncThunk('resumes/submit', async (resumeData, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const token = user?.token;

        const response = await fetch('/api/resumes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: resumeData // Using FormData directly
        });
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

export const resumesSlice = createSlice({
    name: 'resumes',
    initialState,
    reducers: {
        resetResumeState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitResume.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(submitResume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(submitResume.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { resetResumeState } = resumesSlice.actions;
export default resumesSlice.reducer;
