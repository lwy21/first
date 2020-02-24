<template>
  <el-container>
    <el-main style="padding:0px;">
      <!--查询框-->
      <el-col :span="24" class="toolbar">
<!--        <el-form :inline="true" :model="filters">-->
<!--          <el-form-item>-->
<!--            <el-input v-model="searchId" placeholder="课程id"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="success"  @click="search" >搜索</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
      </el-col>
      <!--成绩列表-->
      <el-table :data="tableData" border ref="multipleTable" tooltip-effect="dark">
        <el-table-column prop="departmentName" label="身份证" width="160" sortable>
        </el-table-column>
        <el-table-column prop="departmentID" label="学院" width="140" sortable>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template scope="scope">
            <el-button type="small" @click="handleEdit(scope.$index,scope.row)" size="small" icon="el-icon-edit">显示该部门所有学生</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="departmentTeacher" v-if="teacherVisible" border ref="multipleTable" tooltip-effect="dark">
        <el-table-column prop="IDcard" label="身份证" width="160" sortable>
        </el-table-column>
        <el-table-column prop="departmentname" label="学院" width="140" sortable>
        </el-table-column>
        <el-table-column prop="name" label="姓名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sex" label="教学楼" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="teacherID" label="姓名" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
  import Vue from 'vue'
  import axios from 'axios'

  export default {
    data() {
      return {
        userinfo: {
          userId: '',
          passWord: '',
          userPermisos: '',
          token:'',
          name:''
        },
        tableData:[{
          departmentID: "",
          departmentName: ""
        }],
        departmentTeacher:[{
          IDcard: "",
          departmentname: "",
          name: "",
          phonenumber: "",
          sex: "",
          teacherID: ""
        }],
        filters:{
          name:''
        },
        teacherVisible:false,
        searchId:""
      }
    },
    created: function () {
      var data = [];
      Vue.prototype.$http = axios;
      let _this = this;
      // 请求后台数据，渲染表格
      // this.$http.get('../static/table.json').then(function (res) {
      //   console.log(res);
      //   console.log(res.data.chanpin.length);
      //   var datas = res.data.chanpin;
      //   for (let i = 0; i < datas.length; i++) {
      //     var obj = {};
      //     obj.courseId = datas[i].courseId;
      //     obj.courseName = datas[i].courseName;
      //     obj.grade = datas[i].grade;
      //     data[i] = obj;
      //   }
      //   _this.tableData = data;
      //   //读取历史操作记录，渲染卡片
      // }).catch(function (error) {
      // })
    },
    mounted(){
      var data1 = localStorage.getItem('userInfo');
      var data2 = JSON.parse(data1);
      //alert(data1)
      this.userinfo =data2;
      switch (this.userinfo.userPermisos) {
        case 'S':
          this.p1=true;
          break;
        case  'T':
          this.p2=true;
          break;
        case 'A':
          this.p3=true;
          break
      }

      this.$ajax.get("http://10.28.255.88:5000/app/admin/departmentlist",
        {
          params:{},
          headers:{
            "Authorization":"Bearer "+this.userinfo.token
          }
        }
      ).then(res=>{
          this.tableData=res.data.list;
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
    },
    methods: {
      handleEdit:function(row){
        this.teacherVisible = true;
        this.$ajax.get("http://10.28.255.88:5000/app/admin/departmentteacherlist",
          {
            params:{
              UUID:this.tableData[row].departmentID,
            },
            headers:{
              "Authorization":"Bearer "+this.userinfo.token
            }
          }
        ).then(res=>{
          this.departmentTeacher=res.data.list;
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
          }
        });
      },
      handleRow: function (index) {
        alert(index)
      },
      search(){
        alert("功能未实现")

      }
    }
  }
</script>
<style>
  .toolbar{
    margin-bottom: 10px;
    background: #f2f2f2;
    padding: 10px 10px 0 10px;
  }
  thead tr{
    background: rgb(238, 241, 246) !important;
    color:#000;
  }
  .el_card_body p{
    margin:0;
  }
</style>
