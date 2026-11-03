export const successRes = (res, data, message = "success", status = 200) => {
    return res.status(status).json({ message, data });
};
export const errorRes = (res, error, status = 400) => {
    return res.status(status).json({ error });
};
