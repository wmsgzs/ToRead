var bookdata, bookcover, booknum, booktimesort; //小说数据，书籍封面，数据索引，时间排序数据
$.ajaxSetup({async: false}); //设置成同步
// 从json文件获取数据
$.getJSON("data.json", function (data) {
    bookdata = data.bookdata;
    bookcover = data.bookcover;
    booknum = data.booknum;
    booktimesort = data.booktimesort;
    console.log(data);
});
// 根据获取的json数据自动建立小说
bookdisplay(bookdata, 0, 'allbooks');
refreshrecentbook();
// 按数组显示图书
function bookdisplay(namearr,type,cname) {
    for (let l = 0; l < namearr.length; l++) {
        if(type === 1){var book = bookdata[booknum[namearr[l]]];}
        else {var book = bookdata[l];}
        const div = document.createElement('div');
        const link = document.createElement("a");
        const aname = document.createElement("a"); //封面文字内容
        aname.href = "#Reading?name=" + book["书名"];
        link.href = "#Reading?name=" + book["书名"];
        div.setAttribute("onclick", "openbook("+booknum[book["书名"]]+")");
        var linktitle = "";
        for(let i in book){
            if(i != '内容'){ 
                if(i == '分类'){
                    var sort = "分类：";
                    for(let x in book['分类']){
                        sort = sort + '-' + book['分类'][x];
                    }
                    linktitle = linktitle + sort + '\n';
                } else if(i == '标签'){
                    var bq = '标签：';
                    for(let y in book['标签']){
                        bq = bq + '-' + book['标签'][y];
                    }
                    linktitle = linktitle + bq.replace('-', '') + '\n';
                } else{
                    linktitle = linktitle + i + ': ' + book[i] + '\n';
                }
            }
        }
        link.title = linktitle;
        aname.innerHTML = book["书名"];
        div.className = "bookcover" + book["封面"];
        aname.className = "bookname" + book["封面"];
        link.className = "booklink book" + booknum[book["书名"]];
        div.insertBefore(link, div.lastChild);
        div.insertBefore(aname, div.lastChild);
        const all = document.getElementsByClassName(cname)[0];
        if(type === 1){all.appendChild(div, all.lastChild);}
        else {all.insertBefore(div, all.lastChild);}
    }
}
//对booktimesort按最后阅读时间排序，最新阅读的在最前面
function changetimesort(data){
    var time = {};
    $.extend({
        myTime:{
            CurTime: function(){
                return Date.parse(new Date())/1000;
            },
            DateToUnix: function(string) {
                var f = string.split(' ', 2);
                var d = (f[0] ? f[0] : '').split('-', 3);
                var t = (f[1] ? f[1] : '').split(':', 3);
                return (new Date(
                    parseInt(d[0], 10) || null,
                    (parseInt(d[1], 10) || 1) - 1,
                    parseInt(d[2], 10) || null,
                    parseInt(t[0], 10) || null,
                    parseInt(t[1], 10) || null,
                    parseInt(t[2], 10) || null
                    )).getTime() / 1000;
            },
            UnixToDate: function(unixTime, isFull, timeZone) {
                if (typeof (timeZone) == 'number'){
                    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                }
                var time = new Date(unixTime * 1000);
                var ymdhis = "";
                ymdhis += time.getUTCFullYear() + "-";
                ymdhis += (time.getUTCMonth()+1) + "-";
                ymdhis += time.getUTCDate();
                if (isFull === true){
                    ymdhis += "" + time.getUTCHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();
                }
                return ymdhis;
            }
        }
    });
    for (let i = 0; i < data.length; i++) {
        if (data[i]["最后阅读时间"] != '') {
            time[data[i]["书名"]] = $.myTime.DateToUnix(data[i]["最后阅读时间"]);
        }
    }
    timesort = Object.keys(time).sort(function(a,b){return  -(time[a]-time[b])});
    return timesort;
}
// 按booktimesort刷新最近阅读
function refreshrecentbook(){
    $('.recentbooklist').empty();
    var timesort = changetimesort(bookdata);
    bookdisplay(timesort, 1, 'recentbooklist');
}
function refreshallbook(){
    $('.allbooks div').remove();
    var timesort = changetimesort(bookdata);
    bookdisplay(bookdata, 0, 'allbooks');
}
Date.prototype.Format = function (fmt) { // 获取当前时间 author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function bookcopy() {
    return {
        "书名": "",
        "文件大小": "",
        "文件类型": "",
        "最新上传时间": "",
        "最后阅读时间": "",
        "封面": bookcover,
        "作者": "",
        "主角": "",
        "配角": "",
        "分类": {
            "性向": "",
            "视角": "",
            "时代": "",
            "风格": "",
            "原创性": "",
            "类型": ""
        },
        "标签": [],
        "简介": "",
        "文案": "",
        "立意": "",
        "备注": "使用手册",
        "章节": "",
        "内容": ""
    };
}
function upload(files) {
    var file = files[0];
    var name = file.name.replace(".txt", "");
    var book = {};
    if (booknum[name]) { //上传过的图书对内容进行修改
        console.log("更新了已上传改本图书")
        num = booknum[name];
        book = bookdata[num];

        book["文件大小"] = file.size + "字节";
        book["文件类型"] = file.type;
        /** 读取文件文本内容 */
        var reader = new FileReader();
        var fileString;
        reader.readAsText(file, "UTF-8");
        reader.onload = function (e) { //读取完文件之后会回来这里
            fileString = e.target.result; // 读取文件内容
            book["内容"] = fileString.replaceAll('\n', '<br>');//替换所有换行符并存入内容
            // console.log(fileString)
        }
        var nowtime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        book["最新上传时间"] = nowtime;

        bookdata[num] = book;
        // 修改title
        refreshtitle(num);
    } else { //没有上传的图书
        num = bookdata.length;
        booknum['length'] = num;
        booknum[name] = num;

        var book = new bookcopy();
        book["书名"] = name;
        book["文件大小"] = file.size + "字节";
        book["文件类型"] = file.type;
        /** 读取文件文本内容 */
        var reader = new FileReader();
        var fileString;
        reader.readAsText(file, "UTF-8");
        reader.onload = function (e) { //读取完文件之后会回来这里
            fileString = e.target.result; // 读取文件内容
            book["内容"] = fileString.replaceAll('\n', '<br>');//替换所有换行符并存入内容
            // console.log(fileString)
        }
        var nowtime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        book["最新上传时间"] = nowtime;
        bookdata[num] = book;

        
        /** 在全部图书中创建封面 */
        var div = document.createElement('div');
        var link = document.createElement("a");
        var aname = document.createElement("a"); //封面文字内容
        aname.href = "#Reading?name=" + name;
        link.href = "#Reading?name=" + name;
        div.setAttribute("onclick", "openbook("+num+")");
        var linktitle = "";
        for(var i in book){
            if(i != '内容'){ 
                if(i == '分类'){
                    var sort = "分类：";
                    for(var x in book['分类']){
                        sort = sort + '-' + book['分类'][x];
                    }
                    linktitle = linktitle + sort + '\n';
                } else if(i == '标签'){
                    var bq = '标签：';
                    for(var y in book['标签']){
                        bq = bq + '-' + book['标签'][y];
                    }
                    linktitle = linktitle + bq.replace('-', '') + '\n';
                } else{
                    linktitle = linktitle + i + ': ' + book[i] + '\n';
                }
            }
        }
        link.title = linktitle;
        aname.innerHTML = name;
        div.className = "bookcover" + bookcover;
        aname.className = "bookname" + bookcover;
        link.className = "booklink book" + num;
        div.insertBefore(link, div.lastChild);
        div.insertBefore(aname, div.lastChild);
        var all = document.getElementsByClassName('allbooks')[0];
        all.insertBefore(div, all.lastChild);
    }

    console.log(bookdata);
    console.log(booknum);
}
function openbook(id){
    $(".bookmenu").css("display","none");
    $(".readmenu").css("display","block");
    $(".bookshelfmain").css("display","none");
    $(".searchmain").css("display","none");
    $(".settingsmain").css("display","none");
    $(".Reading").css("display","block");
    var book = bookdata[id];
    var lasttime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    book["最后阅读时间"] = lasttime;
    $('.information0').html('书籍id：' + id );
    $('.information1 span').html(book['封面'] + '.png');
    $('.information2').val(book['作者']);
    $('.information3').val(book['主角']);
    $('.information4').val(book['配角']);
    $('.information5').val(book['简介']);
    $('.information6').val(book['文案']);
    $('.information7').val(book['立意']);
    $('.information8').val(book['备注']);
    var idname = ['cp', 'angle', 'times', 'style', 'original', 'type'];
    var name   = ['性向', '视角', '时代', '风格', '原创性', '类型'];
    for(var x = 0; x < 6; x++){
        if(book['分类'][name[x]] != ""){
            $('#' + idname[x]).val(book['分类'][name[x]]);
        }
    }
    // $('.information10').html('标签：' + book['标签']);
    for(var y in book['标签']){
        // console.log(book['标签'][y],bqid(book['标签'][y]))
        $('#check' + bqid(book['标签'][y])).prop('checked', true);
    }
    refreshtitle(id); // 刷新title
    refreshrecentbook(); // 刷新最近阅读
    //显示小说内容
    textdisplay(id);
        
    //设置界面导航栏-页面滚动时导航定位
    var $as = $('.booklist a');   // 导航
    var $chapters = $('.chapter');// 模块
    var $window = $(window);
    var alen = $as.length - 1;
        
    $window.on('scroll', function() {
        var scrollTop = $window.scrollTop();
        for (var len = alen ; len > -1; len--) {
            var that = $chapters.eq(len);
            if (scrollTop >= that.offset().top) {
                $as.removeClass('choose').eq(len).addClass('choose');
                break;
            }
        }
    });
    //设置界面导航栏-点击导航定位页面
    $as.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            'scrollTop': $($(this).attr('href')).offset().top
        }, 200);
    });
    // console.log($('html').html())
    console.log(bookdata)
}
function textdisplay(id){
    console.log('调用了textdisplay方法')
    if(bookdata[id]){
        console.log('该书本在第'+id+'个');
        $('.booklist').empty(); //清空目录
        var content = '<div>' + bookdata[id]["内容"];
        var reg = /([☆、第]{1,3}[0-9一二两三四五六七八九十百千零]*[章回]{1,2} *[0-9a-zA-Z\u4E00-\u9FA5]*)/g;
        var chapters = content.match(reg);
        if(chapters != null){
            for (var i = 0; i < chapters.length; i++) {
                content = content.replace(chapters[i], "</div><div class='chapter' id='chap" + (i+1) + "'><span>"+chapters[i]+"</span>");
                
                var a;
                if(i == 0){ a = '<a class="choose" href="#chap'+(i+1)+'">'+chapters[i]+'</a>';}
                else{a = '<a href="#chap'+(i+1)+'">'+chapters[i]+'</a>';}
                $('.booklist').append(a);
                // var item = chapters[i];
                // list = list +"<div class='chapter' id='chap" + (i+1) + "'><span>"+chapters[i] +'</span>'+ item.match(reg)[1] + "</div>";
            }
        }
        $(".text").html(content);
    } else{
        $(".text").html("找不到该本图书记录。<br>操作异常！！！<br>请返回书架重新进入");
    }
}
function changebook(cover){ bookcover = cover; }
function coveropen() {
    if ($('.information1 ul').css('display') == 'none') {
        $('.information1 ul').css('display','block');
    } else {
        $('.information1 ul').css('display','none');
    }
}
function changecover(coverid) {
    $('.information1 span').html(coverid + '.png')
    var bookid = $('.information0').html().replace('书籍id：','');
    bookdata[bookid]["封面"] = coverid;
    refreshtitle(bookid);
    refreshrecentbook(); // 刷新最近阅读
    refreshallbook();
}
function refreshtitle(bookid){
    var title = "";
    for(var i in bookdata[bookid]){
        if(i != '内容'){ 
            if(i == '分类'){
                var titlesort = "分类：";
                for(var x in bookdata[bookid]['分类']){
                    titlesort = titlesort + '-' + bookdata[bookid]['分类'][x];
                }
                title = title + titlesort.replace('-', '') + '\n';
            } else if(i == '标签'){
                var bq = '标签：';
                for(var y in bookdata[bookid]['标签']){
                    bq = bq + '-' + bookdata[bookid]['标签'][y];
                }
                title = title + bq.replace('-', '') + '\n';
            } else{
                title = title + i + ': ' + bookdata[bookid][i] + '\n';
            }
        }
    }
    $('.book' + bookid).attr('title',title);
}
function chifm(id){
    console.log('已调用');
    var name = ['作者', '主角', '配角', '简介', '文案', '立意', '备注'];
    var bookid = $('.information0').html().replace('书籍id：','');
    bookdata[bookid][name[id-2]] = $('.information' + id).val();
    var bookid = $('.information0').html().replace('书籍id：','');
    refreshtitle(bookid);
}
function booksort(id){
    var idname = ['cp', 'angle', 'times', 'style', 'original', 'type'];
    var name   = ['性向', '视角', '时代', '风格', '原创性', '类型'];
    var bookid = $('.information0').html().replace('书籍id：','');
    bookdata[bookid]['分类'][name[id]] = $('#' + idname[id]).val();
    console.log(bookdata[bookid]['分类']);
    refreshtitle(bookid);
}
function allchk(){
    $('.information10 input[type = "checkbox"]').each(function(){
        $(this).prop('checked', true);
    });
}
function cancelchk(){
    $('.information10 input[type = "checkbox"]').each(function(){
        $(this).prop('checked', false);
    });
}
function contrarychk(){
    $('.information10 input[type = "checkbox"]').each(function(){
        if($(this).prop('checked')){
            $(this).prop('checked', false);
        } else{
            $(this).prop('checked', true);
        }
    });
}
function bqid(name){
    var l = ['穿越时空', '东方玄幻', '都市情缘', '古穿今', '古代幻想', '豪门世家', '幻想空间', '江湖恩怨', '民国旧影', '魔法幻情', '虐恋情深', '女扮男装', '破镜重圆', '奇幻魔幻', '前世今生', '时代新风', '时尚流行', '史诗奇幻', '未来架空', '西方罗曼', '西方名著', '仙侠修真', '现代架空', '悬疑推理', '异国奇缘', '异世大陆', '英美衍生', '综漫', '咒回', '网王', '银魂', '海贼王', '齐神', '文野', '柯南', '火影', '家教', '黑篮', '猎人', 'JOJO', '圣斗士', '穿书', '打脸', '宫斗', '婚恋', '机甲', '基建', '姐弟恋', '经商', '竞技', '科幻', '科举', '恐怖', '快穿', '恋爱合约', '灵魂转换', '灵异神怪', '马甲文', '美食', '萌宠', '末世', '逆袭', '年代文', '年下', '女配', '女强', '强强', '乔装改扮', '青梅竹马', '商战', '升级流', '生子', '爽文', '随身空间', '甜文', '亡灵异族', '网红', '网配', '无限流', '武侠', '西幻', '系统', '相爱相杀', '校园', '星际', '性别转换', '玄学', '血族', '异能', '游戏网游', '娱乐圈', '宅斗', '直播', '职场', '种田文', '重生', '封神', '洪荒', '聊斋', '古典名著', '历史衍生', '港台', '日韩', '少女漫', '少年漫', '死神', '美娱', '超级英雄'];
    return l.indexOf(name) + 1;
}
function submitchk(){
    var id = $('.information0').html().replace('书籍id：','');
    var bq = [];
    $('.information10 input[type = "checkbox"]').each(function(){
        if($(this).prop('checked')){
            bq.push($(this).val());
        }
    });
    bookdata[id]['标签'] = bq;
    refreshtitle(id);
}
// 点击不限，其他取消选择
$('.searchcp input:first').click(function(){
    $('.searchcp input').prop('checked', false);
    $('.searchcp input:first').prop('checked', true);
});
$('.searchangle input:first').click(function(){
    $('.searchangle input').prop('checked', false);
    $('.searchangle input:first').prop('checked', true);
});
$('.searchtimes input:first').click(function(){
    $('.searchtimes input').prop('checked', false);
    $('.searchtimes input:first').prop('checked', true);
});
$('.searchstyle input:first').click(function(){
    $('.searchstyle input').prop('checked', false);
    $('.searchstyle input:first').prop('checked', true);
});
$('.searchoriginal input:first').click(function(){
    $('.searchoriginal input').prop('checked', false);
    $('.searchoriginal input:first').prop('checked', true);
});
$('.searchtype input:first').click(function(){
    $('.searchtype input').prop('checked', false);
    $('.searchtype input:first').prop('checked', true);
});
// 点击其他，不限取消选择；取消其他选择，不限被选择
$('.searchcp input').not(":first").click(function(){
    if ($('.searchcp input:checked').length == 0) {
        $('.searchcp input:first').prop('checked', true);
    } else {
        $('.searchcp input:first').prop('checked', false);
    }
});
$('.searchangle input').not(":first").click(function(){
    if ($('.searchangle input:checked').length == 0) {
        $('.searchangle input:first').prop('checked', true);
    } else {
        $('.searchangle input:first').prop('checked', false);
    }
});
$('.searchtimes input').not(":first").click(function(){
    if ($('.searchtimes input:checked').length == 0) {
        $('.searchtimes input:first').prop('checked', true);
    } else {
        $('.searchtimes input:first').prop('checked', false);
    }
});
$('.searchstyle input').not(":first").click(function(){
    if ($('.searchstyle input:checked').length == 0) {
        $('.searchstyle input:first').prop('checked', true);
    } else {
        $('.searchstyle input:first').prop('checked', false);
    }
});
$('.searchoriginal input').not(":first").click(function(){
    if ($('.searchoriginal input:checked').length == 0) {
        $('.searchoriginal input:first').prop('checked', true);
    } else {
        $('.searchoriginal input:first').prop('checked', false);
    }
});
$('.searchtype input').not(":first").click(function(){
    if ($('.searchtype input:checked').length == 0) {
        $('.searchtype input:first').prop('checked', true);
    } else {
        $('.searchtype input:first').prop('checked', false);
    }
});
function biaoqianname(id){
    var l = ['穿越时空', '东方玄幻', '都市情缘', '古穿今', '古代幻想', '豪门世家', '幻想空间', '江湖恩怨', '民国旧影', '魔法幻情', '虐恋情深', '女扮男装', '破镜重圆', '奇幻魔幻', '前世今生', '时代新风', '时尚流行', '史诗奇幻', '未来架空', '西方罗曼', '西方名著', '仙侠修真', '现代架空', '悬疑推理', '异国奇缘', '异世大陆', '英美衍生', '综漫', '咒回', '网王', '银魂', '海贼王', '齐神', '文野', '柯南', '火影', '家教', '黑篮', '猎人', 'JOJO', '圣斗士', '穿书', '打脸', '宫斗', '婚恋', '机甲', '基建', '姐弟恋', '经商', '竞技', '科幻', '科举', '恐怖', '快穿', '恋爱合约', '灵魂转换', '灵异神怪', '马甲文', '美食', '萌宠', '末世', '逆袭', '年代文', '年下', '女配', '女强', '强强', '乔装改扮', '青梅竹马', '商战', '升级流', '生子', '爽文', '随身空间', '甜文', '亡灵异族', '网红', '网配', '无限流', '武侠', '西幻', '系统', '相爱相杀', '校园', '星际', '性别转换', '玄学', '血族', '异能', '游戏网游', '娱乐圈', '宅斗', '直播', '职场', '种田文', '重生', '封神', '洪荒', '聊斋', '古典名著', '历史衍生', '港台', '日韩', '少女漫', '少年漫', '死神', '美娱', '超级英雄'];
    return l[id];
}
function bqintext(id){
    var name = biaoqianname(id);
    var text = $('#sbqintext').html() + '';
    var tt = $('.searchbqin input[type = "radio"]:checked').val();
    if (tt == null) {
        $('.searchbqin input[type = "radio"]:first').prop('checked',true);
    }
    if ($('#allbq'+id).css('color') == "rgb(255, 140, 122)") {
        $('#allbq'+id).css('color', '#3cd0fe');
        // text = text.replace(' ' + name , '');
        if(text == '暂无'){
            $('#sbqintext').html(' '+name);
            $('#sbqintext').css('color', '#3cd0fe');
        }
        else{
            $('#sbqintext').html(text + ' '+name);
        }
        var nottext = $('#sbqnotintext').html() + '';
        if(nottext == ' ' + name){
            $('#sbqnotintext').html('暂无');
            $('#sbqnotintext').css('color',$('body').css('color'));
        } else {
            nottext = nottext.replace(' ' + name ,'');
            $('#sbqnotintext').html(nottext);
        }
    }else if (text == '暂无') {
        $('#sbqintext').html(' ' + name);
        $('#sbqintext').css('color','#3cd0fe');
        $('#allbq'+id).css('color','#3cd0fe');
    }else if (text.indexOf(name) != -1) {
        text = text.replace(' ' + name , '');
        $('#allbq'+id).css('color',$('body').css('color'));
        if(text == ''){
            $('#sbqintext').html('暂无');
            $('#sbqintext').css('color',$('body').css('color'));
        }
        else{
            $('#sbqintext').html(text);
        }
    } else{
        $('#sbqintext').html(text + ' ' + name); 
        $('#allbq'+id).css('color','#3cd0fe');
    }
}
function bqnitext(id){
    var name = biaoqianname(id);
    var text = $('#sbqnotintext').html() + '';
    var tt = $('.searchbqnotin input[type = "radio"]:checked').val();
    if (tt == null) {
        $('.searchbqnotin input[type = "radio"]:first').prop('checked',true);
    }
    if ($('#allbq'+id).css('color') == "rgb(60, 208, 254)") {
        $('#allbq'+id).css('color', '#ff8c7a');
        // text = text.replace(' ' + name , '');
        if(text == '暂无'){
            $('#sbqnotintext').html(' '+name);
            $('#sbqnotintext').css('color', '#ff8c7a');
        }
        else{
            $('#sbqnotintext').html(text + ' '+name);
        }
        var nottext = $('#sbqintext').html() + '';
        if(nottext == ' ' + name){
            $('#sbqintext').html('暂无');
            $('#sbqintext').css('color',$('body').css('color'));
        } else {
            nottext = nottext.replace(' ' + name ,'');
            $('#sbqintext').html(nottext);
        }
    }else if (text == '暂无') {
        $('#sbqnotintext').html(' ' + name);
        $('#sbqnotintext').css('color','#ff8c7a');
        $('#allbq'+id).css('color','#ff8c7a');
    }else if (text.indexOf(name) != -1) {
        text = text.replace(' ' + name , '');
        $('#allbq'+id).css('color',$('body').css('color'));
        if(text == ''){
            $('#sbqnotintext').html('暂无');
            $('#sbqnotintext').css('color',$('body').css('color'));
        }
        else{
            $('#sbqnotintext').html(text);
        }
    } else{
        $('#sbqnotintext').html(text + ' ' + name); 
        $('#allbq'+id).css('color','#ff8c7a');
    }
}
function clearsearch(){
    // 全部取消
    $('.searchsort input[type = "checkbox"]').each(function(){
        $(this).prop('checked', false);
    });
    var sortid = ['cp', 'angle', 'times', 'style', 'original', 'type'];
    for(var x = 0;x < sortid.length;x++){
        $('.search' + sortid[x] +' input:first').prop('checked', true);
    }
    $('.searchbq input[type = "radio"]').prop('checked', false);
    $('#sbqintext').html('暂无');
    $('#sbqnotintext').html('暂无');
    $('#sbqintext').css('color',$('body').css('color'));
    $('#sbqnotintext').css('color',$('body').css('color'));
    $('.searchallbq span').css('color',$('body').css('color'));
}
function searchusekey(key,value){
    var list = [];
    var move = [];
    if (key == '标签') {
        for (let x in value) {
            if (x == '包含并集') {
                for (let y in value[x]) {
                    for (let b in bookdata) {
                        if($.inArray(value[x][y],bookdata[b]['标签']) != -1){
                            list.push(b);
                        }
                    }
                }
            } else if (x == '包含交集') {
                for (let b in bookdata) {
                    let turelen = 0;
                    for (let y in value[x]) {
                        if($.inArray(value[x][y],bookdata[b]['标签']) != -1){
                            turelen = turelen + 1;
                        }
                    }
                    if (turelen == value[x].length) { list.push(b); }
                }
            } else if (x == '排除并集') {
                for (let y in value[x]) {
                    for (let b in bookdata) {
                        if($.inArray(value[x][y],bookdata[b]['标签']) != -1){
                            move.push(b);
                        }
                    }
                }
            } else if (x == '排除交集') {
                for (let b in bookdata) {
                    const turelen = 0;
                    for (let y in value[x]) {
                        if($.inArray(value[x][y],bookdata[b]['标签']) != -1){
                            turelen = turelen + 1;
                        }
                    }
                    if (turelen == value[x].length) { move.push(b); }
                }
            } else {
                console.log('无标签限制');
            }
        }
    } else if (key == '分类') {
        for (let x in value) {
            if (value[x][0] != '不限') {
                for (let y in value[x]) {
                    for (let b in bookdata) {
                        if(value[x][y] == bookdata[b]['分类'][x]){
                            list.push(b);
                        }
                    }
                }
            }
        }
    } else {
        if (value != '') {
            for (let x in value) {
                for (let y in value[x]) {
                    for (let b in bookdata) {
                        if($.inArray(value[x][y],bookdata[b][key]) != -1){
                            list.push(b);
                        }
                    }
                }
            }
        }
        
    }
    // 去掉重复的bookid
    move = $.unique(move);
    list = $.unique(list);
    return {'list':list, 'move':move};
}
function searchlist(){
    var keylist = {书名: '',作者: '',主角: '',配角: '',简介: '',文案: '',立意: '',备注: '',
        分类: {性向:'', 视角:'', 时代:'', 风格:'', 原创性:'', 类型:''},标签: []};
    var sortid = ['cp', 'angle', 'times', 'style', 'original', 'type'];
    var sortname   = ['性向', '视角', '时代', '风格', '原创性', '类型'];
    var gjcname   = ['书名', '作者', '主角', '配角', '简介', '文案', '立意', '备注'];
    var gjc = $('.searchtext input').val().split(' ');
    if (gjc == '') {
        var bx = 1;
    } else {
        var bx = 0;
        for (let i = 0; i < gjcname.length; i++) {
            keylist[gjcname[i]] = gjc;
        }
    }
    for(var x = 0;x < sortid.length;x++){
        var sortlist = [];
        $('.search' + sortid[x] +' input[type = "checkbox"]').each(function(){
            if($(this).prop('checked')){
                if ($(this).val() == '不限') {
                    bx = bx + 1;
                }
                sortlist.push($(this).val());
            }
        });
        keylist['分类'][sortname[x]] = sortlist;
    }
    var bqlist = {};
    var tt = $('.searchbqin input[type = "radio"]:checked').val();
    var ft = $('.searchbqnotin input[type = "radio"]:checked').val();
    if ($('#sbqintext').html() == '暂无') {
        bx = bx + 1;
        bqlist[tt] = '不限';
    } else if(tt){
        var bqin = $('#sbqintext').html().match(/[\u4E00-\u9FA5]{2,4}/g);
        bqlist[tt] = bqin;
    }
    if ($('#sbqnotintext').html() == '暂无') {
        bx = bx + 1;
        bqlist[ft] = '不限';
    } else if(ft){
        var bqnotin = $('#sbqnotintext').html().match(/[\u4E00-\u9FA5]{2,4}/g);
        bqlist[ft] = bqnotin;
    }
    keylist['标签'] = bqlist;
    console.log('不限个数：' + bx,keylist);
    var searchlist = [], searchmovelist = [];
    if (bx == 9) {
        for (let l in bookdata) {
            searchlist.push(l);
        }
    } else {
        for (let z in keylist) {
            var find = searchusekey(z, keylist[z]);
            if (find['list'].length != 0) { searchlist.push(find['list'][0]); }
            if (find['move'].length != 0) { searchmovelist.push(find['move'][0]); }
        }
    }
    // 去掉重复的bookid
    searchlist = $.unique(searchlist);
    searchmovelist = $.unique(searchmovelist);
    // 去掉包含排除标签的bookid
    searchlist = $.grep(searchlist, function(value) {
        return $.inArray(value, searchmovelist) < 0;
    });
    // 依靠bookid创建表格
    $('.findlist').empty(); //清空上次搜索结果
    var addtable = $('<table border = "1"></table>')
    var addtrtop = '<tr class="findlisttop"><td>书名</td><td>作者</td><td>分类</td><td>标签</td><td>备注</td></tr>';
    addtable.append(addtrtop);
    if (searchlist.length == 0) {
        var addtr = '<tr><td colspan="5">没有符合要求的图书</td></tr>';
        addtable.append(addtr);
    } else {
        for(var sl in searchlist){
            var sorttext = '' , bqtext = '';
            for (let fl in sortname) {
                if (bookdata[sl]['分类'][sortname[fl]] != '') {
                    sorttext = sorttext + '-' + bookdata[sl]['分类'][sortname[fl]];
                }
            }
            for (let bq in bookdata[sl]['标签']) {
                bqtext = bqtext + '-' + bookdata[sl]['标签'][bq];
            }
            var addtr = '<tr><td onclick="openbook('+sl+')">'+bookdata[sl]['书名']+'</td><td>'+bookdata[sl]['作者']+'</td><td>'+sorttext.replace('-','')+'</td><td>'+bqtext.replace('-','')+'</td><td>'+bookdata[sl]['备注']+'</td></tr>';
            addtable.append(addtr);
        }
    }
    // 显示在表格
    $('.findlist').append(addtable);
    $('.findlist').css('display','block');
}
/* 保存data.json */
$('.save').click(function() {
    var json = {
        "bookcover": bookcover,
        "bookdata": bookdata,
        "booknum": booknum,
        "booktimesort": changetimesort(bookdata)
    };
    if(typeof json === "object"){
        json = JSON.stringify(json, undefined, 4)
    }
    // console.log(json);
    var blob = new Blob([json], {type: 'text/json'});
    var e = document.createEvent('MouseEvents');
    var a = document.createElement('a');
    a.download = 'data.json';
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
});