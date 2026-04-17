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

export const createStat = createAsyncThunk('stats/create', async (statData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch('/api/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(statData)
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

export const deleteStat = createAsyncThunk('stats/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch(`/api/stats/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            return data.id;
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
            })
            .addCase(createStat.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createStat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats.push(action.payload);
            })
            .addCase(createStat.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteStat.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteStat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats = state.stats.filter(stat => stat._id !== action.payload);
            })
            .addCase(deleteStat.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = statsSlice.actions;
export default statsSlice.reducer;
