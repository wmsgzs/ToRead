function bookshelfbar(){
    $('.bookmenu').css("display","block");
    $('.readmenu').css("display","none");
    $('.bookshelfmain').css("display","block");
    $('.searchmain').css("display","none");
    $('.settingsmain').css("display","none");
    $('.Reading').css("display","none");
}
function searchbar(){
    $('.bookshelfmain').css("display","none");
    $('.searchmain').css("display","block");
    $('.settingsmain').css("display","none");
    $('.Reading').css("display","none");
}
function settingsbar(){
    $('.bookshelfmain').css("display","none");
    $('.searchmain').css("display","none");
    $('.settingsmain').css("display","flex");
    $('.Reading').css("display","none");
}
function listbar(){
    $('.bookmenu').css("display","none");
    $('.readmenu').css("display","block");
    $('.Reading').css("display","block");
    $('.bookshelfmain').css("display","none");
    $('.searchmain').css("display","none");
    $('.settingsmain').css("display","none");
    if($('.booklist').css("display") == "none"){
        $('.setmenu').show(); 
        $('.booklist').css("display","block");
    }
    else{ 
        $('.setmenu').hide(); 
        $('.booklist').css("display","none");
    }
}
function readsetbar(){
    $('.bookmenu').css("display","none");
    $('.readmenu').css("display","block");
    $('.Reading').css("display","block");
    $('.bookshelfmain').css("display","none");
    $('.searchmain').css("display","none");
    $('.settingsmain').css("display","none");
    if($('.setdisplay').css("display") == "none"){ $('.setdisplay').css("display","block");}
    else{ $('.setdisplay').css("display","none");}

}
function hide(){
    $('.menu').css("background-color",$(body).css('background-color'));
    $('.menu').css("width","30px");
    $('.main').css("margin-left","30px");
    $('.topmenu').css("display","none");
    $('#hidden').css("display","none");
    $('#unhidden').css("display","block");
}
function unhide(){
    $('.menu').css("background-color","#ffffff11");
    $('.menu').css("width","60px");
    $('.main').css("margin-left","60px");
    $('.topmenu').css("display","block");
    $('#hidden').css("display","block");
    $('#unhidden').css("display","none");
}
function morebar(id){
    var cname = ['.booklist','.ztsz','.gdsz']
    if($(cname[id]).css('display') == 'none'){
        $('.setmenu').show(); 
        $(cname[id]).css('display','block');
        for (let i = 0; i < cname.length; i++) {
            if (i != id) {
                $(cname[i]).hide(); 
            }
        }
    } else{
        $('.setmenu').hide(); 
        $(cname[id]).css('display','none');
    }
}
$('.paintset').pgs({
    color: '#ffffff', //初始色  支持两种配置方案
    // recommend : '25,38,220,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1'
    //		,color : '42,0,255'
}, function (event, obj) {
    console.log(event);
    console.log(obj);
    // $(event).css('color', '#' + obj.hex)
    $('body').css('background-color', '#' + obj.hex);
    $('.menu').css('background-color', '#fff8');
});
function readfontrange(id){
    var left = (id - 10) / 40 *100;
    $('.text').css('font-size',id + 'px');
    $('#readztzh').css('background-size', left +'% 100%');
    $('#readsize').val(id);
}
function readfontheight(id){
    $('.text').css('line-height',id + 'px');
    $('#readzthg').css('background-size', (id - 10) +'% 100%');
    $('#readheight').val(id);
}
function readfontweight(id){
    var fw = ['normal', 'bolder'];
    $('.text').css('font-weight', fw[id]);
}
function readfontfamily(){
    var name = $("#s option:selected").val();
    $('.text').css('font-family', name);
}
function readeye(){
    var t = $('.moonset').attr('title');
    var title = ['夜间模式', '护眼模式', '日间模式'];
    var fun = eye;
    if( t == '夜间模式'){
        $('.moonset').attr('title',title[1]);
        $('.moonset').css('background','url(img/eyeset.png) 0% 0% / 32px 32px no-repeat');
        $('.moonset').css('background-size','30px 30px');
        fun(1);
    } else if( t == '护眼模式'){
        $('.moonset').attr('title',title[2]);
        $('.moonset').css('background','url(img/sunset.png) 0% 0% / 32px 32px no-repeat');
        fun(2);
    } else{
        $('.moonset').attr('title',title[0]);
        $('.moonset').css('background','url(img/moonset.png) 0% 0% / 30px 30px no-repeat');
        fun(0);
    }
}
//设置界面导航栏-页面滚动时导航定位
var $navs = $('.navigation li'),                    // 导航
    $sections = $('.section'),             // 模块
    $window = $(window),
    navLength = $navs.length - 1;
    
