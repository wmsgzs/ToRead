(function ($, window, document, undefined) {

	var _pgs = function (event, options) {
		this.eve = event;
		this.defaults = {
			width: 230,
			height: 390,
			color: '#ffffff',
			recommend: false,
			title: '最近使用'
			//			,color : '42,0,255'
		};
		this.options = $.extend({}, this.defaults, options);
		console.log(this.options)
	}

	_pgs.prototype = {
		init: function () {
			var _this = this;
			this.getPosition();
			this.initDefaultColor();
			this.latelyColor();
			this.createHtml();
			this.on();
		},
		//弹出框
		createHtml: function () {
			var _this = this;
			var config = _this.options;
			var color = config.bg.r + ',' + config.bg.g + ',' + config.bg.b;
			var lately = '';

			$.each(config.lately, function (i, v) {
				if (i > 9) {
					return false;
				}
				lately += '<div style="width: 20px;height: 20px;margin:5px 11px;float: left;box-shadow: 0 0 5px #ccc;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==)"><div style="width: 100%px;height: 100%;background: rgba(' + v + ');" class="pgs-lately" data-color="' + v + '"></div></div>';
			});

			var elemColorBox = [
				'<div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 9999;"  id="pgs-screen">',

				'<div style="width: ' + config.width + 'px;height: ' + config.height + 'px;background: #fff;position: absolute;top: ' + config.positionTop + 'px;left: ' + config.positionLeft + 'px;border-radius: 6px ;z-index:99999;" id="pgs-color-picker">',
				'<div style="width:100%;height: 150px;background: rgb(' + color + ');position: absolute;border-radius: 6px 6px 0 0 ;overflow: hidden;" id="color-block">',
				'<div style="width:100%;height:100%;background: linear-gradient(to right, #fff, rgba(255,255,255,0));position: absolute;">',
				'<div style="width: 100%;height: 100%;background: linear-gradient(to top, #000, rgba(0,0,0,0));position: absolute;">',
				'<div style="width: 12px;height: 12px;border-radius: 6px;box-shadow: inset 0 0 0 1px #fff;position: absolute;top: ' + config.ident.top + 'px;left: ' + config.ident.left + 'px; z-index:1;" id="block-ident"></div>',
				'<div style="width:100%;height:100%;position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;" id="pgs-palette"></div>',
				'</div>',
				'</div>',

				'</div>',

				'<div style="width: 100%;height:100px;position: absolute;top: 150px;box-shadow: 0 2px 10px -2px #ccc;padding: 10px 20px;box-sizing: border-box;">',
				'<div style="width:16px;height:16px;border-radius: 8px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);box-shadow: inset 0 0 0 1px rgba(0,0,0,.1); float: left;margin-top: 5px;">',
				'<div style="width:16px;height:16px;border-radius: 8px;background: rgba(' + config.color.r + ',' + config.color.g + ',' + config.color.b + ');" id="final-color"></div>',
				'</div>',


				'<div style="width:160px;height: 10px;background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);float: right;position:relative;margin-bottom: 10px;">',
				'<div style="width:10px;height: 10px;background-color: #fff;border-radius: 5px;box-shadow: 0 0 2px #ccc;position: absolute;left:' + (config.colorSlider - 5) + 'px; z-index:1;" id="pgs-slider-btn"></div>',
				'<div style="width:100%;height:100%;position: absolute;left:0;top:0;right:0;bottom:0;z-index:2;" id="pgs-slider"></div>',
				'</div>',

				'<div style="width:160px;height: 10px;float: right;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);position: relative;">',
				'<div style="width: 100%;height: 10px;background:linear-gradient(to right, rgba(' + color + ', 0) 0%, rgba(' + color + ', 1) 100%);position: relative;" id="pgs-alpha-block">',
				'<div style="width:10px;height: 10px;background-color: #fff;border-radius: 5px;box-shadow: 0 0 2px #ccc;position: absolute;right:-5px;z-index:1;" id="pgs-alpha-btn"></div>',
				'<div style="width:100%;height:100%;position: absolute;left:0;top:0;right:0;bottom:0;z-index:2;" id="pgs-alpha"></div>',
				'</div>',
				'</div>',

				'<div style="width: 100%;height:45px;clear: both;padding-top: 10px;">',
				'<div style="width: 153px;height: 100%;float: left;">',
				'<div style="width:100%;height:100%; " id="pgs-rgba">',
				'<input type="text" name="pgs-r" style="width: 33px;height:20px;padding:0;border: 1px solid #ccc;border-radius: 5px;margin-right: 4px;text-align:center;color:#333" value="' + config.color.r + '">',
				'<input type="text" name="pgs-g" style="width: 33px;height:20px;padding:0;border: 1px solid #ccc;border-radius: 5px;margin-right: 4px;text-align:center;color:#333" value="' + config.color.g + '">',
				'<input type="text" name="pgs-b" style="width: 33px;height:20px;padding:0;border: 1px solid #ccc;border-radius: 5px;margin-right: 4px;text-align:center;color:#333" value="' + config.color.b + '">',
				'<input type="text" name="pgs-a" style="width: 33px;height:20px;padding:0;border: 1px solid #ccc;border-radius: 5px;text-align:center;color:#333" value="' + config.color.a + '">',
				'<p style="color:#666;letter-spacing: 29px;text-indent: 13px;line-height: 25px;margin:0;">RGBA</p>',
				'</div>',
				'<div style="width:100%;height:100%;float: left; display: none;" id="pgs-rex">',
				'<input type="text" name="pgs-hex" style="width:100%;height:20px;border: 1px solid #ccc;border-radius: 5px;text-align:center;color:#333" value="#' + config.hex + '" >',
				'<p style="color:#666;text-align:center;letter-spacing: 8px;text-indent: 13px;line-height: 25px;margin:0;">HEX</p>',
				'</div>',
				'</div>',

				'<div style="width:35px;height: 100%;float: right;cursor: pointer;padding-top: 8px;text-align: right;" id="pgs-tab">',
				'<svg style="width:85%;" viewBox="0 0 24 24" data-reactid=".0.0.q.0.0.0.0.0.1.1.1.0.0" ><path fill="#333" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" data-reactid=".0.0.q.0.0.0.0.0.1.1.1.0.0.0"></path></svg>',
				'</div>',
				'</div>',
				'</div>',

				'<div style="width:100%;position: absolute;bottom: 50px;padding:10px;box-sizing: border-box;">',
				// '<p style="color:#666;text-indent: 10px;margin:0;">'+config.title+'</p>',
				'<div style="height: 70px;width:100%;padding: 5px 0;box-sizing: border-box;">',
				lately,
				'</div>',
				'</div>',

				'<div style="width:100%;height: 50px;text-align: center;position: absolute;bottom: 0;line-height: 50px;box-shadow: 0 -2px 10px -2px #ccc;">',
				'<button style="line-height:18px;border: 1px solid #333;background: #fff;padding: 5px 30px;border-radius: 4px;color: #333;cursor: pointer;font-size:12px;" id="pgs-ok">确定</button>',
				'</div>',
				'</div>',
				'</div>',
			].join('');
			$('body').append(elemColorBox);
		},
		//解析默认颜色
		initDefaultColor: function () {
			var _this = this;
			var config = _this.options;
			var colors = (_this.options.color).split(',');
			if (colors.length == 1) { //rex
				var colorObj = _this.hexToRgb(colors[0]);
				colorObj.a = 1;
				var hex = _this.rgbToHex(colorObj);
				var hsb = _this.rgbToHsb(colorObj);
			} else {
				if (colors.length == 3) { //rgb
					var r = colors[0],
						g = colors[1],
						b = colors[2],
						a = 1;
				} else if (colors.length == 4) { //rgba
					var r = colors[0],
						g = colors[1],
						b = colors[2],
						a = colors[3];
				} else { //采用默认颜色
					var r = 42,
						g = 0,
						b = 255,
						a = 1;
				}
				var colorObj = {
					r: parseInt(r) > 255 ? 255 : parseInt(r),
					g: parseInt(g) > 255 ? 255 : parseInt(g),
					b: parseInt(b) > 255 ? 255 : parseInt(b),
					a: parseFloat(parseFloat(a).toFixed(1) > 0.9 ? 1 : parseFloat(a).toFixed(1))
				};
				var hex = _this.rgbToHex(colorObj);
				var hsb = _this.rgbToHsb(colorObj);

			}

			//计算背景色
			var h = hsb.h;
			var bgrgb = _this.hsbToRgb({
				h: h,
				s: 100,
				b: 100
			});
			var top = 150 - hsb.b / 100 * 150 - 6;
			var left = hsb.s / 100 * 230 - 6;

			_this.set({
				color: colorObj,
				hex: hex,
				hsb: hsb,
				bg: bgrgb,
				ident: {
					top: top,
					left: left
				},
				colorSlider: parseInt(hsb.h / 360 * 160)
			})
		},
		//最近使用
		latelyColor: function () {
			var _this = this;
			if (_this.options.recommend) {
				var recommend = _this.options.recommend;
				var colors = recommend.split("|");
				_this.options.lately = colors;
				_this.options.title = '推荐色';
				return;
			}

			if (window.localStorage) {
				var storage = window.localStorage;
				var lately = storage.getItem('pgs-lately');
				if (!lately) {
					var lately = ['0,0,51,1', '0,51,102,1', '0,102,153,1', '0,153,204,1', '0,204,255,1', '102,0,51,1', '102,51,102,1', '102,102,153,1', '102,204,204,1', '102,255,255,1'];
					storage.setItem('pgs-lately', lately.join('-'));
					_this.options.lately = lately;
				} else {
					var lately = lately.split('-');
					_this.options.lately = lately;
				}
			}
		},
		rgbToHsb: function (rgb) {
			var hsb = {
				h: 0,
				s: 0,
				b: 0
			};
			var min = Math.min(rgb.r, rgb.g, rgb.b);
			var max = Math.max(rgb.r, rgb.g, rgb.b);
			var delta = max - min;
			hsb.b = max;
			hsb.s = max != 0 ? 255 * delta / max : 0;
			if (hsb.s != 0) {
				if (rgb.r == max) {
					hsb.h = (rgb.g - rgb.b) / delta;
				} else if (rgb.g == max) {
					hsb.h = 2 + (rgb.b - rgb.r) / delta;
				} else {
					hsb.h = 4 + (rgb.r - rgb.g) / delta;
				}
			} else {
				hsb.h = -1;
			};
			if (max == min) {
				hsb.h = 0;
			};
			hsb.h *= 60;
			if (hsb.h < 0) {
				hsb.h += 360;
			};
			hsb.s *= 100 / 255;
			hsb.b *= 100 / 255;
			hsb = {
				h: Math.round(hsb.h),
				s: Math.round(hsb.s),
				b: Math.round(hsb.b)
			}
			return hsb;
		},
		hexToRgb: function (hex) {
			var hex = hex.indexOf('#') > -1 ? hex.substring(1) : hex;
			if (hex.length == 3) {
				var num = hex.split("");
				hex = num[0] + num[0] + num[1] + num[1] + num[2] + num[2]
			};
			hex = parseInt(hex, 16);
			var rgb = {
				r: hex >> 16,
				g: (hex & 0x00FF00) >> 8,
				b: (hex & 0x0000FF)
			};
			return rgb;
		},
		rgbToHex: function (rgb) {

			var hex = [
				rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)
			];
			$.each(hex, function (nr, val) {
				if (val.length == 1) {
					hex[nr] = '0' + val;
				}
			});
			return hex.join('');
		},
		hsbToRgb: function (hsb) {
			var rgb = {};
			var h = hsb.h;
			var s = hsb.s * 255 / 100;
			var b = hsb.b * 255 / 100;
			if (s == 0) {
				rgb.r = rgb.g = rgb.b = b;
			} else {
				var t1 = b;
				var t2 = (255 - s) * b / 255;
				var t3 = (t1 - t2) * (h % 60) / 60;
				if (h == 360) h = 0;
				if (h < 60) {
					rgb.r = t1;
					rgb.b = t2;
					rgb.g = t2 + t3
				} else if (h < 120) {
					rgb.g = t1;
					rgb.b = t2;
					rgb.r = t1 - t3
				} else if (h < 180) {
					rgb.g = t1;
					rgb.r = t2;
					rgb.b = t2 + t3
				} else if (h < 240) {
					rgb.b = t1;
					rgb.r = t2;
					rgb.g = t1 - t3
				} else if (h < 300) {
					rgb.b = t1;
					rgb.g = t2;
					rgb.r = t2 + t3
				} else if (h < 360) {
					rgb.r = t1;
					rgb.g = t2;
					rgb.b = t1 - t3
				} else {
					rgb.r = 0;
					rgb.g = 0;
					rgb.b = 0
				}
			}
			return {
				r: Math.round(rgb.r),
				g: Math.round(rgb.g),
				b: Math.round(rgb.b)
			};
		},
		hsbToHex: function (hsb) {
			var _this = this;
			var rgb = _this.hsbToRgb(hsb);
			var hex = [
				rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)
			];
			$.each(hex, function (nr, val) {
				if (val.length == 1) {
					hex[nr] = '0' + val;
				}
			});
			return hex.join('');
		},

		getPosition: function () {
			var _this = this;
			var config = _this.options,
				bodyW = $(window).width(),
				bodyH = $(window).height(),
				objPosition = _this.eve.getBoundingClientRect();
			//计算右边宽度
			var right = bodyW - objPosition.right;
			if (right > config.width) {
				_this.set({
					positionLeft: objPosition.right + 5
				})
			} else {
				_this.set({
					positionLeft: objPosition.left - config.width - 5
				})
			}
			//计算下边高度
			var bottom = bodyH - objPosition.bottom;
			if (bottom > config.height) {
				_this.set({
					positionTop: objPosition.top
				})
			} else {
				_this.set({
					positionTop: objPosition.bottom - config.height
				})
			}
		},
		//颜色处理
		doploy: function () {
			var _this = this;
			var config = _this.options;

			$('#pgs-slider-btn').css('left', config.colorSlider - 5);
			var hex = _this.hsbToHex({
				h: config.colorSlider / 160 * 360,
				s: 100,
				b: 100
			});
			var bgRgb = _this.hexToRgb(hex);


			//计算圆点所在的rgb--hsb -- hex
			var ident = {
				h: config.colorSlider / 160 * 360,
				s: 100,
				s: config.hsb.s,
				b: config.hsb.b
			}

			var hex = _this.hsbToHex(ident);
			var rgb = _this.hexToRgb(hex);
			rgb.a = config.color.a;
			_this.set({
				bg: bgRgb,
				color: rgb,
				hex: hex,
				hsb: ident,
			});
			_this.setInputColor();
		},
		//设置输入框颜色
		setInputColor: function () {
			var config = this.options;
			var color = config.color.r + ',' + config.color.g + ',' + config.color.b;
			$('#final-color').css('background', 'rgba(' + color + ',' + config.color.a + ')');
			var bgcolor = config.bg.r + ',' + config.bg.g + ',' + config.bg.b;
			console.log(bgcolor)
			$('#color-block').css('background', 'rgb(' + bgcolor + ')');

			$('#pgs-alpha-block').css('background', 'linear-gradient(to right, rgba(' + color + ', 0) 0%, rgba(' + color + ', 1) 100%)');
			$.each(config.color, function (i, v) {
				$("input[name='pgs-" + i + "']").val(v);
			})
			$("input[name='pgs-hex']").val('#' + config.hex);
			this.callFun();
		},
		//输入框颜色部署
		inputSetColor: function () {
			var _this = this;
			var hsb = _this.options.hsb
			var h = hsb.h < 0 ? 250 : hsb.h;
			var bgRgb = _this.hsbToRgb({
				h: h,
				s: 100,
				b: 100
			});
			var top = 150 - hsb.b / 100 * 150 - 6;
			var left = hsb.s / 100 * 230 - 6;
			var colorSlider = parseInt(hsb.h / 360 * 160)
			var color = _this.options.color;
			_this.set({
				bg: bgRgb,
				ident: {
					top: top,
					left: left
				},
				colorSlider: colorSlider
			});
			console.log(bgRgb)
			$('#color-block').css('background', 'rgb(' + bgRgb.r + ',' + bgRgb.g + ',' + bgRgb.b + ')');
			$('#block-ident').css({
				top: top,
				left: left
			});
			$('#pgs-slider-btn').css('left', colorSlider - 5);
			$('#final-color').css('background', 'rgb(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')');
			$('#pgs-alpha-block').css('background', 'linear-gradient(to right, rgba(0,17,255, 0) 0%, rgba(' + bgRgb.r + ',' + bgRgb.g + ',' + bgRgb.b + ', 1) 100%)');
			$('#pgs-alpha-btn').css('left', parseInt(color.a * 160) - 5);
			this.callFun();

		},
		//调色板
		palette: function () {
			var _this = this;
			var config = this.options;
			$('#block-ident').css(config.ident);
			var top = config.ident.top < 0 ? 0 : config.ident.top,
				left = config.ident.left < 0 ? 0 : config.ident.left;
			var top = top > 150 ? 150 : top,
				left = left > 230 ? 230 : left;
			var hsb = {
				s: (left + 6) / 230 * 100,
				b: 100 - (top + 6) / 150 * 100,
				h: config.hsb.h
			}
			var hex = _this.hsbToHex(hsb);
			var rgb = _this.hexToRgb(hex);
			this.options.hex = hex;
			this.options.hsb = hsb;
			this.options.color.r = rgb.r;
			this.options.color.g = rgb.g;
			this.options.color.b = rgb.b;
			_this.setInputColor();
		},
		callFun: function () {
			var _this = this;
			var config = _this.options;
			var rgba = config.color;
			_this.callBack(_this.eve, {
				hex: config.hex,
				rgba: rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a,
				rgb: rgba.r + ',' + rgba.g + ',' + rgba.b,
			});
		},
		//设置属性
		set: function (options) {
			var that = this;
			that.options = $.extend({}, that.options, options);
			return that;
		},
		on: function () {
			var _this = this;
			//点击幕布关闭
			$('#pgs-screen').off().on('mousedown', function () {
				$(this).remove();
				return false;
			});

			$('#pgs-color-picker').off().on('mousedown', function (e) {
				e.stopPropagation();
			})
			//切换输入框
			$('#pgs-tab').off().on('click', function () {
				if ($('#pgs-rgba').is(":hidden")) {
					$('#pgs-rgba').show();
					$('#pgs-rex').hide();
				} else {
					$('#pgs-rgba').hide();
					$('#pgs-rex').show();
				}
			})
			//调色板
			$('#pgs-palette').off().on('mousedown', function (event) {
				var e = event || window.event;
				window.pgspalette = true;
				_this.set({
					ident: {
						top: e.offsetY - 6,
						left: e.offsetX - 6
					}
				});

				_this.palette();
			}).on('mousemove', function (event) {
				var e = event || window.event;
				if (window.pgspalette) {
					_this.set({
						ident: {
							top: e.offsetY - 6,
							left: e.offsetX - 6
						}
					});
					_this.palette();
				}
			}).on('mouseup', function () {
				window.pgspalette = false;
			}).on('mouseleave', function () {
				window.pgspalette = false;
			});
			//颜色条
			$('#pgs-slider').off().on('mousedown', function (event) {
				var e = event || window.event;
				window.pgsslider = true;
				_this.set({
					colorSlider: e.offsetX
				});
				_this.doploy();
			}).on('mousemove', function (event) {
				var e = event || window.event;
				if (window.pgsslider) {
					_this.set({
						colorSlider: e.offsetX < 0 ? 0 : e.offsetX
					});
					_this.doploy();
				}
			}).on('mouseup', function () {
				window.pgsslider = false;
			}).on('mouseleave', function () {
				window.pgsslider = false;
			});
			//透明按钮
			$('#pgs-alpha').off().on('mousedown', function (event) {
				var e = event || window.event;
				window.pgsalpha = true;
				$('#pgs-alpha-btn').css('left', e.offsetX - 6);
				_this.options.color.a = parseFloat((e.offsetX / 160).toFixed(1));
				_this.setInputColor();
			}).on('mousemove', function (event) {
				var e = event || window.event;
				if (window.pgsalpha) {
					$('#pgs-alpha-btn').css('left', e.offsetX - 6);
					var offsetX = e.offsetX < 0 ? 0 : e.offsetX;
					_this.options.color.a = parseFloat((offsetX / 160).toFixed(1));
					_this.setInputColor();
				}
			}).on('mouseup', function () {
				window.pgsalpha = false;
			}).on('mouseleave', function () {
				window.pgsalpha = false;
			});
			//rgb输入框事件
			$('input[name="pgs-r"],input[name="pgs-g"],input[name="pgs-b"],input[name="pgs-a"]').on('keyup', function () {
				var rgb = $(this).attr('name').split('-');
				if (rgb[1] == 'a') {
					var value = parseFloat($(this).val()) || 1;
					value = parseFloat(value.toFixed(1));
					if (value > 1 || value < 0) {
						$(this).val(1);
						value = 1;
					}
				} else {
					var value = parseInt($(this).val()) || 0;
					if (value < 0) {
						$(this).val(0);
						value = 0;
					} else if (value > 255) {
						$(this).val(255);
						value = 255;
					}
				}
				_this.options.color[rgb[1]] = value;
				//计算出hex
				var hex = _this.rgbToHex(_this.options.color);
				$('input[name="pgs-hex"]').val('#' + hex);
				_this.options.hex = hex;
				//计算hsb
				var hsb = _this.rgbToHsb(_this.options.color);
				_this.options.hsb = hsb;
				_this.inputSetColor();
			})
			//hex输入框事件
			$('input[name="pgs-hex"]').on('keyup', function () {
				var value = $(this).val().replace('#', '');
				if (value.length == 3 || value.length == 6) {
					var rgb = _this.hexToRgb(value);
					rgb.a = 1;


					_this.set({
						color: rgb,
						hex: _this.rgbToHex(rgb),
						hsb: _this.rgbToHsb(rgb)
					})
					$.each(rgb, function (i, v) {
						$('input[name="pgs-' + i + '"]').val(v);
					})
					_this.inputSetColor();
				}

			});

			//最近使用
			$('.pgs-lately').on('click', function () {
				var rgba = $(this).data('color');
				var obj = rgba.split(',');

				var rgb = {
					r: parseInt(obj[0]),
					g: parseInt(obj[1]),
					b: parseInt(obj[2])
				}

				var rgba = rgb;
				rgba.a = obj['3'] || 1;
				var hex = _this.rgbToHex(rgb);


				_this.callBack(_this.eve, {
					hex: hex,
					rgba: rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a,
					rgb: rgba.r + ',' + rgba.g + ',' + rgba.b,
				});
				$('#pgs-screen').remove();

			})

			//点击确定按钮
			$('#pgs-ok').on('click', function () {
				_this.callFun();

				var config = _this.options;
				var rgba = config.color;
				if (window.localStorage) {
					var storage = window.localStorage;
					var lately = storage.getItem('pgs-lately');
					var lately = lately.split('-');
					lately.shift();
					lately.push(rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a);
					storage.setItem('pgs-lately', lately.join('-'));
				}
				$('#pgs-screen').remove();
			})
		}
	}



	$.fn.extend({
		pgs: function (options, callBack) {

			this.each(function (i, v) {
				$(this).off().on('click', function () {
					var obj = new _pgs(this, options);
					obj.init();
					obj.callBack = callBack;
				});
				return this;

			})

		}
	});


})(jQuery, window, document);