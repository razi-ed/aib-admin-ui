import React from "react";
import { assetHttpClient } from "../lib/http-client";

import { actionStatuses } from "../constants/action-status.constants";

const initialState = {
    url: '',
    status: actionStatuses.IDLE,
};

function reducer(_state, action) {
  switch (action.type) {
    case 'init':
      return {url: '', status: actionStatuses.PENDING};
    case 'uploadSuccess':
      return {url: action.payload, status: actionStatuses.FULFILLED};
    case 'uploadFailed':
      return {url: '', status: actionStatuses.REJECTED};
    default:
      throw new Error();
  }
}

export function useImageUpload(fileList, setFileList) {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const initUpload = React.useCallback((file, fileName = '', folder = '')=> {
        if (file) {
            dispatch({type: 'init'});
            const formData = new FormData();
            formData.append('file', file);
            assetHttpClient.post(`/upload/image?fileName=${fileName}&folder=${folder}`, formData, {
                headers : {
                    "content-type": "multipart/form-data"
                }
            })
            .then(response => {
                const { data: { url = '', secure_url = '' } = {} } = response || {};
                dispatch({type: 'uploadSuccess', payload: secure_url ? secure_url : url});
            })
            .catch(error => {
                console.error(error);
                dispatch({type: 'uploadFailed'});
            })
        }
    }, []);

    return {url: state.url, status: state.status , initUpload};
}