<template>
  <el-container>
    <el-main style="padding:0px;">
      <!--查询框-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
<!--          <el-form-item>-->
<!--            <el-input v-model="searchId" placeholder="课程id"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="success"  @click="search" >搜索</el-button>-->
<!--          </el-form-item>-->
        </el-form>
      </el-col>
      <!--成绩列表-->
      <el-table :data="tableData" border ref="multipleTable" tooltip-effect="dark">
        <el-table-column prop="courseID" label="课程id" width="160" sortable>
        </el-table-column>
        <el-table-column prop="credit" label="学分" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="grade" label="分数" sortable show-overflow-tooltip>
        </el-table-column>

      <el-table-column prop="house" label="教学楼" sortable show-overflow-tooltip>
      </el-table-column>
        <el-table-column prop="name" label="课程名" width="160" sortable>
        </el-table-column>
        <el-table-column prop="room" label="教室" width="160" sortable>
        </el-table-column>
        <el-table-column prop="selectivetype" label="选课类型" width="160" sortable>
        </el-table-column>
        <el-table-column prop="semester" label="学期" width="160" sortable>
        </el-table-column>
        <el-table-column prop="teachername" label="教师姓名" width="160" sortable>
        </el-table-column>
        <el-table-column prop="teachtype" label="教师类型" width="160" sortable>
        </el-table-column>
        <el-table-column prop="time" label="上课时间" width="160" sortable>
        </el-table-column>
        <el-table-column prop="year" label="学年" width="160" sortable>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>

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
          courseID:'',
          credit:'',
          grade:'',
          house:'',
          name:'',
          room:'',
          selectivetype:'',
          semester:'',
          teachername:'',
          teachtype:'',
          time:'',
          year:'',
        }],
        filters:{
          name:''
        },
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
          this.p1=true
          break
        case  'T':
          this.p2=true
          break
        case 'A':
          this.p3=true
          break
      }

      this.$ajax.get("http://10.28.255.88:5000/app/student/courselist",
        {
          headers:{
            "Authorization":"Bearer "+this.userinfo.token
          }
        }
      ).then(res=>{
         alert(JSON.stringify(res))
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
      handleRow: function (index) {
        alert(index)
      },
      search(){
        for(j = 0,len=this.tableData.length; j < len; j++) {
            if(this.tableData[j].courseID==this.filters.name)
              alert("该门课成绩为"+this.tableData[j].grade)
        }
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
    margin:0px;
  }
</style>
