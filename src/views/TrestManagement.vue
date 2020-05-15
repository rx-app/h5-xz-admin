<template>
  <div>
    <div>
      <el-button type="primary" class="add myBtn" @click="pageIndex = 1;fetch()">
        <i class="el-icon-refresh"></i> 列表刷新
      </el-button>
      <el-button
        type="primary"
        class="add myBtn"
        @click="getCategoryList();dialogcategoryVisible = true;"
      >
        <i class="el-icon-circle-plus"></i> 分类管理
      </el-button>
      <el-button type="primary" class="add myBtn" @click="addTest">
        <i class="el-icon-circle-plus"></i> 添加测试题
      </el-button>
    </div>
    <div class="card">
      <h1 class="card-header">测试题列表</h1>
      <el-table :data="items" stripe border :header-cell-style="{background:'#eee'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="标题"></el-table-column>
        <el-table-column prop="result_type" label="结果类型">
          <template
            slot-scope="scope"
          >{{scope.row.result_type == 1?'得分':scope.row.result_type ==2?'百分比':'区间'}}</template>
        </el-table-column>
        <el-table-column prop="origin_price" label="原价"></el-table-column>
        <el-table-column prop="present_price" label="现价"></el-table-column>
        <!-- <el-table-column prop="create_at" label="创建日期"></el-table-column> -->
        <el-table-column fixed="right" label="操作" width="190">
          <template slot-scope="scope">
            <!-- <el-tooltip effect="light" content="查看" placement="bottom">
              <el-button size="mini" type="primary" plain icon="el-icon-view"></el-button>
            </el-tooltip>-->

            <el-tooltip effect="light" content="编辑" placement="bottom">
              <el-button
                size="mini"
                type="primary"
                plain
                icon="el-icon-edit"
                @click="getCategoryList();getQuestion(scope.row,true)"
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

            <el-tooltip effect="light" content="复制" placement="bottom">
              <el-button
                size="mini"
                type="primary"
                @click="getCategoryList();getQuestion(scope.row,false)"
                plain
                icon="el-icon-news"
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
      <!-- 分类管理 -->
      <el-dialog title="分类管理" :visible.sync="dialogcategoryVisible" :close-on-click-modal="false">
        <el-table :data="categoryData">
          <el-table-column label="名称" property="name">
            <template slot-scope="scope">
              <span v-if="scope.row.checked">{{scope.row.name}}</span>
              <el-input v-if="!scope.row.checked" v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注" property="remark">
            <template slot-scope="scope">
              <span v-if="scope.row.checked">{{scope.row.remark}}</span>
              <el-input v-if="!scope.row.checked" v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-tooltip effect="light" content="编辑" v-if="scope.row.checked" placement="bottom">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  icon="el-icon-edit"
                  @click="changeChecked(scope.$index)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="保存" v-if="!scope.row.checked" placement="bottom">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  icon="el-icon-check"
                  @click="saveChecked(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="light"
                content="删除"
                v-if="scope.row.id&&scope.row.checked"
                placement="bottom"
              >
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  @click="deletecategoryItem(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="移除" v-if="!scope.row.id" placement="bottom">
                <el-button
                  type="danger"
                  plain
                  size="mini"
                  icon="el-icon-remove-outline"
                  @click="removecategoryItem(scope.$index)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 0 20px;">
          <el-button
            type="primary"
            plain
            style="border-top:0px;border-color:#EBEEF5;width:100%"
            @click="addCategory"
          >
            <i class="el-icon-circle-plus-outline"></i> 分类管理
          </el-button>
        </div>
      </el-dialog>
      <!-- 测试题 -->
      <el-dialog
        title="测试题配置"
        class="width750"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-dialog width="60%" title="封面上传" :visible.sync="innerVisible" append-to-body>
          <Cropper @upload="getUploadUrl" :uploadType="uploadType"></Cropper>
        </el-dialog>
        <el-form :model="form" :rules="rules" :inline="true" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="category_id" class="inputPosi">
            <el-select v-model="form.category_id" placeholder="综合分类">
              <el-option
                :label="item.name"
                :value="item.id"
                :key="item.id"
                v-for="item in categoryData"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="result_type" class="inputPosi" style="left:330px">
            <el-select v-model="form.result_type" placeholder="结果分类">
              <el-option
                :label="item.name"
                :value="item.value"
                :key="item.value"
                v-for="item in resultTypeList"
              ></el-option>
            </el-select>
          </el-form-item>
          <div>标题</div>
          <el-form-item prop="name" class="inputwidth100" style="width:100%">
            <el-input v-model="form.name" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="image_list" style="width:100%">
            <div>
              <el-button
                type="primary"
                v-if="!form.image_list[0].url"
                plain
                @click="innerVisible = true;uploadType = 1"
              >封面大图</el-button>
              <el-button
                type="primary"
                v-if="!form.image_list[1].url"
                plain
                @click="innerVisible = true;uploadType = 2"
              >封面小图</el-button>
            </div>

            <img
              :src="form.image_list[0].url"
              alt
              class="image43"
              @click="innerVisible = true;uploadType = 1"
              v-if="form.image_list[0].url"
            />
            <img
              :src="form.image_list[1].url"
              alt
              class="image11"
              @click="innerVisible = true;uploadType = 2"
              v-if="form.image_list[1].url"
            />
          </el-form-item>
          <el-form-item prop="content" style="width:100%" class="editor-el-form-item__content">
            <vue-editor
              v-model="form.content"
              :editor-toolbar="customToolbar"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            ></vue-editor>
          </el-form-item>
          <div style="border:1px solid #f0f0f0;padding:10px;margin-bottom:20px">
            <div v-for="(item,i) in form.item_list" :key="i">
              <div
                style="border:1px solid #DCDFE6;margin:10px 0px;padding:10px 5px;border-radius: 4px;"
              >
                题目{{i+1}}
                <el-tooltip effect="light" content="删除" placement="bottom">
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    style="float:right"
                    icon="el-icon-remove-outline"
                    @click="deleteItemList(i)"
                  ></el-button>
                </el-tooltip>
              </div>
              <el-form-item :prop="item.name" class="inputwidth100" style="width:100%">
                <el-input v-model="item.name" placeholder="请输入题目名称"></el-input>
              </el-form-item>
              <div v-for="(item1,j) in item.option_list" :key="j">
                <el-form-item :prop="item1.name" style="width:100%">
                  <el-input
                    v-model="item1.name"
                    style="width:350px;margin-right:10px"
                    placeholder="请输入选项内容"
                  ></el-input>
                  <!-- 排序
                  <el-input-number size="mini" v-model="item1.sort" :min="1"></el-input-number>-->
                  分数
                  <el-input-number size="mini" v-model="item1.score" :min="1"></el-input-number>
                  <i
                    class="el-icon-circle-plus-outline iconfont"
                    @click="addOption(item.option_list)"
                    style="color: #409EFF;"
                  ></i>
                  <i
                    class="el-icon-remove-outline iconfont"
                    @click="removeOption(j,item.option_list)"
                    style="color: #F56C6C;"
                  ></i>
                </el-form-item>
              </div>
            </div>
            <div>
              <el-button
                type="primary"
                plain
                style="border-top:0px;border-color:#EBEEF5;width:100%"
                @click="addItemList"
              >
                <i class="el-icon-circle-plus-outline"></i> 添加题目
              </el-button>
            </div>
          </div>
          <div style="border:1px solid #f0f0f0;padding:10px;margin-bottom:20px">
            <div v-for="(item,i) in form.result_list" :key="i">
              <div>
                结果{{i+1}}
                <el-tooltip effect="light" content="删除" placement="bottom">
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    style="float:right"
                    icon="el-icon-remove-outline"
                    @click="deleteResultList(i)"
                  ></el-button>
                </el-tooltip>
              </div>

              <el-form-item :prop="item.name" style="width:100%">
                <el-input-number size="mini" v-model="item.start_score" :min="1"></el-input-number>-
                <el-input-number size="mini" v-model="item.end_score" :min="1"></el-input-number>
                <el-input
                  v-model="item.name"
                  v-if="form.result_type == 3"
                  style="width:130px;margin-left:20px"
                  placeholder="请输入分值结果"
                ></el-input>
                <!-- <span style="margin-left:20px">排序</span>
                <el-input-number size="mini" v-model="item.sort" :min="1"></el-input-number>-->
              </el-form-item>
              <el-form-item :prop="item.content" class="inputwidth100" style="width:100%">
                <el-input v-model="item.content" type="textarea" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-button
                type="primary"
                plain
                style="border-top:0px;border-color:#EBEEF5;width:100%"
                @click="addResultList"
              >
                <i class="el-icon-circle-plus-outline"></i> 添加结果
              </el-button>
            </div>
          </div>
          <el-form-item label="原价" prop="origin_price">
            <el-input v-model="form.origin_price" style="width:120px" placeholder="请输入原价"></el-input>
          </el-form-item>
          <el-form-item label="现价" prop="present_price">
            <el-input v-model="form.present_price" style="width:120px" placeholder="请输入现价"></el-input>
          </el-form-item>
          <el-form-item label="会员是否免费" prop="is_vip_free">
            <el-radio-group v-model="form.is_vip_free">
              <el-radio label="0">免费</el-radio>
              <el-radio label="1">付费</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">{{this.form.id?'修改':'立即创建'}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import Cropper from "@/components/Cropper.vue";
