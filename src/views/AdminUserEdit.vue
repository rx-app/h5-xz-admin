<template>
  <div class="about card">
    <h1 class="card-header">{{id ? '编辑' : '新建'}}管理员</h1>
    <el-form
      style="max-width:600px"
      :rules="rules"
      :model="model"
      ref="ruleForm"
      label-width="120px"
      @submit.native.prevent="save()"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="model.username" :disabled="id?true:false"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="model.password"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input type="text" v-model="model.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" v-model="model.email"></el-input>
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-button type="primary" native-type="submit" class="myBtn" style="width: 100%;">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  props: {
    id: {}
  },
  data() {
    var RegPhone = (rule, value, callback) => {
      let reg = /^1[0-9]{10}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入11位正确的手机号"));
      } else {
        callback();
      }
    };
    var RegEmail = (rule, value, callback) => {
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (value) {
        if (!reg.test(value)) {
          callback(new Error("请输入正确的邮箱"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      model: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: RegPhone,
            trigger: "blur"
          }
        ],
        email: [
          {
            validator: RegEmail,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
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
        this.$set(this.model, "user_id", parseInt(this.id)); // this.model.id=this.id
        res = await this.$http.post(`admin/update/`, this.model);
      } else {
        res = await this.$http.post("admin/create", this.model);
      }
      if (res.code == 200) {
        this.$router.push("/admin_users/list");
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
      const res = await this.$http.get(`admin/${this.id}`);
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
