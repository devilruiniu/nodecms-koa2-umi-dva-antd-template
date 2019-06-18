const tableName = "t_bas_menu";
const tableGroupName = 't_bas_account_group';
module.exports = {
    getMenu: (ctx) => {
        return ctx.execSql(`select * from ${tableName} where meta_logic_flag = 2 and status = 1 and parent_id not in (select id from ${tableName} where status = 2 or meta_logic_flag = 1)`);
    },
    getMenuList: (ctx, data) => {
        let conditionArr = ['meta_logic_flag = 2'],
            name = data.name ? `name like '%${data.name}%'` : undefined,
            status = data.status ? Number(data.status) !== -1 ? `status = ${data.status}` : undefined : undefined;
        if (name) {
            conditionArr.push(name);
        }
        if (status) {
            conditionArr.push(status);
        }
        return ctx.execSql(`select * from ${tableName} where ${conditionArr.join(" AND ")} LIMIT ${data.startIndex},${data.endIndex};`);
    },
    getMenuCount: (ctx) => {
        return ctx.execSql(`select COUNT(*) AS totalCount from ${tableName}  where meta_logic_flag = 2;`);
    },
    getMaxId: (ctx) => {
        return ctx.execSql(`select id from ${tableName} order by id DESC LIMIT 1;`);
    },
    postMenuInfo: (ctx, postData) => {
        let {parent_id, name, path, route, icon, level, status, is_nav_menu} = postData;
        return ctx.execSql(`insert into ${tableName}(parent_id,name,path,route,icon,level,status,is_nav_menu) values(?,?,?,?,?,?,?,?) ;`, [parent_id, name, path, route, icon, level, status, is_nav_menu]);
    },
    putMenuInfo: (ctx, postData) => {
        let { name,  route, icon, status, is_nav_menu,id} = postData;
        return ctx.execSql(`update ${tableName} set name = ?,route=?,icon=?,status=?,is_nav_menu=? where id=?;`, [name, route, icon, status, is_nav_menu, id]);
    },
    deleteMenuInfo: (ctx, id) => {
        return ctx.execSql(`update ${tableName} set meta_logic_flag = ? where id=?;`, [1, id]);
    },
    getMenuByAccountGroupId:(ctx,id)=>{
        // 如果账户组id为1，则直接返回所有的
        if(Number(id) === 1){
            return ctx.execSql(`select * from ${tableName} where meta_logic_flag = 2 and status = 1 and parent_id not in (select id from ${tableName} where status = 2 or meta_logic_flag = 1)`);
        }else{
            let findIdStr = `FIND_IN_SET(id,(select menu_ids from ${tableGroupName} where id = ${id}))`;
            // return ctx.execSql(`select * from ${tableName} where (${findParentIdStr} or ${findIdStr}) and meta_logic_flag = 2 and status = 1;`);
            return ctx.execSql(`select * from ${tableName} where (id in (select id from ${tableName} where ${findIdStr}) or parent_id in (select id from ${tableName} where ${findIdStr}) or id in (select parent_id from ${tableName} where ${findIdStr} and parent_id>0)) and meta_logic_flag = 2 and status = 1;`);
        }

    }
};
