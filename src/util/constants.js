const GDN_URL = process.env.REACT_APP_GDN_URL
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const DEMO_HEADING = "Address Book"
const DEFAULT_USERNAME = "demo@macrometa.io"
const DEFAULT_REGION = "Global"
const ADDRESS_COLLECTION_NAME = "addresses"
const DOCUMENT_OPERATIONS = {
    UPDATE: "UPDATE",
    INSERT: "INSERT",
    DELETE: "DELETE",
}
const RESTQL = {
    GET_CONTACTS: "FOR data IN addresses RETURN data",
    INSERT_CONTACT:
        'INSERT { "firstName": TRIM(@firstName), "lastName": TRIM(@lastName), "email": TRIM(@email) } INTO addresses',
    UPDATE_CONTACT:
        'UPDATE @key WITH { "firstName": TRIM(@firstName), "lastName": TRIM(@lastName), "email": TRIM(@email) } IN addresses',
    REMOVE_CONTACT: "REMOVE @_key IN addresses",
}
const EMAIL_VALIDATION_REGEX = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
)

export {
    ADDRESS_COLLECTION_NAME,
    DOCUMENT_OPERATIONS,
    DEMO_HEADING,
    DEFAULT_USERNAME,
    DEFAULT_REGION,
    EMAIL_VALIDATION_REGEX,
    GITHUB_URL,
    GDN_URL,
    RESTQL,
}
