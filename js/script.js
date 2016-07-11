$(function (){
	Alarm.realTime();//获取系统时间显示
	Alarm.alarmListDisplay();//判断是否显示列表
	if ($('.alarm-list').css('display') == 'block') {delAlarm('.alarm-list .time-btn')}//删除闹钟
	Active.weekActive($('.week-nav li'));//week-nav点击高亮

	//初始化顶级导航和二级导航
	Nav.topNav($('.top-nav li'))
	$('.aside-nav:eq(0)').css('display', 'block');
	$('.content:eq(0)').css('display', 'block');
	Nav.secondNav($('.aside-nav:eq(0) li'),0);
	$('.content:eq(0) .box-shell:eq(0)').css('display','block');

});
//导航
var Nav = {
	//顶级导航
	topNav : function (object) {
		object.click(function() {
			Active.navActive($(this));
			var num = $(this).index();
			$('.content').css('display','none');
			$('.content:eq(' + num + ')').css('display','block');
			$('.aside-nav').css('display','none');
			$('.aside-nav:eq(' + num + ')').css('display','block');
			//初始化二级导航
			Nav.secondNav($('.aside-nav:eq(' + num + ') li'),num);
			$('.aside-nav:eq(' + num + ') li').removeClass('active');
			$('.aside-nav:eq(' + num + ') li:eq(0)').addClass('active');
			$('.content:eq(' + num + ') .box-shell').css('display','none');
			$('.content:eq(' + num + ') .box-shell:eq(0)').css('display','block');

			if ($('.content:eq(0)').css('background-color') != '#fff') {
				//还原背景颜色
				$('.content').css('background-color', '#fff');
			}
		});
	},
	//二级导航
	secondNav : function (object,topNum) {
		object.click(function() {
			Active.navActive($(this));
			var num = $(this).index();
			$('.content:eq(' + topNum + ') .box-shell').css('display','none');
			$('.content:eq(' + topNum + ') .box-shell:eq(' + num + ')').css('display','block');
			//跌倒告警
			if ($('.content:eq(0)').css('background-color') != '#fff') {
				//还原背景颜色
				$('.content').css('background-color', '#fff');
			}
			if (topNum == 0 && num == 2) {
				//背景颜色设置
				$('.content:eq(0)').css('background-color', '#21282b')
			}
			if (topNum == 1 && num == 0) {
			    var length = $('.content:eq(1) .box-shell:eq(0) dd').length;
			    RightList.rightListDisplay(0,length);//判断右侧列表是否隐藏显示
			}
		});
	}
}
//高亮
var Active = {
	//导航栏高亮
	navActive : function (object) {
		object.siblings().removeClass('active')
		if (object.attr('class') != 'active') {
			object.addClass('active')
		}
	},
	//weekNav高亮
	weekActive : function (object) {
		object.click(function() {
			if ($(this).attr('class') == 'active') {
				$(this).removeClass('active')
			}else {
				$(this).addClass('active')
			}
		});
	}
}
//按钮
var Btn = {
	resetBtn : function(object,value) {
		object.val(value);
	},
	iconBtn : {
		//icon-btn按钮初始化
		iconBtnInit : function (object) {
			object.html('<span></span><i></i>');
			object.each(function() {
				if ($(this).attr('value') == '0') {
					$(this).find('span').css({'background-color': '#eaeaea'});
					$(this).find('i').css({'right':'36px'});
				}
			});
		},
		//icon-btn按钮点击切换
		iconBtnClick : function (object) {
			if ($(object).attr('value') == '1') {
				$(object).attr('value','0');
				$(object).find('span').css({
					'animation': 'icon-btn-off 0.5s',
					'background-color': '#eaeaea'
				});
				$(object).find('i').animate({right:'36px'},'fast');
			} else if($(object).attr('value') == '0') {
				$(object).attr('value','1');
				$(object).find('span').css({
					'animation': 'icon-btn-on 0.5s',
					'background-color': '#f39c12'
				});
				$(object).find('i').animate({right:'0'},'fast');
			}
		}
	}
}
//验证
var Check = {
    //手机
	checkMobile : function(id) {
		var regMobile = /^0?1[3|4|5|8][0-9]\d{8}$/;
    	var mflag = regMobile.test(id.val());
		if (!mflag) {return 0}else {return 1}//正确返回值1，错误返回值0
	}
	// var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; //邮箱
	// var regName = /^[a-z0-9_-]{3,16}$/; //用户名
	// var regTel = /^0[\d]{2,3}-[\d]{7,8}$/;//电话
}
//碎片
var fragment = {
	//取2位整数
	num2 : function (Value) {
		if (Value.toString().length == 1) {
			Value = '0' + Value;
			return Value;
		}else {
			Value = '' + Value;
			return Value;
		}
	}
}
//右侧列表
var RightList = {
	//添加
	add : function (object) {

		var famliyNumValue = $('.famliy-num input').val();
		addFamliyNumHtml = '<dd>' +
			'<span>' + famliyNumValue + '</span>' +
			'<i class="icon iconfont" onclick="RightList.modify($(this),0)">&#xe60b;</i>' +
			'<i class="icon iconfont" onclick="RightList.del($(this),0)">&#xe601;</i>' +
		'</dd>';

		var fingerValue = $('.user-finger input').val();
		addFingerHtml = '<dd>' +
			'<img class="logo" src="images/user-finger-img1.png" alt=""> ' +
			'<span>' + fingerValue + '</span>' +
			'<i class="icon iconfont" onclick="RightList.del($(this),1)">&#xe601;</i>' +
		'</dd>';

		var addList = object.parents('.box-shell').children('.right-list')

		if (object.parents('.famliy-num').length == 1) {
			//验证电话号码
			if (Check.checkMobile($('#check_phone')) == 0) {
				alert('电话号码格式错误')
				return
			}
			$('#check_phone').val("");//清空input值
			$(addFamliyNumHtml).appendTo(addList);//渲染
		    var length = $('.content:eq(1) .box-shell:eq(0) dd').length;
		    RightList.rightListDisplay(0,length);//判断右侧列表是否隐藏显示
		} else if (object.parents('.user-finger').length == 1) {
			$(addFingerHtml).appendTo(addList);//渲染
		    var length = $('.content:eq(1) .box-shell:eq(1) dd').length;
		    RightList.rightListDisplay(1,length);//判断右侧列表是否隐藏显示
		}
	},
	//修改
	modify : function (object,num) {
		var mobileValue = object.prev().html();
		var addFamliyNumHtml = '<div class="famliy-num-modify" style="display:none">' +
				'<div class="title">修改亲情号码：</div>' +
				'<div class="body">' +
					'<label><i class="icon iconfont">&#xe608;</i></label>	' +
					'<input id="check_modify_phone" type="text" value="'+ mobileValue +'"></input>' +
					'<button><i class="icon iconfont" onclick="RightList.save($(this),0)">&#xe60b;</i></button>' +
				'</div>' +
			'</div>' ;

		$('.famliy-num').css('display', 'none');
		$('.right-list').animate({right:'71%'});

		if ($('.famliy-num-modify').length != 1) {
			$(addFamliyNumHtml).appendTo(object.parents('.box-shell'));
		}
		setTimeout(function(){$('.famliy-num-modify').fadeIn();},400);
	},
	//保存
	save : function (object,num) {
		this.anima = function(id,modifyId) {
			id.css('display', 'block');
			$('.right-list').animate({right:'0'});
			modifyId.remove();
		}
		if (num == 0) {
			//验证电话号码
			if (Check.checkMobile($('#check_modify_phone')) == 0) {
				alert('电话号码格式错误')
				return
			}
			this.anima($('.famliy-num'),$('.famliy-num-modify'));
		}
	},
	//删除
	del : function (object,num) {
		var r=confirm("确认删除用户指纹吗？");
		if (r==true){
		    object.parents('dd').remove();
		    var length = $('.content:eq(1) .box-shell:eq(' + num + ') dd').length;
		    RightList.rightListDisplay(num,length);
		}else{
			return
		}
	},
	//判断右侧列表是否隐藏显示
	rightListDisplay : function (num,value) {
		if (value == 0) {
			if (num == 0) {
				$('.right-list:eq(0)').fadeOut();
				$('.famliy-num').animate({width:'68%'});
			}else if (num == 1) {
				$('.right-list:eq(1)').fadeOut();
				$('.user-finger').animate({width:'93%'});
			}
		}else {
			if (num == 0) {
				$('.right-list:eq(0)').fadeIn();
				$('.famliy-num').animate({width:'40%'});
			}else if (num == 1) {
				$('.right-list:eq(1)').fadeIn();
				$('.user-finger').animate({width:'70%'});
			}
		}
	}
}
//闹钟
var Alarm = {
	//显示系统时间
	realTime : function () {
		var myDate = new Date();
		var timeValue = {
			hours: myDate.getHours(),
			minutes: myDate.getMinutes(),
		}
		
		this.timeHtml = function(hours,minutes) {
			$('#real_time .icon').html(fragment.num2(hours) + ':' + fragment.num2(minutes));
		}

		this.angleLoop = function() {
			var setTime = $('#real_time .icon:eq(0)').html().split(':');
			var angle = (parseInt(setTime[0]*60) + parseInt(setTime[1]))/720*360
			$('#real_time .bg').css('transform','rotate('+ angle +'deg)');
		}

		this.timeHtml(timeValue.hours,timeValue.minutes);
		this.angleLoop();
	},
	//添加闹钟
	add : function () {
		var alarmTime = $('#alarm_value').html();
		var num = $('.alarm-list li').length;
		var addAlarmHtml = '<li>' +
				'<span class="title">闹钟' + (num + 1) + '</span>' +
				'<span class="state">自定义</span>' +
				'<span class="time-btn" onclick="Alarm.modify($(this))">' + alarmTime +'</span>' +
				'<span class="icon-btn" onclick="Btn.iconBtn.iconBtnClick(this)" value="1"></span>' +
			'</li>';
		$(addAlarmHtml).appendTo('.alarm-list');//渲染

		Btn.iconBtn.iconBtnInit($('.icon-btn'));//初始化闹钟开关
		Alarm.alarmListDisplay();//判断是否显示列表
		Alarm.del($('.alarm-list .time-btn:eq(' + num + ')'));
	},
	//删除闹钟
	del : function (id) {
		touch.on(id, 'hold', function(ev){
			var r=confirm("确认删除闹钟吗？");
			if (r==true){
			    this.parentNode.setAttribute('name','delete');
			    $('.alarm-list li[name="delete"]').remove();
				Alarm.alarmListDisplay();
			}else{
			    this.parentNode.removeAttribute("name");
			}
		});
	},
	//修改闹钟
	modify : function (object) {
		var alarmTime = object.html();
		var addAlarmHtml = '<div class="time-alarm-modify">' +
				'<div class="real-time-display" id="real_time">' +
					'<img class="bg" src="images/real-time-bg.png" alt="">' +
					'<div class="time-text"><span id="alarm_value" class="icon iconfont time-btn" onclick="setupTime.open($(this))">' + alarmTime + '</span></div>' +
				'</div>' +
				'<div class="real-time-title">当前时间</div>' +
				'<hr class="real-time-hr">' +
				'<ul class="week-nav clearfix">' +
					'<li><a>周一</a></li>' +
					'<li class="active"><a>周二</a></li>' +
					'<li class="active"><a>周三</a></li>' +
					'<li><a>周四</a></li>' +
					'<li><a>周五</a></li>' +
					'<li><a>周六</a></li>' +
					'<li><a>周日</a></li>' +
				'</ul>' +
				'<button class="btn btn-time" onclick="Alarm.save($(this))">修改闹钟</button>' +
			'</div>' ;

		$('.time-alarm').css('display', 'none');
		$('.alarm-list').animate({right:'71%'});
		if ($('.time-alarm-modify').length != 1) {
			$(addAlarmHtml).appendTo(object.parents('.box-shell'));
		}
		setTimeout(function(){$('.time-alarm-modify').fadeIn();},400);

		Active.weekActive($('.week-nav li'));//week-nav点击高亮
	},
	//保存已修改闹钟
	save : function (object) {
		$('.alarm-list').animate({right:'0'});
		$('.time-alarm-modify').remove();
		setTimeout(function(){$('.time-alarm').fadeIn();},400);

		Active.weekActive($('.week-nav li'));//week-nav点击高亮
	},
	//判断右侧列表是否隐藏显示
	alarmListDisplay : function () {
		if ($('.alarm-list li').length == 0) {
			$('.time-alarm').animate({width:'100%'});
			$('.alarm-list').fadeOut();
		}else {
			$('.time-alarm').animate({width:'72%'});
			$('.alarm-list').fadeIn();
		}
	}
}
//时间设置窗口
var setupTime = {
	//打开
	open : function(object) {
		var timeArrays = object.html().split(':');
		var hourValue = timeArrays[0];
		var minuteValue = timeArrays[1];

		var a = new setupTimeWindow();
		a.openWindow(24,60,hourValue,minuteValue);//打开时间设置窗口

		if ($('.time-alarm').css('display') == 'block') {
			$('.time-alarm').animate({width:'69%'});
		}else if ($('.time-alarm-modify').css('display') == 'block') {
			$('.time-alarm-modify').animate({'margin-right':'31%','width':'69%'});
		}
		$('.alarm-list').fadeOut();
	},	
	//关闭
	close : function() {
		var a = new setupTimeWindow();
		var b = $('.time-btn');
		a.closeWindow();//关闭时间设置窗口

		if ($('.time-alarm').css('display') == 'block') {
			if ($('.alarm-list li').length == 0) {
				$('.time-alarm').animate({width:'100%'});
			}else {
				$('.time-alarm').animate({width:'72%'});
				$('.alarm-list').fadeIn();
			}
		}else if ($('.time-alarm-modify').css('display') == 'block') {
			$('.time-alarm-modify').animate({'margin-right':'0','width':'70%'});
			$('.alarm-list').fadeIn();
		}
	},
	//保存
	save : function() {
		var a = new setupTimeWindow();

		if ($('.time-alarm').css('display') == 'block') {
			$('.time-alarm .time-btn').html(a.save());//保存时间设置窗口
			if ($('.alarm-list li').length == 0) {
				$('.time-alarm').animate({width:'100%'});
			}else {
				$('.time-alarm').animate({width:'72%'});
				$('.alarm-list').fadeIn();
			}
		}else if ($('.time-alarm-modify').css('display') == 'block') {
			$('.time-alarm-modify .time-btn').html(a.save());//保存时间设置窗口
			$('.time-alarm-modify').animate({'margin-right':'0','width':'70%'});
			$('.alarm-list').fadeIn();
		}

		var setTime = $('#real_time .icon:eq(0)').html().split(':');
		var angle = (parseInt(setTime[0]*60) + parseInt(setTime[1]))/720*360
		$('#real_time .bg').css('transform','rotate('+ angle +'deg)');
	}
}
//设置时间窗口控件
var setupTimeWindow = function(){
	var liHeight;
	//打开窗口
	this.openWindow = function(hoursNum,minutesNum,hourValue,minuteValue){

		var hoursHtml = '';

		for (var i = 1; i <= hoursNum; i++) {
			hoursHtml = hoursHtml + '<li>' + fragment.num2(i) + '<span>时</span></li>';
		};

		var minutesHtml = '';
		for (var i = 0; i <= minutesNum-1; i++) {
			minutesHtml = minutesHtml + '<li>' + fragment.num2(i) + '<span>分</span></li>';
		};

		var windowHtml = '<div id="setup-time-window">' +
			'<div class="setup-header">' +
				'<div class="left-btn" onclick="setupTime.close()"><i class="iconfont">&#xe610;</i></div>' +
				'<div class="title">设置时间</div>' +
				'<div class="right-btn" onclick="setupTime.save()"><i class="iconfont">&#xe60f;</i></div>' +
			'</div>' +
			'<div class="setup-body">' +
				'<div class="control-setup-time">' +
					'<ul id="hour_move" class="hour clearfix">' +
						hoursHtml +
					'</ul>' +
					'<ul id="minute_move" class="minute clearfix">' +
						minutesHtml +
					'</ul>' +
					'<div class="active-bg"></div>' +
				'</div>' +
			'</div>' +
		'</div>';

		//窗口渲染
		$('.content').append(windowHtml);
		$('#setup-time-window').fadeIn();


		//设置时间的li高度自适应
		liHeight = $('#setup-time-window li').height();
		$('#setup-time-window li').css({
			'line-height': liHeight + 'px',
			'height': liHeight + 'px'
		})

		//加载初始时间
		var hourMoveValue = this.iniTimeDisplay($('#hour_move'),hoursNum,hourValue);
		var minuteMoveValue = this.iniTimeDisplay($('#minute_move'),minutesNum,parseInt(minuteValue)+1);

		//加载时间滑动效果
		this.setupTime($('#hour_move'),hoursNum,hourMoveValue);
		this.setupTime($('#minute_move'),minutesNum,minuteMoveValue);
	}

	//关闭窗口
	this.closeWindow = function() {
		$('#setup-time-window').remove();
	}

	//修改后保存
	this.save = function() {
		var liHeight = $('#setup-time-window li').height();
		var h = parseInt($('#hour_move').css('top'));
		var m = parseInt($('#minute_move').css('top'));
		var timeValue = function(x) {
			var y = -x/liHeight+3;
			return y
		}
		var text = fragment.num2(timeValue(h)) + ':' + fragment.num2((timeValue(m)-1));//取2位整数

		$('#setup-time-window').remove();
		return text
	}

	//弹窗初始时间显示
	this.iniTimeDisplay = function(id,num,Value) {
		var topValueArray = topValue(id,num);//获取top值数组

		id.css('top',topValueArray[Value - 1] + 'px');
		id.find('li').eq(Value - 1).addClass('active');

		return topValueArray[Value - 1]//返回top值
	}

	//时间设置滑动效果
	this.setupTime = function (id,num,moveValue) {
		//滑动时
		touch.on(id, 'swiping', function(ev){
			var totalMoveValue = moveValue + ev.distanceY;
			id.css('top',totalMoveValue + 'px');
			id.find('li').removeClass('active');
		});
		//滑动结束
		touch.on(id, 'swipeend', function(ev){
			moveValue = moveValue + ev.distanceY;

			var topValueArray = topValue(id,num);//获取top值数组

			$.each(topValueArray, function(i){
				if (moveValue > topValueArray[i+1] + liHeight/2 && moveValue <= topValueArray[i] + liHeight/2) {
					$(id).css('top',topValueArray[i] + 'px');
					moveValue = topValueArray[i];
					id.find('li').eq(i).addClass('active');
				} else if (moveValue > topValueArray[0] + liHeight/2) {
					$(id).css('top',topValueArray[0] + 'px');
					moveValue = topValueArray[0];
					id.find('li').eq(0).addClass('active');
					// console.log('超出最小值');
				} else if (moveValue <= topValueArray[num-1] + liHeight/2) {
					$(id).css('top',topValueArray[num-1] + 'px');
					moveValue = topValueArray[num-1];
					id.find('li').eq(num-1).addClass('active');
					// console.log('超出最大值');
				}
			});
			// console.log(moveValue)
		});
	}

	//生成top值数组
	var topValue = function(id,num) {
		num = num - 1;
		var topArray = new Array();
		for (var i = 0; i <= num; i++) {
			x = i - 2;
			topArray[i]= -liHeight * x;
		}
		// console.log(topArray);
		return topArray //返回top值数组
	}
};