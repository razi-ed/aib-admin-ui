
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pickBy } from 'lodash';
import { actionStatuses } from '../../../modules/common/constants/action-status.constants';
import { createUserApi, deleteUserApi, getUsersApi, updateUserApi } from './user.api';

const initialState = {
  list: [],
  queryStatus: actionStatuses.IDLE,
  mutationStatus: actionStatuses.IDLE
}

export const getUsersService = createAsyncThunk(
    'user/getList',
    async () => {
        const response = await getUsersApi();
        return response;
    }
);

export const upsertUserService = createAsyncThunk(
    'user/upsert',
    async ({name, email, id = null, phone, imageUrl}) => {
        let response = {};
        if (id) {
            response = await updateUserApi(
                pickBy({name, email, phone, imageUrl}, (value) => !!value),
                id
            );
        } else {
            response = await createUserApi({name, email, phone, imageUrl});
        }
        return response;
    }
);

export const deleteUserService = createAsyncThunk(
    'user/delete',
    async (id = '') => {
        const response = await deleteUserApi(id);
        return response;
    }
);

export const authSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(upsertUserService.pending, (state) => {
      state.mutationStatus = actionStatuses.PENDING;
    })
    builder.addCase(upsertUserService.fulfilled, (state, action) => {
      const { hasErrored = false } = action.payload;
      if (hasErrored) {
        state.mutationStatus = actionStatuses.REJECTED;
      } else {
        state.mutationStatus = actionStatuses.FULFILLED;
      }
    })

    builder.addCase(getUsersService.pending, (state) => {
      state.queryStatus = actionStatuses.PENDING;
    })
    builder.addCase(getUsersService.fulfilled, (state, action) => {
      const { results, hasErrored = false } = action.payload;
      if (hasErrored) {
        state.queryStatus = actionStatuses.REJECTED;
        state.list = [];
      } else {
        state.list = results;
        state.queryStatus = actionStatuses.FULFILLED;
      }
    })
  },
})

// Action creators are generated for each case reducer function
// export const {} = authSlice.actions

export default authSlice.reducer