<template>
  <div>
    <div class="page-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/pageHome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>运营商</el-breadcrumb-item>
        <el-breadcrumb-item>帮助中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <el-tabs type="border-card" v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="帮助说明" name="first">
          <el-form :inline="true" size="small" class="demo-form-inline">
            <el-form-item>
              <el-button v-if="!editState" @click="editState = true">编辑</el-button>
              <el-button v-if="editState" @click="save">保存</el-button>
              <el-button v-if="editState" @click="addTitle">插入标题</el-button>
              <el-button v-if="editState" @click="addParagraph">插入段落</el-button>
            </el-form-item>
            <el-form-item>
              <el-upload v-if="editState" :on-success="imageSuccess" :action="host + '/comm/uploadImage'" :headers="headers" :show-file-list="false">
                <el-button>插入图片</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <div class="phone-wrap">
            <div class="top"></div>
            <div class="phone">
              <div class="nav">
                <div class="cur">帮助说明</div>
                <div>服务条款</div>
              </div>
              <div v-if="editState" class="tag-w yes-edit" v-for="item,index in html" :key="index" v-dragging="{ item: item, list: html, group: 'item' }">
                <i class="el-icon-delete" @click="delElement(index)"></i>
                <input v-if="item.title == 'title'" class="tag-title" v-model="item.content">
                <textarea v-if="item.title == 'paragraph'" class="paragraph" v-model="item.content"></textarea>
                <img v-if="item.title == 'images'" :src="item.content">
              </div>
              <div v-if="!editState" class="tag-w no-edit" v-for="item,index in html" :key="index">
                <div v-if="item.title == 'title'" class="tag-title">{{item.content}}</div>
                <p v-if="item.title == 'paragraph'" class="paragraph">{{item.content}}</p>
                <img v-if="item.title == 'images'" :src="item.content">
              </div>
            </div>
          </div>
          <p class="tip">编辑状态下可拖动进行排序</p>
        </el-tab-pane>
        <el-tab-pane label="服务条款" name="second">
          <el-form :inline="true" size="small" class="demo-form-inline">
            <el-form-item>
              <el-button v-if="!editState" @click="editState = true">编辑</el-button>
              <el-button v-if="editState" @click="save">保存</el-button>
              <el-button v-if="editState" @click="addTitle">插入标题</el-button>
              <el-button v-if="editState" @click="addParagraph">插入段落</el-button>
            </el-form-item>
          </el-form>
          <div class="phone-wrap">
            <div class="phone">
              <div class="top"></div>
              <div class="nav">
                <div>帮助说明</div>
                <div class="cur">服务条款</div>
              </div>
              <div v-if="editState" class="tag-w yes-edit" v-for="item,index in html" :key="index" v-dragging="{ item: item, list: html, group: 'item' }">
                <i class="el-icon-delete" @click="delElement(index)"></i>
                <input v-if="item.title == 'title'" class="tag-title" v-model="item.content">
                <textarea v-if="item.title == 'paragraph'" class="paragraph" v-model="item.content"></textarea>
                <img v-if="item.title == 'images'" :src="item.content">
              </div>
              <div v-if="!editState" class="tag-w no-edit" v-for="item,index in html" :key="index">
                <div v-if="item.title == 'title'" class="tag-title">{{item.content}}</div>
                <p v-if="item.title == 'paragraph'" class="paragraph">{{item.content}}</p>
                <img v-if="item.title == 'images'" :src="item.content">
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关于我们" name="third">
          <el-form :inline="true" size="small" class="demo-form-inline">
            <el-form-item>
              <el-button v-if="!editState" @click="editState = true">编辑</el-button>
              <el-button v-if="editState" @click="save">保存</el-button>
            </el-form-item>
          </el-form>
          <div class="phone-wrap">
            <div class="phone" style="background: #f5f5f5">
              <div class="top"></div>
              <div class="banner"><img src="../../images/about.png"></div>
              <div class="cells">
                <div class="cell">
                  <div class="cell_hd">微信公众号：</div>
                  <div class="cell_bd" v-if="!editState">领歌云康</div>
                  <div class="cell_bd" v-if="editState"><input type="text" v-model="aboutForm" placeholder="请输入微信公众号" /></div>
                </div>
                <div class="cell">
                  <div class="cell_hd">联系电话：</div>
                  <div class="cell_bd" v-if="!editState">400-0029-800</div>
                  <div class="cell_bd" v-if="editState"><input type="text" v-model="aboutForm" placeholder="请输入联系电话" /></div>
                </div>
                <div class="cell">
                  <div class="cell_hd">电子邮件：</div>
                  <div class="cell_bd" v-if="!editState">Servise@leagoohealth.com</div>
                  <div class="cell_bd" v-if="editState"><input type="text" v-model="aboutForm" placeholder="请输入电子邮件" /></div>
                </div>
                <div class="cell">
                  <div class="cell_hd">网址：</div>
                  <div class="cell_bd" v-if="!editState">www.leagoohealth.com</div>
                  <div class="cell_bd" v-if="editState"><input type="text" v-model="aboutForm" placeholder="请输入网址" /></div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import api from '../../utils/api'
