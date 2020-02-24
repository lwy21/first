<template>
  <div>
    <div class="outer_label">
      <img src="@/assets/logo.png">
    </div>
    <div class="login_form">
      <span class="icon el-icon-user"></span>
      <input type="text"  class="qxs-icon "  placeholder="用户名" v-model="userinfo.userId">
      <br/>
      <span class="icon el-icon-star-on"></span>
      <input type="password"  class="qxs-icon"  placeholder="密码" v-model="userinfo.passWord">
      <br/>
      <el-button class="btn btn-primary login_btn" @click.native="login" type="primary" round :loading="isBtnLoading">登录</el-button>
      <el-button class="btn btn-primary login_btn" @click.native="forget" type="primary" round :loading="isBtnLoading">忘记密码</el-button>
      <!--<button class="login_btn el-button el-button&#45;&#45;primary is-round" type="primary" round>登录</button>-->
    </div>
  </div>
</template>



<script>
  import md5 from 'js-md5';
  let Base64 = require('js-base64').Base64;
  export default {
    data() {
      return {
        userinfo: {
          userId: '2016211245',
          passWord: 'student',
          userPermisos: '',
          token:'',
          name:''
        },
        isBtnLoading: false
      }
    },
    created () {
      // if(JSON.parse( localStorage.getItem('user')) && JSON.parse( localStorage.getItem('user')).userName){
      //   this.userName = JSON.parse( localStorage.getItem('user')).userName;
      //   this.passWord = JSON.parse( localStorage.getItem('user')).passWord;
      // }
    },
    computed: {
      btnText() {
        if (this.isBtnLoading) return '登录中...';
        return '登录';
      }
    },
    methods: {

      login() {
        var str=this.userinfo.userId+":"+this.userinfo.passWord;
        str=Base64.encode(str)
        if (!this.userinfo.userId) {
          this.$message.error('请输入用户名');
          return;
        }else  if (!this.userinfo.passWord) {
          this.$message.error('请输入密码');
          return;
        }else this.$ajax.post("http://10.28.255.88:5000/app/login",{},
          {
            headers:{
              "Authorization":"Basic "+str
            }
         }
        ).then(res=>{
          console.log(res.data);
          let data=res.data;
          this.userinfo.token=data.token;
          this.userinfo.userPermisos=data.permission;
          this.userinfo.name=data.name;
          if(!window.localStorage){
            alert('您的浏览器不支持localStorage')
          }else{
            localStorage.clear()
            localStorage.setItem('userInfo',JSON.stringify(this.userinfo));
            this.$router.push("home")
          }
        }).catch(err=>{
          switch(err.response.status){
            case 401:
              alert("未登录");
              break;
            case 404:
              alert("请求失败");
              break;
            case 403:
              alert("没有权限");
              break;
            case 410:
              alert("帐号或密码错误");
              break;
            default:
              alert("未知错误");
              break;
          }
        })

        // axios.post("http://api.komavideo.com/news/list").then(res=>{
        //   console.log(res);
        // }).catch(error=>{
        //   console.log(error);
        // });
        // axios.get("http://api.komavideo.com/news/list").then(res=>{
        //   console.log(res);
        // }).catch(error=>{
        //   console.log(error);
        // });
        // alert("用户名"+this.userName+"密码"+this.password)
        // home.userName=his.userName;
        // home.passWord=this.password;

      },
      forget(){
        alert("未实现功能")
      }
    }
  }
</script>
<style>
  .login_form {
    padding-top: 10%;
    padding-left: 10%;
    padding-right: 10%;
  }
  .qxs-ic_user {
    background: url('../../assets/login/ic_user.png.png') no-repeat;
    width: 50%;
    background-size: 13px 15px;
    background-position: 3%;
  }
  .qxs-ic_password {
    background: url('../../assets/login/ic_password.png.png') no-repeat;
    background-size: 13px 15px;
    background-position: 3%;
    width: 50%;
    margin-bottom: 20px;
  }
  .login_logo {
    height: 100%;
  }
  .login_btn {
    position: center;
    width: 20%;
    font-size: 16px;
  }
</style>
