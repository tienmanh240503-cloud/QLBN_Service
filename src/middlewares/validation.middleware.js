import Joi from "joi";
import _ from "lodash";

export const validation = (schema) => {
    return (req, res, next) => {
        try {
            const _schema = Joi.object(schema);
            console.log(_schema);
            const formData = _.merge({}, req.body);
            console.log(formData);
            const valid = _schema.validate(_.pick(formData, Object.keys(schema)));
            // console.log('------validation', valid, schema)
            if (valid.error) {
                return res.status(400).json({
                    success: false,
                    message: "Dữ liệu không hợp lệ",
                    error: valid.error.details[0].message
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Lỗi validation",
                error: error.message
            });
        }
    };
};