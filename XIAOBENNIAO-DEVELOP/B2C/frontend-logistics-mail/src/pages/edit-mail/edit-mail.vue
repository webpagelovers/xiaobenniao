<template>
	<div >
		<page-head :title="'邮件'"></page-head>
		<nt-row class="operationBox " style="margin: 0;">
	        <!-- <nt-col :span="6" class="f16">
	        	<i to="/mail/list" @click="routeTo('/mail/list')" class="nt-icon nt-icon-arrow-left" style="cursor: pointer;"></i>
				{{type === 'edit' ? '修改' : '新增'}}邮件
	        </nt-col> -->
	        <nt-col :span="24" align="right">
	        	<nt-button type="primary" @click="sendMail()">发送</nt-button>
	            <nt-button type="primary" @click="sendDefiniteTime()">定时发送</nt-button>
	        	<nt-button type="primary" @click="sendMail('isDraft')">存草稿</nt-button>
				<nt-button type="primary" @click="close()">关闭</nt-button>
	        </nt-col>
	    </nt-row>
		<nt-form :model="postData" ref="postData" label-width="150px" class="contentBox">
			<nt-form-item label="发件人：" prop="sendMailAddress" :rules="[{required: true, message: '此项不能为空', trigger: 'change,blur' }]">
				<nt-select v-model="postData.sendMailAddress" placeholder="请选择" style="width: 300px">
					<nt-option
						v-for="item in tempData.senderList"
						:key="item"
						:label="item"
						:value="item">
					</nt-option>
				</nt-select>
			</nt-form-item>
			<nt-form-item label="收件人：" prop="mailReceiver" :rules="[
                { validator: isemail, message: '邮箱格式不正确', trigger: 'blur' },
				{ validator: delSame, trigger: 'blur' }]">
				<nt-input v-model="postData.mailReceiver" ref="mailReceiver" placeholder="请输入内容"></nt-input>
			</nt-form-item>
			<nt-form-item label="抄送：" prop="ccs" :rules="[
                { validator: isemail, message: '邮箱格式不正确', trigger: 'blur' },
				{ validator: delSame, trigger: 'blur' }]">
				<nt-input v-model="postData.ccs" placeholder="请输入内容"></nt-input>
			</nt-form-item>
			<nt-form-item label="密送：" prop="bccs" :rules="[
                { validator: isemail, message: '邮箱格式不正确', trigger: 'blur' },
				{ validator: delSame, trigger: 'blur' }]">
				<nt-input v-model="postData.bccs" placeholder="请输入内容"></nt-input>
			</nt-form-item>
			<nt-form-item label="主题：" prop="mailSubject" :rules="[{ max: 300, message: '主题超过300字', trigger: 'blur' }]">
				<nt-input v-model="postData.mailSubject" placeholder="请输入内容" :maxlength="300"></nt-input>
			</nt-form-item>
			<nt-form-item label="添加：" >
                <avatar-upload v-model="postData.attachs" :token="ctx.authentication.getToken()" :size="50" :limit="10" listType="text"
                    field-url="attachLocation" field-name="attachName" :file-uploaded="uploadSuccess"
					:action="ctx.servers.mail.options.baseURL + '/mailAttachmentInfo/attachUpload'"
                    accept="">
					<div slot="trigger">
					    <nt-button size="small" type="text">附件</nt-button>
					</div>
                </avatar-upload>
				<!-- <nt-button type="text">快速文本</nt-button> -->
			</nt-form-item>
			<nt-form-item label="正文：" prop="mailContent">
				<Editor ref="editor" v-model="postData.mailContent"></Editor>
			</nt-form-item>
		</nt-form>
		<nt-dialog
			title="定时发送"
			:visible.sync="tempData.isShowUpper.definiteTime"
			width="30%">
			<div>
				<nt-form :model="postData" ref="definiteTimeForm" label-width="150px" class="contentBox">
					<nt-form-item label="发送时间：" prop="definiteTime" :rules="[
						{ validator: validDefiniteTime, message: '请选择发送时间', trigger: 'blur,change' }]">
						<nt-date-picker
							v-model="postData.definiteTime"
							type="datetime"
							placeholder="选择日期时间">
						</nt-date-picker>
					</nt-form-item>
				</nt-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<nt-button type="primary" size="small" @click="sendMail('isOrderTime')">确 定</nt-button>
				<nt-button @click="tempData.isShowUpper.definiteTime = false" type="primary" size="small">取 消</nt-button>

			</span>
		</nt-dialog>
		<FullScreenPrompt ref="FullScreenPrompt"></FullScreenPrompt>
	</div>
