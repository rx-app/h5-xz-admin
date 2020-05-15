<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px">
      <el-menu router unique-opened :default-active="$route.path">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>
            <span>系统设置</span>
          </template>
          <!-- <el-menu-item-group>
            <template slot="title">分类</template>
            <el-menu-item index="/categories/create">新建分类</el-menu-item>
            <el-menu-item index="/categories/list">分类列表</el-menu-item>
          </el-menu-item-group>-->
          <el-menu-item-group>
            <!-- <template slot="title">管理员</template> -->
            <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
            <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
            <!-- <el-menu-item index="/setting/Advertising">广告位设置</el-menu-item> -->
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-message"></i>
            <span>每日运势</span>
          </template>
          <el-menu-item-group>
            <!-- <template slot="title">卡牌</template> -->
            <el-menu-item index="/card/create">新建卡牌</el-menu-item>
            <el-menu-item index="/card/list">卡牌列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <!-- <template slot="title">留言</template> -->
            <!-- <el-menu-item index="/card/create">新建卡牌</el-menu-item> -->
            <el-menu-item index="/message/list">留言列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-message"></i>
            <span>测试大厅</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/test/trestManagement">测试题管理</el-menu-item>
            <!-- <el-menu-item index="/items/list">首页</el-menu-item> -->
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-message"></i>
            <span>数据统计</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/statistical/AccessFrom">平台统计</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <!--el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown-->
        <span>当前用户 [{{name}}}]</span>
        <span @click="logout">
          <i class="el-icon-switch-button"></i> 注销
        </span>
      </el-header>

      <el-main>
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<style>
.el-header {
  background-color: #393836;
  color: #fff;
  line-height: 60px;
}

.el-aside {
  color: #fff;
  background-color: #393836;
}
</style>

<script>
export default {
  data() {
    const item = {
      date: "2016-05-02",
      // name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    return {
      tableData: Array(20).fill(item)
    };
  },
  computed: {
    name() {
      return localStorage.getItem("name");
    }
  },
  created() {
    
    if (this.$route.path == "/") {
      this.$router.push("/admin_users/create"); 
    }
  },
  methods: {
    logout() {
      this.$confirm(`确定要退出登录？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        localStorage.removeItem("token");
        this.$alert("身份信息无效或已过期，请重新登录", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push("/login");
          }
        });
      });

      // router.push('/login');
    }
  }
};
</script>