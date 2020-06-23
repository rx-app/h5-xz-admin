<template>
  <div>
    <div class="card">
      <el-row class="aside">
        <el-col
          :span="5"
          style="width220px;height:705px;border-right:1px solid #e6e6e6;overflow-y:auto"
        >
          <!-- <h1 class="card-header" style="height:45px;margin:0px"></h1> -->
          <el-menu :default-active="active1" class="el-menu-vertical-demo" @select="handleSelect1">
            <template v-for="item in firstList">
              <el-menu-item :index="item.id+''" :key="item.id">
                <span
                  slot="title"
                  :title="item.name"
                  style="display:inline-block;width:100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                >{{item.name}}</span>
                <i
                  class="el-icon-delete"
                  @click.stop="delDetial1(item)"
                  style="float:right;margin-top:20px"
                ></i>
                <i
                  class="el-icon-edit"
                  @click.stop="dialogFormVisible1 = true;form1=JSON.parse(JSON.stringify(item))"
                  style="float:right;margin-top:20px"
                ></i>
              </el-menu-item>
            </template>
          </el-menu>
          <el-button
            @click="dialogFormVisible1 = true;form1.name='';form.id='';"
            plain
            style="width:100%;border-style:dashed"
          >
            <i class="el-icon-circle-plus-outline"></i> 分类管理
          </el-button>
        </el-col>
        <el-col
          :span="5"
          style="width220px;height:705px;border-right:1px solid #e6e6e6;overflow-y:auto"
        >
          <!-- <h1 class="card-header" style="height:45px;margin:0px"></h1> -->
          <el-menu :default-active="active2" class="el-menu-vertical-demo" @select="handleSelect2">
            <template v-for="item in secondList">
              <el-menu-item :index="item.id+''" :key="item.id">
                <span
                  slot="title"
                  :title="item.name"
                  style="display:inline-block;width:100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                >{{item.name}}</span>

                <i
                  class="el-icon-delete"
                  @click.stop="delDetial2(item)"
                  style="float:right;margin-top:20px"
                ></i>
                <i
                  class="el-icon-edit"
                  @click.stop="dialogFormVisible2 = true;form2=JSON.parse(JSON.stringify(item))"
                  style="float:right;margin-top:20px"
                ></i>
              </el-menu-item>
            </template>
          </el-menu>
          <el-button
            @click="dialogFormVisible2 = true;form2.id='';form2.name='';form2.parent_id=active1;"
            plain
            style="width:100%;border-style:dashed"
          >
            <i class="el-icon-circle-plus-outline"></i> 分类管理
          </el-button>
        </el-col>
        <el-col :span="14">
          <el-button
            type="primary"
            class="add myBtn"
            v-if="active2"
            @click="$router.push(`/card/create/${active2}`)"
            style="float:right;margin-top:20px;margin-right:20px"
          >
            <i class="el-icon-s-custom"></i> 添加卡牌
          </el-button>
          <el-button
            type="primary"
            v-if="active2"
            class="add myBtn"
            @click="dialogFormVisible3 = true;categoryvalue='';categoryvalue2=''"
            style="float:right;margin-top:20px;margin-right:20px"
          >
            <i class="el-icon-news"></i> 复制卡牌
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
        </el-col>
      </el-row>
    </div>
    <el-dialog title="一级分类" :visible.sync="dialogFormVisible1">
      <el-form :model="form1">
        <el-form-item label="分类名称">
          <el-input v-model="form1.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="subm1">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="二级分类" :visible.sync="dialogFormVisible2">
      <el-form :model="form2">
        <el-form-item label="分类名称">
          <el-input v-model="form2.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="subm2">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="复制卡牌" :visible.sync="dialogFormVisible3">
      <div style="text-align:center">
        分类选择：
        <el-select v-model="categoryvalue" @change="handleItemChange" placeholder="请选择">
          <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="categoryvalue2" placeholder="请选择">
          <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="copycategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options2: [],
      categoryvalue: "",
      categoryvalue2: "",
      options3: [],
      dialogFormVisible3: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      form1: { name: "", parent_id: 0, sort: 0, type: 1 },
      form2: { name: "", parent_id: null, sort: 0, type: 2 },
      items: [],
      pageSize: 8,
      total: 0,
      pageIndex: 1,
      firstList: [],
      secondList: [],
      active1: "",
      active2: "",
      category_id: ""
    };
  },
  methods: {
    handleItemChange(val) {
      this.$http
        .get("card/category/page", {
          params: {
            type: 2,
            parent_id: this.categoryvalue,
            page_index: 1,
            page_size: 10000
          }
        })
        .then(res => {
          if (res.code == 200) {
            if (res.data.result) {
              this.options3 = res.data.result;
            } else {
              this.options3 = [];
            }
          }
        });
    },
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
    handleSelect1(key, keyPath) {
      this.active1 = key;
      this.active2 = "";
      this.getcategoryItem(key);
    },
    handleSelect2(key, keyPath) {
      this.active2 = key;
      this.fetch();
    },
    delDetial1(item) {
      this.$confirm(`确定要删除此一级分类吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.post(
          `card/category/delete?ids=${item.id}`
        );
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getcategory();
        } else {
          this.$message({
            type: "error",
            message: `错误：${res.msg}`
          });
        }
      });
    },
    delDetial2(item) {
      this.$confirm(`确定要删除此二级分类吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.post(
          `card/category/delete?ids=${item.id}`
        );
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getcategoryItem(this.active1);
        } else {
          this.$message({
            type: "error",
            message: `错误：${res.msg}`
          });
        }
      });
    },
    getcategory() {
      this.$http
        .get("card/category/page", {
          params: { type: 1, parent_id: 0, page_index: 1, page_size: 10000 }
        })
        .then(res => {
          if (res.code == 200) {
            if (res.data.result) {
              this.firstList = res.data.result;
              this.options2 = res.data.result;
              this.options2.forEach(item => {
                item.list = [];
              });
              if (!this.active1) {
                this.active1 = res.data.result[0].id + "";
              }
              this.getcategoryItem(this.active1);
            }
          }
        });
    },
    getcategoryItem(id) {
      this.items = [];
      this.$http
        .get("card/category/page", {
          params: { type: 2, parent_id: id, page_index: 1, page_size: 10000 }
        })
        .then(res => {
          if (res.code == 200) {
            if (res.data.result) {
              this.secondList = res.data.result;
              if (!this.active2) {
                this.active2 = res.data.result[0].id + "";
              }
              this.fetch();
            } else {
              this.active2 = "";
              this.secondList = [];
            }
          }
        });
    },
    async fetch() {
      const res = await this.$http.get("card/page", {
        params: {
          page_index: this.pageIndex,
          page_size: this.pageSize,
          category_id: this.active2
        }
      });
      if (res.code == 200) {
        if (res.data.result) {
          this.items = res.data.result;
          this.total = res.data.total_count;
        } else {
          this.items = [];
          this.total = 0;
        }
      } else {
        this.items = [];
        this.total = 0;
      }
    },
    subm1() {
      this.$http
        .post(
          `card/category/${!this.form1.id ? "create" : "update"}`,
          this.form1
        )
        .then(res => {
          if (res.code == 200) {
            this.dialogFormVisible1 = false;
            this.$http
              .get("card/category/page", {
                params: {
                  type: 1,
                  parent_id: 0,
                  page_index: 1,
                  page_size: 10000
                }
              })
              .then(res => {
                if (res.code == 200) {
                  if (res.data.result) {
                    this.firstList = res.data.result;
                  }
                }
              });
            this.$message({
              type: "success",
              message: "添加成功!"
            });
          }
        });
    },
    subm2() { 
      this.$http
        .post(
          `card/category/${!this.form2.id ? "create" : "update"}`,
          this.form2
        )
        .then(res => {
          if (res.code == 200) {
            this.dialogFormVisible2 = false;
            this.$http
              .get("card/category/page", {
                params: {
                  type: 2,
                  parent_id: this.active1,
                  page_index: 1,
                  page_size: 10000
                }
              })
              .then(res => {
                if (res.code == 200) {
                  if (res.data.result) {
                    this.secondList = res.data.result;
                  }
                }
              });
            this.$message({
              type: "success",
              message: "添加成功!"
            });
          }
        });
    },
    copycategory() {
      if (!this.categoryvalue2) {
        this.$message({
          type: "error",
          message: "请选择二级分类!"
        });
        return false;
      }
      this.$http
        .post(`card/copy/list`, {
          source_category_id: this.categoryvalue2,
          target_category_id: this.active2
        })
        .then(res => {
          if (res.code == 200) {
            this.dialogFormVisible3 = false;
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.fetch();
          }
        });
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
    this.getcategory();
  }
};
</script>
<style>
.aside .el-menu-item.is-active {
  border-left: 3px solid #6595f2;
  background-color: #f5f8fd;
}
.aside .el-menu .el-menu-item {
  border-bottom: 1px solid #e6e6e6;
}
.aside .el-menu .el-menu-item:last-child {
  border-bottom: 0px;
}
.aside .el-menu {
  border-right: 0px;
}
</style>