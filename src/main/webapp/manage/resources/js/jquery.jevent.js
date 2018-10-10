/**
 * @jQuery�����Jevent
 * @author:zhanzhihu
 * @date:  2008-14-40
 * jQuery������Զ���jQuery�¼�����
 * �¼��Ļ��ƣ���Ϊ����׶Ρ�Ŀ��׶Ρ�ð�ݽ׶�
 * ����׶Σ��¼�����ʱ���ã�Ĭ��Ϊ�رգ��ɸ�����������Ŀ����󣬴����¼�
 * ð�ݽ׶Σ��¼�����ʱ���ã�Ĭ��Ϊ�򿪣���Ŀ�괥�����������Ϊֹ�������¼�
 */
if (typeof jQueryJEvent == "undefined") { var jQueryJEvent = new Object();}

/**
 * �����¼���ĸ���
 * @param {string} name    
 * @param {boolean} capture 
 * @param {boolean} bubble  
 * @param {Object} data   
 * @param {jQuery Object} target  
 */
jQueryJEvent.Event = 
function(name,capture,bubble,data,target){
	this.name    = name;
	this.capture = capture;
	this.bubble  = bubble;
	this.data    = data;
	this.target  = target;
};


jQueryJEvent.poolUnit = function(name,handleArray){
	this.name = name;
	if(handleArray instanceof Array){
		this.handleArray = handleArray;
	}else{
		this.handleArray = [handleArray];
	}
	
};
jQueryJEvent.handleUnit = function(jQueryObj,capture,bubble,func){
	this.jQueryObj = jQueryObj;
	this.capture   = capture;
	this.bubble    = bubble;
	this.func      = func;
};
jQueryJEvent.jEventController = function(){
	if(jQueryJEvent.jEventController.caller != jQueryJEvent.getJEventControllerInstance){
		throw new Error("�Ƿ�����jEventController�Ĺ��캯��");return;
	}
	this.eventPool = [];
};
jQueryJEvent.jEventController.prototype = {
	handleJEvent: function(jEvent){	
		var parentArray1 = null;
		for(var i=0;i<this.eventPool.length;i+=1){
			if(this.eventPool[i].name == jEvent.name){
				if (jEvent.capture) {
						var handleArray1 = this.getJEventListener(jEvent,jEvent.name);
						for(var j=0;j<handleArray1.length;j+=1){
							handleArray1[j].func.call(handleArray1[j].jQueryObj,jEvent.data,"capture");
						}
				}
			}
		}			
	},
	addjEventListener:function(jQueryObj,name,capture,bubble,func){
		for(var i=0;i<this.eventPool.length;i+=1){
			if(this.eventPool[i].name == name){
				this.eventPool[i].handleArray.push(new jQueryJEvent.handleUnit(jQueryObj,capture,bubble,func));
				return;							
			}
		}
		this.eventPool.push(new jQueryJEvent.poolUnit(name,new jQueryJEvent.handleUnit(jQueryObj,capture,bubble,func)));
	},
	removeEventListener:function(jQueryObj,name,func){
		for(var i=0;i<this.eventPool.length;i+=1){
			if(this.eventPool[i].name == name){
				for(var j=0;j<this.eventPool[i].handleArray.length;j+=1){
					if(this.eventPool[i].handleArray[j].jQueryObj[0] == jQueryObj[0] && this.eventPool[i].handleArray[j].func == func){
						this.eventPool[i].handleArray.splice(j,1);
						return;
					}
				}
			}
		}		
	},
	hasJEventListener:function(jQueryObj,name){
		for(var i=0;i<this.eventPool.length;i+=1){
			if(this.eventPool[i].name == name){
				for(var j=0;j<this.eventPool[i].handleArray.length;j+=1){
					if(this.eventPool[i].handleArray[j].jQueryObj[0] == jQueryObj[0]){
						return true;
					}
				}
			}
		}
		return false;
	},
	getJEventListener:function(jQueryObj,name){
		var handleArrayRet = [];
		for(var i=0;i<this.eventPool.length;i+=1){
			if(this.eventPool[i].name == name){		
				for(var j=0;j<this.eventPool[i].handleArray.length;j+=1){
					handleArrayRet.push(this.eventPool[i].handleArray[j]);
				}
			}
		}
		return handleArrayRet;
	}
};
jQueryJEvent.singleJEventController = null;
jQueryJEvent.getJEventControllerInstance = function(){
	if(jQueryJEvent.singleJEventController == null){
		jQueryJEvent.singleJEventController = new jQueryJEvent.jEventController();
	}
	return jQueryJEvent.singleJEventController;
};

$.fn.extend({
	dispatchJEvent: function(name/*string*/,data,capture,bubble){		
		capture = capture || true;//�����¼�ʱĬ�Ͽ�������
		bubble  = bubble  || true;//�����¼�ʱĬ�Ͽ���ð��
		var controller = jQueryJEvent.getJEventControllerInstance();
		var jEvent = jQuery.createJEvent(name,capture,bubble,data,this);
		controller.handleJEvent(jEvent);
	},
	addJEventListener:function(name,func,capture,bubble){		
		capture = capture || false;//��Ӽ���ʱĬ�ϲ���������
		bubble  = bubble  || true; //��Ӽ���ʱĬ�Ͽ���ð��
		var controller = jQueryJEvent.getJEventControllerInstance();
		controller.addjEventListener(this,name,capture,bubble,func);	
	},
	removeJEventListener:function(name,func){
		var controller = jQueryJEvent.getJEventControllerInstance();
		controller.removeEventListener(this,name,func);
	},
	hasJEventListener:function(name){
		var controller = jQueryJEvent.getJEventControllerInstance();	
		return	controller.hasJEventListener(this,name);
	},
	getJEventListener:function(name){
		var controller = jQueryJEvent.getJEventControllerInstance();	
		return controller.getJEventListener(this,name);
	}
});
$.extend({
	createJEvent:function(name,capture,bubble,data,target){
		return new jQueryJEvent.Event(name,capture,bubble,data,target);
	},
	getParentsArray:function(jQueryObj){
		var parentsArray = [];
		if(jQueryObj[0] == jQuery(document)[0]){return parentsArray;}
		var tempParent = null;		
		for(tempParent = jQueryObj.parent();tempParent[0]!=jQuery(document)[0];tempParent=tempParent.parent()){			
			parentsArray.push(tempParent);
		}
		parentsArray.push(jQuery(document));
		return parentsArray;
	},
	checkInArray:function(ele,array,isJQuery){
		isJQuery = isJQuery || true;
		for(var i=0;i<array.length;i+=1){
			if(isJQuery){
				if(array[i][0] == ele[0]){
					return true;
				}
			}else{
				if(array[i] == ele){
					return true;
				}
			}
		}
		return false;
	}
});