</template>

<script>
import merge from 'deepmerge';

import { PageHead, AvatarUpload } from 'xbn-biz-components';
import {isemail} from 'xbn-biz-validate';
// import common from './../../models/common.js';
// element 日期格式化
import DateUtils from 'nt-element/src/utils/date';
import common from './../../models/common.js';
import Editor from './../../components/xbn-KindEditor.vue';
import FullScreenPrompt from './../../components/full-screen-prompt.vue';

export default {
    components: {
        PageHead,
		AvatarUpload,
		Editor,
		FullScreenPrompt
    },
	mixins: [common],
    data() {
        return {
            postData: {
				id: '',
				prefixMailId: '',
				sendMailAddress: '',
				sender: '',
				mailSubject: '',
				mailContent: '',
				attachs: [],
				bccs: '',
				ccs: '',
				definiteTime: '',
                // 收件人
				// reveivers: []
				reveivers: [],
				mailReceiver: '',
				sendFlag: '1'
            },
            tempData: {
				isShowUpper: {
					definiteTime: false
				},
        		addressee: '',
        		restaurants: [],
				senderList: []
			},
			base: {},
			type: '',
			source: ''
        }
    },
    methods: {
		isemail,
		uploadSuccess(res, obj){
			return res.response.data;
		},
		delSame(rules, value, callback) {
			if (value) {
				let obj = {};
				let arr = [];
				value.split(',').map((v) => {
					obj[v] = v;
				});
				for (let item in obj) {
					arr.push(item);
				}
				this.postData[rules.field] = arr.join(',');
			}
			callback();
		},
		close() {
			this.$confirm('您正在编辑内容，是否保存内容至草稿箱？', '提示', {
				confirmButtonText: '是',
				cancelButtonText: '否',
				type: 'warning'
			}).then(async () => {
				let res = await this.postSendMail('isDraft');
				if (res && res.statusCode === '2000000') {
					this.goBack();
				}
			}).catch(async () => {
				this.goBack();
			});
		},
        // 校验定时发送时间
		validDefiniteTime(rule, value, callback) {
	        if (value === '') {
	        	callback(new Error());
	        } else {
	        	callback();
	        }
	    },
        /* 表单提交 发送*/
        async sendMail(specialStatu) {
			if (specialStatu === 'isDraft') {
				let res = await this.postSendMail(specialStatu);
				if (res && res.statusCode === '2000000') {
					this.afterPostMail(specialStatu, res);
				}
				return;
			}
            this.$refs['postData'].validate(async (valid) => {
                if (valid) {
					let isGoon = true;
					if (specialStatu === 'isOrderTime') {
                        // 定时发送校验
						this.$refs['definiteTimeForm'].validate((innerValid) => {
						    if (!innerValid) {
								isGoon = false;
							}
							if (new Date() >= this.postData.definiteTime) {
								isGoon = false;
								this.$message({
									message: '选择的定时发送时间小于当前时间，不可以发送。',
									type: 'warning'
								});
							}
						});
					}
					if (!isGoon) {
						return;
					}
					let hasAddressee = false;
					if (!(this.postData.mailReceiver || this.postData.ccs || this.postData.bccs)) {
						this.$message({
							message: '请输入收件人或抄送或密送人',
							type: 'warning'
						});
						return;
					}
					if (this.postData.mailSubject === '') {
						this.$confirm('邮件主题为空，确定要发送吗？', '提示', {
				            confirmButtonText: '确定',
				            cancelButtonText: '取消',
				            type: 'warning'
				        }).then(async () => {
				            let res = await this.postSendMail(specialStatu);
							if (res && res.statusCode === '2000000') {
								this.afterPostMail(specialStatu, res);
							}
				        }).catch(() => {
							// nothing
				        });
					} else {
						let res = await this.postSendMail(specialStatu);
						if (res && res.statusCode === '2000000') {
							this.afterPostMail(specialStatu, res);
						}
					}
                } else {
                    return false;
                }
            });
        },
		async postSendMail(specialStatu) {
			try {
				let params = this.formatParams(this.postData, specialStatu);
				let res = null;
				if (specialStatu === 'isDraft') {
					if (this.type === 'edit') {
						// 编辑草稿
						res = await this.$nt.models.mail.sendMailDraft(params);
					} else {
						// 保存草稿，首次和之后是不同接口
						res = await this.$nt.models.mail.sendMail(params);
					}
				} else {
					// 如果是编辑草稿的发送，也是另外的接口
					if (this.type === 'edit') {
						res = await this.$nt.models.mail.sendMailDraft(params);
					} else {
						res = await this.$nt.models.mail.sendMail(params);
					}
				}
				return res;
			} catch (err) {
				//交给框架处理的异常
				this.ctx.onerror(err);
			}
		},
		afterPostMail(specialStatu, res) {
			let that = this;
			if (specialStatu === 'isOrderTime') {
				// 定时发送，显示发送时间页面
				let that = this;
				this.$refs.FullScreenPrompt.show({
					title: '邮件定时发送设置成功',
					content: '邮件已暂时为您保存到「草稿箱」，并在指定的时间为您发出。',
					btns:  [{
						icon: 'xbn-19',
						text: '查看此邮件',
						clickFn: () => {
							that.$router.push('/mail/mailInfo/' + res.data + '?source=' + (that.source || 'outboxList'));
						}
					}, {
						icon: 'xbn-20',
						text: '再写一封',
						clickFn: () => {
							that.$router.push('/mail/writeMail/new');
							that.$router.go(0);
						}
					}]
				});
			} else if (specialStatu === 'isDraft') {
				this.$message({
					message: '邮件保存成功！',
					type: 'success'
				});
				this.postData.id = res.data;
				this.$router.push('/mail/writeMail/edit/' + res.data);

			} else {
				// 立即发送成功，参照定时发送效果
				let that = this;
				this.$refs.FullScreenPrompt.show({
					title: '邮件发送成功',
					content: '您可以到「发件箱」中查看',
					btns:  [{
						icon: 'xbn-19',
						text: '查看此邮件',
						clickFn: () => {
							that.$router.push('/mail/detailMail/2/' + res.data + '?source=' + (that.source || 'outboxList'));
						}
					}, {
						icon: 'xbn-20',
						text: '再写一封',
						clickFn: () => {
							that.$router.push('/mail/writeMail/new');
							that.$router.go(0);
						}
					}]
				});
			}
		},
        // 定时发送
		sendDefiniteTime() {
			this.tempData.isShowUpper.definiteTime = true;
        	this.$refs['definiteTimeForm'] && this.$refs['definiteTimeForm'].resetFields();
		},

		// 格式化请求数据
		formatParams(params, specialStatu) {
			let tempPostData = merge({}, params);
            // 格式化 收件人
			if (tempPostData.mailReceiver) {
				tempPostData.reveivers = tempPostData.mailReceiver.split(',').map((item, index) => {
					return {
						contactMail: item,
						nickName: '',
						sort: index + 1
					}
				});
			} else {
				tempPostData.reveivers = [];
			}
            // 格式化 抄送
			if (tempPostData.ccs) {
				tempPostData.ccs = tempPostData.ccs.split(',').map((item, index) => {
					return {
						contactMail: item,
						nickName: '',
						sort: index + 1
					}
				});
			} else {
				tempPostData.ccs = [];
			}
            // 格式化 密送
			if (tempPostData.bccs) {
				tempPostData.bccs = tempPostData.bccs.split(',').map((item, index) => {
					return {
						contactMail: item,
						nickName: '',
						sort: index + 1
					}
				});
			} else {
				tempPostData.bccs = [];
			}
            // 正文
			tempPostData.mailContent = this.$refs.editor.fullHtml();
            // 定时发送 格式化
			if (tempPostData.definiteTime) {
				tempPostData.definiteTime = DateUtils.format(tempPostData.definiteTime, 'yyyy-MM-dd HH:mm:ss');
			}
            // 草稿 or 立即发送
			if (specialStatu === 'isDraft') {
				tempPostData.sendFlag = '2';
			}
			return tempPostData;
		},
		async getMailInfoById(id) {
			try {
				// 请求草稿邮件信息 - 带入信息
				let mailInfo = await this.$nt.models.mail.mailInfo({id: id});
				return mailInfo.data;
			} catch (err) {
				//交给框架处理的异常
				this.ctx.onerror(err);
			}
		},
		// 页面初始化方法
		async init() {
			this.type = this.$route.params.type;
			this.source = this.$route.params.source;
            // 获取 发件人 列表
			try {
				let res = await this.$nt.models.mail.listUserEmail();
				this.tempData.senderList = res.data;

				let id = this.$route.params.id;
	            // 以下 - 带状态初始化
				if (this.type === 'new') {
					// 全新邮件 - 空内容
					this.postData.sendMailAddress = this.tempData.senderList[0];
				} else {
					try {
						let mailInfo = null;
						if (id) {
							mailInfo = await this.getMailInfoById(id);
						}
						if (this.type === 'edit') {
							// 草稿箱 进入
							this.postData.id = id;
							this.postData = merge(this.postData, mailInfo);
							if (this.postData.ccs) {
								this.postData.ccs = this.postData.ccs.map((v) => {
									return v.contactMail
								}).join(',');
							}
							if (this.postData.bccs) {
								this.postData.bccs = this.postData.bccs.map((v) => {
									return v.contactMail
								}).join(',');
							}
						} else {
							if (this.type === 'reply' || this.type === 'replyAll') {
								// 回复
								this.postData.prefixMailId = id;
                                // 设置 - 收件人
								if (this.type === 'replyAll') {
			                        // 回复全部 - 所有收件人都添加到收件人列表
									let tempArr = [];
									for (let i = 0, len = mailInfo.receivers.length; i < len; i++) {
										let item = mailInfo.receivers[i];
										if (item.contactMail !== this.postData.sendMailAddress) {
											tempArr.push(item.contactMail);
										}
									}
									// 设置抄送
									if (mailInfo.ccs) {
										this.postData.ccs = mailInfo.ccs.map((v) => {
											return v.contactMail
										}).join(',');
									}
									// sendOrReceive
									// 收件箱 2
									// 发件箱 1

									if (mailInfo.mailType === '2' || (mailInfo.mailType === '4' && mailInfo.sendOrReceive === '1')) {
										// 发件箱的时候，收件人不用加上一封邮件的发件人
										this.postData.mailReceiver = tempArr.join(',');
									} else if (mailInfo.mailType === '1' || (mailInfo.mailType === '4' && mailInfo.sendOrReceive === '2')) {
										// 收件箱
										this.postData.mailReceiver = mailInfo.sendMailAddress + ',' + tempArr.join(',');
									}
								} else {
				                    // 回复邮件的发件人 = 此处的收件人
									this.postData.mailReceiver = mailInfo.sendMailAddress;
								}
		                        // 设置回复主题
								this.postData.mailSubject = '回复：' + mailInfo.mailSubject;
							} else if (this.type === 'relay') {
		                        // 转发
								// 设置回复主题
								this.postData.mailSubject = '转发：' + mailInfo.mailSubject;
		                        // 收件人 置空 鼠标至收件人
								this.postData.mailReceiver = '';
								this.$refs.mailReceiver.focus();
							}
							// 设置发件人
							if (mailInfo.mailType === '2' || (mailInfo.mailType === '4' && mailInfo.sendOrReceive === '1')) {
								// 发件箱信件的转发，发件人 = 上一封邮件的发件人
								this.postData.sendMailAddress = mailInfo.sendMailAddress;
							} else if (mailInfo.mailType === '1' || (mailInfo.mailType === '4' && mailInfo.sendOrReceive === '2')) {
								// 收件箱信件的回复，发件人 = 上一封邮件的收件人
								let that = this;
								let realSender = mailInfo.receivers.filter((v) => {
									return that.tempData.senderList.indexOf(v.contactMail) !== -1
								});
								if (realSender[0]) {
									this.postData.sendMailAddress = realSender[0].contactMail;
								}
							}
	                        // 设置邮件正文内容
							this.postData.mailContent = `
								<br /><br /><br /><br /><br />----------原始邮件----------<br />
								<div style="background-color: #d3d3d3;">
									<p>
										<strong>发件人：</strong>${mailInfo.sendMailAddress}
									</p>
									<p>
										<strong>发送时间：</strong>${mailInfo.sendTime}
									</p>
									<p>
										<strong>收件人：</strong>${mailInfo.mailReceiver}
									</p>
									<p>
										<strong>抄送：</strong>${mailInfo.ccs.map((v) => { return v.contactMail})}
									</p>
									<p>
										<strong>主题：</strong>${mailInfo.mailSubject}
									</p>
								</div>
								${mailInfo.mailContent}
							`;
						}
					} catch (err) {
						//交给框架处理的异常
						this.ctx.onerror(err);
					}
				}
				let that = this;
				this.$refs.editor.initEditor({
					afterCreate() {
	                    // 这里的this，是editor了
						this.html(that.postData.mailContent);
						// K.appendHtml(expr, val)
						if (that.type !== 'relay' && that.type !== 'edit' && that.type !== 'new') {
							// 如果不是转发，编辑器获取焦点
							this.focus();
						}
					}
				});
			} catch (err) {
				//交给框架处理的异常
				this.ctx.onerror(err);
			}
		}
    },
	async created () {
        // 直接把数据字典写入 data.base
		// this.initBaseDictionary();
        // 页面初始化
		// this.init();
    },
	mounted() {
		this.init();
    },
	watch: {
		'$route' (to, from) {
			// 对路由变化作出响应...
			if (to.matched[0].path === from.matched[0].path) {
				// this.$router.go(0);
				this.$route.params.id = to.params.id;
				this.$route.params.type = to.params.type;
				this.$route.params.source = to.params.source;
				this.$refs.postData.resetFields();
				this.init();
			}
		}
	}
}
</script>

