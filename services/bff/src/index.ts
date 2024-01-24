/////////////////// Content Service ///////////////////

app.get("/content", allowIfAnyOf("anonymous", "active"), async (req: Request, res: Response) => {
    const { status, data } = await contentApi.get("content", {
        params: req.query,
        headers: filterHeadersToForward(req, "authorization"),
    });

    const transformedContent = await transformContent(data.data, filterHeadersToForward(req, "authorization"));
    res.status(status).json(transformedContent);
});

app.get("/content/:contentId", allowIfAnyOf("anonymous", "active"), async (req: Request, res: Response) => {
    const { status, data } = await contentApi.get("content/" + req.params.contentId, {
        params: req.query,
        headers: filterHeadersToForward(req, "authorization"),
    });

    const transformedContent = await transformContent([data], filterHeadersToForward(req, "authorization"));
    res.status(status).json(transformedContent[0]);
});

app.get("/auth/email/verify/:token", async (req: Request, res: Response) => {
    const { status, data } = await identityApi.get("auth/email/verify/" + req.params.token, {
        headers: filterHeadersToForward(req, "authorization"),
    });
    if (status === 301) {
        res.redirect(data);
    } else {
        res.status(status).json(data);
    }
});

app.get("/profiles/tag/:tag", allowIfAnyOf("anonymous", "active"), async (req: Request, res: Response) => {
    const filteredAuthHeader = filterHeadersToForward(req, "authorization");

    try {
        const { tag } = req.params;
        const tagResponse = await profileApi.get("profiles/tag/" + tag, {
            headers: filteredAuthHeader,
        });

        if (tagResponse.status !== 200) {
            return res.status(tagResponse.status).json(tagResponse.data);
        }

        const profileId = tagResponse.data.id;
        const profile = await getProfileData(profileId, filteredAuthHeader);
        res.status(200).json({ data: profile });
    } catch (error) {
        res.status(500).json("Unable to retrieve profile details");
    }
});

app.get("/profiles/:profileId", allowIfAnyOf("anonymous", "active"), async (req: Request, res: Response) => {
    const filteredAuthHeader = filterHeadersToForward(req, "authorization");

    try {
        const { profileId } = req.params;
        const profile = await getProfileData(profileId, filteredAuthHeader);
        res.status(200).json({ data: profile });
    } catch (error) {
        res.status(500).json("Unable to retrieve profile details");
    }
});

app.get("/collaborators", allowIfAnyOf("anonymous", "active"), async (req: Request, res: Response) => {
    const { status, data } = await profileApi.get("profiles/", {
        headers: filterHeadersToForward(req, "authorization"),
    });

    const result = Object.values(data).map((item: any) => ({
        id: item.id,
        organization: item.organization,
        tag: item.tag,
    }));

    res.status(status).json(result);
});

app.get("/search", allowIfAnyOf("anonymous", "active"), async (req: Request, res: Response) => {
    type ServiceResult = {
        status: number | null;
        data: any | null;
        error: string | null;
        meta: any;
    };

    const scope: string | undefined = req.query.scope as string | undefined;

    const searchContentResult: ServiceResult = { status: null, data: null, error: null, meta: null };
    const searchProfileResult: ServiceResult = { status: null, data: null, error: null, meta: null };

    const filters: any = {};
    Object.keys(req.query).forEach((key) => {
        if (key.startsWith("filters.")) {
            const filterKey = key.substring("filters.".length);
            filters[filterKey] = req.query[key];
            delete req.query[key];
        }
    });

    req.query.filters = filters;

    if (!scope || scope === "content") {
        try {
            const contentResponse = await contentApi.get("search/", {
                params: req.query,
                headers: filterHeadersToForward(req, "authorization"),
            });

            const contentToTransform = await Promise.all(
                contentResponse.data.data.map(async (item: any) => {
                    Object.assign(item, item.data);
                    delete item.data;
                    return item;
                })
            );

            searchContentResult.meta = contentResponse.data.meta;
            searchContentResult.status = contentResponse.status;
            searchContentResult.data = await transformContent(contentToTransform, filterHeadersToForward(req, "authorization"));
        } catch (error: any) {
            searchContentResult.status = error.response?.status || 500;
            searchContentResult.error = error.message;
        }
    }

    if (!scope || scope === "profile") {
        try {
            const profileResponse = await profileApi.get("search/", {
                params: req.query,
                headers: filterHeadersToForward(req, "authorization"),
            });

            searchProfileResult.meta = profileResponse.data.meta;
            searchProfileResult.status = profileResponse.status;
            searchProfileResult.data = profileResponse.data.data;
        } catch (error: any) {
            searchProfileResult.status = error.response?.status || 500;
            searchProfileResult.error = error.message;
        }
    }

    const responsePayload: any = {};

    if (!scope || scope === "content") {
        responsePayload.contentResults = {
            meta: searchContentResult.meta,
            data: searchContentResult.data,
            status: searchContentResult.status,
            error: searchContentResult.error,
        };
    }

    if (!scope || scope === "profile") {
        responsePayload.profileResults = {
            meta: searchProfileResult.meta,
            data: searchProfileResult.data,
            status: searchProfileResult.status,
            error: searchProfileResult.error,
        };
    }

    res.status(200).json(responsePayload);
});

app.get("/", async (req: Request, res: Response) => {
    res.status(200).json("Service is running!");
});

const server: Server = app.listen(settings.PORT, async () => {
    console.log(`Listening on port ${settings.PORT}`);
});

export { app, server };
