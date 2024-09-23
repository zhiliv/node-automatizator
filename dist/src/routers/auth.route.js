export const authRoute = (req, res, next) => {
    let query = null;
    query = JSON.stringify(req.query) === '{}' ? req.body : req.query;
    if (query.token === 'Cbo28-4oS4LJfnxJTcrAx0D92') {
        next();
    }
    else {
        console.log('🚀 -> authRoute -> query:', query);
        res.status(401).send('Ошибка авторизации');
    }
};
