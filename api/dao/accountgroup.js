const tableName = "t_bas_account_group";
module.exports = {
    getAccountGroupList: (ctx, data) => {
        let conditionArr = [`meta_logic_flag=2`],
            nameStr = data.name ? `name like '%${data.name}%'` : undefined,
            status = data.status ? Number(data.status) !== -1 ? `status = ${data.status}` : undefined : undefined;
        if (nameStr) {
            conditionArr.push(nameStr);
        }
        if (status) {
            conditionArr.push(status);
        }
        return ctx.execSql(`select * from ${tableName} where ${conditionArr.join(" AND ")} LIMIT ${data.startIndex},${data.endIndex};`);
    },
    getAccountGroupCount: (ctx, data) => {
        let conditionArr = ['meta_logic_flag=2'],
            nameStr = data.name ? `name like '%${data.name}%'` : undefined,
            status = data.status ? Number(data.status) !== -1 ? `status = ${data.status}` : undefined : undefined;
        if (nameStr) {
            conditionArr.push(nameStr);
        }
        if (status) {
            conditionArr.push(status);
        }
        return ctx.execSql(`select COUNT(*) AS totalCount from ${tableName} where ${conditionArr.join(" AND ")};`);
    },
    getAccountByName: (ctx, name) => {
        return ctx.execSql(`select * from ${tableName} where name = '${name}';`);
    },
    postAccountGroupInfo: (ctx, postData) => {
        const {name, description, status, menu_ids} = postData;
        return ctx.execSql(`insert into ${tableName}(menu_ids, name,description,status) values(?,?,?,?) ;`, [menu_ids,name, description, status]);
    },
    putAccountGroupInfo:(ctx,postData)=>{
        const {name, description, status,menu_ids,id} = postData;
        return ctx.execSql(`update ${tableName} set menu_ids = ? ,name = ?,description = ?,status = ? where id=?;`,[menu_ids,name,description,status,id]);
    },
    deleteAccountGroupInfo:(ctx,id)=>{
        return ctx.execSql(`update ${tableName} set meta_logic_flag = ? where id=?;`,[1,id]);
    }
};
