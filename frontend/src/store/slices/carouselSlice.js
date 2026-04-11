import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    slides: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

export const fetchSlides = createAsyncThunk('carousel/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await fetch('/api/carousel');
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

export const carouselSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSlides.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSlides.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.slides = action.payload;
            })
            .addCase(fetchSlides.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = carouselSlice.actions;
export default carouselSlice.reducer;
