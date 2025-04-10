import devConfig from '../config/dev.js';
import prodConfig from '../config/prod.js';

export function loadConfig() {
    const env = window.location.hostname === "qualitativedatarepository.github.io" ? "prod" : "dev";
    return env === "prod" ? prodConfig : devConfig;
}