const tableName = "t_bas_account";
const groupTableName = "t_bas_account_group";
module.exports = {
    getAccountList: (ctx, data) => {
        let conditionArr = [`${tableName}.meta_logic_flag=2`],
            accountStr = data.account ? `${tableName}.account like '%${data.account}%'` : undefined,
            phoneStr = data.phone ? `${tableName}.phone like '%${data.phone}%'` : undefined,
            status = data.status ? Number(data.status) !== -1 ? `${tableName}.status = ${data.status}` : undefined : undefined;
        if (accountStr) {
            conditionArr.push(accountStr);
        }
        if (phoneStr) {
            conditionArr.push(phoneStr);
        }
        if (status) {
            conditionArr.push(status);
        }
        return ctx.execSql(`select ${tableName}.*, ${groupTableName}.name as group_name from ${tableName} left outer join ${groupTableName} on ${tableName}.account_group_id = ${groupTableName}.id where ${conditionArr.join(" AND ")} LIMIT ${data.startIndex},${data.endIndex};`);
    },
    getAccountCount: (ctx, data) => {
        let conditionArr = ['meta_logic_flag=2'],
            accountStr = data.account ? `account like '%${data.account}%'` : undefined,
            phoneStr = data.phone ? `phone like '%${data.phone}%'` : undefined,
            status = data.status ? Number(data.status) !== -1 ? `status = ${data.status}` : undefined : undefined;
        if (accountStr) {
            conditionArr.push(accountStr);
        }
        if (phoneStr) {
            conditionArr.push(phoneStr);
        }
        if (status) {
            conditionArr.push(status);
        }
        return ctx.execSql(`select COUNT(*) AS totalCount from ${tableName} where ${conditionArr.join(" AND ")};`);
    },
    getAccountByAccount: (ctx, account) => {
        return ctx.execSql(`select * from ${tableName} where account = '${account}';`);
    },
    postAccountInfo: (ctx, postData) => {
        const {account, account_group_id, password, name, phone, status} = postData;
        return ctx.execSql(`insert into ${tableName}(account,account_group_id,password,name,phone,status) values(?,?,?,?,?,?) ;`, [account, account_group_id, password, name, phone, status]);
    },
    putAccountInfo: (ctx, postData) => {
        const {account_group_id, name, phone, status, id} = postData;
        return ctx.execSql(`update ${tableName} set account_group_id = ?,name = ?,phone = ?,status = ? where id=?;`, [account_group_id, name, phone, status, id]);
    },
    deleteAccountInfo: (ctx, id) => {
        return ctx.execSql(`update ${tableName} set meta_logic_flag = ? where id=?;`, [1, id]);
    },
};
