/**
 * Interface for User Start Header Info request parameters
 */
export interface StartHeaderInfoRequest {
    authpn: string;  // Vendor Authentication User (tataelxsi)
    authpt: string;  // Encrypted vendor authentication key (vofee7ohhecai)
}

/**
 * Interface for User Start Header Info response
 */
export interface StartHeaderInfoResponse {
    region: string;               // Country
    session_stringvalue: string;  // HKS Value (encrypted session ID)
    session_parametername: string;// HKS
    date: string;                // Date of the region
    time: string;                // Time of the region
    timezone: string;            // Timezone of the region
    utc: string;                 // UTC value
}
