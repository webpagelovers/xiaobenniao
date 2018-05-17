export default async function(ctx) {
    let res = await ctx.models.cusDecOrder.getErrorCode(this.postData);
    return res.data
}
