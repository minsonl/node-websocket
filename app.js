const ws = require('nodejs-websocket');
const server = ws.createServer(function(conn){
	conn.on('text',function(str){
		if (JSON.parse(str).type=='sign') {
			conn.nickName = JSON.parse(str).name;
			users(conn);
			boardcast("<span>系统消息</span>["+JSON.parse(str).name+"] 加入房间","chat")
		} else if(JSON.parse(str).type=='chat'){
			boardcast("<span>["+conn.nickName+"] </span>"+JSON.parse(str).content,"chat",conn)
		}
	})
	conn.on('close',function(data){
		boardcast("<span>系统消息</span>["+conn.nickName+"] 离开了房间","chat");
		users(conn);
	})
	conn.on('error',function(errs){
		console.log(errs)
	})
}).listen(3333);
function boardcast(str,type,self){
	if (type=='chat') {
		server.connections.forEach(function(item){
			if (self&&item==self) {
				item.sendText(JSON.stringify({type:type,msg:str,belong:true}))
			} else{
				item.sendText(JSON.stringify({type:type,msg:str}))
			}
		})
	} else{
		
	}	
}
function users(){
	server.connections.forEach(function(item){
		item.sendText(JSON.stringify({type:'sign',users:sortUsers(item)}));
	})
}
function sortUsers(self){
	let ary = new Array();
	server.connections.forEach(function(item){
		if (item==self) {
			ary.unshift(item.nickName)
		}else{
			ary.push(item.nickName)
		}
	})
	return ary;
}
