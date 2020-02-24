<!--查询模块：负责学生查询自己的基本信息和成绩，教师查询成绩和个人基本信息，管理员查询基本信息情况-->
<!--录入模块：以教师的角色登录，允许录入成绩；以管理员身份登录允许录入人员和课程信息；-->
<!--修改模块：以教师的角色登录，允许修改成绩；以管理员身份登录允许修改人员和课程信息；系统配置模块：密码修改和重置等-->
<!--统计模块：统计各分数段学生的成绩分布， 画出直方图和饼图。-->
<template>
  <div id="home">
    <el-container class="con_section">
      <el-header class="blueheader">
        <h2 class="headlogo">教务管理系统</h2>
        <el-col :span="3" class="userinfo">
          <el-dropdown @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu  :visible.sync="see" slot="dropdown">
              <el-dropdown-item command="showInfo">查看用户信息</el-dropdown-item>
              <el-dropdown-item command="cleanPassword">修改电话号码</el-dropdown-item>
              <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout"> 退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span id="home">{{ userinfo.name }}</span>
        </el-col>
      </el-header>
      <el-container>
        <el-aside style="flex: 0 0 230px;width: 230px;background:#eef1f6">
          <el-menu default-active="1"  class="el-menu-vertical-demo" @select="handleSelect">
            <el-submenu index="1" v-if="p1">
              <template slot="title" ><i class="el-icon-message"></i>教师系统</template>
              <el-menu-item index="1">录入修改成绩</el-menu-item>
              <el-menu-item index="2">统计数据</el-menu-item>
            </el-submenu>
            <el-submenu index="2" v-if="p2">
              <template slot="title"><i class="el-icon-message"></i>查询系统</template>
              <el-menu-item index="3">成绩查询</el-menu-item>
            </el-submenu>
            <el-submenu index="3" v-if="p3">
              <template slot="title"><i class="el-icon-message"></i>管理系统</template>
              <el-menu-item index="4">课程管理</el-menu-item>
              <el-menu-item index="5">学生管理</el-menu-item>
              <el-menu-item index="6">教师管理</el-menu-item>
              <el-menu-item index="7">部门信息</el-menu-item>
<!--              <h1 :visible.sync="p1">123</h1>-->
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="home_main">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24">
            <div style="margin-top:10px">
              <router-view></router-view>
            </div>
          </el-col>
        </el-main>

        <el-dialog title="修改密码" :visible.sync="editPassword" :before-close="handleClose" width="35%">
          <el-form  label-width="80px">
            <el-form-item label="新密码">
              <el-input type="password" v-model="newPassword.p1"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input type="password" v-model="newPassword.p2"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="editPassword=false">取消</el-button>
              <el-button type="success"  @click="handlechangePassword">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改电话号码" :visible.sync="editPhone" :before-close="handleClose" width="35%">
          <el-form  label-width="80px">
            <el-form-item label="新号码">
              <el-input type="password" v-model="newPassword.p1"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="editPassword=false">取消</el-button>
              <el-button type="success"  @click="handlechangePhone">保存</el-button>
            </span>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    el:'#home',
    data(){
      return {
        userinfo: {
          userId: '',
          passWord: '',
          userPermisos: '',
          token:'',
          name:''
        },
        searchCriteria: '',
        p1:1,
        p2:1,
        p3:1,

        // p1:false,
        // p2:false,
        // p3:false,
        editPassword:false,
        editPhone:false,
        newPassword:{
          p1:"",
          p2:''
        },
        newPhoneNumber:"",
      }
    },
    mounted(){
      var data1 = localStorage.getItem('userInfo');
      var data2 = JSON.parse(data1);
      alert(data1)
      this.userinfo.name =data2.name;
      this.userinfo.token =data2.token;
      this.userinfo.userId =data2.userId;

      switch (this.userinfo.userPermisos) {
        case 'S':
          this.p1=true
          break
        case  'T':
          this.p2=true
          break
        case 'A':
          this.p3=true
              break
      }
    },
    methods:{
      handlechangePhone(){
        if(this.newPhoneNumber.length<8)
          this.$message.error("格式不符合")

        this.$ajax.POST("http://10.28.255.88:5000/app/user/password",qs.stringify({instance:JSON.stringify(this.newPhoneNumber)}),
          {
            headers:{
              "Authorization":"Bearer "+this.userinfo.token
            },
            newpassword:this.newpassword.p1
          }
        ).then(res=>{
          alert("成功")
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
          }
        })
      },
      handlechangePassword(){
        alert("按了")
        if(this.newPassword.p1==this.newPassword.p2){
          this.$ajax.POST("http://10.28.255.88:5000/app/user/password",qs.stringify({instance:JSON.stringify(this.password.p1)}),
            {
              headers:{
                "Authorization":"Bearer "+this.userinfo.token
              },
            }
          ).then(res=>{
            alert("修改密码")
          }).catch(err=>{
            alert("错误")
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
          this.editPassword=false;
        }else{
          this.$message.error("两次输入密码不一致")
        }
      },
      handleSelect(key, keyPath){
        switch(key){
          case '1':
            this.$router.push('/grade');
            break;
          case '2':
            this.$router.push('/forms')
            break;
          case '3':
            this.$router.push('/mygrade')
            break;
          case'4':
            this.$router.push('/courseManage')
                break;
          case'5':
            this.$router.push('/peopleManage')
            break;
          case'6':
            this.$router.push("/teacherManage")
                break;
          case'7':
            this.$router.push("/department")
                break;
        }
      },
      showUserInfo(){
        this.$ajax.get("http://10.28.255.88:5000/app/user/detailedinfo",
          {
            psrams:{},
            headers:{
              "Authorization":"Bearer "+this.userinfo.token
            }
          }
        ).then(res=>{

          let str= "学号"
          str+=res.data.studentID;
          str+="\n姓名"
          str+=res.data.name;
          str+="\n性别"
          str+=res.data.sex;
          str+="\n身份证"
          str+=res.data.IDcard;
          str+="\n手机号"
          str+=res.data.phonenumber;
          str+="\n系"
          str+=res.data.departmentname;
          if(this.userinfo.userPermisos=='S'){
            str+="\n班级"
            str+=res.data.classID;
            str+="\n专业"
            str+=res.majorname;
          }
          alert(str);
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
              alert("未知错误")
          }
        })
      },
      handleCommand(command) {
        switch (command) {
          case'showInfo':
            this.showUserInfo()
            break;
          case 'logout':
            this.$router.push('/')
            break
          case 'changePassword':
            this.editPassword=true;
            break
          case 'cleanPassword':
            this.editPhone=true;
            break
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .con_section{
    position: absolute;
    top: 0px;
    bottom: 0px;
    left:0px;
    width:100%;
  }
  .blueheader {
    height: 60px;
    line-height: 60px;
    background: #67c23a;
    color: #fff;
  }
  .headlogo{
    float: left;
    height: 60px;
    margin: 0 20px;
    width: 300px;
  }
  .userinfo{
    position: absolute;
    right: 0px;
  }
  .home_main{
    padding:10px;
  }
  .breadcrumb-container .title {
    width: 200px;
    float: left;
    color: #475669;
    font-size: 13px;
  }
  .breadcrumb-inner {
    float: right;
    font-size: 13px;
  }
</style>
