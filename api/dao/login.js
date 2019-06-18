const tableName = "t_bas_account";
module.exports = {
    adminLogin:(ctx,postData)=>{
        return ctx.execSql(`select * from ${tableName} where account = ? and password = ?`, [postData.account, postData.password]);
    }
};
