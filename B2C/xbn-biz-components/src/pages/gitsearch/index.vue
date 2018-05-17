<template>
    <div class="app-container">
        <div class="git-huber-search">
            <div>
                <nt-input
                        placeholder="搜索Git用户名"
                        :icon="searchIcon"
                        v-model="githuberName"
                        :on-icon-click="handleReset">
                </nt-input>
                <nt-button type="primary" icon="search" @click="handleIconClick">搜索</nt-button>
            </div>
        </div>

        <div class="search-result" v-if="searched">
            <nt-table
                    ref="multipleTable"
                    :data="gitusers"
                    border
                    style="width: 100%">
                <nt-table-column
                        label="Rank"
                        width="85">
                    <template slot-scope="props">
                        {{props.row.score}}
                    </template>
                </nt-table-column>

                <nt-table-column
                        width="160">
                    <template slot-scope="props">
                        <img class="avatar" :src="props.row.avatar_url">
                    </template>
                </nt-table-column>

                <nt-table-column
                        prop="id"
                        label="用户ID"
                        sortable
                        width="150">
                </nt-table-column>
                <nt-table-column
                        prop="login"
                        label="登录账号"
                        width="100">
                </nt-table-column>

                <nt-table-column
                        prop="type"
                        label="Type"
                        width="100">
                </nt-table-column>
            </nt-table>

            <nt-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="count"
                    layout="total, sizes, prev, pager, next, jumper, slot"
                    :total="total">
            </nt-pagination>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                //搜索栏数据
                searchIcon: 'close',
                searched: false,
                githuberName: '',
                //表格、分页组件数据
                total: 0,
                count: 10,
                current: 1,
                gitusers: [],
            };
        },

        beforeCreate: function() {

        },

        created: async function() {
            this.logger.log('这个等同于原来的console.log', '但是全局还是能关闭的');
            this.logger.style(' style 方法调用，可以增加样式并提供打印当前vue文件位置');
            this.logger.style(' style 常用 *斜体*  _粗体_ ');

            this.ctx.authentication.setToken('xkie');

            await this.searchByUser();
        },

        watch: {

        },

        methods: {
            /**
             * 搜索用户
             * @returns {Promise.<void>}
             */
            searchByUser: async function() {
                if(this.$route.params.user) {
                    this.githuberName = this.$route.params.user;
                    //设置为搜索样式
                    this.searchIcon = 'loading';
                    const {total_count, items} = await this.ctx.models.githuber.searchGitUser({
                        user: this.githuberName
                    });

                    this.searched = true;
                    this.total = total_count;
                    this.gitusers = items;
                    //恢复搜索图标的样式
                    this.searchIcon = 'close';
                } else {
                    this.searched = true;
                    this.total = 0;
                    this.gitusers = [];
                    return;
                }
            },

            handleReset: function() {
                this.githuberName = '';
                this.$router.replace('./');
            },

            handleIconClick: function(ev) {
                if (this.searchIcon==='loading') {
                    return;
                }
                //设置搜索图标为loading形态
                this.searchIcon = 'loading';

                //执行路由替代， 更改url
                this.$router.replace(this.githuberName);
                //this.searchByUser();
                //路由修改地址
                //this.ctx.replace(this.githuberName);
                //this.ctx.page('#!/githuber/search/' + this.githuberName);
            },

            handleSizeChange(val) {

            },
            handleCurrentChange(val) {

            }
        }
    };
</script>


<style lang="less">

    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }

    .app-container {
        padding: 20px;

        .el-input {
            width: 400px;
        }
    }

    .example {
        color: red;
    }

    .userEntry {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 5px;

        &:hover {
            cursor: pointer;
            background-color: rgba(50, 65, 87, 0.03);
        }
        .order {
            width: 70px;
            border: 1px solid #eee;
            text-align: center;

            .seq {
                height: 35px;
                font-size: 24px;
                color: #666;
                border-bottom: 1px solid #eee;
                line-height: 35px;
                &.top {
                    color: green;
                }
            }
            .score {
                color: #999;
            }
        }
        .thumb {
            width: 60px;
            margin: 0px 10px;
            img {
                width: 60px;
                height: 60px;
                border-radius: 30px;
            }
        }
        .name {
            padding: 5px;
            font-size: 18px;
        }
    }
</style>