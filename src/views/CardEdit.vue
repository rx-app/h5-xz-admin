<template>
  <div class="about card">
    <h1 class="card-header">{{id ? '编辑' : '新建'}}卡牌</h1>
    <el-form
      :rules="rules"
      :model="model"
      ref="ruleForm"
      style="max-width:600px"
      label-width="120px"
      @submit.native.prevent="save"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <!-- <el-form-item label="图标">
        <el-input type="text" v-model="model.icon"></el-input>
      </el-form-item>-->
      <el-form-item label="图标" prop="icon">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="getAuthHeaders()"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="内容">
        <el-input type="text" v-model="model.content"></el-input>
      </el-form-item>-->
      <!-- <el-form-item label="邮箱">
        <el-input type="text" v-model="model.email"></el-input>
      </el-form-item>-->
      <el-form-item label="内容" class="editor-el-form-item__content" prop="content">
        <vue-editor
          v-model="model.content"
          :editor-toolbar="customToolbar"
          useCustomImageHandler
          @imageAdded="handleImageAdded"
        ></vue-editor>
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-button type="primary" native-type="submit" class="myBtn" style="width: 100%;">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import md5 from "js-md5";
export default {
  props: {
    id: {}
  },
  components: {
    VueEditor
  },
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        icon: [{ required: true, message: "请上传图标", trigger: "change" }],
        content: [{ required: true, message: "请输入内容", trigger: "change" }]
      },
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
      model: {}
    };
  },
  methods: {
    afterUpload(res) {
      this.$set(this.model, "icon", res.data.url);
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      debugger;
      const formData = new FormData();
      formData.append("file", file);
      const res = await this.$http.post("/storage/upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },
    async save() {
      let flag = false;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          flag = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      if (!flag) {
        return false;
      }
      let res;
      if (this.model.password) {
        this.model.password = md5(this.model.password);
      }
      if (this.id) {
        // debugger
        this.$set(this.model, "user_id", parseInt(this.id)); // this.model.id=this.id
        console.log(this.model);
        res = await this.$http.post(`card/update/`, this.model);
      } else {
        res = await this.$http.post("card/create", this.model);
      }
      if (res.code == 200) {
        this.$router.push("/card/list");
        this.$message({
          type: "success",
          message: "保存成功"
        });
      } else {
        this.$message({
          type: "error",
          message: `错误：${res.msg}`
        });
      }
    },
    async fetch() {
      const res = await this.$http.get(`card/${this.id}`);
      !res.data.role_ids && (res.data.role_ids = [1, 2, 3]); //不设置权限的话，编辑提交不成功
      console.log(res);
      this.model = res.data;
    }
  },
  created() {
    this.id && this.fetch();
  }
};
</script>
<style>
.editor-el-form-item__content .el-form-item__content {
  line-height: normal;
}
</style>
