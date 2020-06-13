<template>
  <div>
    <div class="card">
      <el-row class="aside">
        <el-col :span="4" style="width220px;">
          <!-- <h1 class="card-header" style="height:45px;margin:0px"></h1> -->
          <el-menu default-active="1" class="el-menu-vertical-demo">
            <el-menu-item index="1">
              <span slot="title">导航一</span>
              <i class="el-icon-arrow-right" style="float:right;margin-top:20px"></i>
            </el-menu-item>
            <el-menu-item index="2">
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3">
              <span slot="title">导航三</span>
            </el-menu-item>
          </el-menu>
          <el-button plain style="width:100%;border-style:dashed">
            <i class="el-icon-circle-plus-outline"></i> 分类管理
          </el-button>
        </el-col>
        <el-col :span="4" style="width220px;">
          <!-- <h1 class="card-header" style="height:45px;margin:0px"></h1> -->
          <el-menu class="el-menu-vertical-demo">
            <el-menu-item index="1">
              <span slot="title">导航一</span>
            </el-menu-item>
            <el-menu-item index="2">
              <span slot="title">导航二</span>
            </el-menu-item>
          </el-menu>
          <el-button plain style="width:100%;border-style:dashed">
            <i class="el-icon-circle-plus-outline"></i> 分类管理
          </el-button>
        </el-col>
        <el-col :span="16">
          <el-button
            type="primary"
            class="add myBtn"
            @click="$router.push(`/card/create`)"
            style="float:right;margin-top:20px;margin-right:20px"
          >
            <i class="el-icon-s-custom"></i> 添加卡牌
          </el-button>
          <h1 class="card-header">卡牌列表</h1>
          <el-table :data="items" stripe border :header-cell-style="{background:'#eee'}">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="icon" label="图标">
              <template slot-scope="scope">
                <img :src="scope.row.icon" style="height:3rem;" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-tooltip effect="light" content="编辑" placement="bottom">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    icon="el-icon-edit"
                    @click="$router.push(`/card/edit/${scope.row.id}`)"
                  ></el-button>
                </el-tooltip>

                <el-tooltip effect="light" content="删除" placement="bottom">
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    @click="remove(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        @next-click="nextClick"
        @prev-click="prevClick"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      pageSize: 8,
      total: 0,
      pageIndex: 1
    };
  },
  methods: {
    nextClick(val) {
      this.pageIndex += 1;
      this.fetch();
    },
    prevClick(val) {
      this.pageIndex -= 1;
      this.fetch();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.fetch();
    },
    async fetch() {
      const res = await this.$http.get("card/page", {
        params: { page_index: this.pageIndex, page_size: this.pageSize }
      });
      console.log(res.data);
      if (res.code == 200) {
        this.items = res.data.result;
        this.total = res.data.total_count;
      }
    },
    remove(row) {
      this.$confirm(`确定要删除此卡牌吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.post(`card/delete?ids=${row.id}`);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.fetch();
        } else {
          this.$message({
            type: "error",
            message: `错误：${res.msg}`
          });
        }
      });
    }
  },
  created() {
    this.fetch();
  }
};
</script>
<style>
.aside .el-menu-item.is-active {
  border-left: 3px solid #6595f2;
  background-color: #f5f8fd;
}
.aside .el-menu .el-menu-item{
  border-bottom: 1px solid #e6e6e6;
}
.aside .el-menu .el-menu-item:last-child {
  border-bottom:0px;
}
</style>