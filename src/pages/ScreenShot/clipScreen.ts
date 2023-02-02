import html2canvas from 'html2canvas';
// 样式
const cssText = {
  box: 'position:absolute;left:0;top:0; width: 100%; height: 100%; z-index: 100000;',
  rect: 'background: rgba(5, 92, 110, .2);position:absolute;border:1px solid #3e8ef7;box-sizing:border-box;cursor:move;user-select:none;',
  toolBox:
    'position:absolute;top:0;left:0;padding:0 10px;background:#eee;line-height:2em;text-align:right;',
  toolBtn:
    'font-weight:bold;color:#111;margin:0 1em;user-select:none;font-size:12px;cursor:pointer;',
};
/**
 * dom节点截图工具（基于html2canvas）
 * dom: 要截图的目标dom
 * options: {
 *   // 以下三个回调方法作用域this指向构造函数
 *   success: function(res), //截图完成触发 参数为截图结果
 *   fail: function(), //取消截图触发
 *   complete: function(), //截图结束触发 success和fail都会触发
 * }
 *
 * 调用示例：
 * new ClipScreen(dom节点, {
 *   success: function (res) {},
 *   complete: function () {},
 * });
 */
class ClipScreen {
  border: number;
  container_w: number;
  container_h: number;
  box: HTMLDivElement;
  dom: any;
  options: any;
  imgUrl: string;
  rect: any;
  toolBox: any;
  axis: any;
  imgDom: HTMLImageElement;
  // imgDom width 与 naturalWidth 比例
  imgDomWidthScale: number;
  // imgDom height 与 naturalHeight 比例
  imgDomHeightScale: number;
  domClientLeft: any;
  domClientTop: any;
  timer: any;
  constructor(dom, imgDom, options) {
    this.dom = dom;
    const { left, top } = this.dom.getBoundingClientRect();

    this.domClientLeft = left;
    this.domClientTop = top;
    this.imgDom = imgDom;
    this.imgDomWidthScale = imgDom.naturalWidth / imgDom.offsetWidth;
    this.imgDomHeightScale = imgDom.naturalHeight / imgDom.offsetHeight;
    this.options = options;
    html2canvas(this.dom).then((canvas) => {
      let dataURL = canvas.toDataURL('image/png');
      this.imgUrl = dataURL;
      this.start();
    });
  }
  // 初始化
  start() {
    this.border = 2; //用于计算选区拖拽点和边界的判断
    this.container_w = this.dom.offsetWidth;
    this.container_h = this.dom.offsetHeight;
    this.box = document.createElement('div');
    this.box.id = 'ClipScreenId';
    this.box.style.cssText = cssText.box;
    this.dom.appendChild(this.box);
    this.bindEvent(this.box);
    let w = this.box.offsetWidth,
      h = this.box.offsetHeight,
      container_w = this.container_w,
      container_h = this.container_h,
      left = (container_w - w) / 2,
      top = (container_h - h) / 2;
    this.axis = {
      left,
      top,
    };
    // let img = document.createElement('img');
    // img.src = this.imgUrl;
    // this.imgDom = img;
  }
  // 绑定蒙版事件、键盘事件
  bindEvent(mask) {
    document.onkeydown = (e) => {
      if (e.keyCode === 27) {
        this.cancel();
      }
    };
    mask.onmousedown = (e) => {
      let offsetX = e.offsetX,
        offsetY = e.offsetY;
      document.onmousemove = (e) => {
        let x = e.offsetX,
          y = e.offsetY,
          sx = offsetX,
          sy = offsetY,
          w = Math.abs(offsetX - x),
          h = Math.abs(offsetY - y);
        if (x < offsetX) sx = x;
        if (y < offsetY) sy = y;
        this.createRect(sx, sy, w, h);
      };
      document.onmouseup = (e) => {
        this.moveToolBox();
        this.rect.style.pointerEvents = 'initial';
        this.unbindMouseEvent();
      };
    };
  }
  // 创建矩形截图选区
  createRect(x, y, w, h) {
    let rect = this.rect;
    if (!rect) {
      rect = this.rect = document.createElement('div');
      rect.style.cssText = cssText.rect;
      let doms = this.createPoints(rect);
      this.box.appendChild(rect);
      this.bindRectEvent(doms);
    }
    let border = this.border;
    if (x <= border) x = border;
    if (y <= border) y = border;
    if (x + w >= this.container_w - border) x = this.container_w - border - w;
    if (y + h >= this.container_h - border) y = this.container_h - border - h;
    rect.style.pointerEvents = 'none';
    rect.style.display = 'block';
    rect.style.left = x + 'px';
    rect.style.top = y + 'px';
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    // rect.style.backgroundPosition =
    //   -x + this.axis.left - 1 + 'px ' + (-y + this.axis.top - 1) + 'px';
    // if (this.toolBox) this.toolBox.style.display = 'none';
  }
  // 创建截图选区各个方位拉伸点
  createPoints(rect) {
    let lt = document.createElement('span'),
      tc = document.createElement('span'),
      rt = document.createElement('span'),
      rc = document.createElement('span'),
      rb = document.createElement('span'),
      bc = document.createElement('span'),
      lb = document.createElement('span'),
      lc = document.createElement('span');
    let c_style =
      'position:absolute;width:5px;height:5px;background:rgb(5, 92, 110);';
    lt.style.cssText = c_style + 'left:-3px;top:-3px;cursor:nw-resize;';
    tc.style.cssText =
      c_style + 'left:50%;top:-3px;margin-left:-3px;cursor:ns-resize;';
    rt.style.cssText = c_style + 'right:-3px;top:-3px;cursor:ne-resize;';
    rc.style.cssText =
      c_style + 'top:50%;right:-3px;margin-top:-3px;cursor:ew-resize;';
    rb.style.cssText = c_style + 'right:-3px;bottom:-3px;cursor:nw-resize;';
    bc.style.cssText =
      c_style + 'left:50%;bottom:-3px;margin-left:-3px;cursor:ns-resize;';
    lb.style.cssText = c_style + 'left:-3px;bottom:-3px;cursor:ne-resize;';
    lc.style.cssText =
      c_style + 'top:50%;left:-3px;margin-top:-3px;cursor:ew-resize;';
    let res: any = {
      lt,
      tc,
      rt,
      rc,
      rb,
      bc,
      lb,
      lc,
    };
    for (let k in res) {
      rect.appendChild(res[k]);
    }
    res.rect = rect;
    return res;
  }
  // 生成 、移动工具
  moveToolBox() {
    let toolBox = this.toolBox;
    console.log('this: ', this);
    if (!toolBox) {
      toolBox = this.toolBox = document.createElement('div');
      toolBox.style.cssText = cssText.toolBox;
      let save = document.createElement('span'),
        cancel = document.createElement('span');
      save.innerText = '完成';
      cancel.innerText = '取消';
      save.style.cssText = cancel.style.cssText = cssText.toolBtn;
      toolBox.appendChild(cancel);
      toolBox.appendChild(save);
      this.box.appendChild(toolBox);
      this.bindToolBoxEvent(save, cancel);
    }

    if (this.toolBox && this.rect) {
      toolBox.style.display = 'block';
      let border = this.border;
      let t_w = this.toolBox.offsetWidth,
        t_h = this.toolBox.offsetHeight,
        r_t = this.rect.offsetTop,
        r_h = this.rect.offsetHeight;
      let t = r_t + r_h + 10,
        l = this.rect.offsetLeft + this.rect.offsetWidth - t_w;
      if (l <= border) l = border;
      if (t >= this.container_h - border - t_h) t = r_t - t_h - 10;
      if (r_h >= this.container_h - border - t_h) {
        t = r_t + r_h - t_h - 10;
        l -= 10;
      }
      toolBox.style.top = t + 'px';
      toolBox.style.left = l + 'px';
    }
  }
  // 绑定工具栏事件
  bindToolBoxEvent(save, cancel) {
    save.onclick = () => {
      this.success();
    };
    cancel.onclick = () => {
      this.cancel();
    };
  }
  // 绑定截图选区事件
  bindRectEvent(o) {
    o.rect.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      let border = this.border;
      let $target = e.target;
      let offsetX = e.x,
        offsetY = e.y;
      let r_w = o.rect.offsetWidth,
        r_h = o.rect.offsetHeight,
        r_l = o.rect.offsetLeft,
        r_t = o.rect.offsetTop;

      if ($target === o.rect) {
        // const { left, top } = this.dom.getBoundingClientRect();
        offsetX = e.offsetX + this.domClientLeft;
        offsetY = e.offsetY + this.domClientTop;

        document.onmousemove = (e) => {
          let dif_x = e.x - offsetX,
            dif_y = e.y - offsetY;
          if (dif_x <= border) dif_x = border;
          if (dif_y <= border) dif_y = border;

          if (dif_x + r_w >= this.container_w - border)
            dif_x = this.container_w - border - r_w;

          if (dif_y + r_h >= this.container_h - border)
            dif_y = this.container_h - border - r_h;

          o.rect.style.left = dif_x + 'px';
          o.rect.style.top = dif_y + 'px';
          this.toolBox.style.display = 'none';
        };
      } else {
        document.onmousemove = (e) => {
          this.toolBox.style.display = 'none';
          this.transform($target, o, offsetX, offsetY, r_w, r_h, r_l, r_t, e);
        };
      }
      document.onmouseup = (e) => {
        this.moveToolBox();
        this.unbindMouseEvent();
        this.success();
      };
    });
  }
  // 拉伸选区
  transform($t, o, offsetX, offsetY, r_w, r_h, r_l, r_t, e) {
    let border = this.border;
    let x = e.x,
      y = e.y;
    const lLimit = this.domClientLeft + border;
    const tLimit = this.domClientTop + border;
    const rLimit = this.domClientLeft + this.container_w - border;
    const bLimit = this.domClientTop + this.container_h - border;

    if (x <= lLimit) x = lLimit;
    if (y <= tLimit) y = tLimit;
    if (x >= rLimit) x = rLimit;
    if (y >= bLimit) y = bLimit;
    let dif_x = x - offsetX,
      dif_y = y - offsetY;
    let min = 10;
    let left = r_l,
      top = r_t,
      width = r_w,
      height = r_h;
    if ($t === o.lt) {
      if (r_w - dif_x <= min || r_h - dif_y <= min) return false;
      left = r_l + dif_x;
      top = r_t + dif_y;
      width = r_w - dif_x;
      height = r_h - dif_y;
    } else if ($t === o.tc) {
      if (r_h - dif_y <= min) return false;
      top = r_t + dif_y;
      height = r_h - dif_y;
    } else if ($t === o.rt) {
      if (r_w + dif_x <= min || r_h - dif_y <= min) return false;
      top = r_t + dif_y;
      width = r_w + dif_x;
      height = r_h - dif_y;
    } else if ($t === o.rc) {
      if (r_w + dif_x <= min) return false;
      width = r_w + dif_x;
    } else if ($t === o.rb) {
      if (r_w + dif_x <= min || r_h + dif_y <= min) return false;
      width = r_w + dif_x;
      height = r_h + dif_y;
    } else if ($t === o.bc) {
      if (r_h + dif_y <= min) return false;
      height = r_h + dif_y;
    } else if ($t === o.lb) {
      if (r_w - dif_x <= min || r_h + dif_y <= min) return false;
      left = r_l + dif_x;
      width = r_w - dif_x;
      height = r_h + dif_y;
    } else if ($t === o.lc) {
      if (r_w - dif_x <= min) return false;
      left = r_l + dif_x;
      width = r_w - dif_x;
    }
    o.rect.style.left = left + 'px';
    o.rect.style.top = top + 'px';
    o.rect.style.width = width + 'px';
    o.rect.style.height = height + 'px';
    o.rect.style.backgroundPosition =
      -left + this.axis.left - 1 + 'px ' + (-top + this.axis.top - 1) + 'px';
  }
  // 解绑事件
  unbindMouseEvent() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // 生成base64图片
  getImagePortion(imgDom, new_w, new_h, s_x, s_y) {
    const img = imgDom.cloneNode();
    img.src = this.imgUrl;
    let sx = s_x - this.axis.left,
      sy = s_y - this.axis.top;
    let t_cv = document.createElement('canvas');
    let t_ct = t_cv.getContext('2d');
    t_cv.width = new_w;
    t_cv.height = new_h;
    t_ct.drawImage(this.imgDom, sx, sy, new_w, new_h, 0, 0, new_w, new_h);

    let res = t_cv.toDataURL();
    return res;
  }
  // 完成
  success() {
    // 500毫秒触发一次
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.timer = setTimeout(() => {
      this.timer = null;
      let imgBase64 = this.getImagePortion(
        this.imgDom,
        Math.floor(this.rect.offsetWidth * this.imgDomWidthScale),
        Math.floor(this.rect.offsetHeight * this.imgDomHeightScale),
        Math.floor(this.rect.offsetLeft * this.imgDomWidthScale),
        Math.floor(this.rect.offsetTop * this.imgDomHeightScale),
      );
      if (this.options) {
        this.options.success && this.options.success.call(this, imgBase64);
      }
      // this.close();
    }, 500);
  }
  // 取消
  cancel() {
    if (this.options) {
      this.options.fail && this.options.fail.call(this);
    }
    this.close();
  }
  // 关闭
  close() {
    if (this.options) {
      this.options.complete && this.options.complete.call(this);
    }
    this.distroy();
  }
  // 销毁
  distroy() {
    this.box.remove();
  }
}
export default ClipScreen;
