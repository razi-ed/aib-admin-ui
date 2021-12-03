import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authTokensStoragKeys } from '../../constants/auth.constants';
import { actionStatuses } from '../../constants/action-status.constants';
import { loginApi } from './auth.api';

const initialState = {
  user: {},
  status: actionStatuses.IDLE
}

export const loginService = createAsyncThunk(
    'auth/login',
    async (payload) => {
        const response = await loginApi(payload);
        if (response.user && response.tokens) {
            const serializedAccessToken = window.btoa(JSON.stringify(response.tokens.access));
            const serializedRefreshToken = window.btoa(JSON.stringify(response.tokens.refresh));
            window.localStorage.setItem(authTokensStoragKeys.ACCESS, serializedAccessToken)
            window.localStorage.setItem(authTokensStoragKeys.REFRESH, serializedRefreshToken)
        }
        return response;
    }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loginService.fulfilled, (state, action) => {
      const { user, hasErrored = false } = action.payload;
      if (hasErrored) {
        state.status = actionStatuses.REJECTED;
        state.user = {};
      } else {
        state.user = user;
      }
    })
  },
})

// Action creators are generated for each case reducer function
// export const {} = authSlice.actions

export default authSlice.reducer