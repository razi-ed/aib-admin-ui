import HttpClient from "../../../modules/common/lib/http-client";
import { errorLog } from "../../../modules/common/lib/dev-util";
import { moduleName } from "../constants";

export async function getApi() {
    let response = {}
    try {
        const apiResponse = await HttpClient.get(`/${moduleName}/`);
        if (apiResponse.status === 200) {
            const { data = [] } = apiResponse;
            response = { results: data };
        }
    } catch (error) {
        errorLog(`get-${moduleName}-api`, error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}

export async function createApi({ label, value }) {
    let response = {}
    try {
        const apiResponse = await HttpClient.post(`/${moduleName}`, { label, value });
        if (apiResponse.status === 201) {
            response = apiResponse.data;
        } else {
            response = {
                hasErrored: true,
                errorMessage: apiResponse?.data?.message,
            }
        }
    } catch (error) {
        errorLog(`create-${moduleName}-api`, error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}

export async function updateApi(payload, value) {
    let response = {}
    try {
        const apiResponse = await HttpClient.patch(`/${moduleName}/${value}`, payload);
        if (apiResponse.status === 200) {
            response = apiResponse.data;
        } else {
            response = {
                hasErrored: true,
                errorMessage: apiResponse?.data?.message,
            }
        }
    } catch (error) {
        errorLog(`update-${moduleName}-api`, error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}

export async function deleteApi(value) {
    let response = {}
    try {
        const apiResponse = await HttpClient.delete(`/${moduleName}/${value}`);
        if (apiResponse.status === 204) {
            response = {};
        } else {
            response = {
                hasErrored: true,
                errorMessage: apiResponse.data.message,
            }
        }
    } catch (error) {
        errorLog(`delete-${moduleName}-api`, error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}