<style lang="less">
	.box_line{
		border: 1px solid #dfe3ec;
	}
	.box_Ntline{border-top:none;}
	.img {
		border: 1px solid #dfe3ec;
		width: 80px;
		height: 80px;
	}
	.inlineBlock {
		display: inline-block;
	}
	.w752{width:752px;}
	.triangle-topleft {
		width: 0;
		height: 0;
		border-top: 100px solid #f3f3f4;
		border-right: 100px solid transparent;/*左上角三角形*/
	}
	.case_number{
		position: absolute;
		top:-90px;
		left:12px;
		color:#9fa1a2;
	}/*箱号的定位*/
	.w32{width:32px;}
	.pL24{padding-left:24px;}
	.pB24{padding-bottom:24px;}
	.mB16{margin-bottom: 16px;}
	.w150{width:150px;}
	.w610{width:610px;}
	.f48{font-size: 48px;}
	.f18{font-size: 18px;}
	.pT16{padding-top:16px;}
	.pB10{padding-bottom:10px;}
	.pR40{padding-right:40px;}
	.pR32{padding-right:24px;}
	.pLRbox{padding:0 32px 25px}
	.mR10{margin-right: 10px;}
	.mT10 {margin-top: 10px;}
	.pT24a {padding-top: 24px;padding-bottom: 0px;}
	.x_bz90 .nt-textarea__inner{height: 90px;}
	.forecatPlaformInfor .forecatCompeting_infor:first-child{ padding-top: 24px;border-top:none;}
	.forecatPlaformInfor .forecatCompeting_infor{padding: 0px 32px 24px 32px;}
	.edit_Q .nt-dialog--small{min-width:760px;}
	.w460 {width:460px;}
	// .boxListDiv .border_dashed:first-child { border-top: none; padding-top: 0;}
	.input_Boxmargin .nt-form-item.is-error{margin-top: 30px;}
	.right_img textarea{outline:none;resize:none;}
</style>
