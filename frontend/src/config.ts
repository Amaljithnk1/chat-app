/**
 * Backend connection config.
 *
 * IMPORTANT for physical devices / Expo Go:
 * "localhost" only works in a web browser or an emulator running on the
 * SAME machine as the backend. If you're testing on a real phone via
 * Expo Go, replace this with your computer's LAN IP address, e.g.
 * "http://192.168.1.23:4000" (find it with `ipconfig` on Windows or
 * `ifconfig`/`ipconfig getifaddr en0` on macOS). Your phone and computer
 * must be on the same Wi-Fi network.
 */
export const API_BASE_URL = 'http://192.168.1.120:4000';
export const SOCKET_URL = API_BASE_URL;
