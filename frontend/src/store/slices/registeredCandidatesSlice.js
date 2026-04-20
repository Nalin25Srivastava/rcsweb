import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    registeredCandidates: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

export const fetchRegisteredCandidates = createAsyncThunk('registeredCandidates/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await fetch('/api/registered-candidates');
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

export const createRegisteredCandidate = createAsyncThunk('registeredCandidates/create', async (candidateData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch('/api/registered-candidates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(candidateData)
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

export const updateRegisteredCandidate = createAsyncThunk('registeredCandidates/update', async ({ id, candidateData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch(`/api/registered-candidates/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(candidateData)
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

export const deleteRegisteredCandidate = createAsyncThunk('registeredCandidates/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch(`/api/registered-candidates/${id}`, {
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

export const registeredCandidatesSlice = createSlice({
    name: 'registeredCandidates',
    initialState,
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
            .addCase(fetchRegisteredCandidates.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRegisteredCandidates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.registeredCandidates = action.payload;
            })
            .addCase(fetchRegisteredCandidates.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createRegisteredCandidate.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createRegisteredCandidate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.registeredCandidates.unshift(action.payload);
            })
            .addCase(createRegisteredCandidate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateRegisteredCandidate.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateRegisteredCandidate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.registeredCandidates = state.registeredCandidates.map(candidate =>
                    candidate._id === action.payload._id ? action.payload : candidate
                );
            })
            .addCase(updateRegisteredCandidate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteRegisteredCandidate.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteRegisteredCandidate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.registeredCandidates = state.registeredCandidates.filter(candidate => candidate._id !== action.payload);
            })
            .addCase(deleteRegisteredCandidate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = registeredCandidatesSlice.actions;
export default registeredCandidatesSlice.reducer;
