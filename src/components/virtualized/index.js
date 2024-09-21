import React, { useEffect, useState, useRef, useMemo } from "react";
import faker from "faker";
import { throttle } from "lodash-es";
import style from "./style.module.less";

const length = 10000 * 10;
const itemheight = 50;

const items = [];
for (let id = 0; id < length; id++) {
  items.push({
    id,
    value: id,
    value: faker.lorem.sentences(), // 长文本
  });
}

const offsetBuffers = {
  top: 1,
  bottom: 1.5,
};

let screenSize = 0; // 可视区能放多少个

function App() {
  const ref = useRef();
  const [visible, setVisible] = useState({
    start: 0, // 开始索引
    end: 0, // 结束索引
  });

  useEffect(() => {
    const el = ref.current;
    screenSize = Math.ceil(el.clientHeight / itemheight);
    setVisible({
      start: 0,
      end: screenSize,
    });
  }, []);

  // 缓冲区
  const buffers = useMemo(() => {
    return {
      start: Math.min(visible.start, offsetBuffers.top * screenSize),
      end: Math.min(items.length - visible.end, offsetBuffers.bottom * screenSize),
    };
  }, [visible]);

  const renderList = useMemo(() => {
    return items.slice(visible.start - buffers.start, visible.end + buffers.end);
  }, [visible, buffers]);

  const scroll = throttle(e => {
    const scrollTop = e.target.scrollTop;
    const start = Math.floor(scrollTop / itemheight);
    setVisible({
      start,
      end: start + screenSize,
    });
  }, 10);

  // 可视区偏移量;
  const translateY = useMemo(() => {
    const newOffet = (visible.start - buffers.start) * itemheight;
    return visible.start > screenSize ? newOffet : 0;
  }, [visible]);

  const handler = e => {
    console.log("handler...", e);
  };

  useEffect(() => {
    ref.current.addEventListener("scroll", scroll);
    return () => ref.current.removeEventListener("scroll", scroll);
  }, []);

  return (
    <div>
      {JSON.stringify(visible)}
      translateY: {translateY}
      {/* <h1>虚拟化列表示例</h1> */}
      <div className={style.container} ref={ref}>
        <div className={style.slider} style={{ height: itemheight * items.length + "px" }} />
        <ul className={style.content} style={{ transform: `translate3d(0, ${translateY}px ,0)` }}>
          {renderList.map((item, index) => (
            <li
              key={index}
              // key={item.id}
              className={style.item}
              style={{ height: itemheight + "px" }}
              onClick={() => handler(item)}
            >
              <span>{item.id}: </span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
