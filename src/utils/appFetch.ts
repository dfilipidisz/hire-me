type ReqData = Record<string, string>;

const makeURL = (path: string, params: ReqData | null) => {
  const url = new URL(`${process.env.REACT_APP_API_BASE_URL}${path}`);

  url.search = new URLSearchParams({
    ...params,
    accessToken: process.env.REACT_APP_ACCESS_TOKEN as string,
  }).toString();

  return url.toString();
};

interface AppFetchOptions {
  path: string;
  method: 'GET' | 'POST';
  data?: ReqData;
}

export const appFetch = async (options: AppFetchOptions) => {
  try {
    const { path, method, data = {} } = options;

    const response = await fetch(
      makeURL(path, method === 'GET' ? data : null),
      {
        method,
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
      }
    );

    if (!response.ok) {
      throw new Error('API error');
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    throw new Error('API error');
  }
};