export default {
  components: {
    VueEditor,
    Cropper
  },
  data() {
    return {
      uploadType: "",
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["blockquote"],
        ["formula"],
        ["bold", "italic", "underline"],
        [{ align: "center" }, { align: "justify" }, { align: "right" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ background: [] }, { color: [] }],
        ["image", "link"],
        ["strike"],
        ["clean"],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: [] }]
      ],
      // 1：得分，2：百分比，3：区间
      resultTypeList: [
        {
          name: "得分",
          value: 1
        },
        {
          name: "百分比",
          value: 2
        },
        {
          name: "区间",
          value: 3
        }
      ],
      // 测试题
      innerVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        image_list: [
          { url: "", type: 0 },
          { url: "", type: 1 }
        ],
        content: "",
        is_vip_free: "1",
        result_type: "",
        origin_price: "",
        present_price: "",
        category_id: "",
        item_list: [
          {
            name: "",
            option_list: [
              {
                name: "",
                score: 0,
                sort: 1
              }
            ]
          }
        ],
        result_list: [
          { name: "", content: "", start_score: 0, end_score: 0, sort: 0 }
        ]
      },
      rules: {
        image_list: [
          { required: true, message: "请上传封面", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        category_id: [
          { required: true, message: "请选择综合分类", trigger: "change" }
        ],
        result_type: [
          { required: true, message: "请选择结果分类", trigger: "change" }
        ],
        origin_price: [
          { required: true, message: "请输入原价", trigger: "blur" }
        ],
        present_price: [
          { required: true, message: "请输入现价", trigger: "blur" }
        ]
      },
      // 分类管理
      dialogcategoryVisible: false,
      categoryData: [],

      status: 0,
      items: [],
      pageSize: 8,
      total: 0,
      pageIndex: 1,
      categorypageSize: 5000,
      categorypageIndex: 1
    };
  },
  filters: {},
  methods: {
    // 图片上传成功地址
    getUploadUrl(data) {
      console.log(data, this.form.image_list);
      if (this.uploadType == 1) {
        this.form.image_list[0].url = data;
      } else {
        this.form.image_list[1].url = data;
      }
      this.innerVisible = false;
    },
    //   添加测试题
    addTest() {
      this.form = {
        name: "",
        content: "",
        image_list: [
          { url: "", type: 0 },
          { url: "", type: 1 }
        ],
        is_vip_free: "1",
        result_type: "",
        origin_price: "",
        present_price: "",
        category_id: "",
        item_list: [
          {
            name: "",
            option_list: [
              {
                name: "",
                score: 0,
                sort: 1
              }
            ]
          }
        ],
        result_list: [
          { name: "", content: "", start_score: 0, end_score: 0, sort: 0 }
        ]
      };
      this.getCategoryList();
      this.dialogFormVisible = true;
    },
    //   获取测试题详情
    async getQuestion(row, type) {
      const res = await this.$http.get(`test/question/${row.id}`);
      if (res.code == 200) {
        res.data.is_vip_free = String(res.data.is_vip_free);
        this.form = res.data;
        this.dialogFormVisible = true;
        this.form.id = type ? this.form.id : "";
        console.log(this.form);
      }
    },
    //   删除结果
    deleteResultList(index) {
      if (this.form.result_list.length == 1) {
        this.$message({
          type: "erroe",
          message: "请至少保留一条结果！"
        });
        return false;
      }
      this.form.result_list.splice(index, 1);
    },
    //   添加结果
    addResultList() {
      this.form.result_list.push({
        name: "",
        content: "",
        start_score: 0,
        end_score: 0,
        sort: 0
      });
    },
    //   删除题目
    deleteItemList(index) {
      if (this.form.item_list.length == 1) {
        this.$message({
          type: "erroe",
          message: "请至少保留一条题目！"
        });
        return false;
      }
      this.form.item_list.splice(index, 1);
    },
    //   添加题目
    addItemList() {
      this.form.item_list.push({
        name: "",
        option_list: [
          {
            name: "",
            score: 0,
            sort: 1
          }
        ]
      });
    },
    //   选项添加
    addOption(list) {
      list.push({
        name: "",
        score: 0,
        sort: 1
      });
    },
    // 选项删除
    removeOption(index, list) {
      if (list.length == 1) {
        this.$message({
          type: "erroe",
          message: "选项至少有一条！"
        });
        return false;
      }
      list.splice(index, 1);
    },
    //   编辑器
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await this.$http.post("/storage/upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },
    //   保存测试题
    submitForm(formName) {
      //   console.log(this.form);
      let flag = true;
      for (let index = 0; index < this.form.item_list.length; index++) {
        const element = this.form.item_list[index];
        console.log(element);
        if (element.name == "") {
          flag = false;
          this.$message({
            type: "error",
            message: "请补全信息后再提交！"
          });
          return false;
        }
        for (let j = 0; j < element.option_list.length; j++) {
          const element1 = element.option_list[j];
          console.log(element1);
          if (element1.name == "" || element1.score == "") {
            this.$message({
              type: "error",
              message: "请补全信息后再提交！"
            });
            flag = false;
            return false;
          }
        }
      }
      for (let i = 0; i < this.form.result_list.length; i++) {
        const element = this.form.result_list[i];
        console.log(element);
        if (
          element.content == "" ||
          element.start_score == "" ||
          element.end_score == "" ||
          (this.form.result_type == 3 && element.name == "")
        ) {
          this.$message({
            type: "error",
            message: "请补全信息后再提交！"
          });
          flag = false;
          return false;
        }
      }
      for (let i = 0; i < this.form.image_list.length; i++) {
        const element = this.form.image_list[i];
        if (element.url == "") {
          this.$message({
            type: "error",
            message: "请补全信息后再提交！"
          });
          flag = false;
          return false;
        }
      }
      //
      if (!flag) return false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post(
              `/test/question/${!this.form.id ? "create" : "update"}`,
              this.form
            )
            .then(res => {
              if (res.code == 200) {
                this.dialogFormVisible = false;
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.fetch();
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //   获取分类list
    async getCategoryList() {
      const res = await this.$http.get("test/category/page", {
        params: {
          page_index: this.categorypageIndex,
          page_size: this.categorypageSize
        }
      });
      if (res.code == 200) {
        res.data.result.forEach(item => {
          item.checked = true;
        });
        this.categoryData = res.data.result;
      }
    },
    // 修改分类
    changeChecked(index) {
      this.categoryData[index].checked = false;
    },
    // 保存分类
    async saveChecked(row) {
      if (!row.name) {
        this.$message({
          type: "erroe",
          message: "请输入分配名称"
        });
        return false;
      }
      let res;
      if (row.id) {
        res = await this.$http.post(`/test/category/update`, row);
      } else {
        res = await this.$http.post("test/category/create", row);
      }
      if (res.code == 200) {
        this.getCategoryList();
        this.$message({
          type: "success",
          message: "保存成功"
        });
      }
    },
    removecategoryItem(index) {
      this.categoryData.splice(index, 1);
    },
    // 添加分类
    addCategory() {
      this.categoryData.push({
        name: "",
        remark: "",
        checked: false
      });
    },
    // 删除分类
    deletecategoryItem(row) {
      this.$confirm(`确定要删除分类："${row.name}" 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.post(`test/category/delete?ids=${row.id}`);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getCategoryList();
        } else {
          this.$message({
            type: "error",
            message: `错误：${res.msg}`
          });
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
    async fetch() {
      const res = await this.$http.get("test/question/page", {
        params: {
          page_index: this.pageIndex,
          page_size: this.pageSize
          // status: this.status,
        }
      });
      console.log(res.data);
      if (res.code == 200) {
        this.items = res.data.result;
        this.total = res.data.total_count;
      }
    },
    remove(row) {
      this.$confirm(`确定要删除该测试题吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.post(
          `/test/question/delete?ids=${row.id}`
        );
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
.inputwidth100 .el-form-item__content {
  width: 100%;
}
.inputPosi {
  position: absolute;
  top: 10px;
  left: 120px;
}
.editor-el-form-item__content .el-form-item__content {
  line-height: normal;
}
.iconfont {
  font-size: 22px;
  vertical-align: middle;
  margin-left: 5px;
}
.width750 .el-dialog {
  width: 750px;
}
.image43 {
  display: inline-block;
  width: 256px;
  height: 192px;
  padding: 10px;
  border: 1px solid #ccc;
}
.image11 {
  display: inline-block;
  width: 180px;
  height: 180px;
  padding: 10px;
  border: 1px solid #ccc;
  margin-left: 20px;
}
</style>

