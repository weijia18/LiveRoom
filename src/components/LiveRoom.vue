<template>
  <div>
    <div  class="barrages-drop" >
      <div style="width:60%;;margin-left:2%;float:left;">
        <div class="container" style="width:100%;height:100px;padding-bottom:3px">
          <div class="row">
            <div class="col-md-2"><img src="../assets/lantian.jpg" class="round_icon"  alt=""></div>
            <div class="col-md-2 mtext"><lable class="mblue">教师</lable><lable class="mblue">已实名</lable></div>
            <div class="col-md-2 mtext"><li class="icon_pedu" ></li>xx大学</div>
            <div class="col-md-2 mtext"><li class="icon_pcity"></li>深圳市</div>
            <div class="col-md-4 mtext">分享到<li class="icon_qq" alt=""></li><li class="icon_weibo" alt=""></li></div>
          </div>
        </div>
        <video
        id="videoId"
        controls = "true"
        :height="600"
        style="width:100%">
        </video>
        <vue-baberrage
        :isShow="barrageIsShow"
        :barrageList="barrageList"
        :maxWordCount="maxWordCount"
        :throttleGap="throttleGap"
        :loop="barrageLoop"
        :boxHeight="boxHeight"
        :messageHeight="messageHeight"
        :boxWidth="boxWidth-300"
        >
        </vue-baberrage>
      </div>
      <div class="ivu-card ivu-card-bordered" style="float: left; height: 700px; width: 20%; margin-left:1%">
        <nav>
          <ul>
            <li id="mnavbar">
              <router-link to="/chatroom" exact>在线聊天室</router-link>
              <router-link to="/online" exact>当前在线人数</router-link>
            </li>
          </ul>
        </nav>
        <router-view></router-view>
      </div>
    </div>

    <div style="width:100%">
      <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type" style="width: 55%;float:left;margin-left:2%">
        <div class="ivu-input-inner-container" style="">
          <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i> 
          <input autocomplete="off" spellcheck="false" type="text" placeholder="请输入..." class="ivu-input ivu-input-default">
        </div> 
      </div>
      <button type="button" class="ivu-btn ivu-btn-primary" style="width: 5%;float:left">
        <span>发送弹幕</span>
      </button>
      <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type" style="width: 15%;float:left;margin-left:1%">
        <div class="ivu-input-inner-container" style="">
          <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i> 
          <input autocomplete="off" spellcheck="false" type="text" placeholder="请输入..." class="ivu-input ivu-input-default">
        </div>
      </div>
      <button type="button" class="ivu-btn ivu-btn-primary" style="width: 5%;float:left">
        <span>发送消息</span>
      </button>
    </div>
  </div>
