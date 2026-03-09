/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Google Sheets API service layer.
 *
 * Uses client-side OAuth2 via Google Identity Services (GIS).
 * The `gapi` and `google` globals come from dynamically loaded scripts;
 * we declare minimal typings below so TypeScript is satisfied.
 */

declare global {
  interface Window {
    gapi: any
    google: any
  }
  const gapi: any
  const google: any
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || ''
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'

let tokenClient: any | null = null
let accessToken: string | null = null

/**
 * Load the Google API client library and initialise the Sheets v4 discovery doc.
 */
export function initGoogleApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, skip
    if (typeof gapi !== 'undefined' && gapi.client?.sheets) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({ apiKey: API_KEY })
          await gapi.client.load('sheets', 'v4')
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    }
    script.onerror = () => reject(new Error('Failed to load Google API script'))
    document.body.appendChild(script)
  })
}

/**
 * Initialise the GIS token client. Must be called after the GIS script has loaded.
 *
 * @param callback – invoked with `true` on success, `false` on failure.
 */
export function initTokenClient(callback: (success: boolean) => void): void {
  // Load GIS script if not present
  if (typeof google === 'undefined' || !google.accounts?.oauth2) {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      createTokenClient(callback)
    }
    document.body.appendChild(script)
  } else {
    createTokenClient(callback)
  }
}

function createTokenClient(callback: (success: boolean) => void): void {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: any) => {
      if (response.access_token) {
        accessToken = response.access_token
        callback(true)
      } else {
        callback(false)
      }
    },
  })
}

/**
 * Prompt the user to sign in and grant Sheets access.
 */
export function signIn(): void {
  tokenClient?.requestAccessToken()
}

/**
 * Revoke the current token and sign out.
 */
export function signOut(): void {
  if (accessToken) {
    google.accounts.oauth2.revoke(accessToken, () => {
      /* revoke complete */
    })
    accessToken = null
  }
}

/**
 * Whether the user is currently signed in.
 */
export function isSignedIn(): boolean {
  return !!accessToken
}

/**
 * Read a range from a spreadsheet.
 *
 * @returns A 2-D array of strings (rows x cols). Empty cells = empty string.
 */
export async function readRange(
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })
  return response.result.values || []
}

/**
 * Overwrite a range with new values.
 */
export async function writeRange(
  spreadsheetId: string,
  range: string,
  values: string[][]
): Promise<void> {
  await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  })
}

/**
 * Append rows after the last row with data in the given range.
 */
export async function appendRows(
  spreadsheetId: string,
  range: string,
  values: string[][]
): Promise<void> {
  await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  })
}
