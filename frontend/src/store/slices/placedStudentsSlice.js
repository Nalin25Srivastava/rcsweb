import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    placedStudents: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

// Helper to handle fetch responses safely
const handleResponse = async (response, thunkAPI, fallbackMessage) => {
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        return thunkAPI.rejectWithValue(`Server error (${response.status}): The server returned an unexpected response format.`);
    }

    if (response.ok) {
        return data;
    } else {
        return thunkAPI.rejectWithValue(data.message || fallbackMessage);
    }
};

// Fetch all placed students
export const fetchPlacedStudents = createAsyncThunk('placedStudents/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await fetch('/api/placed-students');
        return await handleResponse(response, thunkAPI, 'Failed to fetch success stories');
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Create placed student
export const createPlacedStudent = createAsyncThunk('placedStudents/create', async (studentData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch('/api/placed-students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(studentData)
        });
        return await handleResponse(response, thunkAPI, 'Failed to create success story');
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Update placed student
export const updatePlacedStudent = createAsyncThunk('placedStudents/update', async ({ id, studentData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch(`/api/placed-students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(studentData)
        });
        return await handleResponse(response, thunkAPI, 'Failed to update success story');
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Delete placed student
export const deletePlacedStudent = createAsyncThunk('placedStudents/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch(`/api/placed-students/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await handleResponse(response, thunkAPI, 'Failed to delete success story');
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const placedStudentsSlice = createSlice({
    name: 'placedStudents',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.placedStudents = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlacedStudents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPlacedStudents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.placedStudents = action.payload;
            })
            .addCase(fetchPlacedStudents.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createPlacedStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPlacedStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.placedStudents.unshift(action.payload);
            })
            .addCase(createPlacedStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updatePlacedStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePlacedStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.placedStudents = state.placedStudents.map(student => 
                    student._id === action.payload._id ? action.payload : student
                );
            })
            .addCase(updatePlacedStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deletePlacedStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deletePlacedStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.placedStudents = state.placedStudents.filter(student => student._id !== action.payload.id);
            })
            .addCase(deletePlacedStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = placedStudentsSlice.actions;
export default placedStudentsSlice.reducer;
