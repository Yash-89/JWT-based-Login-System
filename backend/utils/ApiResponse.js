export default (res, stat, obj) => {
    return res.status(stat).json(obj)
}