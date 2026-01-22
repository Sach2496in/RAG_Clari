export interface RuntimeConfig {
    API_BASE_URL: string;
}

export function getRuntimeConfig(): RuntimeConfig {
    const env = (window as any).__env;

    if (!env || !env.API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined in runtime config');
    }

    return {
        API_BASE_URL: env.API_BASE_URL,
    };
}
