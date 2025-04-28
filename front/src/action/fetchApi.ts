type FetchToken = {
    url: string;
    method?: "PUT" | "DELETE" | "GET" | "POST";
    token?: any;
    body?: any;
    cache?:
    | "default"
    | "force-cache"
    | "no-cache"
    | "no-store"
    | "only-if-cached"
    | "reload";
    next?: number;
    tags?: string[]
};
export const fetchApi = async ({
    url,
    method,
    token,
    body,
    cache,
    next,
    tags
}: FetchToken) => {
    let options: RequestInit = {
        method: method || "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || null}`,
            // "Cache-Control": "public, max-age=10, must-revalidate",
        },
        // cache: cache || "default",
    };
    if (next || tags) {
        options.next = {}
        if (next) {
            options.next = { revalidate: next };
        }
        if (tags) {
            options.next = { ...options.next, tags: tags };
        }
    }
    if (cache) {
        options.cache = cache;
    }
    if (body) {
        options.body = JSON.stringify(body);
    }
    try {        
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/${url}`, options);
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json?.message);
        }
        return json
    } catch (err: any) {
        return { error: err.message || "خطا در ارتباط با دیتابیس" }
    }
};