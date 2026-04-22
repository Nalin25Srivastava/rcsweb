import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

let user = null;
let isSecretVerifiedInitial = false;
try {
    const storedUser = localStorage.getItem('rcs_user');
    user = storedUser ? JSON.parse(storedUser) : null;
    isSecretVerifiedInitial = localStorage.getItem('rcs_admin_verified') === 'true';
} catch (error) {
    console.error('Error parsing session data:', error);
    localStorage.removeItem('rcs_user');
    localStorage.removeItem('rcs_admin_verified');
}

const initialState = {
    user: user ? user : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    isSecretVerified: isSecretVerifiedInitial,
    users: [] // Added users list for admin selection
};

// Helper to handle fetch responses safely
const handleResponse = async (response, thunkAPI, fallbackMessage) => {
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        return thunkAPI.rejectWithValue('Server returned an invalid response. Is the backend running?');
    }

    if (response.ok) {
        return data;
    } else {
        return thunkAPI.rejectWithValue(data.message || fallbackMessage);
    }
};

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const result = await handleResponse(response, thunkAPI, 'Login failed');
        if (result && typeof result !== 'string') {
            localStorage.setItem('rcs_user', JSON.stringify(result));
        }
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Signup user
export const signup = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const result = await handleResponse(response, thunkAPI, 'Registration failed');
        if (result && typeof result !== 'string') {
            localStorage.setItem('rcs_user', JSON.stringify(result));
        }
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Google login
export const googleLogin = createAsyncThunk('auth/google', async (googleData, thunkAPI) => {
    try {
        const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(googleData)
        });
        const result = await handleResponse(response, thunkAPI, 'Google auth failed');
        if (result && typeof result !== 'string') {
            localStorage.setItem('rcs_user', JSON.stringify(result));
        }
        return result;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Verify Registration Payment
export const verifyRegistrationPayment = createAsyncThunk('auth/verifyPayment', async (paymentData, thunkAPI) => {
    try {
        const response = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        return await handleResponse(response, thunkAPI, 'Payment verification failed');
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Fetch all users (admin only)
export const fetchUsers = createAsyncThunk('auth/fetchUsers', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const response = await fetch('/api/auth/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await handleResponse(response, thunkAPI, 'Failed to fetch users');
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        logout: (state) => {
            localStorage.removeItem('rcs_user');
            localStorage.removeItem('rcs_admin_verified');
            state.user = null;
            state.isSecretVerified = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setSecretVerified: (state, action) => {
            state.isSecretVerified = action.payload;
            if (action.payload) {
                localStorage.setItem('rcs_admin_verified', 'true');
            } else {
                localStorage.removeItem('rcs_admin_verified');
            }
        },
        setPaid: (state) => {
            if (state.user) {
                state.user.isPaid = true;
                localStorage.setItem('rcs_user', JSON.stringify(state.user));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                if (action.payload && action.payload.role === 'admin') {
                    state.isSecretVerified = true;
                    localStorage.setItem('rcs_admin_verified', 'true');
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                if (action.payload && action.payload.role === 'admin') {
                    state.isSecretVerified = true;
                    localStorage.setItem('rcs_admin_verified', 'true');
                }
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                if (action.payload && action.payload.role === 'admin') {
                    state.isSecretVerified = true;
                    localStorage.setItem('rcs_admin_verified', 'true');
                }
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(verifyRegistrationPayment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyRegistrationPayment.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(verifyRegistrationPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset, logout, setSecretVerified, setPaid } = authSlice.actions;
export default authSlice.reducer;
