

export default async function(ctx) {
    let res = await ctx.models.taxrefund.getErrorCode(this.postData);
    return res.data
}
