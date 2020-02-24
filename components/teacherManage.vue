




<template>
  <el-container>
    <el-main style="padding:0px;">
      <!--表单操作-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">

          <!--          查询-->
          <el-form-item>
            <!--            <el-input v-model="filters.courseId" placeholder="人员id"></el-input>-->
            <!--          </el-form-item>-->
            <!--          <el-form-item>-->
            <!--            <el-button type="success" @click="handleSearch">查询人员信息</el-button>-->
            <!--          </el-form-item>-->
            <!--          <el-form-item>-->
            <el-button type="success" @click="handleAdd" icon="el-icon-plus">添加教师</el-button>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-button type="success" @click="handleAdd" icon="el-icon-plus">查询课程信息</el-button>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item>-->
          <!--            <el-button type="success" @click="handleAll">批量操作</el-button>-->
          <!--          </el-form-item>-->
        </el-form>
      </el-col>
      <!--成绩列表-->
      <el-table :data="tableData" border ref="multipleTable" tooltip-effect="dark" >
        <el-table-column prop="teacherID" label="教师id" width="140" sortable>
        </el-table-column>
        <el-table-column prop="teachername" label="教师姓名" width="140" sortable>
        </el-table-column>
        <el-table-column prop="departmentname" label="部门" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="140" sortable>
        </el-table-column>
        <el-table-column prop="IDcard" label="身份证号" width="140" sortable>
        </el-table-column>
        <el-table-column prop="phonenumber" label="联系方式" width="140" sortable>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template scope="scope">
            <!--            <el-button type="small" @click="handleEdit(scope.$index,scope.row)" size="small" icon="el-icon-edit">编辑</el-button>-->
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
        <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">-->
        <!--</el-pagination>-->
      </el-col>
      <!--添加成绩-->
      <el-dialog title="添加教师" :visible.sync="dialogVisible"  width="35%">
        <el-form ref="addGrad" :model="addGrad" label-width="80px" :rules="rules">
          <el-form-item  label="教师idid" prop="name">
            <el-input v-model="addGrad.userID"></el-input>
          </el-form-item>
          <el-form-item  label="姓名" prop="name">
            <el-input v-model="addGrad.name"></el-input>
          </el-form-item>
          <el-form-item  label="部门" prop="name">
            <el-input v-model="addGrad.departmentname"></el-input>
          </el-form-item>
          <el-form-item  label="性别" prop="name">
            <el-input v-model="addGrad.sex"></el-input>
          </el-form-item>
          <el-form-item  label="身份证" prop="name">
            <el-input v-model="addGrad.IDcard"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="type">
            <el-input v-model="addGrad.phonenumber"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="success"  @click.native="addSubmit">保存</el-button>
            </span>
      </el-dialog>
      <!--编辑成绩信息-->
      <!--      <el-dialog title="修改学生成绩" :visible.sync="editVisible" :before-close="handleClose" width="35%">-->
      <!--        <el-form  label-width="80px">-->
      <!--          <el-form-item label="课程id">-->
      <!--            <el-input v-model="editGrade."></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="学生id">-->
      <!--            <el-input v-model="editGrade.studentId"></el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="成绩">-->
      <!--            <el-input type="number" v-model="editGrade.grade"></el-input>-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--        <span slot="footer" class="dialog-footer">-->
      <!--              <el-button @click="editVisible=false">取消</el-button>-->
      <!--              <el-button type="success"  @click="handleSave">保存</el-button>-->
      <!--            </span>-->
      <!--      </el-dialog>-->
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
        tableData:[{
          teacherID:'',
          teachername:'',
          sex:'',
          IDcard:'',
          phonenumber:'',
          departmentname:'',
        }],
        dialogVisible: false,
        editVisible:false,
        multipleSelection: [],
        //新增界面数据
        addGrad: {
          teacherID:'',
          teachername:'',
          sex:'',
          IDcard:'',
          phonenumber:'',
          departmentname:'',
        },
        //编辑
        // editGrade:{
        //   row:0,
        //   userID:'',
        //   stundentname:'',
        //   classID:'',
        //   sex:'',
        //   IDcard:'',
        //   phonenumber:'',
        //   password:'',
        // },
        //查询
        filters:{
          courseId:''
        },
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
      //     obj.studentId = datas[i].studentId;
      //     obj.grade = datas[i].grade;
      //     data[i] = obj;
      //   }
      //   _this.tableData = data;
      //   //读取历史操作记录，渲染卡片
      //   _this.lookinfo = res.data.lookInfo;
      // }).catch(function (error) {
      // })
    },
    mounted(){
      var data1 = localStorage.getItem('userInfo');
      var data2 = JSON.parse(data1);
      //alert(data1)
      this.userinfo =data2;

      this.$ajax.get("http://10.28.255.88:5000/app/admin/allteacherlist",
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
            alert("请求失败");
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
      handleSearch(){
        for ( var i = 0; i <this.tableData.length; i++){
          console.log(arr[i]);
        }
      },
      handleRow:function(index){
        alert(index)
      },
      handleSelectionChange:function(val){
        this.multipleSelection = val;
        console.log(val);
      },
      handleAdd: function () {
        this.dialogVisible = true;
        this.addGrad = {
          UserID:'',
          Name:'',
          Sex:'',
          IDCard:'',
          PhoneNumber:'',
          DepartmentName:'',
          Password: '',
        };
      },
      //获取页面数据，并追加字段后提交
      addSubmit:function(){
        this.$ajax.post("http://10.28.255.88:5000/app/admin/teacher",{
            instance:this.addGrad
          },
          {
            headers:{
              "Authorization":"Bearer "+this.userinfo.token,
              'Content-Type':'application/x-www-form-urlencoded'
            }
          }
        ).then(res=>{
          this.tableData.push(this.addGrad);
          this.editVisible=false
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
              alert("错误"+err.response.status)
              break;
          }
        })

      },
      //编辑页面
      handleEdit:function(row){
        this.editVisible = true;
        console.log(trowData);
        this.editGrade.row=row;
      },
      handleSave:function(){
        console.log("保存");
        this.tableData[this.editGrade.row].studentId=this.editGrade.studentId;
        this.tableData[this.editGrade.row].courseId=this.editGrade.courseId;
        this.tableData[this.editGrade.row].grade=this.editGrade.grade;
      },
      handleAll:function(){
        let arr = [];
        for (let i in this.multipleSelection) {
          arr.push(this.multipleSelection[i].name);
        }
        console.log('勾中的产品为：' + arr.join());
//        console.log(this.multipleSelection);
      },
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$ajax.get("http://10.28.255.88:5000/app/del/teacher",{
            params:{
              UUID:this.tableData[row].teacherID
            },
              headers:{
                "Authorization":"Bearer "+this.userinfo.token}
            }
          ).then(res=>{
            this.tableData.splice(row,1);
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
          });
        }).catch(() => {
        });
      },
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