$window.on('scroll', function() {
    var scrollTop = $window.scrollTop();
    for (var len = navLength; len > -1; len--) {
        var that = $sections.eq(len);
        if (scrollTop >= that.offset().top) {
            $navs.removeClass('current').eq(len).addClass('current');
            break;
        }
    }
});
//设置界面导航栏-点击导航定位页面
$('.navigation li a').on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({
        'scrollTop': $($(this).attr('href')).offset().top
    }, 400);
});
function eye(id){
    var  c = ['#ffffff', '#000000', '#000000'];
    var bc = ['#000000', '#faf9de', '#ffffff'];
    var mc = ['#fff1', '#fff8', '#fff8'];
    $('h2').css('border-bottom','3px solid ' + c[id]);
    $('h2').css('color',c[id]);
    $('h3').css('color',c[id]);
    $('.menu').css('background-color', mc[id]);
    $('.nava').css('color',c[id]);
    $('body').css('color',c[id]);
    $('body').css('background-color',bc[id]);
}
function color(name){
    var c = ['#55efc4', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d']
    if(name == '#55efc4' || name == '#ecf0f1' || name == '#bdc3c7' || name == '#95a5a6'){
        $('.menu').css('background-color','#fff8');
        $('h2').css('border-bottom','3px solid #000000');
        $('h2').css('color','#000000');
        $('h3').css('color','#000000');
        $('.nava').css('color','#000000');
        $('body').css('color','#000000');
        $('body').css('background-color',name);
    } else {
        $('.menu').css('background-color','#fff8');
        $('h2').css('border-bottom','3px solid #ffffff');
        $('h2').css('color','#ffffff');
        $('h3').css('color','#ffffff');
        $('.nava').css('color','#ffffff');
        $('body').css('color','#ffffff');
        $('body').css('background-color',name);
    }
}
$('.paigusu').pgs({
    color: '#ffffff', //初始色  支持两种配置方案
    // recommend : '25,38,220,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1'
    //		,color : '42,0,255'
}, function (event, obj) {
    console.log(event);
    console.log(obj);
    // $(event).css('color', '#' + obj.hex)
    $('body').css('background-color', '#' + obj.hex);
    $('.menu').css('background-color', '#fff8');
});
function fontcolor(name){
    $('h2').css('border-bottom','3px solid ' + name);
    $('h2').css('color',name);
    $('h3').css('color',name);
    $('.nava').css('color',name);
    $('body').css('color',name);
}
$('.fcmore').pgs({
    color: '#ffffff', //初始色  支持两种配置方案
    // recommend : '25,38,220,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1|25,38,220,1|46,49,104,1'
    //		,color : '42,0,255'
}, function (event, obj) {
    console.log(event);
    console.log(obj);
    // $(event).css('color', '#' + obj.hex)
    $('body').css('color', '#' + obj.hex);
    $('h2').css('border-bottom','3px solid #' + obj.hex);
    $('h2').css('color','#' + obj.hex);
    $('h3').css('color','#' + obj.hex);
    $('.nava').css('color','#' + obj.hex);
});
function fontrange(id){
    var left = (id - 10) / 40 *100;
    $('body').css('font-size',id + 'px');
    $('#ztzh').css('background-size', left +'% 100%');
    $('#size').val(id);
}
function fontheight(id){
    $('body').css('line-height',id + 'px');
    $('#zthg').css('background-size', (id - 10) +'% 100%');
    $('#height').val(id);
}
function fontweight(id){
    var fw = ['normal', 'bolder'];
    $('body').css('font-weight', fw[id]);
}
function family(){
    var $ff = $('#fontfamily');
    if($ff.css('display') == 'none'){
        $ff.css('display', 'block');
    } else{
        $ff.css('display', 'none');
    }
}
function fontfamily(id){
    var ff = ['微软雅黑','宋体','楷体','黑体','本墨今宋',
    '汉仪乐喵体','字酷堂清楷体','字酷堂海藏楷体','默陌山魂手迹',
    '潮字社时光简',"文鼎特颜楷",'逐浪雅宋体','Brush Script Std',
    'Kaushan Script','Lobster','Stencil Std','HoneyLight',
    'Lucida Grande Regular','Berkshire Swash','SeasideResortNF'];
    $('body').css('font-family', ff[id]);
    $('#fontname').html('选择字体：' + ff[id]);
}