import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/Login'
import Home from '@/components/home'
import grade from '@/components/grade'
import forms from '@/components/forms'
import mygrade from '@/components/mygrade'
import peopleManage from '@/components/studentManage'
import courseManage from '@/components/courseManage'
import teacherManage from '@/components/teacherManage'
import department from '@/components/department'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children:[
        { path: '/grade', component: grade, name: '学生成绩' },
        { path: '/forms', component: forms, name: '统计数据' },
        { path: '/mygrade', component: mygrade, name: '我的成绩' },
        { path: '/peopleManage', component: peopleManage, name: '学生管理' },
        { path: '/courseManage', component: courseManage, name: '课程管理' },
        { path: '/teacherManage', component: teacherManage, name: '教师管理'} ,
        { path: '/department', component: department, name: '学院信息' }
        ]
    }
  ]
})