import check from '../../utils/check'
export default {
  props: {
    isCollapse: Boolean,
  },
  data () {
    return {
      headers: {
        'Access-Token': JSON.parse(sessionStorage.sysUser).token
      },
      host: api.host,
      editState: false,
      html: [],
      activeTab: 'first',
      aboutForm: {

      }
    }
  },
  created () {
    this.getData(1)
  },
  mounted () {
  
  },
  updated () {
    
  },
  methods: {
    getData (type) {
      //请求修改数据
      this.loading = true
      this.$postByForm(api.host + '/operator/queryHelpCenter', {type: type}).then(data => {
        this.html = data.resultData
        this.loading = false
      })
    },
    save () {
      //数据提交      
      this.editState = false
      if (this.activeTab == 'first') {
        this.$postByForm(api.host + '/operator/addHelpCenter', {
          params: JSON.stringify(this.html),
          type: 1
        }).then(data => {
          
        })
      } else if (this.activeTab == 'second') {
        this.$postByForm(api.host + '/operator/addHelpCenter', {
          params: JSON.stringify(this.html),
          type: 2
        }).then(data => {
          
        })
      }
    },
    delElement (index) {
      this.html.splice(index,1)
    },
    addTitle () {
      this.html.push({
        title: 'title',
        content: '标题',
      })
    },
    addParagraph () {
      this.html.push({
        title: 'paragraph',
        content: '段落',
      })
    },
    imageSuccess (res, file) {
      if (res.resultCode == 200) {
        this.html.push({
          title: 'images',
          content: res.resultData,
        })
      } else {
        this.$message.error(data.resultMsg)
      }
    },
    handleClick(tab) {
      this.editState = false
      if (tab.name == 'first') {
        this.getData(1)
      } else if (tab.name == 'second') {
        this.getData(2)
      }
    }
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>
.cells{
  font-size: 14px;
  background: #fff;
}
.cell{
  margin: 0 12px;
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d1d1d1;
}
.cell_hd{
  width: 100px;
  color: #212121;
}
.cell_bd{
  flex: 1;
  color: #666;
  input{
    border: none;
    outline: none;
  }
}
.cells .cell:last-child{
  border: none;
}
.banner{
  margin-top: 64px;
  padding: 12px;
  img{
    display: block;
    width: 100%;
  }
}
.tag-w{
  position: relative;
  overflow: hidden;
  div.tag-title{
    padding: 10px 15px;
    font-size: 14px;
    box-sizing: border-box;
    color: #4AB134;
  }
  input.tag-title{
    display: block;
    width: 100%;
    border: none;
    outline: none;
    margin-bottom: none;
    padding: 10px 15px;
    font-size: 14px;
    box-sizing: border-box;
  }
  p.paragraph{
    padding: 0 15px;
    font-size: 14px;
  }
  textarea.paragraph{
    resize: none;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-size: 14px;
    display: block;
    padding: 10px 15px;
    background: none;
    height: 120px;
  }
  img{
    display: block;
    width: 100%;
    height: auto;
  }
}
.yes-edit.tag-w:hover{
  box-shadow: 0 0 20px #d1d1d1;
  z-index: 9998;
}
.tag-w.no-edit:hover{
  box-shadow: none;
}
.tat-w .yes-edit{
  position: relative;
}
.yes-edit i.el-icon-delete{
  display: none;
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -15px;
  color: #fff;
  background: #999;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.yes-edit:hover .el-icon-delete{
  display: block;
}
.tip{
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  line-height: 28px;
  color: #999;
}
.phone-wrap{
  width: 365px;
  height: 667px;
  margin: auto;
  position: relative;
  .top{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: url(../../images/top.png) 0 0 no-repeat;
    background-color: #fff;
    z-index: 9999;
    background-size: 100%;
  }
  .phone{
    width: 365px;
    height: 667px;
    margin: auto;
    position: relative;
    overflow-y: auto;
    box-shadow: 0 0 20px #d1d1d1;
    .nav{
      margin-top: 64px;
      display: flex;
      height: 40px;
      font-size: 14px;
      line-height: 40px;
      box-sizing: border-box;
      padding: 0 12px;
      box-shadow: 0 0 20px #d1d1d1;
      >div{
        padding: 0 10px;
        color: #666;
      }
      div.cur{
        color: #4AB134;
        border-bottom: 2px solid #4AB134;
      }
    }
  }
}
</style>