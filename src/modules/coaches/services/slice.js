import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { actionStatuses } from '../../../modules/common/constants/action-status.constants';
import { moduleName } from '../constants';
import { createApi, deleteApi, getApi, updateApi } from './api';

const initialState = {
  list: [],
  queryStatus: actionStatuses.IDLE,
  mutationStatus: actionStatuses.IDLE
}

export const getListService = createAsyncThunk(
    `${moduleName}/getList`,
    async () => {
        const response = await getApi();
        return response;
    }
);

export const upsertService = createAsyncThunk(
    `${moduleName}/upsert`,
    async ({name, description, imageUrl = '', id = null}) => {
        let response = {};
        if (id) {
            response = await updateApi({name, description, imageUrl}, id);
        } else {
            response = await createApi({name, description, imageUrl});
        }
        return response;
    }
);

export const deleteService = createAsyncThunk(
    `${moduleName}/delete`,
    async (id = '') => {
        const response = await deleteApi(id);
        return response;
    }
);

export const slice = createSlice({
  name: moduleName,
  initialState,
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(upsertService.pending, (state) => {
      state.mutationStatus = actionStatuses.PENDING;
    })
    builder.addCase(upsertService.fulfilled, (state, action) => {
      const { hasErrored = false } = action.payload;
      if (hasErrored) {
        state.mutationStatus = actionStatuses.REJECTED;
      } else {
        state.mutationStatus = actionStatuses.FULFILLED;
      }
    })

    builder.addCase(getListService.pending, (state) => {
      state.queryStatus = actionStatuses.PENDING;
    })
    builder.addCase(getListService.fulfilled, (state, action) => {
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

export default slice.reducer

export { moduleName };