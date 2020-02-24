<template>
  <el-container>
    <el-main style="padding:0px;">
      <!--表单操作-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
<!--          <el-form-item>-->
<!--            <el-input v-model="filters.courseId" placeholder="课程id"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="success" @click="handleSearch">搜索</el-button>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="success" @click="handleAdd" icon="el-icon-plus">录入成绩</el-button>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-button type="success" @click="handleAll">批量操作</el-button>-->
<!--          </el-form-item>-->
        </el-form>
      </el-col>
      <!--成绩列表-->
      <el-table :data="tableData" border ref="multipleTable" tooltip-effect="dark" >

        <el-table-column prop="courseID" label="课程id" width="160" sortable>
        </el-table-column>
        <el-table-column prop="credit" label="学分" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="house" label="教学楼" width="140" sortable>
        </el-table-column>
        <el-table-column prop="name" label="课程名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="room" label="教室" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="selectivetype" label="选课类型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="semester" label="学期" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="teachtype" label="课程类型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="time" label="学时" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="year" label="学年" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template scope="scope">
            <el-button type="small" @click="handleSarch(scope.$index,scope.row)" size="small" icon="el-icon-edit">查看该课程所有学生</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="studentTable" v-if="studentVisible" ref="multipleTable" tooltip-effect="dark" >
        <el-table-column prop="studentID" label="学生id" width="160" sortable>
        </el-table-column>
        <el-table-column prop="studentname" label="学生姓名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="140" sortable>
        </el-table-column>
        <el-table-column prop="sequencenumber" label="排名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="grade" label="成绩" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="300">
                <el-button type="small" @click="handleEdit(scope.$index,scope.row)" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>
      <!--添加成绩-->
<!--      <el-button type="small" @click="handleEdit(scope.$index,scope.row)" size="small" icon="el-icon-edit">编辑</el-button>-->
<!--      <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete">删除</el-button>-->
      <el-dialog title="添加成绩" :visible.sync="dialogVisible"  width="35%">
        <el-form ref="addGrad" :model="addGrad" label-width="80px" :rules="rules">
          <el-form-item  label="课程id" prop="name">
            <el-input v-model="addGrad.courseId"></el-input>
          </el-form-item>
          <el-form-item label="学生id" prop="type">
            <el-input v-model="addGrad.studentId"></el-input>
          </el-form-item>
          <el-form-item label="学生成绩">
            <el-input type="textarea" v-model="addGrad.grade"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="success"  @click.native="addSubmit">保存</el-button>
            </span>
      </el-dialog>
      <!--编辑成绩信息-->
      <el-dialog title="修改学生成绩" :visible.sync="editVisible" :before-close="handleClose" width="35%">
      <el-form  label-width="80px">
        <el-form-item label="成绩">
          <el-input type="number" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="editVisible=false">取消</el-button>
              <el-button type="success"  @click="handleSave">保存</el-button>
            </span>
    </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
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
        collapsed:false,
        tableData:[{
          courseID:'',
          credit:'',
          house:'',
          name:'',
          room:'',
          selectivetype:'',
          semester:'',
          teachtype:'',
          time:'',
          year:'',
        }],
        studentTable:[{
          grade: '',
          sequencenumber: '',
          sex:'',
          studentID:'',
          studentname:'',
        }],
        dialogVisible: false,
        editVisible:false,
        studentVisible:false,
        multipleSelection: [],
        //新增界面数据
        addGrad: {
          grade: '',
          sequencenumber: '',
          sex:'',
          studentID:'',
          studentname:'',
        },
        editGrad: {
          grade: '',
          sequencenumber: '',
          sex:'',
          studentID:'',
          studentname:'',
        },
        //查询
        filters:{
          courseId:''
        },
      }
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

      this.$ajax.get("http://10.28.255.88:5000/app/teacher/courselist",
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
      handleDel: function(row){
        alert("删除")
      },
      handleEdit: function(row) {
        alert("编辑")
      },
      handleAdd: function () {
        this.dialogVisible = true;
        this.addGrad = {
          courseId: '',
          courseName: '',
          studentId: '',
          grade: ''
        };
      },
      //获取页面数据，并追加字段后提交
      addSubmit: function () {
        this.tableData.push(this.addGrad);
      },
      //编辑页面
      handleSarch: function (row) {
        this.$ajax.get("http://10.28.255.88:5000/app/teacher/coursestudentlist",
          {
            params: {
              UUID: this.tableData[row].courseID,
            },
            headers: {
              "Authorization": "Bearer " + this.userinfo.token
            }
          }
        ).then(res => {
          this.studentVisible = true;
          this.studentTable = res.data.list;
        }).catch(err => {
          switch (err.response.status) {
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
          alert("2")
        });
      },
    }}
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
    margin:0px;
  }
</style>
