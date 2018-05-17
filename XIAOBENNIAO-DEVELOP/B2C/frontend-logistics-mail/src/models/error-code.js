

export default async function(ctx) {
    let res = await ctx.models.mail.getErrorCode(this.postData);
    // let error = {};
    // for (let item of res.data) {
    //     for (let jtem in item) {
    //         error[jtem] = item[jtem];
    //     }
    // }
    return res.data
}
