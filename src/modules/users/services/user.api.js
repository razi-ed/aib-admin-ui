import HttpClient from "../../../modules/common/lib/http-client";
import { errorLog } from "../../../modules/common/lib/dev-util";

export async function getUsersApi() {
    let response = {}
    try {
        const apiResponse = await HttpClient.get('/users?sortBy=createdAt:desc&limit=100');
        if (apiResponse.status === 200) {
            const { data = {} } = apiResponse;
            response = data;
        }
    } catch (error) {
        errorLog('get-users-api', error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}

export async function createUserApi({ email, name, phone, imageUrl }) {
    let response = {}
    try {
        const apiResponse = await HttpClient.post('/users', { email, name, phone, imageUrl }, );
        if (apiResponse.status === 201) {
            response = apiResponse.data;
        } else {
            response = {
                hasErrored: true,
                errorMessage: apiResponse?.data?.message,
            }
        }
    } catch (error) {
        errorLog('create-user-api', error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}

export async function updateUserApi(payload, userId) {
    let response = {}
    try {
        const apiResponse = await HttpClient.patch(`/users/${userId}`, payload);
        if (apiResponse.status === 200) {
            response = apiResponse.data;
        } else {
            response = {
                hasErrored: true,
                errorMessage: apiResponse?.data?.message,
            }
        }
    } catch (error) {
        errorLog('update-user-api', error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}

export async function deleteUserApi(userId) {
    let response = {}
    try {
        const apiResponse = await HttpClient.delete(`/users/${userId}`);
        if (apiResponse.status === 204) {
            response = {};
        } else {
            response = {
                hasErrored: true,
                errorMessage: apiResponse.data.message,
            }
        }
    } catch (error) {
        errorLog('delete-user-api', error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}

