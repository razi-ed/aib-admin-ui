import { httpOpenClient } from "../../lib/http-client";
import { errorLog } from "../../lib/dev-util";

export async function loginApi({ email, password }) {
    let response = {}
    try {
        const apiResponse = await httpOpenClient.post('/auth/login', { email, password }, );
        if (apiResponse.status === 200) {
            response = apiResponse.data;
        } else if (apiResponse.status === 401) {
            response = {
                hasErrored: true,
                errorMessage: apiResponse.data.message,
            }
        }
    } catch (error) {
        errorLog('login-api', error)
        response = {
            hasErrored: true,
            errorMessage: error.message,
            error,
        }
    } finally {
        return response;
    }
}