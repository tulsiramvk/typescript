// import Config from "react-native-config";

export const BASE_URL = "https://api.9orbits.com"

const LOGIN_PATH = `${BASE_URL}/api/auth/login/`;
const CHANGE_PASSWORD = `${BASE_URL}/api/auth/change-password/`;
const DASHBOARD = `${BASE_URL}/api/v1/dashboard/`;
const CUSTOM_FIELDS = `${BASE_URL}/api/custom-fields/?moduleId=`;
const CONTACTS = `${BASE_URL}/api/contacts/`;
const LEADS = `${BASE_URL}/api/leads/`;
const CHANGE_OWNER = `${BASE_URL}/api/change-owner/`;
const SOURCES = `${BASE_URL}/api/sources/`;
const ROLES = `${BASE_URL}/api/roles/`;
const DEPARTMENTS = `${BASE_URL}/api/departments/`;
const PRODUCTS = `${BASE_URL}/api/products/`;
const STAGES = `${BASE_URL}/api/stages/`;
const BRANCHES = `${BASE_URL}/api/branches/`;
const PIPELINES = `${BASE_URL}/api/pipelines/`;
const ADD_MEETING = `${BASE_URL}/auth/login/`;
const CUSTOMERS = `${BASE_URL}/api/customers/`;
const ACTIVITY_PATH = `${BASE_URL}/api/activities/`;
const DEALS_PATH = `${BASE_URL}/api/deals/`;


const HEADER_OPTIONS = (contentType = 'application/json') => {
    return {
        headers: {
            //   Authorization: `Bearer ${store.getState().auth.token}`,
            //   'Content-Type': contentType
        },
    };
};

export default {
    LOGIN_PATH,
    CHANGE_PASSWORD,
    DASHBOARD,
    ADD_MEETING,
    DEALS_PATH,
    ACTIVITY_PATH,
    CONTACTS,
    CUSTOM_FIELDS,
    LEADS,
    CUSTOMERS,

    CHANGE_OWNER,
    SOURCES,
    ROLES,
    DEPARTMENTS,
    PRODUCTS,
    STAGES,
    BRANCHES,
    PIPELINES,
    HEADER_OPTIONS,
};