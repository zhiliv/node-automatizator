const isDev = process.env?.npm_lifecycle_script?.indexOf('isDev=true') < 0 ? false : true; // признак запуска проекта в режиме разработки
export const authRoute = (req, res, next) => {
    const query = req.query || req.body;
    if (query.token === 'Cbo28-4oS4LJfnxJTcrAx0D92' || isDev) {
        next();
    }
    else {
        res.status(401).send('Ошибка авторизации');
    }
};