</template>
<script>
  //import { onlineList } from '@/api/data'
  import { MESSAGE_TYPE } from 'vue-baberrage'
  import flvjs from 'flv.js' 
  import ChatRoom from './ChatRoom'
  import OnLine from './OnLine'
  export default {
    name: 'App',
    components:{
      "chatroom":ChatRoom,
      "online":OnLine
    },
    data () {
      return {
        type:0,
        sendmsg: '土狗就是个辣鸡~',
        barrageIsShow: true,
        messageHeight: 3,
        boxHeight: 150,
        boxWidth:1000,
        barrageLoop: true,
        maxWordCount: 3,
        throttleGap: 5000,
        barrageList: [],
        t:'',
        userId:0,
        userName:'游客',
        msgs:[],
        currentId:1,
        msgHeadImageURL:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3064584167,3502823640&fm=26&gp=0.jpg',
        sendTime:'',
        chatRoomWebsocket:'',
        onlineUserList:[],
        onlineNumber:0

      }
    },
    created() {
      this.userId=parseInt(Math.random()*1000000);
      this.userName=this.userName+this.userId;
      console.log(this.userName);
      this.t = window.setInterval(this.getChatUserList, 5000);
    },
    beforeDestroy() {
      clearInterval(this.t);
    },
    destroyed() {
      this.websocketClose();
    },
    mounted(){
      console.log(this.$route.query.id);
      if (flvjs.isSupported()){
        var videoElement = document.getElementById('videoId');
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          "isLive": true,
          url: 'http://62.234.60.111:7001/stream/'+this.$route.query.id+'.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
          // flvPlayer.play();
      }
  },
  methods: {       
    initWebSocket() {
      if (typeof WebSocket != "undefined") {
        this.supported = "支持 websocket";
      } else {
        this.supported = "不支持 websocket";
      }
      //ws地址
      const wsuri = "ws://62.234.60.111:8888/websocket/" + this.$route.query.id + "/" + this.type + "/" + this.userId; 
      this.chatRoomWebsocket = new WebSocket(wsuri);
      this.chatRoomWebsocket.onerror = this.websocketOnError;
      this.chatRoomWebsocket.onmessage = this.websocketOnMessage;
      this.chatRoomWebsocket.onclose = this.websocketOnClose;       
  },              
    //连接发生错误的回调方法
    websocketOnError() {
      console.log("WebSocket 连接发生错误");
    },
    //接收到消息的回调方法
    websocketOnMessage(event) {
      console.log(event);
      let data = JSON.parse(event.data);
      // this.msgHeadImageURL = data.chatImage ? data.chatImage : userPhoto;
      if (data.chatUser != this.userId&&data.chatType=='1') {
        this.msgs.push(data);
      }
      if (data.chatUser != this.userId&&data.chatType=='2') {
        this.barrageList.push({
          id: ++this.currentId,
          avatar: this.msgHeadImageURL,
          msg: data.chatContent,
          barrageStyle: "normal",
          time: 5,
          type: MESSAGE_TYPE.NORMAL,
          position: "bottom"
        });
      }
  },
    //连接关闭的回调方法
    websocketOnClose(e) {
      console.log("WebSocket 连接关闭", e);
    },
    //关闭 WebSocket 连接
    websocketClose() {
      this.chatRoomWebsocket.close();
    },       
    addToList(type) {
      if (this.sendmsg.split(" ").join("").length != 0) {
        //获取当前时间
        var time = new Date();
        this.sendTime =
        time.getHours() +
        ":" +
        (time.getMinutes() < 10
          ? "0" + time.getMinutes()
          : time.getMinutes());
        let messageData = {
          chatContent: type==2?this.userName+":"+this.sendmsg:this.sendmsg,
          chatUser: this.userId,
          chatAvatar: this.userName,
          chatImage: this.msgHeadImageURL,
          chatTime: this.sendTime,
          chatType:type
        };
        if (this.chatRoomWebsocket.readyState != "1") {
          // 如果按下按钮时不是连接状态，重连并等到连接成功再发送消息
          this.initWebSocket();
          this.chatRoomWebsocket.onopen = () => {
            this.chatRoomWebsocket.send(JSON.stringify(messageData));
            //发送消息
            if (type==1) {
              this.msgs.push({
                chatContent: this.sendmsg,
                chatUser: this.userId,
                chatAvatar: this.userName,
                chatImage: this.msgHeadImageURL,
                chatTime: this.sendTime,
              });
            }else{
              this.barrageList.push({
                id: ++this.currentId,
                avatar: this.msgHeadImageURL,
                msg: messageData.chatContent,
                barrageStyle: "normal",
                time: 5,
                type: MESSAGE_TYPE.NORMAL,
                position: "bottom"
              });
            }
            this.sendmsg = "";
        };
    } else {
      this.chatRoomWebsocket.send(JSON.stringify(messageData));
          //发送消息
          if (type==1) {
            this.msgs.push({
              chatContent: this.sendmsg,
              chatUser: this.userId,
                chatAvatar: this.userName,
                chatImage: this.msgHeadImageURL,
                chatTime: this.sendTime,
            });
          }else{
            this.barrageList.push({
              id: ++this.currentId,
              avatar: this.msgHeadImageURL,
              msg: messageData.chatContent,
              barrageStyle: "normal",
              time: 5,
              type: MESSAGE_TYPE.NORMAL,
              position: "bottom"
            });
          }
          this.sendmsg = "";
      }
  }
      // list.forEach((v) => {
      //  this.barrageList.push({
      //    id: v.id,
      //    avatar: v.avatar,
      //    msg: v.msg,
      //    time: v.time,
      //    type: MESSAGE_TYPE.NORMAL,
      //    barrageStyle: v.barrageStyle
      //  });
      // });
    },
    getChatUserList() {
      let data = {
        sid: this.$route.query.id,
        type: 1
      };
      onlineList(data).then(res => {
        // console.log(res);
        // if (res.data.state == 200) {
          this.onlineNumber = res.data.count;
          this.onlineUserList = res.data.userList;
          console.log(this.onlineNumber);
          console.log(this.onlineUserList);
        // }
      });
  },

}

}
</script>
<style  lang="less">
ul {
  list-style-type:none;
  text-align:center;
}

.round_icon{
  width: 97px;
  height: 97px;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.icon_pedu{
    background: url(../assets/icon-card.png) no-repeat;
    background-position: 0 -67px;
    display: inline-block;
    width: 21px;
    height: 24px;
    vertical-align: text-bottom;
    margin-right: 2px;
}

.icon_pcity{
    background: url(../assets/icon-card.png) no-repeat;
    background-position: 0 0px;
    display: inline-block;
    width: 21px;
    height: 24px;
    vertical-align: text-bottom;
    margin-right: 2px;
}

.icon_qq{
    background: url(../assets/icon-share.png) no-repeat;
    background-position-y: 2px;
    width: 25px;
    height: 26px;
    display: inline-block;
    vertical-align: text-bottom;
    margin-left: 10px;
}

.icon_weibo{
    background: url(../assets/icon-share.png) no-repeat;
    background-position-y: -40px;
    width: 28px;
    height: 25px;
    display: inline-block;
    vertical-align: text-bottom;
    margin-left: 5px;
}

.barrages-drop .mblue {
    border-radius: 100px;
    background: #bad6f3;
    color: #1673d0;
    margin:2px 3px;
}

.mtext{
  padding-top:65px;
  font-size:20px;

}

#mnavbar {
  display:inline-block;
  margin:0px;
  width: 100%;
}
a {
  width:50%;
  float:left;
  padding-top:10px
}

a:hover {
  color:red;
}

.barrages-drop {
  .blue {
    border-radius: 100px;
    background: #e6ff75;
    color: #fff;
  }

  .green {
    border-radius: 100px;
    background: #75ffcd;
    color: #fff;
  }
  .red {
    border-radius: 100px;
    background: #e68fba;
    color: #fff;
  }
  .yellow {
    border-radius: 100px;
    background: #dfc795;
    color: #fff;
  }
  .baberrage-stage {
    position: absolute;
    width: 100%;
    height: 212px;
    overflow: hidden;
    top: 0;
    margin-top: 130px;
  }
}
</style>


