import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    registeredStudents: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

export const fetchRegisteredStudents = createAsyncThunk('registeredStudents/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await fetch('/api/registered-students');
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

export const createRegisteredStudent = createAsyncThunk('registeredStudents/create', async (studentData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch('/api/registered-students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(studentData)
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

export const updateRegisteredStudent = createAsyncThunk('registeredStudents/update', async ({ id, studentData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch(`/api/registered-students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(studentData)
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

export const deleteRegisteredStudent = createAsyncThunk('registeredStudents/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch(`/api/registered-students/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            return id;
        } else {
            return thunkAPI.rejectWithValue(data.message);
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const registeredStudentsSlice = createSlice({
    name: 'registeredStudents',
    initialState,
    reducers: {
        reset: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegisteredStudents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRegisteredStudents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.registeredStudents = action.payload;
            })
            .addCase(fetchRegisteredStudents.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createRegisteredStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createRegisteredStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.registeredStudents.unshift(action.payload);
            })
            .addCase(createRegisteredStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateRegisteredStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateRegisteredStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.registeredStudents = state.registeredStudents.map(student =>
                    student._id === action.payload._id ? action.payload : student
                );
            })
            .addCase(updateRegisteredStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteRegisteredStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteRegisteredStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.registeredStudents = state.registeredStudents.filter(student => student._id !== action.payload);
            })
            .addCase(deleteRegisteredStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = registeredStudentsSlice.actions;
export default registeredStudentsSlice.reducer;
