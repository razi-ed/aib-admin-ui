import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { actionStatuses } from '../../../modules/common/constants/action-status.constants';
import { moduleName } from '../constants';
import { createApi, deleteApi, getApi, updateApi, getByIdApi } from './api';

const initialState = {
  list: [],
  modules: [],
  sections: {},
  course: {},
  queryStatus: actionStatuses.IDLE,
  mutationStatus: actionStatuses.IDLE,
}

export const getListService = createAsyncThunk(
    `${moduleName}/getList`,
    async () => {
        const response = await getApi();
        return response;
    }
);

export const getByIdService = createAsyncThunk(
    `${moduleName}/getById`,
    async (id) => {
        const response = await getByIdApi(id);
        return response;
    }
);

export const upsertService = createAsyncThunk(
    `${moduleName}/upsert`,
    async ({payload, id = null, step = 'basic'}) => {
        let response = {};
        if (id) {
            response = await updateApi(payload, step, id);
        } else {
            response = await createApi(payload);
        }
        return response;
    }
);

export const submitCourseService = createAsyncThunk(
    `${moduleName}/submit`,
    async (payload, thunkAPI) => {
        const { [moduleName]: { modules = [], sections = {}} = {} } = await thunkAPI.getState();
        const data = modules.reduce((acc, module) => {
          const mData = {
            moduleId: module.moduleId,
            sections: sections[module.moduleId]
          }
          acc.push(mData);
          return acc;
        }, [])
        let response = {};
        response = await updateApi({modules: data}, 'module', payload.courseId);
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
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
    addModule(state, action) {
      state.modules.push(action.payload);
    },
    removeModule(state, action) {
      const { moduleId } = action.payload
      state.modules = 
        state.modules
          .filter((module) => module.moduleId !== moduleId);
    },
    addSection(state, action) {
      const { moduleId, sectionData } = action.payload
      if (!Array.isArray(state.sections[moduleId])) {
        state.sections[moduleId] = [];
      }
      state.sections[moduleId].push(sectionData);
    },
    addSectionDetails(state, action) {
      const { sectionId, moduleId, data } = action.payload;
      const idx = state.sections[moduleId].findIndex((section)=> {
        return section.sectionId === sectionId;
      });
      state.sections[moduleId][idx] = data;
    },
    addProjectModuleDetails(state, action) {
      const { moduleId, data } = action.payload;
      const idx = state.modules.findIndex((module)=> {
        return module.moduleId === moduleId;
      });
      state.modules[idx] = {
        ...state.modules[idx],
        ...data,
      };
    },
    removeSection(state, action) {
      const { moduleId, sectionId } = action.payload
      state.sections[moduleId] = 
        state.sections[moduleId]
          .filter((section) => section.sectionId !== sectionId);
    },
  },
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
    builder.addCase(getByIdService.pending, (state) => {
      state.queryStatus = actionStatuses.PENDING;
      state.course = {};
    })
    builder.addCase(getByIdService.fulfilled, (state, action) => {
      const { results, hasErrored = false } = action.payload;
      if (hasErrored) {
        state.queryStatus = actionStatuses.REJECTED;
        state.course = [];
      } else {
        const course = Object.assign({}, results);
        state.course = course;
        let modulesSectionsObj = {modules: [], sections: {}};
        if (Array.isArray(course.modules) && course.modules.length > 0) {
          modulesSectionsObj = course.modules.reduce((acc, curr) => {
            const {sections, ...moduleDetails} = curr;
            acc.modules.push(moduleDetails);
            acc.sections[moduleDetails.moduleId] = sections;
            return acc;
          }, modulesSectionsObj);
        }
        state.modules = modulesSectionsObj.modules;
        state.sections = modulesSectionsObj.sections;
        state.queryStatus = actionStatuses.FULFILLED;
      }
    })
  },
})

// Action creators are generated for each case reducer function
export const {
  addModule,
  addSection,
  removeModule,
  removeSection,
  addSectionDetails,
  addProjectModuleDetails,
} = slice.actions

export default slice.reducer

export { moduleName };