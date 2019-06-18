// china.js
const tableName = "t_bas_china_city";
module.exports = {
    getAllData:(ctx)=>{
        return ctx.execSql(`select * from ${tableName}`);
    }
};
