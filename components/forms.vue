<template>
  <el-container>
    <el-main style="padding:0px;">
      <!--查询框-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="课程id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handlepaint" >查看</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <h2>分数统计情况</h2>
      <div id="chart_example">
      </div>
      <div class="pie">
        <div id="pie1">
          <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
          <div id="main1" style="float:left;width:100%;height: 300px"></div>
        </div>
        <div id="pie2">
          <div id="main2" style="float:left;width:100%;height: 300px"></div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>



<script>
  import axios from 'axios'
  var echarts = require('echarts');
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
        ret:{
          a0:0,
          a1:0,
          a2:0,
          a3:0,
          a4:0,
          a5:0,
          a6:0,
          a7:0,
          a8:0,
          a9:0,
        },
        ret1:[10],
        ret2:[
          {value:0,name:'0-10'},
          {value:0,name:'10-20'},
          {value:0,name:'20-30'},
          {value:0,name:'30-40'},
          {value:0,name:'40-50'},
          {value:0,name:'50-60'},
          {value:0,name:'60-70'},
          {value:0,name:'70-80'},
          {value:0,name:'80-90'},
          {value:0,name:'90-100'},
        ],
        filters:{
          name:''
        },
        option : {
          color: function (params) {
            var colorList = [
              '#BA55D3', '#f67287', '#f29e3c', '#c05bdd',
              '#7a65ff', '#8A0fE2','#6f2BE2','#8295cf',
              '#6A2B5f','#8A8Bff']; //每根柱子的颜色
            return colorList[params.dataIndex];
          },
          tooltip : {
            trigger: 'axis',
            axisPointer : {
              type : 'shadow'
            }
          },
          xAxis : [
            {
              type : 'category',
              data : ['0-10','10-20','20-30','30-40','40-50','50-60','60-70','70-80','80-90','90-100'],
              axisTick: {
                alignWithLabel: true
              },
              shadowColor: '#ffffff'
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'分数段人数',
              type:'bar',
              barWidth: '60%',
              data:this.ret1,
            }
          ]
        }
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
    },
    methods: {
      handlepaint:function () {

        this.$ajax.get("http://10.28.255.88:5000/app/teacher/statistic",
          {
            params:{
              UUID:this.filters.name,
            },
            headers:{
              "Authorization":"Bearer "+this.userinfo.token
            }
          }
        ).then(res=>{
          this.ret.a0=res.data.a0;
          this.ret.a1=res.data.a1;
          this.ret.a2=res.data.a2;
          this.ret.a3=res.data.a3;
          this.ret.a4=res.data.a4;
          this.ret.a5=res.data.a5;
          this.ret.a6=res.data.a6;
          this.ret.a7=res.data.a7;
          this.ret.a8=res.data.a8;
          this.ret.a9=res.data.a9;

          this.ret1[0]=this.ret.a0;
          this.ret1[1]=this.ret.a1;
          this.ret1[2]=this.ret.a2;
          this.ret1[3]=this.ret.a3;
          this.ret1[4]=this.ret.a4;
          this.ret1[5]=this.ret.a5;
          this.ret1[6]=this.ret.a6;
          this.ret1[7]=this.ret.a7;
          this.ret1[8]=this.ret.a8;
          this.ret1[9]=this.ret.a9;
          this.ret2[0]=this.ret.a0;

          this.ret2[1].value=this.ret.a1;
          this.ret2[2].value=this.ret.a2;
          this.ret2[3].value=this.ret.a3;
          this.ret2[4].value=this.ret.a4;
          this.ret2[5].value=this.ret.a5;
          this.ret2[6].value=this.ret.a6;
          this.ret2[7].value=this.ret.a7;
          this.ret2[8].value=this.ret.a8;
          this.ret2[9].value=this.ret.a9;
          // this.option.series.data=this.course.indexOf(filters.name);
          // let this_ = this;
          let myChart = echarts.init(document.getElementById('chart_example'));
          myChart.setOption(this.option);
          this.initData();
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
      },
      initData() {
        this.requested = true;
        // 动态数据
          // 基于准备好的dom，初始化echarts实例
          var myChart2 = echarts.init(document.getElementById('main1'));
          // 绘制图表
          myChart2.setOption({
            title : {
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              bottom: 'bottom',
              data : ['0-10','10-20','20-30','30-40','40-50','50-60','60-70','70-80','80-90','90-100'],
            },
            series : [
              {
                name: '分数段占比',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:this.ret2,
                itemStyle: {
                  // emphasis: {
                  //   shadowBlur: 10,
                  //   shadowOffsetX: 0,
                  //   shadowColor: '#ffffff'
                  // }
                }
              }
            ]
          });
      },
    },
    watch: {

    },
    created() {
      axios.get("").then(res=>{
        // alert(res.data);
      }).catch(error=>{
        // alert(error.data());
      })

    }
  }
</script>
<style scoped>
  h2{
    text-align: center;
    padding: 30px;
    font-size: 18px;
  }
  #chart_example{
    width: 80%;
    height: 500px;
    border: 0;
    margin: 0 auto;
  }  .toolbar{
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
