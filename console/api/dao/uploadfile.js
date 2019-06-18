// uploadfile.js---此文件仅用来作为上传示例查看，根据业务逻辑中具体的情况，完成对应的操作
const tableName = "upload_file";
module.exports = {
    uploadFile:(ctx,postData)=>{
        return ctx.execSql(`insert into ${tableName} values (?,?,?)`, [null,postData.url, postData.fileName]);
    },
    getAllFiles:(ctx)=>{
        return ctx.execSql(`select * from ${tableName}`);
    }
};
