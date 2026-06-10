import { cookies } from "next/headers";

const getBody = <T>(c: Response | Request): Promise<T> => {
  return c.json() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const newUrl = new URL(`${baseUrl}${contextUrl}`);
  return newUrl.toString();
};

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  const _cookies = await cookies();
  return {
    ...headers,
    cookie: _cookies.toString(),
  };
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const requestUrl = getUrl(url);
  const requestHeaders = await getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  };

  try {
    const response = await fetch(requestUrl, requestInit);
    const data = await getBody<T>(response);
    return { status: response.status, data, headers: response.headers } as T;
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      data: "Erro de conexão com a API",
      headers: new Headers(),
    } as T;
  }
};