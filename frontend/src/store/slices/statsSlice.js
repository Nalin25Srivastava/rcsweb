import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    stats: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

export const fetchStats = createAsyncThunk('stats/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await fetch('/api/stats');
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

export const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = statsSlice.actions;
export default statsSlice.reducer;
